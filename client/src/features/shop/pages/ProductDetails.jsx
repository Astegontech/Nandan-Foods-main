import React, { useEffect, useState, useRef } from "react";
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
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeSection, setActiveSection] = useState("description");

    const product = products.find((item) => item._id === id);
    const imageRef = useRef(null);

    // Get price for selected weight variant
    const getVariantPrice = () => {
        if (product?.weightVariants && product.weightVariants.length > 0 && selectedWeight) {
            const variant = product.weightVariants.find(v => v.weight === selectedWeight);
            return variant || { price: product.price, offerPrice: product.offerPrice };
        }
        return { price: product?.price, offerPrice: product?.offerPrice };
    };

    const currentVariant = getVariantPrice();
    const discountPercentage = Math.round(((currentVariant.price - currentVariant.offerPrice) / currentVariant.price) * 100);

    // Handle Image Zoom
    const handleMouseMove = (e) => {
        if (!imageRef.current) return;
        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePosition({ x, y });
    };

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
        setActiveSection("description");
        scrollTo(0, 0);
    }, [product]);

    if (!product) return <div className="min-h-screen"></div>;

    return (
        <div className="bg-white min-h-screen pb-32 md:pb-20 pt-6">

            {/* Mobile Bottom Sticky Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 md:hidden flex gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex-1">
                    <p className="text-xs text-gray-500">Total Price</p>
                    <p className="text-lg font-bold text-gray-900">{currency}{currentVariant.offerPrice}</p>
                </div>
                <button
                    onClick={() => addToCart(product._id, selectedWeight)}
                    className="flex-1 bg-primary text-white font-bold py-3 rounded-lg shadow-lg"
                >
                    Add to Cart
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="flex text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <span className="mx-2 text-gray-300">/</span>
                    <Link to="/products" className="hover:text-primary transition-colors">Shop</Link>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

                    {/* LEFT: Image Gallery */}
                    <div className="flex flex-col gap-6">
                        {/* Main Image with Zoom */}
                        <div
                            className="relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden cursor-crosshair group border border-gray-100"
                            onMouseEnter={() => setIsZoomed(true)}
                            onMouseLeave={() => setIsZoomed(false)}
                            onMouseMove={handleMouseMove}
                            ref={imageRef}
                        >
                            <img
                                src={thumbnail}
                                alt={product.name}
                                className={`w-full h-full object-contain mix-blend-multiply transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
                            />

                            {/* Zoomed Image Overlay */}
                            {isZoomed && (
                                <div
                                    className="absolute inset-0 pointer-events-none mix-blend-multiply bg-no-repeat"
                                    style={{
                                        backgroundImage: `url(${thumbnail})`,
                                        backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                                        backgroundSize: '250%' // Zoom level
                                    }}
                                />
                            )}

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {discountPercentage > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        {discountPercentage}% OFF
                                    </span>
                                )}
                                <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                    Natural
                                </span>
                            </div>
                        </div>

                        {/* Thumbnail Slider */}
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {product.image.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setThumbnail(img)}
                                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${thumbnail === img
                                            ? "border-primary ring-2 ring-primary/20 ring-offset-2"
                                            : "border-gray-100 hover:border-gray-300"
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                                </button>
                            ))}
                        </div>

                        {/* Trust Badges (Desktop) */}
                        <div className="hidden md:grid grid-cols-4 gap-4 pt-6 border-t border-gray-100">
                            {[
                                { icon: assets.leaf_icon, label: "100% Natural" },
                                { icon: assets.trust_icon, label: "Verified" },
                                { icon: assets.delivery_truck_icon, label: "Fast Delivery" },
                                { icon: assets.coin_icon, label: "Best Price" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 text-center p-2">
                                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                        <img src={item.icon} alt="" className="w-5 h-5 opacity-80" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* RIGHT: Product Info (Sticky) */}
                    <div className="lg:sticky lg:top-24 h-fit space-y-8">

                        {/* Header */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2 font-outfit">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center text-amber-400 gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-4 h-4 ${i < 4 ? "fill-current" : "text-gray-300 fill-current"}`} viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-gray-500 font-medium">128 Reviews</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded text-xs">In Stock</span>
                            </div>
                        </div>

                        {/* Price Block */}
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-gray-900 font-outfit">
                                    {currency}{currentVariant.offerPrice}
                                </span>
                                {currentVariant.price > currentVariant.offerPrice && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through font-medium">
                                            {currency}{currentVariant.price}
                                        </span>
                                        <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                                            You Save {currency}{currentVariant.price - currentVariant.offerPrice}
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Inclusive of all taxes. Free shipping on orders above ₹499.</p>
                        </div>

                        {/* Variants */}
                        {product.availableWeights?.length > 0 && (
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-3">
                                    Select Size / Weight
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {product.availableWeights.map((weight) => (
                                        <button
                                            key={weight}
                                            onClick={() => setSelectedWeight(weight)}
                                            className={`px-6 py-2.5 rounded-lg border font-medium text-sm transition-all duration-200 ${selectedWeight === weight
                                                    ? 'border-primary bg-primary text-white shadow-md transform scale-105'
                                                    : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white hover:bg-gray-50'
                                                }`}
                                        >
                                            {weight}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Desktop Actions */}
                        <div className="hidden md:flex gap-4">
                            <button
                                onClick={() => {
                                    if (product.availableWeights?.length > 0 && !selectedWeight) return alert('Please select a size');
                                    addToCart(product._id, selectedWeight);
                                    navigate("/cart");
                                }}
                                className="flex-1 bg-gray-900 text-white font-bold text-lg py-4 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={() => {
                                    if (product.availableWeights?.length > 0 && !selectedWeight) return alert('Please select a size');
                                    addToCart(product._id, selectedWeight);
                                }}
                                className="flex-1 bg-white border-2 border-gray-900 text-gray-900 font-bold text-lg py-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
                            >
                                Add to Cart
                            </button>
                        </div>

                        {/* Accordion Sections */}
                        <div className="divide-y divide-gray-100 border-t border-b border-gray-100">

                            {/* Description */}
                            <div className="py-4">
                                <button
                                    onClick={() => setActiveSection(activeSection === 'description' ? '' : 'description')}
                                    className="flex items-center justify-between w-full text-left font-semibold text-gray-900 group"
                                >
                                    <span>Description</span>
                                    <span className={`transition-transform duration-300 ${activeSection === 'description' ? 'rotate-180' : ''}`}>
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeSection === 'description' ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                    <ul className="space-y-2 text-gray-600 leading-relaxed">
                                        {product.description.map((line, i) => (
                                            <li key={i} className="flex gap-3 items-start">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                                <span>{line}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Ingredients (Static Placeholder) */}
                            <div className="py-4">
                                <button
                                    onClick={() => setActiveSection(activeSection === 'ingredients' ? '' : 'ingredients')}
                                    className="flex items-center justify-between w-full text-left font-semibold text-gray-900 group"
                                >
                                    <span>Ingredients</span>
                                    <span className={`transition-transform duration-300 ${activeSection === 'ingredients' ? 'rotate-180' : ''}`}>
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeSection === 'ingredients' ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-gray-600">
                                        Premium quality nuts, organic jaggery, pure ghee, cardamom powder, and secret spice blend. 100% natural with no added preservatives.
                                    </p>
                                </div>
                            </div>

                            {/* Shelf Life (Static Placeholder) */}
                            <div className="py-4">
                                <button
                                    onClick={() => setActiveSection(activeSection === 'shelf-life' ? '' : 'shelf-life')}
                                    className="flex items-center justify-between w-full text-left font-semibold text-gray-900 group"
                                >
                                    <span>Shelf Life & Storage</span>
                                    <span className={`transition-transform duration-300 ${activeSection === 'shelf-life' ? 'rotate-180' : ''}`}>
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeSection === 'shelf-life' ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-gray-600">
                                        Best before 3 months from packaging. Store in a cool, dry place in an airtight container for maximum freshness.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Why Nandan Foods? */}
                        <div className="bg-primary/5 rounded-xl p-6 mt-6 border border-primary/10">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <img src={assets.verified_icon || assets.trust_icon} className="w-5 h-5 text-primary" alt="" />
                                Why Nandan Foods?
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed mb-0">
                                We bring you the authentic taste of North Karnataka, prepared with traditional recipes passed down through generations. Every pack is made with love, ensuring hygiene and premium quality.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-24 border-t border-gray-100 pt-16">
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center font-outfit">You Might Also Like</h2>
                        <p className="text-gray-500 text-center max-w-2xl">Discover more authentic flavors from our collection. Hand-picked recommendations just for you.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {relatedProducts.filter(p => p.inStock).map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetails;
