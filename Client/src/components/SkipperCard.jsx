import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- HELPER UTILITIES & MOCK COMPONENTS ---
// Simplified versions of your project's dependencies to make this example runnable.
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

const SparklesIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("mr-2", className)}>
    <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9z" />
  </svg>
);

const Badge = ({ children, className }) => (
  <div className={cn("inline-flex items-center gap-x-2 rounded-md px-3 py-1 text-sm font-medium", className)}>
    {children}
  </div>
);


// --- FULLY FUNCTIONAL SKIPER CARD COMPONENT ---
/**
 * This is now a stateful component that automatically cycles through its 4 steps,
 * creating a carousel effect.
 * Replace with your actual import from '../ui/skiper-card'.
 */
const SkiperCard = ({ image, ...props }) => {
    const [step, setStep] = useState(0);

    // This useEffect hook sets up an interval to change the step every 3 seconds.
    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prevStep) => (prevStep + 1) % 4); // Cycles from 0 to 3
        }, 3000); // Change step every 3 seconds

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);

    const steps = [
        {
            images: [
                { src: image.step1light1, className: props.step1img1Class },
                { src: image.step1light2, className: props.step1img2Class },
            ],
        },
        {
            images: [
                { src: image.step2light1, className: props.step2img1Class },
                { src: image.step2light2, className: props.step2img2Class },
            ],
        },
        {
            images: [
                { src: image.step3light, className: props.step3imgClass },
            ],
        },
        {
            images: [
                { src: image.step4light, className: props.step4imgClass },
            ],
        },
    ];

    return (
      <div className="relative group h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-neutral-900" />
        
        {/* AnimatePresence handles the exit and enter animations of the images */}
        <AnimatePresence>
            {steps[step].images.map((img, index) => (
                <motion.img
                    key={`${step}-${index}`} // A unique key is crucial for AnimatePresence
                    src={img.src}
                    alt={image.alt}
                    className={cn("absolute", img.className)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            ))}
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 p-6 text-white z-10">
          <h3 className="text-2xl font-bold">{props.title}</h3>
          <p className="text-neutral-300">{props.description}</p>
        </div>
      </div>
    );
};


// --- YOUR FEATURES COMPONENT (WITH STYLING FIXES) ---
// This component now has the Badge removed and a transparent background.
export function SkiperCardDemo() {
  const shiftCard = "https://placehold.co/400x600/DDD/31343C?text=shiftCard.png";
  const family = "https://placehold.co/600x400/EEE/31343C?text=family.png";
  const carousel = "https://placehold.co/600x400/CCC/31343C?text=carousel.png";
  const textureFull = "https://placehold.co/400x600/BBB/31343C?text=textureFull.png";
  const skiper = "https://placehold.co/800x600/999/31343C?text=skiper.png";
  const textureCard = "https://placehold.co/800x600/AAA/31343C?text=textureCard.png";

  return (
    // The `bg-gray-50` is removed to inherit the dark background from the parent.
    <section className="relative w-full overflow-hidden" id="features">
      <div className="p-2">
        <div className="mx-auto max-w-4xl rounded-[34px] bg-neutral-800 p-1">
          <div className="relative z-10 grid w-full gap-8 rounded-[28px] bg-neutral-950 p-2">
            <SkiperCard
              step1img1Class={cn("pointer-events-none w-[50%] border border-stone-100/10 transition-all duration-500", "left-1/4 top-[57%] rounded-[24px] max-md:scale-[160%] max-md:rounded-[24px] md:left-[35px] md:top-[29%]")}
              step1img2Class={cn("pointer-events-none w-3/5 overflow-hidden border border-stone-100/10 transition-all duration-500", "left-[69%] top-[53%] rounded-2xl max-md:scale-[160%] max-md:rounded-[24px] md:left-[calc(50%+35px+1rem)] md:top-[21%]")}
              step2img1Class={cn("pointer-events-none w-[50%] overflow-hidden rounded-t-[24px] border border-stone-100/10 transition-all duration-500", "left-1/4 top-[69%] max-md:scale-[160%] md:left-[35px] md:top-[30%]")}
              step2img2Class={cn("pointer-events-none w-2/5 overflow-hidden rounded-2xl rounded-t-[24px] border border-stone-100/10 transition-all duration-500", "left-[70%] top-[53%] max-md:scale-[140%] md:left-[calc(50%+27px+1rem)] md:top-1/4")}
              step3imgClass={cn("pointer-events-none w-[90%] overflow-hidden rounded-t-[24px] border border-stone-100/10 transition-all duration-500", "left-[5%] top-[50%] md:left-[68px] md:top-[30%]")}
              step4imgClass={cn("pointer-events-none w-[90%] overflow-hidden rounded-t-[24px] border border-stone-100/10 transition-all duration-500", "left-[5%] top-[50%] md:left-[68px] md:top-[30%]")}
              description="Make your app 🤌"
              image={{ step1light1: family, step1light2: shiftCard, step2light1: carousel, step2light2: textureFull, step3light: textureCard, step4light: skiper, alt: "Something" }}
              title="Components that pop"
            />
          </div>
        </div>
      </div>
    </section>
  );
}