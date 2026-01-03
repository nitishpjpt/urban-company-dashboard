import { useState } from "react";
import { Menu, X } from "lucide-react";
import React from "react";
import Logo from "../../assets/easy2get-logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <img src={Logo} alt="Logo" className=" h-12 w-auto" />
            <h1 className="text-2xl font-bold text-gray-900">
              <Link to="/">
                {" "}
                Easy-2-<span className="text-indigo-600">Get</span>
              </Link>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="nav-link">
              Services
            </a>
            <a href="#how-it-works" className="nav-link">
              How It Works
            </a>
            <a href="#partners" className="nav-link">
              Partners
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>

            <button className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition">
               <Link to="/login">Login</Link>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-4 space-y-4">
            <a href="#services" className="mobile-link">
              Services
            </a>
            <a href="#how-it-works" className="mobile-link">
              How It Works
            </a>
            <a href="#partners" className="mobile-link">
              Partners
            </a>
            <a href="#contact" className="mobile-link">
              Contact
            </a>

            <button className="w-full bg-indigo-600 text-white py-2 rounded-full font-medium hover:bg-indigo-700 transition">
              Join as Pro
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
