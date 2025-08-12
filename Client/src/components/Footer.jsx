import React from 'react';
import Particles from './ui/Particles';
import { FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-zinc-950 text-white py-16 overflow-hidden">
      {/* Background Particles with a subtle, dynamic feel */}
      <Particles className="absolute inset-0 z-0 opacity-10" quantity={200} />

      {/* Dynamic Background Element */}
      <div className="absolute inset-0 z-10">
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-orange-500 rounded-full mix-blend-lighten opacity-50 filter blur-3xl animate-blob" />
        <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-[#4ecdc4] rounded-full mix-blend-lighten opacity-50 filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 text-center">
        <div className="grid md:grid-cols-4 gap-12 mb-12 text-left">
          
          {/* QuickCourt Branding */}
          <div className="md:col-span-1">
            <h3 className="text-orange-500 text-3xl font-extrabold mb-4 uppercase tracking-widest">
              QuickCourt
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Find, book, and dominate the court. Your ultimate hub for sports venue booking.
            </p>
          </div>

          {/* Explore */}
          <div className="md:col-span-1">
            <h3 className="text-[#4ecdc4] font-bold mb-4 uppercase tracking-wider">Explore</h3>
            <ul className="space-y-3 font-medium">
              <li><a href="/venues" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">Venues</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">Popular Venues</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">Sports</a></li>
            </ul>
          </div>

          {/* Account */}
          <div className="md:col-span-1">
            <h3 className="text-[#4ecdc4] font-bold mb-4 uppercase tracking-wider">Account</h3>
            <ul className="space-y-3 font-medium">
              <li><a href="/profile" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">Profile</a></li>
              <li><a href="/my-bookings" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">My Bookings</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">Support</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-1">
            <h3 className="text-[#4ecdc4] font-bold mb-4 uppercase tracking-wider">Connect</h3>
            <div className="flex justify-start space-x-6">
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} QuickCourt. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;