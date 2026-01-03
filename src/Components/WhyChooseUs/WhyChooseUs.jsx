import { ShieldCheck, BadgeCheck, Clock, Star } from "lucide-react";
import React from "react";

const reasons = [
  {
    icon: <ShieldCheck size={30} />,
    title: "Verified Professionals",
    desc: "All service providers are background-checked and verified.",
  },
  {
    icon: <BadgeCheck size={30} />,
    title: "Quality Assured",
    desc: "High-quality service with standardized pricing.",
  },
  {
    icon: <Clock size={30} />,
    title: "On-Time Service",
    desc: "Professionals arrive on time as per your booking slot.",
  },
  {
    icon: <Star size={30} />,
    title: "Rated by Customers",
    desc: "Top-rated services trusted by thousands of users.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Why Choose Us
          </h2>
          <p className="mt-4 text-gray-600">
            Trusted services designed for your comfort and peace of mind
          </p>
        </div>

        {/* Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((item, index) => (
            <div
              key={index}
              className="group bg-gray-50 rounded-2xl p-6 text-center hover:bg-white hover:shadow-xl transition"
            >
              <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                {item.icon}
              </div>

              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                {item.title}
              </h3>

              <p className="mt-3 text-gray-600 text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
