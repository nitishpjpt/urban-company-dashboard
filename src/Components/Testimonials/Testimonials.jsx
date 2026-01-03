import { Star } from "lucide-react";
import React from "react";

const testimonials = [
  {
    name: "Amit Sharma",
    role: "Home Cleaning",
    rating: 5,
    review:
      "Excellent service! The professional was punctual and very polite. My home looks brand new.",
  },
  {
    name: "Neha Verma",
    role: "Salon at Home",
    rating: 5,
    review:
      "Loved the experience. The stylist was highly skilled and followed all safety measures.",
  },
  {
    name: "Rahul Mehta",
    role: "AC Repair",
    rating: 4,
    review:
      "Quick service and reasonable pricing. Definitely booking again.",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-gray-600">
            Real experiences from real customers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
            >
              {/* Rating */}
              <div className="flex gap-1 text-yellow-500">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              {/* Review */}
              <p className="mt-4 text-gray-700 leading-relaxed">
                “{item.review}”
              </p>

              {/* User */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
