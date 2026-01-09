import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../../../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState("");
  const product = products.find((item) => item._id === id);

  // Get price for selected weight variant
  const getVariantPrice = () => {
    if (product?.weightVariants && product.weightVariants.length > 0 && selectedWeight) {
      const variant = product.weightVariants.find(v => v.weight === selectedWeight);
      return variant || { price: product.price, offerPrice: product.offerPrice };
    }
    return { price: product?.price, offerPrice: product?.offerPrice };
  };

  const currentVariant = getVariantPrice();

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(
        (item) => product.category === item.category && item._id !== product._id
      );
      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [product, products]);

  useEffect(() => {
    setThumbnail(product?.image[0] ? product.image[0] : null);
    setSelectedWeight(product?.availableWeights?.[0] || "");
    scrollTo(0, 0);
  }, [product]);

  return (
    product && (
      <div className="pt-12 pb-24 px-4 md:px-8 lg:px-16 bg-gray-50/30">

        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500 font-medium">
          <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-emerald-600 transition">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-6">
            <div className="w-full bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative group">
              <img
                src={thumbnail}
                alt={product.name}
                className="w-full h-[400px] md:h-[550px] object-contain p-8 transform transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay Badge */}
              <div className="absolute top-4 left-4 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                {product.category}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-center">
              {product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-white rounded-xl border-2 cursor-pointer overflow-hidden p-2 transition-all duration-300 ${thumbnail === image ? "border-emerald-500 shadow-md ring-2 ring-emerald-100" : "border-gray-200 hover:border-emerald-300"
                    }`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-2">
              {product.name}
            </h1>

            {/* Reviews */}
            <div className="flex items-center gap-1 mb-6">
              <div className="flex text-amber-400">
                {Array(5).fill("").map((_, i) => (
                  <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" className="w-4 h-4 md:w-5 md:h-5" />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium ml-2">(128 Reviews)</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-sm text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">In Stock</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <p className="text-4xl font-bold text-gray-900">
                {currency}{currentVariant.offerPrice}
              </p>
              <p className="text-xl text-gray-400 line-through decoration-gray-400">
                {currency}{currentVariant.price}
              </p>
              <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">
                {Math.round(((currentVariant.price - currentVariant.offerPrice) / currentVariant.price) * 100)}% OFF
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3">About the Product</h3>
              <ul className="space-y-3">
                {product.description.map((desc, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-600 leading-relaxed">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {desc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 py-6 border-y border-gray-100 bg-white/50 rounded-xl px-4">
              <div className="flex flex-col items-center text-center gap-2">
                <img src={assets.leaf_icon} alt="Natural" className="w-8 h-8 opacity-80" />
                <span className="text-xs font-semibold text-gray-600">100% Natural</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <img src={assets.trust_icon} alt="Authentic" className="w-8 h-8 opacity-80" />
                <span className="text-xs font-semibold text-gray-600">Verified Quality</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <img src={assets.delivery_truck_icon} alt="Delivery" className="w-8 h-8 opacity-80" />
                <span className="text-xs font-semibold text-gray-600">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <img src={assets.coin_icon} alt="Price" className="w-8 h-8 opacity-80" />
                <span className="text-xs font-semibold text-gray-600">Best Price</span>
              </div>
            </div>

            {/* Variant Selection */}
            {product.availableWeights && product.availableWeights.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Select Quantity</p>
                <div className="flex flex-wrap gap-3">
                  {product.availableWeights.map((weight, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedWeight(weight)}
                      className={`px-6 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${selectedWeight === weight
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:border-emerald-200 hover:bg-gray-50'
                        }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-auto">
              <button
                onClick={() => {
                  if (product.availableWeights?.length > 0 && !selectedWeight) return alert('Select weight');
                  addToCart(product._id, selectedWeight);
                }}
                className="flex-1 py-4 bg-white border-2 border-gray-200 rounded-full font-bold text-gray-800 hover:border-gray-900 hover:bg-gray-50 transition-all duration-300"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  if (product.availableWeights?.length > 0 && !selectedWeight) return alert('Select weight');
                  addToCart(product._id, selectedWeight);
                  navigate("/cart");
                }}
                className="flex-1 py-4 bg-gray-900 text-white rounded-full font-bold shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_25px_rgba(0,0,0,0.25)] hover:scale-[1.02] transition-all duration-300 transform"
              >
                Buy Now
              </button>
            </div>

          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Related Products</h2>
            <Link to="/products" className="text-emerald-600 font-semibold hover:underline">View All</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {relatedProducts.filter(p => p.inStock).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>

      </div>
    )
  );
};

export default ProductDetails;
