"use client";
import { motion } from "framer-motion";
import React from 'react';
import ShuffleGrid from "./ui/ShuffleGrid";
import { GridBeam } from "./ui/GridBeam"; // Make sure this is imported
import { Highlight } from "./ui/Hero-highlight";

const Hero3 = () => {
  return (
    // The main wrapper with your custom background class
    <div className="relative min-h-screen w-full  grid-background-hero3">
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
                            // Text color is now permanently white
                            className="text-4xl md:text-4xl lg:text-5xl font-bold text-gray-300 max-w-4xl leading-relaxed lg:leading-snug mb-8"
                          >
                            Find Players & venues nearby{" "}
                            {/* <Highlight className="text-white">
                              copy, of a copy, of a copy.
                            </Highlight> */}
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
                              // Button styles are now hard-coded for the dark theme appearance
                              className="relative px-8 py-4 text-lg font-semibold text-black bg-gradient-to-r from-white to-gray-100 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out overflow-hidden group"
                            >
                              <span className="relative z-10">Join Now</span>
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