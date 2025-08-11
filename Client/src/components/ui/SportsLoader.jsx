import React from 'react';

export const SportsLoader = () => {
  return (
    <>
      <style>
        {`
          /* A more dynamic "breathing" orbit animation */
          @keyframes dynamic-orbit {
            0% {
              transform: rotate(0deg) translateX(70px) scale(0.8);
              opacity: 0.7;
            }
            50% {
              transform: rotate(180deg) translateX(70px) scale(1.1);
              opacity: 1;
            }
            100% {
              transform: rotate(360deg) translateX(70px) scale(0.8);
              opacity: 0.7;
            }
          }
          
          /* A simple, continuous spin for the icon itself */
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          /* A pulsating animation for the central dot */
          @keyframes pulse {
            0%, 100% {
              transform: scale(0.9);
              opacity: 0.8;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
          }
          
          .dynamic-orbit {
            animation: dynamic-orbit 4s ease-in-out infinite;
          }

          .spin {
            animation: spin 3s linear infinite;
          }

          .pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}
      </style>

      {/* Main loader container with a blurred overlay */}
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="relative h-48 w-48 flex items-center justify-center">
          
          {/* Pulsating central dot */}
          <div className="pulse absolute h-8 w-8 bg-[#FF6B35] rounded-full shadow-lg"></div>

          {/* Icons now have a unique animation delay and drop-shadow */}
          
          {/* Cricket Bat */}
          <div className="dynamic-orbit absolute h-12 w-12" style={{ animationDelay: '0s' }}>
            <div className="spin w-full h-full" style={{ animationDelay: '-0.5s' }}>
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#FF6B35] drop-shadow-md">
                <path d="M63.6,83.3c-2.8-0.9-5.7-1.7-8.5-2.6c-11.4-3.4-16.8-13.4-13.4-24.8c0.8-2.8,1.7-5.7,2.6-8.5l24.8,13.4 C68.3,72,68.7,80.5,63.6,83.3z" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M49.2,50.8l-4.2-2.4c-2.8-1.6-4-5.1-2.4-7.9l10-17.3c1.6-2.8,5.1-4,7.9-2.4l4.2,2.4c2.8,1.6,4,5.1,2.4,7.9L57.1,48.4 C55.5,51.2,52,52.4,49.2,50.8z" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Shuttlecock */}
          <div className="dynamic-orbit absolute h-12 w-12" style={{ animationDelay: '-1s' }}>
            <div className="spin w-full h-full" style={{ animationDelay: '-1.5s' }}>
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#4ECDC4] drop-shadow-md">
                <path d="M50 85C55.5228 85 60 80.5228 60 75C60 69.4772 55.5228 65 50 65C44.4772 65 40 69.4772 40 75C40 80.5228 44.4772 85 50 85Z" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M40 75L25 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M60 75L75 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M50 75V45L35 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M50 45L65 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30 40H70" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Tennis Ball */}
          <div className="dynamic-orbit absolute h-10 w-10" style={{ animationDelay: '-2s' }}>
            <div className="spin w-full h-full" style={{ animationDelay: '-2.5s' }}>
               <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#FF6B35] drop-shadow-md">
                  <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="6"/>
                  <path d="M18.8,65.4C31.3,84.9,56.2,93,75.7,80.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
                  <path d="M81.2,34.6C68.7,15.1,43.8,7,24.3,19.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          
          {/* Table Tennis Paddle */}
          <div className="dynamic-orbit absolute h-12 w-12" style={{ animationDelay: '-3s' }}>
            <div className="spin w-full h-full" style={{ animationDelay: '-3.5s' }}>
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#4ECDC4] drop-shadow-md">
                <circle cx="50" cy="35" r="30" stroke="currentColor" strokeWidth="6"/>
                <line x1="50" y1="65" x2="50" y2="95" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
        <p className="text-lg font-semibold text-gray-700 mt-8 tracking-wider">Finding Available Courts...</p>
      </div>
    </>
  );
};