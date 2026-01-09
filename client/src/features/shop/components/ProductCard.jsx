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
        className="group relative flex flex-col justify-between border border-gray-100 rounded-xl bg-white w-full transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-emerald-500/10 hover:border-emerald-500/50 hover:-translate-y-1 overflow-hidden"
      >
        <div className="relative flex items-center justify-center h-40 sm:h-48 bg-gray-50/50 group-hover:bg-gray-50 transition-colors p-3 overflow-hidden">
          <img
            className={`w-full h-full object-contain transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1 ${!product.inStock ? "opacity-50 grayscale" : ""
              }`}
            src={product.image?.[0]}
            alt={product.name}
          />

          {/* Sale Badge */}
          {currentVariant.price > currentVariant.offerPrice && product.inStock && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm z-10 flex items-center gap-1">
              <span className="tracking-wide">
                {Math.round(((currentVariant.price - currentVariant.offerPrice) / currentVariant.price) * 100)}% OFF
              </span>
            </div>
          )}

          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] z-20">
              <span className="px-4 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-md uppercase tracking-wide transform -rotate-6">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-3 flex flex-col flex-grow">
          {/* Header: Category & Rating */}
          {/* <div className="flex justify-between items-start mb-1.5"> */}
            {/* <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              {product.category}
            </span>
            <div className="flex items-center gap-1 bg-white">
              <div className="flex text-yellow-500 text-xs"> */}
                {/* Static rating for now as per original code */}
                {/* {"★★★★☆".split("").map((star, i) => (
                  <span key={i} className={i < 4 ? "text-yellow-400" : "text-gray-300"}>★</span>
                ))}
              </div>
              <span className="text-[10px] text-gray-400 font-medium ml-0.5">(4)</span>
            </div>
          </div> */}

          <h3 className="text-gray-800 font-bold text-sm sm:text-base mb-1 leading-tight line-clamp-2 min-h-[2.2rem]">
            {product.name?.charAt(0).toUpperCase() + product.name?.slice(1)}
          </h3>

          {/* Low Stock Indicator */}
          {product.stock && product.stock < 10 && product.inStock && (
            <p className="text-[10px] text-orange-500 font-medium mb-1">
              Only {product.stock} left!
            </p>
          )}

          {/* Weight Selection */}
          {product.availableWeights && product.availableWeights.length > 0 && (
            <div className={`flex flex-wrap gap-1.5 mb-2 overflow-x-auto no-scrollbar scroll-smooth ${product.availableWeights.length > 3 ? 'justify-start' : 'justify-start'}`}>
              {product.availableWeights.map((weight, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedWeight(weight);
                  }}
                  className={`px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-md transition-all duration-200 border shadow-sm flex-shrink-0 ${selectedWeight === weight
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50"
                    }`}
                >
                  {weight}
                </button>
              ))}
            </div>
          )}

          <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold text-emerald-700 leading-none">
                {currency}{currentVariant.offerPrice}
              </span>
              {currentVariant.price > currentVariant.offerPrice && (
                <span className="text-xs text-gray-400 line-through font-medium mt-0.5">
                  {currency}{currentVariant.price}
                </span>
              )}
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
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
                  className={`relative overflow-hidden h-8 px-3 sm:px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 transform active:scale-95 flex items-center gap-2 shadow-sm hover:shadow-md ${!product.inStock
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                >
                  <img src={assets.cart_icon} alt="" className="w-3.5 h-3.5 filter invert brightness-0" />
                  <span>ADD</span>
                </button>
              ) : (
                <div className="flex items-center h-8 bg-white border border-emerald-200 rounded-lg overflow-hidden shadow-sm">
                  <button
                    onClick={() => removeFromCart(product._id, selectedWeight)}
                    className="w-8 h-full flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-emerald-700 bg-emerald-50/50 h-full flex items-center justify-center border-x border-emerald-100">
                    {cartItems[cartKey]}
                  </span>
                  <button
                    onClick={() => addToCart(product._id, selectedWeight)}
                    className="w-8 h-full flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors text-lg font-bold"
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
