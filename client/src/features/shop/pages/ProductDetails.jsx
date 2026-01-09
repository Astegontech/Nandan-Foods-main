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
  const [showFullDescription, setShowFullDescription] = useState(false);
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
      <div className="bg-white min-h-screen pt-8 pb-20">

        {/* Container */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

          {/* Breadcrumb */}
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-400 font-medium mb-12">
            <Link to="/" className="hover:text-black transition">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-black transition">Shop</Link>
            <span>/</span>
            <span className="text-black">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

            {/* Left Column: Minimalist Gallery */}
            <div className="flex flex-col gap-8">
              {/* Main Image - Pure & Clean */}
              <div className="w-full h-[500px] lg:h-[650px] bg-gray-50 rounded-[2rem] flex items-center justify-center overflow-hidden relative">
                <img
                  src={thumbnail}
                  alt={product.name}
                  className="w-full h-full object-contain p-8 mix-blend-multiply transition-transform duration-700 hover:scale-105"
                />
                {Math.round(((currentVariant.price - currentVariant.offerPrice) / currentVariant.price) * 100) > 0 && (
                  <span className="absolute top-6 left-6 px-4 py-2 bg-black text-white text-xs font-bold tracking-widest uppercase rounded-full">
                    Sale
                  </span>
                )}
              </div>

              {/* Minimal Thumbnails */}
              <div className="flex gap-4 justify-center">
                {product.image.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setThumbnail(image)}
                    className={`w-16 h-16 rounded-full overflow-hidden border transition-all duration-300 ${thumbnail === image ? "border-black scale-110" : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Clean Info */}
            <div className="flex flex-col pt-4">

              {/* Header */}
              <div className="mb-6">
                <p className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-3">
                  {product.category}
                </p>
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex text-black">
                    {Array(5).fill("").map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 underline decoration-gray-300 underline-offset-4">(128 reviews)</span>
                </div>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-4 mb-8">
                <p className="text-4xl font-light text-gray-900">
                  {currency}{currentVariant.offerPrice}
                </p>
                {currentVariant.price > currentVariant.offerPrice && (
                  <p className="text-xl text-gray-400 line-through">
                    {currency}{currentVariant.price}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-10 text-gray-600 leading-relaxed text-lg space-y-4 font-light">
                {product.description.slice(0, 3).map((desc, i) => (
                  <p key={i}>{desc}</p>
                ))}
                {product.description.length > 3 && (
                  <div className="hidden md:block">
                    {product.description.slice(3).map((desc, i) => <p key={i} className="mt-4">{desc}</p>)}
                  </div>
                )}
              </div>

              {/* Weight Selector - Minimal Pills */}
              {product.availableWeights && product.availableWeights.length > 0 && (
                <div className="mb-10">
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Size / Weight</p>
                  <div className="flex flex-wrap gap-3">
                    {product.availableWeights.map((weight, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedWeight(weight)}
                        className={`px-6 py-3 rounded-full border text-sm font-medium transition-all duration-200 ${selectedWeight === weight
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 text-gray-600 hover:border-black'
                          }`}
                      >
                        {weight}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => {
                    if (product.availableWeights?.length > 0 && !selectedWeight) return alert('Select weight');
                    addToCart(product._id, selectedWeight);
                    navigate("/cart");
                  }}
                  className="flex-1 py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-lg"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => {
                    if (product.availableWeights?.length > 0 && !selectedWeight) return alert('Select weight');
                    addToCart(product._id, selectedWeight);
                  }}
                  className="flex-1 py-4 bg-white border border-gray-300 text-black rounded-full font-bold text-lg hover:border-black transition-all"
                >
                  Add to Cart
                </button>
              </div>

              {/* Trust Features */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                <div className="flex flex-col gap-2">
                  <img src={assets.leaf_icon} alt="Natural" className="w-6 h-6 opacity-60 grayscale" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">100% Natural</span>
                </div>
                <div className="flex flex-col gap-2">
                  <img src={assets.delivery_truck_icon} alt="Delivery" className="w-6 h-6 opacity-60 grayscale" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fast Shipping</span>
                </div>
                <div className="flex flex-col gap-2">
                  <img src={assets.trust_icon} alt="Secure" className="w-6 h-6 opacity-60 grayscale" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Secure Pay</span>
                </div>
              </div>

            </div>
          </div>

          {/* Related Products - Clean Grid */}
          <div className="mt-32 border-t border-gray-100 pt-16">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">You might also like</h2>
              <Link to="/products" className="text-sm font-semibold border-b border-black pb-1 hover:text-gray-600 transition">View All</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
              {relatedProducts.filter(p => p.inStock).map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>

        </div>
      </div>
    )
  );
};

export default ProductDetails;

