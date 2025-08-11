import React from 'react';
import PropTypes from 'prop-types';

// --- Marquee Component (Enhanced with Fading Edges) ---
const Marquee = ({ children, reverse = false, className = '' }) => {
  return (
    <div
      className={`group flex overflow-hidden p-4 --gap-4 --duration-40s ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <div className={`flex shrink-0 animate-marquee items-center justify-around gap-4 ${reverse ? 'group-hover:[animation-play-state:paused] animate-marquee-reverse' : 'group-hover:[animation-play-state:paused]'}`}>
        {children}
      </div>
      <div className={`flex shrink-0 animate-marquee items-center justify-around gap-4 ${reverse ? 'group-hover:[animation-play-state:paused] animate-marquee-reverse' : 'group-hover:[animation-play-state:paused]'}`} aria-hidden="true">
        {children}
      </div>
    </div>
  );
};

// --- Testimonial Card Component (Enhanced with Hover Effect & Responsive Size) ---
const TestimonialCard = ({ testimonial }) => {
  return (
    <div
      className="flex h-44 w-80 sm:w-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md border-t-4 border-[#4ECDC4] transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:z-10"
      key={testimonial.name}
    >
      <div className="relative h-full w-32 flex-shrink-0 overflow-hidden">
        <img src={testimonial.image} alt={testimonial.name} className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <span className="block text-lg font-bold text-gray-800">{testimonial.name}</span>
        <span className="-mt-1 mb-2 block text-sm font-medium leading-loose text-gray-500">
          {testimonial.title}
        </span>
        <span className="block text-sm text-gray-700 leading-snug">{testimonial.description}</span>
      </div>
    </div>
  );
};

// --- Main ScrollingTestimonials Component ---
const ScrollingTestimonials = ({ data }) => {
  const firstRow = data.slice(0, data.length / 2);
  const secondRow = data.slice(data.length / 2);

  return (
    <div className="relative w-full">
      <Marquee>
        {firstRow.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </Marquee>
      <Marquee reverse>
        {secondRow.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </Marquee>
    </div>
  );
};

// --- Sample Data ---
const testimonialsData = [
  {
    name: "Aarav Sharma",
    title: "Cricket Enthusiast",
    image: "https://images.unsplash.com/photo-1595997239194-44b317e0881f?w=500&q=80",
    description: "The booking process is seamless. Found the best cricket nets in my area within minutes!",
  },
  {
    name: "Priya Patel",
    title: "Badminton Pro",
    image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=500&q=80",
    description: "Love the variety of courts available. The ratings and reviews really help in choosing the right place.",
  },
  {
    name: "Rohan Kumar",
    title: "Weekend Footballer",
    image: "https://images.unsplash.com/photo-1615109398623-88346a601842?w=500&q=80",
    description: "Organizing our weekly football game has never been easier. The instant booking is a lifesaver.",
  },
  {
    name: "Anika Singh",
    title: "Swimming Aspirant",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80",
    description: "Found a fantastic coach and a clean pool through this platform. Highly recommended!",
  },
  {
    name: "Vikram Reddy",
    title: "Table Tennis Player",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
    description: "The availability calendar is super accurate. No more showing up to a crowded venue.",
  },
  {
    name: "Saanvi Desai",
    title: "Fitness Fanatic",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80",
    description: "From Yoga to CrossFit, I can book all my classes in one place. It’s a game-changer for my routine.",
  },
];


// --- Parent Component (Enhanced with better styling) ---
export const TestimonialsSection = () => {
  return (
    <section className="bg-white py-20 lg:py-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 to-white">
       {/* You can add a <style> block or add this to your global CSS */}
       <style>
        {`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-100%); }
          }
          @keyframes marquee-reverse {
            from { transform: translateX(0); }
            to { transform: translateX(100%); }
          }
          .animate-marquee {
            animation: marquee var(--duration, 40s) linear infinite;
          }
          .animate-marquee-reverse {
            animation: marquee-reverse var(--duration, 40s) linear infinite;
          }
        `}
       </style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-800">
                What Our <span className="text-[#FF6B35]">Players</span> Say
            </h2>
            <p className="mt-4 text-lg text-gray-600">
                Trusted by thousands of athletes and enthusiasts across Gandhinagar.
            </p>
        </div>
        <ScrollingTestimonials data={testimonialsData} />
      </div>
    </section>
  );
};

// PropTypes for type-checking in JavaScript
Marquee.propTypes = {
  children: PropTypes.node.isRequired,
  reverse: PropTypes.bool,
  className: PropTypes.string,
};

TestimonialCard.propTypes = {
  testimonial: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

ScrollingTestimonials.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};