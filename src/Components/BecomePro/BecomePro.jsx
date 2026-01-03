import React from "react";
import { Download } from "lucide-react";
import phone from "../../assets/phone.png";

const BecomePro = () => {
  return (
    <section className="bg-indigo-600 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-700 rounded-3xl p-8 md:p-16 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                Become a Service Professional
              </h2>

              <p className="mt-4 text-indigo-100 text-lg max-w-xl">
                Download our app and start earning by providing services on your
                own schedule. Simple onboarding, real customers, fast payouts.
              </p>

              <ul className="mt-6 space-y-3 text-indigo-100">
                <li>✔ Flexible working hours</li>
                <li>✔ Weekly payments</li>
                <li>✔ Verified customer bookings</li>
                <li>✔ Zero marketing cost</li>
              </ul>

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/apk/your-app-name.apk"
                  download
                  className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-50 transition"
                >
                  <Download size={18} />
                  Download APK
                </a>

                <button className="border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition">
                  Join as Professional
                </button>
              </div>

              <p className="mt-4 text-sm text-indigo-200">
                * App not available on Play Store yet
              </p>
            </div>

            {/* Right App Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img
                  src={phone}
                  alt="App UI Preview"
                  className="w-[260px] sm:w-[300px] rounded-3xl 
                 rotate-[8deg] hover:rotate-0 transition-transform duration-500"
                />

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-white text-indigo-600 px-4 py-1 rounded-full text-sm font-semibold shadow rotate-6">
                  New App
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomePro;
