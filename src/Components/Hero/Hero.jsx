import { MapPin, Search } from "lucide-react";
import React from "react";
import banner from "../../assets/ChatGPT Image Jan 3, 2026, 03_11_46 PM.png";

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="order-1">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Find Trusted{" "}
              <span className="text-indigo-600">
                Service Professionals
              </span>
              <br /> Near You
            </h1>

            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              Book verified professionals for home services, repairs, beauty, and
              maintenance — all at your convenience.
            </p>

            {/* Search Box */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 border border-indigo-600 rounded-xl px-4 py-3 w-full">
                <MapPin className="text-indigo-600" />
                <input
                  type="text"
                  placeholder="Enter your location"
                  className="w-full outline-none text-gray-700"
                />
              </div>

              <div className="flex items-center gap-3 border border-indigo-600 rounded-xl px-4 py-3 w-full">
                <Search className="text-indigo-600" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full outline-none text-gray-700"
                />
              </div>

              <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition whitespace-nowrap">
                Search
              </button>
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition">
                Book a Service
              </button>

              <button className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-indigo-50 transition">
                Join as a Professional
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-2 flex justify-center lg:justify-end">
            <img
              src={banner}
              alt="Service Professionals"
              className="
                w-full 
                max-w-sm 
                sm:max-w-md 
                lg:max-w-lg 
                rounded-3xl 
                shadow-2xl 
                object-cover
          
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
