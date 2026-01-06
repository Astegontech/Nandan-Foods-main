import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import ProductCard from "../components/ProductCard";
import { assets } from "../../../assets/assets";

const AllProducts = () => {
  const { products, searchQuery } = useAppContext();
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [showFilter, setShowFilter] = useState(false);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (searchQuery) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    switch (sortType) {
      case 'low-high':
        setFilterProducts(productsCopy.sort((a, b) => (a.offerPrice - b.offerPrice)));
        break;
      case 'high-low':
        setFilterProducts(productsCopy.sort((a, b) => (b.offerPrice - a.offerPrice)));
        break;
      default:
        setFilterProducts(productsCopy);
        break;
    }
  }

  // Get unique categories for the sidebar
  const uniqueCategories = [...new Set(products.map(item => item.category))];

  useEffect(() => {
    applyFilter();
  }, [category, sortType, searchQuery, products])

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-gray-100">

      {/* Filter Options Sidebar */}
      <div className="min-w-60">
        <p onClick={() => setShowFilter(!showFilter)} className="my-2 text-xl flex items-center cursor-pointer gap-2 font-light text-gray-700 uppercase tracking-wide">
          Filters
          <img className={`h-3 sm:hidden transition-transform ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>

        {/* Category Filter */}
        <div className={`border border-gray-200 bg-white p-5 mt-6 rounded-lg ${showFilter ? '' : 'hidden'} sm:block shadow-sm`}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900">Categories</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {uniqueCategories.map((cat, index) => (
              <label key={index} className="flex gap-2 items-center cursor-pointer hover:text-primary transition-colors">
                <input className="w-3 h-3 accent-primary" type="checkbox" value={cat} onChange={toggleCategory} />
                <span className="capitalize">{cat}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Product Grid */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between text-base sm:text-2xl mb-6 gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-medium text-gray-900 uppercase tracking-tight text-3xl sm:text-2xl">All Collections</h1>
            <p className="text-sm text-gray-400 font-light">Check out our fresh arrivals</p>
          </div>

          {/* Sort Dropdown */}
          <div className="relative group w-full sm:w-auto">
            <select onChange={(e) => setSortType(e.target.value)} className="w-full sm:w-auto border-2 border-gray-200 text-sm px-4 py-2.5 rounded-lg outline-none cursor-pointer bg-white text-gray-700 hover:border-gray-300 transition-colors">
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Price (Low to High)</option>
              <option value="high-low">Sort by: Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Product Mapping */}
        {filterProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8">
            {filterProducts.map((item, index) => (
              <ProductCard key={index} product={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <p className="text-4xl mb-4">🍃</p>
            <p className="text-lg text-gray-500">No products found matching your criteria.</p>
            <button onClick={() => { setCategory([]); setSortType('relevant') }} className="mt-4 text-primary font-medium hover:underline">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
