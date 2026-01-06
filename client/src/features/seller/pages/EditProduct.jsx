
import React, { useEffect, useState } from "react";
import { assets, categories } from "../../../assets/assets";
import { useAppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { axios, products } = useAppContext();

    const [files, setFiles] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [existingImages, setExistingImages] = useState([]);
    const [selectedWeights, setSelectedWeights] = useState([]);
    const [weightVariants, setWeightVariants] = useState({});

    useEffect(() => {
        if (products.length > 0) {
            const product = products.find((p) => p._id === id);
            if (product) {
                setName(product.name);
                setDescription(product.description);
                setCategory(product.category);
                setPrice(product.price);
                setOfferPrice(product.offerPrice);
                setExistingImages(product.image);
                setSelectedWeights(product.availableWeights || []);

                if (product.weightVariants && product.weightVariants.length > 0) {
                    const variantsObj = {};
                    product.weightVariants.forEach(variant => {
                        variantsObj[variant.weight] = {
                            weight: variant.weight,
                            price: variant.price,
                            offerPrice: variant.offerPrice,
                            stock: variant.stock || 0
                        };
                    });
                    setWeightVariants(variantsObj);
                } else if (product.availableWeights && product.availableWeights.length > 0) {
                    // For legacy products: create variants from available weights using base price
                    const variantsObj = {};
                    product.availableWeights.forEach(weight => {
                        variantsObj[weight] = {
                            weight: weight,
                            price: product.price,
                            offerPrice: product.offerPrice,
                            stock: 0
                        };
                    });
                    setWeightVariants(variantsObj);
                }
            }
        }
    }, [products, id]);

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
            const basePrice = weightVariantsArray[0]?.price || price;
            const baseOfferPrice = weightVariantsArray[0]?.offerPrice || offerPrice;

            const productData = {
                id,
                name,
                description: Array.isArray(description) ? description : description.split("\n"),
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

            const { data } = await axios.post("api/product/update", formData);
            if (data.success) {
                toast.success(data.message);
                navigate("/seller/product-list");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form
                onSubmit={onSubmitHandler}
                className="md:p-10 p-4 space-y-5 max-w-lg"
            >
                <div>
                    <p className="text-base font-medium">Current Images</p>
                    <div className="flex gap-2 mt-2">
                        {existingImages.map((img, idx) => (
                            <img key={idx} src={img} className="w-16 h-16 object-cover rounded" alt="existing" />
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-base font-medium">New Images (Optional - Replaces All)</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4)
                            .fill("")
                            .map((_, index) => (
                                <label key={index} htmlFor={`image${index}`}>
                                    <input
                                        onChange={(e) => {
                                            const updatedFiles = [...files];
                                            updatedFiles[index] = e.target.files[0];
                                            setFiles(updatedFiles);
                                        }}
                                        accept="image/*"
                                        type="file"
                                        id={`image${index}`}
                                        hidden
                                    />
                                    <img
                                        className="max-w-24 cursor-pointer"
                                        src={
                                            files[index]
                                                ? URL.createObjectURL(files[index])
                                                : assets.upload_area
                                        }
                                        alt="uploadArea"
                                        width={100}
                                        height={100}
                                    />
                                </label>
                            ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">
                        Product Name
                    </label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        id="product-name"
                        type="text"
                        placeholder="Type here"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label
                        className="text-base font-medium"
                        htmlFor="product-description"
                    >
                        Product Description
                    </label>
                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        id="product-description"
                        rows={4}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                        placeholder="Type here"
                    ></textarea>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">
                        Category
                    </label>
                    <select
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                        id="category"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    >
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.path}>
                                {item.path}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full flex flex-col gap-3">
                    <label className="text-base font-medium">Available Weights/Quantities & Pricing</label>
                    <p className="text-xs text-gray-500">Select weights and set individual prices for each option</p>

                    <div className="space-y-3">
                        {['250g', '500g', '1kg', '2kg', '5kg', '10kg'].map((weight) => (
                            <div key={weight} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                <label className="flex items-center gap-2 cursor-pointer mb-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedWeights.includes(weight)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedWeights([...selectedWeights, weight]);
                                                if (!weightVariants[weight]) {
                                                    setWeightVariants({
                                                        ...weightVariants,
                                                        [weight]: { weight, price: '', offerPrice: '', stock: 0 }
                                                    });
                                                }
                                            } else {
                                                setSelectedWeights(selectedWeights.filter(w => w !== weight));
                                                const newVariants = { ...weightVariants };
                                                delete newVariants[weight];
                                                setWeightVariants(newVariants);
                                            }
                                        }}
                                        className="w-4 h-4 accent-primary cursor-pointer"
                                    />
                                    <span className="text-base font-semibold text-gray-800">{weight}</span>
                                </label>

                                {selectedWeights.includes(weight) && (
                                    <div className="grid grid-cols-3 gap-3 mt-2 pl-6">
                                        <div>
                                            <label className="text-xs text-gray-600 mb-1 block">Product Price</label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={weightVariants[weight]?.price || ''}
                                                onChange={(e) => setWeightVariants({
                                                    ...weightVariants,
                                                    [weight]: { ...weightVariants[weight], weight, price: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-primary"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600 mb-1 block">Offer Price</label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={weightVariants[weight]?.offerPrice || ''}
                                                onChange={(e) => setWeightVariants({
                                                    ...weightVariants,
                                                    [weight]: { ...weightVariants[weight], weight, offerPrice: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-primary"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600 mb-1 block">Stock</label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={weightVariants[weight]?.stock || 0}
                                                onChange={(e) => setWeightVariants({
                                                    ...weightVariants,
                                                    [weight]: { ...weightVariants[weight], weight, stock: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-5 flex-wrap">
                </div>
                <button className="cursor-pointer px-8 py-2.5 bg-primary text-white font-medium rounded hover:bg-primary-dull">
                    UPDATE
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
