import React from "react";
import { categories } from "../../../assets/assets";
import { useAppContext } from "../../../context/AppContext";

const Categories = () => {
  const { navigate } = useAppContext();

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 px-4 md:px-10 bg-white">
      <div className="text-center mb-10 md:mb-16">
        <p className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent mb-3">
          Explore Categories
        </p>
        <p className="text-gray-500 font-medium text-sm md:text-lg max-w-2xl mx-auto">
          Discover our wide range of fresh and authentic products curated just for you.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10 w-full max-w-7xl mx-auto">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group cursor-pointer relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-2 border border-gray-100"
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            <div
              className="h-32 md:h-44 flex items-center justify-center p-6 relative z-10"
              style={{ backgroundColor: category.bgColor }}
            >
              <img
                src={category.image}
                alt={category.text}
                className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-in-out"
              />
            </div>
            <div className="py-4 text-center bg-white relative z-20">
              <p className="text-base md:text-lg font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                {category.text}
              </p>
              <p className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                View Products →
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
