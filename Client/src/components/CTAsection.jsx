import React from 'react';

const CommunityCTAWhite = ({ communityLink = "/community" }) => {
  return (
    // The main container with a clean white background
    <section 
      className="
        bg-white 
        py-20 px-5
        flex flex-col justify-center items-center text-center
      "
    >
      <h2 
        className="
          text-4xl md:text-5xl font-extrabold 
          mb-3 
          text-orange-500  // Orange text for the heading
        "
      >
        Ready to Dive In?
      </h2>

      <p 
        className="
          max-w-2xl text-lg text-gray-600 // Standard dark gray for readable text
          mb-8
        "
      >
        Become a part of our growing family. Share ideas, get support, and connect with like-minded people from around the world.
      </p>

      {/* The Big Button (now with an orange background) */}
      <a 
        href={communityLink}
        className="
          inline-block 
          bg-gradient-to-r from-orange-500 to-amber-400 // Orange gradient background
          text-white // White text
          font-bold text-lg 
          py-4 px-10 
          rounded-full 
          shadow-lg 
          transition-all duration-300 ease-in-out
          transform hover:-translate-y-1 hover:scale-105 hover:shadow-2xl
        "
      >
        Join Our Community
      </a>
    </section>
  );
};

export default CommunityCTAWhite;