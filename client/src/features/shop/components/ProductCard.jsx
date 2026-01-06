import React, { useState } from "react";
import { assets } from "../../../assets/assets";
import { useAppContext } from "../../../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, navigate, cartItems } =
    useAppContext();
  const [selectedWeight, setSelectedWeight] = useState(product.availableWeights?.[0] || "");

  // Get price for selected weight variant
  const getVariantPrice = () => {
    if (product.weightVariants && product.weightVariants.length > 0 && selectedWeight) {
      const variant = product.weightVariants.find(v => v.weight === selectedWeight);
      return variant || { price: product.price, offerPrice: product.offerPrice };
    }
    return { price: product.price, offerPrice: product.offerPrice };
  };

  const currentVariant = getVariantPrice();

  // Generate cart key based on product and weight
  const getCartKey = () => selectedWeight ? `${product._id}-${selectedWeight}` : product._id;
  const cartKey = getCartKey();

  return (
    product && (
      <div
        onClick={() => {
          navigate(
            `/products/${product.category?.toLowerCase() || 'unknown'}/${product._id}`
          );
          scrollTo(0, 0);
        }}
        className="group relative flex flex-col justify-between border border-gray-100 rounded-xl sm:rounded-2xl bg-white w-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
      >
        <div className="relative flex items-center justify-center h-36 sm:h-52 bg-gray-50/50 group-hover:bg-gray-50 transition-colors p-2 sm:p-4">
          <img
            className={`w-full h-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-110 ${!product.inStock ? "opacity-50 grayscale" : ""
              }`}
            src={product.image?.[0]}
            alt={product.name}
          />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
              <span className="px-2 py-1 sm:px-3 sm:py-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-sm uppercase tracking-wide">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <p className="text-[10px] sm:text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="text-gray-900 font-semibold text-sm sm:text-lg mb-1 leading-tight line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-2 sm:mb-3">
            <div className="flex text-yellow-400 text-[10px] sm:text-xs">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    key={i}
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                    alt="star"
                  />
                ))}
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">({4})</span>
          </div>

          {/* Weight Selection - Only show if product has available weights */}
          {product.availableWeights && product.availableWeights.length > 0 && (
            <div className="mt-2 mb-2">
              <select
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation();
                  setSelectedWeight(e.target.value);
                }}
                value={selectedWeight}
                className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="">Select</option>
                {product.availableWeights.map((weight, idx) => (
                  <option key={idx} value={weight}>{weight}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex flex-col">
              <span className="text-sm sm:text-xl font-bold text-gray-900">
                {currency}{currentVariant.offerPrice}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                {currency}{currentVariant.price}
              </span>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="flex-shrink-0"
            >
              {!cartItems?.[cartKey] ? (
                <button
                  disabled={!product.inStock}
                  onClick={() => {
                    if (product.availableWeights && product.availableWeights.length > 0 && !selectedWeight) {
                      alert('Please select a weight option');
                      return;
                    }
                    addToCart(product._id, selectedWeight);
                  }}
                  className={`h-8 sm:h-9 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${!product.inStock
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100 hover:border-emerald-600"
                    }`}
                >
                  {product.inStock && <img src={assets.cart_icon} alt="" className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-70 group-hover:opacity-100 group-hover:invert transition-all" style={{ filter: "inherit" }} />}
                  <span className="hidden sm:inline">{!product.inStock ? "Sold Out" : "Add"}</span>
                  <span className="sm:hidden">{!product.inStock ? "Sold" : "Add"}</span>
                </button>
              ) : (
                <div className="flex items-center h-8 sm:h-9 bg-emerald-50 border border-emerald-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() => removeFromCart(product._id, selectedWeight)}
                    className="w-7 sm:w-8 h-full flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors text-base sm:text-lg font-medium"
                  >
                    -
                  </button>
                  <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-semibold text-emerald-700">
                    {cartItems[cartKey]}
                  </span>
                  <button
                    onClick={() => addToCart(product._id, selectedWeight)}
                    className="w-7 sm:w-8 h-full flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors text-base sm:text-lg font-medium"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
