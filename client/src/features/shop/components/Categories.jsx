import React from "react";
import { categories } from "../../../assets/assets";
import { useAppContext } from "../../../context/AppContext";

const Categories = () => {
  const { navigate } = useAppContext();

  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4 md:px-10 bg-gradient-to-b from-white to-gray-50/50">
      <div className="text-center mb-12 md:mb-20 animate-fade-up">
        <p className="text-3xl md:text-5xl font-bold text-gray-800 mb-3 tracking-tight">
          Explore <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Categories</span>
        </p>
        <p className="text-gray-500 font-medium text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
          Discover our wide range of fresh and authentic products curated just for you.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10 w-full max-w-7xl mx-auto">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group cursor-pointer relative"
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            {/* Background Blob/Shape */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-40 md:h-40 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500"
              style={{ backgroundColor: category.bgColor }}
            ></div>

            {/* Card Content */}
            <div className="relative flex flex-col items-center">

              {/* Image Container with Floating Effect */}
              <div className="relative mb-6 transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white p-4 flex items-center justify-center relative z-10 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] transition-shadow duration-500">
                  <img
                    src={category.image}
                    alt={category.text}
                    className="w-full h-full object-contain drop-shadow-md"
                  />
                </div>
                {/* Decorative Ring */}
                <div className="absolute inset-0 rounded-full border border-gray-100 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500"></div>
              </div>

              {/* Text Content */}
              <div className="text-center space-y-2">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                  {category.text}
                </h3>

                <div className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-emerald-500 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span>Explore</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
