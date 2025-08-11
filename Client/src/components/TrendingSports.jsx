import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';

// --- Data for the sports cards ---
const trendingSportsData = [
  {
    name: 'Cricket',
    image: 'https://images.unsplash.com/photo-1593341646782-e0b495cffc25?w=600&h=800&fit=crop',
    description: 'Engage in the nation\'s favorite pastime with top-tier pitches and equipment.'
  },
  {
    name: 'Football',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=800&fit=crop',
    description: 'Experience the thrill of the game on our professional-grade turf fields.'
  },
  {
    name: 'Badminton',
    image: 'https://images.unsplash.com/photo-1521587504744-8461b2d45a4a?w=600&h=800&fit=crop',
    description: 'High-quality indoor courts perfect for a fast-paced, competitive match.'
  },
  {
    name: 'Swimming',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=800&fit=crop',
    description: 'Dive into our clean, Olympic-sized pools for a refreshing workout.'
  }
];

// --- The Main Component ---
const TrendingSports = () => {
  return (
    <div className="bg-[#141416] text-white relative py-20 lg:py-32">
      {/* This SVG creates the curve at the top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-[60px] lg:h-[120px] w-full"
        >
          <path
            d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
            className="fill-current text-white" // Use your page's background color, likely white
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Flame className="w-8 h-8 lg:w-12 lg:h-12 text-[#FF6B35]" />
            Trending Near You
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Discover the most popular sports and venues booked by players in your city.
          </p>
        </div>

        {/* --- Sports Cards Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingSportsData.map((sport) => (
            <div
              key={sport.name}
              className="relative group overflow-hidden rounded-xl border border-gray-800 transform hover:-translate-y-2 transition-transform duration-300"
            >
              {/* Background Image */}
              <img src={sport.image} alt={sport.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>

              {/* Glowing Effect on Hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: `radial-gradient(circle at center, transparent 30%, #FF6B35 150%)`,
                     filter: 'blur(30px)'
                   }}
              ></div>

              {/* Card Content */}
              <div className="relative p-6 flex flex-col justify-end h-full">
                <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">
                  {sport.name}
                </h3>
                <p className="text-gray-300 mb-4 text-sm leading-snug line-clamp-2">
                  {sport.description}
                </p>
                <button className="flex items-center gap-2 text-[#4ECDC4] font-semibold text-sm transform group-hover:translate-x-1 transition-transform duration-300">
                  Explore
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingSports;