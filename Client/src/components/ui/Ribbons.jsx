import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Renderer, Transform, Vec3, Color, Polyline } from 'ogl';

//================================================================================================
// Ribbons Component (FIXED)
//================================================================================================
// This component has been modified to work as a non-blocking overlay.
function Ribbons({
  colors = ['#8eb8fc79'],
  baseSpring = 0.03,
  baseFriction = 0.9,
  baseThickness = 30,
  offsetFactor = 0.05,
  maxAge = 500,
  pointCount = 50,
  speedMultiplier = 0.6,
  enableFade = false,
  enableShaderEffect = false,
  effectAmplitude = 2,
  backgroundColor = [0, 0, 0, 0],
  zIndex = 1,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ dpr: window.devicePixelRatio || 2, alpha: true, antialias: true });
    const gl = renderer.gl;
    
    // Make the canvas non-interactive and position it correctly
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.pointerEvents = 'none'; // Crucial for letting clicks pass through

    if (Array.isArray(backgroundColor) && backgroundColor.length === 4) {
      gl.clearColor(...backgroundColor);
    } else {
      gl.clearColor(0, 0, 0, 0);
    }

    container.appendChild(gl.canvas);

    const scene = new Transform();
    const lines = [];

    const vertex = `
      precision highp float;
      attribute vec3 position;
      attribute vec3 next;
      attribute vec3 prev;
      attribute vec2 uv;
      attribute float side;
      uniform vec2 uResolution;
      uniform float uDPR;
      uniform float uThickness;
      uniform float uTime;
      uniform float uEnableShaderEffect;
      uniform float uEffectAmplitude;
      varying vec2 vUV;
      
      vec4 getPosition() {
          vec4 current = vec4(position, 1.0);
          vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
          vec2 nextScreen = next.xy * aspect;
          vec2 prevScreen = prev.xy * aspect;
          vec2 tangent = normalize(nextScreen - prevScreen);
          vec2 normal = vec2(-tangent.y, tangent.x) / aspect;
          normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));
          float dist = length(nextScreen - prevScreen);
          normal *= smoothstep(0.0, 0.02, dist);
          float pixelWidth = current.w * (1.0 / (uResolution.y / uDPR)) * uThickness;
          current.xy -= normal * side * pixelWidth;
          if(uEnableShaderEffect > 0.5) {
            current.xy += normal * sin(uTime + current.x * 10.0) * uEffectAmplitude;
          }
          return current;
      }
      
      void main() {
          vUV = uv;
          gl_Position = getPosition();
      }
    `;

    const fragment = `
      precision highp float;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uEnableFade;
      varying vec2 vUV;
      void main() {
          float fadeFactor = 1.0;
          if(uEnableFade > 0.5) {
              fadeFactor = 1.0 - smoothstep(0.0, 1.0, vUV.y);
          }
          gl_FragColor = vec4(uColor, uOpacity * fadeFactor);
      }
    `;

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      lines.forEach(line => line.polyline.resize());
    }
    window.addEventListener('resize', resize, false);

    const center = (colors.length - 1) / 2;
    colors.forEach((color, index) => {
      const line = {
        spring: baseSpring + (Math.random() - 0.5) * 0.05,
        friction: baseFriction + (Math.random() - 0.5) * 0.05,
        mouseVelocity: new Vec3(),
        mouseOffset: new Vec3(
          (index - center) * offsetFactor + (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.1,
          0
        ),
        points: Array.from({ length: pointCount }, () => new Vec3()),
      };

      line.polyline = new Polyline(gl, {
        points: line.points,
        vertex,
        fragment,
        uniforms: {
          uColor: { value: new Color(color) },
          uThickness: { value: baseThickness + (Math.random() - 0.5) * 3 },
          uOpacity: { value: 1.0 },
          uTime: { value: 0.0 },
          uEnableShaderEffect: { value: enableShaderEffect ? 1.0 : 0.0 },
          uEffectAmplitude: { value: effectAmplitude },
          uEnableFade: { value: enableFade ? 1.0 : 0.0 },
        },
      });
      line.polyline.mesh.setParent(scene);
      lines.push(line);
    });

    resize();

    const mouse = new Vec3();
    function updateMouse(e) {
      let x, y;
      if (e.changedTouches && e.changedTouches.length) {
        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }
      // Convert window coordinates to NDC
      mouse.set((x / window.innerWidth) * 2 - 1, (y / window.innerHeight) * -2 + 1, 0);
    }
    // Listen on the window object
    window.addEventListener('mousemove', updateMouse, false);
    window.addEventListener('touchstart', updateMouse, false);
    window.addEventListener('touchmove', updateMouse, false);

    const tmp = new Vec3();
    let frameId;
    let lastTime = performance.now();
    function update() {
      frameId = requestAnimationFrame(update);
      const currentTime = performance.now();
      const dt = currentTime - lastTime;
      lastTime = currentTime;

      lines.forEach(line => {
        tmp.copy(mouse).add(line.mouseOffset).sub(line.points[0]).multiply(line.spring);
        line.mouseVelocity.add(tmp).multiply(line.friction);
        line.points[0].add(line.mouseVelocity);

        for (let i = 1; i < line.points.length; i++) {
          const segmentDelay = maxAge / (line.points.length - 1);
          const alpha = Math.min(1, (dt * speedMultiplier) / segmentDelay);
          line.points[i].lerp(line.points[i - 1], alpha);
        }
        if (line.polyline.mesh.program.uniforms.uTime) {
          line.polyline.mesh.program.uniforms.uTime.value = currentTime * 0.001;
        }
        line.polyline.updateGeometry();
      });

      renderer.render({ scene });
    }
    update();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', updateMouse);
      window.removeEventListener('touchstart', updateMouse);
      window.removeEventListener('touchmove', updateMouse);
      cancelAnimationFrame(frameId);
      if (gl.canvas && gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
    };
  }, [ /* dependencies */ ]);

  return (
    <div
      ref={containerRef}
      className='fixed inset-0 pointer-events-none'
      style={{ zIndex }}
    />
  );
};


//================================================================================================
// Main App Component
//================================================================================================
export default function Ribbon() {


  return (
    <main className="relative flex flex-col items-center justify-center w-screen h-screen min-h-screen gap-8 p-8 overflow-hidden text-center bg-gray-900 text-white">
      
      

      {/* The fixed Ribbons component */}
      <Ribbons 
        colors={['#8eb8fc79', '#f0a5a579', '#a5f0e179']}
        baseThickness={40}
        zIndex={1}
      />

    </main>
  );
}
