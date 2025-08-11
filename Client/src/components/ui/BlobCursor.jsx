import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

//================================================================================================
// BlobCursor Component (The Fix is Here)
//================================================================================================
// We've modified this component to listen for mouse movements on the global `window` object.
// This allows the component's own div to have `pointer-events-none`, so it can overlay your
// content without blocking clicks.
function BlobCursor({
  blobType = "circle",
  fillColor = "#5227FF",
  trailCount = 3,
  sizes = [60, 125, 75],
  innerSizes = [20, 35, 25],
  innerColor = "rgba(255,255,255,0.8)",
  opacities = [0.6, 0.6, 0.6],
  shadowColor = "rgba(0,0,0,0.75)",
  shadowBlur = 5,
  shadowOffsetX = 10,
  shadowOffsetY = 10,
  filterId = "blob",
  filterStdDeviation = 30,
  filterColorMatrixValues = "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10",
  useFilter = true,
  fastDuration = 0.1,
  slowDuration = 0.5,
  fastEase = "power3.out",
  slowEase = "power1.out",
  zIndex = 9999, // High z-index to ensure it's on top
}) {
  const blobsRef = useRef([]);
  const containerRef = useRef(null); // Ref for the container to get its position

  // This is the core of the fix. We listen to the `window` for mouse moves.
  const handleMove = useCallback(
    (e) => {
      // Get the container's position relative to the viewport
      const rect = containerRef.current ? containerRef.current.getBoundingClientRect() : { left: 0, top: 0 };
      const x = "clientX" in e ? e.clientX : e.touches[0].clientX;
      const y = "clientY" in e ? e.clientY : e.touches[0].clientY;

      blobsRef.current.forEach((el, i) => {
        if (!el) return;
        const isLead = i === 0;

        // Animate the blobs. We subtract the container's top/left
        // because the blobs are positioned relative to the container.
        gsap.to(el, {
          x: x - rect.left,
          y: y - rect.top,
          duration: isLead ? fastDuration : slowDuration,
          ease: isLead ? fastEase : slowEase,
        });
      });
    },
    [fastDuration, slowDuration, fastEase, slowEase]
  );

  // Add and remove the event listeners from the window object.
  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, [handleMove]);

  return (
    // This container is now an overlay. `pointer-events-none` is crucial.
    // It makes the entire element and its children (except where overridden) transparent to mouse events.
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex }}
    >
      {useFilter && (
        <svg className="absolute w-0 h-0">
          <filter id={filterId}>
            <feGaussianBlur
              in="SourceGraphic"
              result="blur"
              stdDeviation={filterStdDeviation}
            />
            <feColorMatrix in="blur" values={filterColorMatrixValues} />
          </filter>
        </svg>
      )}

      {/* The blob container itself also needs pointer-events-none */}
      <div
        className="pointer-events-none absolute inset-0 select-none cursor-default"
        style={{ filter: useFilter ? `url(#${filterId})` : undefined }}
      >
        {Array.from({ length: trailCount }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (blobsRef.current[i] = el)}
            className="absolute will-change-transform transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: sizes[i],
              height: sizes[i],
              borderRadius: blobType === "circle" ? "50%" : "0",
              backgroundColor: fillColor,
              opacity: opacities[i],
              boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`,
            }}
          >
            <div
              className="absolute"
              style={{
                width: innerSizes[i],
                height: innerSizes[i],
                top: (sizes[i] - innerSizes[i]) / 2,
                left: (sizes[i] - innerSizes[i]) / 2,
                backgroundColor: innerColor,
                borderRadius: blobType === "circle" ? "50%" : "0",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}


//================================================================================================
// Main App Component (Your "About" page)
//================================================================================================
// This demonstrates how to use the fixed BlobCursor.
// Just place it anywhere in your component tree, and it will work as an overlay.
export default function Ribbon() {
  return (
    
      <BlobCursor
        fillColor="#B2AAFF"
        trailCount={10}
        sizes={[70, 30, 75]}
        innerSizes={[20, 35, 25]}
        innerColor="rgba(192, 84, 84, 0.8)"
        opacities={[0.5, 0.5, 0.5]}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={10}
        shadowOffsetX={5}
        shadowOffsetY={5}
        filterStdDeviation={25}
      />

  );
}