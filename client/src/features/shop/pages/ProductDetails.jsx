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
        if (products.length > 0 && product) {
            const productsCopy = products.filter(
                (item) =>
                    item.category?.toLowerCase() === product.category?.toLowerCase() &&
                    item._id !== product._id
            );
            setRelatedProducts(productsCopy.slice(0, 5));
        }
    }, [product, products]);

    useEffect(() => {
        setThumbnail(product?.image[0] ? product.image[0] : null);
        setSelectedWeight(product?.availableWeights?.[0] || "");
        setShowFullDescription(false);
        scrollTo(0, 0);
    }, [product]);

    return (
        product && (
            <div className="bg-white min-h-screen pt-10 pb-20">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
                        <Link to="/" className="hover:text-primary transition">Home</Link>
                        <span className="text-gray-300">/</span>
                        <Link to="/products" className="hover:text-primary transition">Products</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                        {/* Left: Image Gallery */}
                        <div className="flex flex-col gap-6">
                            {/* Main Image Container */}
                            <div className="w-full bg-gray-50 rounded-2xl border border-gray-100 p-8 flex items-center justify-center relative overflow-hidden group h-[500px]">
                                <img
                                    src={thumbnail}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                                />
                                {Math.round(((currentVariant.price - currentVariant.offerPrice) / currentVariant.price) * 100) > 0 && (
                                    <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm">
                                        {Math.round(((currentVariant.price - currentVariant.offerPrice) / currentVariant.price) * 100)}% OFF
                                    </span>
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-center">
                                {product.image.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setThumbnail(image)}
                                        className={`shrink-0 w-20 h-20 rounded-lg border-2 p-1 bg-white cursor-pointer transition-all ${thumbnail === image ? "border-primary shadow-sm" : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <img src={image} alt="" className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Product Info */}
                        <div className="flex flex-col">

                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-outfit">
                                {product.name}
                            </h1>

                            {/* Rating + Stock */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1">
                                    {Array(5).fill("").map((_, i) => (
                                        <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} className="w-4 h-4" alt="" />
                                    ))}
                                    <span className="text-sm text-gray-500 ml-2 font-medium">(120 Reviews)</span>
                                </div>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                    In Stock
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100 inline-block w-full sm:w-auto">
                                <p className="text-sm text-gray-500 mb-1">Price per pack</p>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-primary">
                                        {currency}{currentVariant.offerPrice}
                                    </span>
                                    {currentVariant.price > currentVariant.offerPrice && (
                                        <span className="text-lg text-gray-400 line-through">
                                            {currency}{currentVariant.price}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
                            </div>

                            {/* Description (Truncated) */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-gray-900 mb-3">About this item</h3>
                                <div className="text-gray-600 text-base leading-relaxed space-y-3">
                                    {product.description.slice(0, 3).map((desc, i) => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                                            <p>{desc}</p>
                                        </div>
                                    ))}

                                    {showFullDescription && product.description.slice(3).map((desc, i) => (
                                        <div key={i + 3} className="flex gap-3 items-start animate-fadeIn">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                                            <p>{desc}</p>
                                        </div>
                                    ))}
                                </div>

                                {product.description.length > 3 && (
                                    <button
                                        onClick={() => setShowFullDescription(!showFullDescription)}
                                        className="text-primary font-medium text-sm mt-3 hover:underline flex items-center gap-1"
                                    >
                                        {showFullDescription ? "Show Less" : "Read More"}
                                        <svg className={`w-4 h-4 transition-transform ${showFullDescription ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Weight/Size Selector */}
                            {product.availableWeights && product.availableWeights.length > 0 && (
                                <div className="mb-8">
                                    <p className="text-sm font-semibold text-gray-900 mb-3">Select Size</p>
                                    <div className="flex flex-wrap gap-3">
                                        {product.availableWeights.map((weight, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedWeight(weight)}
                                                className={`px-5 py-2 rounded-lg border font-medium text-sm transition-all ${selectedWeight === weight
                                                    ? 'border-primary bg-primary text-white shadow-md'
                                                    : 'border-gray-200 text-gray-700 hover:border-primary hover:text-primary bg-white'
                                                    }`}
                                            >
                                                {weight}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-4 mb-10">
                                <button
                                    onClick={() => {
                                        if (product.availableWeights?.length > 0 && !selectedWeight) return alert('Select weight');
                                        addToCart(product._id, selectedWeight);
                                        navigate("/cart");
                                    }}
                                    className="flex-1 bg-primary text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all"
                                >
                                    Buy Now
                                </button>
                                <button
                                    onClick={() => {
                                        if (product.availableWeights?.length > 0 && !selectedWeight) return alert('Select weight');
                                        addToCart(product._id, selectedWeight);
                                    }}
                                    className="flex-1 bg-white border-2 border-primary text-primary font-semibold py-4 rounded-xl hover:bg-primary/5 transition-all"
                                >
                                    Add to Cart
                                </button>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-t border-gray-100">
                                <div className="text-center p-3 rounded-xl bg-gray-50 flex flex-col items-center gap-2">
                                    <img src={assets.leaf_icon} className="w-6 h-6 opacity-70" alt="" />
                                    <span className="text-xs font-semibold text-gray-600">Pure & Natural</span>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-gray-50 flex flex-col items-center gap-2">
                                    <img src={assets.trust_icon} className="w-6 h-6 opacity-70" alt="" />
                                    <span className="text-xs font-semibold text-gray-600">Authentic</span>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-gray-50 flex flex-col items-center gap-2">
                                    <img src={assets.delivery_truck_icon} className="w-6 h-6 opacity-70" alt="" />
                                    <span className="text-xs font-semibold text-gray-600">Safe Delivery</span>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-gray-50 flex flex-col items-center gap-2">
                                    <img src={assets.coin_icon} className="w-6 h-6 opacity-70" alt="" />
                                    <span className="text-xs font-semibold text-gray-600">Best Prices</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="mt-20 border-t border-gray-100 pt-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">More to Explore</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
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
