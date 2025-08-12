"use client";
import { motion } from "framer-motion";
import React from 'react';
import ShuffleGrid from "./ui/ShuffleGrid";
import { GridBeam } from "./ui/GridBeam"; 
import { Highlight } from "./ui/Hero-highlight";
import { useNavigate } from "react-router-dom";

const Hero3 = () => {
  const navigate = useNavigate();
  const backgroundImageUrl = 'http://www.baltana.com/files/wallpapers-2/Sports-HD-Images-05075.jpg';

  return (
    // The main wrapper with an inline style for the background image
    <div 
      className="relative min-h-screen w-full"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* The GridBeam component provides the moving line animation */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <GridBeam>
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full px-4 mx-auto" style={{ minHeight: '600px', width: '1300px' }}>
            {/* Left Column */}
            <div className="md:w-1/2 text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: [20, -5, 0] }}
                transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
                className="text-4xl md:text-4xl lg:text-5xl font-bold text-[#FF6B35] max-w-4xl leading-relaxed lg:leading-snug mb-8"
              >
                Find Players & Venues NearBy{" "}
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: [20, -5, 0] }}
                transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
                className="text-sm lg:text-2xl font-bold text-gray-300 max-w-4xl leading-relaxed lg:leading-snug mb-8"
              >
                Seamlessly explore sports venues & play with other player enthusiasts{" "}
                <Highlight className="text-white">
                  just like you
                </Highlight>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                className="flex justify-center md:justify-start"
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-4 text-lg font-semibold text-black bg-gradient-to-r from-white to-gray-100 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out overflow-hidden group"
                >
                  <span onClick={() => navigate("/login")} className="relative z-10">Join Now</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </motion.button>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="hidden md:flex md:w-1/2 md:mt-0 ml-20 ">
              <div className="w-full">
                <ShuffleGrid />
              </div>
            </div>
          </div>
        </GridBeam>
      </div>
    </div>
  );
};

export default Hero3;
