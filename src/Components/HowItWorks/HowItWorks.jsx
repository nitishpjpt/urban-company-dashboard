import { Search, CalendarCheck, Smile } from "lucide-react";
import React from "react";

const steps = [
  {
    icon: <Search size={32} />,
    title: "Choose a Service",
    desc: "Browse services and select what you need in just a few clicks.",
  },
  {
    icon: <CalendarCheck size={32} />,
    title: "Book a Slot",
    desc: "Pick a convenient date & time that fits your schedule.",
  },
  {
    icon: <Smile size={32} />,
    title: "Relax & Enjoy",
    desc: "Our verified professional delivers quality service at your doorstep.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-4 text-gray-600">
            Book trusted professionals in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition"
            >
              {/* Step Number */}
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-semibold">
                {index + 1}
              </span>

              {/* Icon */}
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-3 text-gray-600">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
