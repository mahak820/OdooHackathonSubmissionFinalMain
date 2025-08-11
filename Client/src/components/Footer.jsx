import React from 'react';
import Particles from './ui/Particles';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-[#001890]/30 py-12">

      

      
      <div className="max-w-6xl mx-auto px-6">
        
        
        
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          {/* Company */}
          <div>
            <h3 className="text-blue-500 font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-blue-500 font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Web Design</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Development</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Consulting</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-blue-500 font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-blue-500 font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#001890]/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 Company Name. All rights reserved.</p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">Made with ❤️</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;