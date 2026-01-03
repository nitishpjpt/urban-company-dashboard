import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              Easy <span className="text-indigo-500">2 Get</span>
            </h2>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Trusted platform to book verified service professionals for all
              your home and personal service needs.
            </p>

            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-white cursor-pointer">Home Cleaning</li>
              <li className="hover:text-white cursor-pointer">AC Repair</li>
              <li className="hover:text-white cursor-pointer">Salon at Home</li>
              <li className="hover:text-white cursor-pointer">Plumbing</li>
              <li className="hover:text-white cursor-pointer">Painting</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={16} /> support@hyperdev95gmail.com
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} /> +91 9871785113
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} /> India
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} UrbanPro. All rights reserved by HyperDev.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
