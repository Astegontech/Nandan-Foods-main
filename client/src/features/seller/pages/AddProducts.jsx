import React, { useState } from "react";
import { assets, categories } from "../../../assets/assets";
import { useAppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";

const AddProducts = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedWeights, setSelectedWeights] = useState([]);
  const [weightVariants, setWeightVariants] = useState({});

  const { axios } = useAppContext();

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      // Convert weightVariants object to array
      const weightVariantsArray = Object.values(weightVariants).map(variant => ({
        weight: variant.weight,
        price: Number(variant.price),
        offerPrice: Number(variant.offerPrice),
        stock: Number(variant.stock) || 0
      }));

      // Use first variant's price as base price for backward compatibility
      const basePrice = weightVariantsArray.length > 0 ? weightVariantsArray[0].price : 0;
      const baseOfferPrice = weightVariantsArray.length > 0 ? weightVariantsArray[0].offerPrice : 0;

      const productData = {
        name,
        description: description.split("\n"),
        category,
        price: basePrice,
        offerPrice: baseOfferPrice,
        availableWeights: selectedWeights,
        weightVariants: weightVariantsArray
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const { data } = await axios.post("api/product/add", formData);
      if (data.success) {
        toast.success(data.message);
        setName("");
        setDescription("");
        setCategory("");
        setSelectedWeights([]);
        setFiles([]);
        setWeightVariants({});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleWeight = (weight) => {
    if (selectedWeights.includes(weight)) {
      setSelectedWeights(selectedWeights.filter(w => w !== weight));
      const newVariants = { ...weightVariants };
      delete newVariants[weight];
      setWeightVariants(newVariants);
    } else {
      setSelectedWeights([...selectedWeights, weight]);
      setWeightVariants({
        ...weightVariants,
        [weight]: { weight, price: '', offerPrice: '', stock: 0 }
      });
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-white p-6 sm:p-10">
      <form onSubmit={onSubmitHandler} className="max-w-3xl mx-auto space-y-12">

        <h1 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">Add Product</h1>

        {/* 1. Image Upload */}
        <div className="space-y-4">
          <label className="block text-lg font-medium text-gray-700">Upload Images</label>
          <div className="flex gap-4 flex-wrap">
            {Array(4).fill("").map((_, index) => (
              <label key={index} className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 relative overflow-hidden">
                <input
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }}
                  type="file"
                  hidden
                />
                {files[index] ? (
                  <img className="w-full h-full object-cover" src={URL.createObjectURL(files[index])} alt="" />
                ) : (
                  <span className="text-gray-400 text-3xl">+</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* 2. Basic Info */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full px-4 py-3 rounded border border-gray-300 outline-none focus:border-blue-500 transition-colors"
              type="text"
              placeholder="Type product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full px-4 py-3 rounded border border-gray-300 outline-none focus:border-blue-500 transition-colors resize-none"
              rows={4}
              placeholder="Write product description"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full px-4 py-3 rounded border border-gray-300 outline-none focus:border-blue-500 bg-white"
              required
            >
              <option value="">Select Category</option>
              {categories.map((item, index) => (
                <option key={index} value={item.path}>{item.path}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Pricing & Weights */}
        <div className="space-y-6">
          <label className="block text-lg font-medium text-gray-700">Pricing & Variants</label>

          {/* Weight Selection Chips */}
          <div className="flex flex-wrap gap-3">
            {['250g', '500g', '1kg', '2kg', '5kg', '10kg'].map(weight => (
              <button
                type="button"
                key={weight}
                onClick={() => toggleWeight(weight)}
                className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${selectedWeights.includes(weight) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
              >
                {weight}
              </button>
            ))}
          </div>

          {/* Variant Inputs Table */}
          {selectedWeights.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Variant</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Offer Price</th>
                    <th className="px-4 py-3">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedWeights.map(weight => (
                    <tr key={weight}>
                      <td className="px-4 py-3 font-medium text-gray-900">{weight}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number" className="w-24 px-2 py-1 border border-gray-300 rounded outline-none"
                          placeholder="0"
                          value={weightVariants[weight]?.price || ''}
                          onChange={(e) => setWeightVariants({ ...weightVariants, [weight]: { ...weightVariants[weight], price: e.target.value } })}
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number" className="w-24 px-2 py-1 border border-gray-300 rounded outline-none"
                          placeholder="0"
                          value={weightVariants[weight]?.offerPrice || ''}
                          onChange={(e) => setWeightVariants({ ...weightVariants, [weight]: { ...weightVariants[weight], offerPrice: e.target.value } })}
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number" className="w-20 px-2 py-1 border border-gray-300 rounded outline-none"
                          placeholder="0"
                          value={weightVariants[weight]?.stock || 0}
                          onChange={(e) => setWeightVariants({ ...weightVariants, [weight]: { ...weightVariants[weight], stock: e.target.value } })}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-10 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedWeights.length === 0}
        >
          ADD PRODUCT
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
