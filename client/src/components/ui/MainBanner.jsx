import React from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    <div className="relative w-full h-[380px] md:h-[500px] bg-gray-900 rounded-xl overflow-hidden group">

      {/* 1. Cinematic Background Layer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={assets.main_banner_bg}
          alt="Banner"
          className="w-full h-full object-cover object-center animate-subtle-zoom opacity-80"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Floating Badge (Unique Touch) */}
      <div className="absolute top-8 right-8 animate-float hidden md:block">
        <div className="relative w-24 h-24 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-500">
          <div className="text-center">
            <span className="block text-emerald-400 font-bold text-xl">100%</span>
            <span className="block text-white text-[10px] uppercase tracking-wider">Natural</span>
          </div>
          {/* Decorative rings */}
          <div className="absolute inset-0 border-2 border-dashed border-emerald-500/30 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }}></div>
        </div>
      </div>

      {/* 2. Glassmorphism Content Layer */}
      <div className="absolute inset-0 flex items-center px-6 md:px-16 lg:px-24">
        <div className="max-w-xl animate-fade-up">

          {/* Glass Card Container */}
          <div className="backdrop-blur-md bg-white/10 border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Shine effect */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-emerald-500/30 blur-3xl rounded-full"></div>

            <h2 className="text-emerald-400 font-bold tracking-widest text-sm uppercase mb-3">Premium Quality</h2>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Authentic flavors of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">Uttar Karnataka</span>
            </h1>

            <p className="text-gray-300 text-lg mb-8 max-w-md">
              Handcrafted with traditional recipes. Taste the heritage in every bite.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-full shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group/btn"
              >
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                </svg>
              </Link>

              <Link
                to="/about"
                className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold rounded-full backdrop-blur-sm transition-colors duration-300"
              >
                Our Story
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MainBanner;
