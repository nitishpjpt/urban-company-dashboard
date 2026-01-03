import {
  Wrench,
  Home,
  Droplets,
  Scissors,
  Paintbrush,
  ShieldCheck,
} from "lucide-react";
import React from "react";

const services = [
  {
    icon: <Home size={28} />,
    title: "Home Cleaning",
    desc: "Professional home & deep cleaning services",
  },
  {
    icon: <Wrench size={28} />,
    title: "Appliance Repair",
    desc: "AC, fridge, washing machine repairs",
  },
  {
    icon: <Droplets size={28} />,
    title: "Plumbing",
    desc: "Leakage, fittings & bathroom solutions",
  },
  {
    icon: <Scissors size={28} />,
    title: "Salon at Home",
    desc: "Beauty & grooming services at your doorstep",
  },
  {
    icon: <Paintbrush size={28} />,
    title: "Painting",
    desc: "Interior & exterior painting solutions",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Pest Control",
    desc: "Safe & effective pest solutions",
  },
];

const Services = () => {
  return (
    <section id="services" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Popular Services
          </h2>
          <p className="mt-4 text-gray-600">
            Choose from a wide range of professional services trusted by
            thousands of customers.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white  border-[#432DD7] border-2 rounded-2xl p-6 hover:shadow-lg transition duration-300 shadow-sm"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                {service.icon}
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                {service.title}
              </h3>

              <p className="mt-2 text-gray-600">
                {service.desc}
              </p>

              <button className="mt-4 text-indigo-600 font-medium hover:underline">
                Explore →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
