// import React from "react";
// import { useAppContext } from "../../context/AppContext";
// import { assets } from "../../assets/assets";
// import toast from "react-hot-toast";

// const ProductList = () => {
//   const { products, currency, axios, fetchProducts, navigate } = useAppContext();

//   const toggleStock = async (id, inStock) => {
//     try {
//       const { data } = await axios.post("/api/product/stock", { id, inStock });
//       if (data.success) {
//         fetchProducts();
//         toast.success(data.message);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const removeProduct = async (id) => {
//     try {
//       const { data } = await axios.post("/api/product/delete", { id });
//       if (data.success) {
//         toast.success(data.message);
//         fetchProducts();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
//       <div className="w-full md:p-10 p-4">
//         <h2 className="pb-4 text-lg font-medium">All Products</h2>
//         <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
//           <table className="md:table-auto table-fixed w-full overflow-hidden">
//             <thead className="text-gray-900 text-sm text-left">
//               <tr>
//                 <th className="px-4 py-3 font-semibold truncate">Product</th>
//                 <th className="px-4 py-3 font-semibold truncate">Category</th>
//                 <th className="px-4 py-3 font-semibold truncate hidden md:block">
//                   Selling Price
//                 </th>
//                 <th className="px-4 py-3 font-semibold truncate">In Stock</th>
//                 <th className="px-4 py-3 font-semibold truncate">Action</th>
//               </tr>
//             </thead>
//             <tbody className="text-sm text-gray-500">
//               {products.map((product) => (
//                 <tr key={product._id} className="border-t border-gray-500/20">
//                   <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
//                     <div className="border border-gray-300 rounded p-2">
//                       <img
//                         src={product.image[0]}
//                         alt="Product"
//                         className="w-16"
//                       />
//                     </div>
//                     <span className="truncate max-sm:hidden w-full">
//                       {product.name}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">{product.category}</td>
//                   <td className="px-4 py-3 max-sm:hidden">
//                     {currency}
//                     {product.offerPrice}
//                   </td>
//                   <td className="px-4 py-3">
//                     <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
//                       <input
//                         onClick={() =>
//                           toggleStock(product._id, !product.inStock)
//                         }
//                         checked={product.inStock}
//                         type="checkbox"
//                         className="sr-only peer"
//                       />
//                       <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
//                       <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
//                     </label>
//                   </td>
//                   {/* <td className="relative inline-flex justify-center items-center cursor-pointer gap-3">
//                     <img
//                       onClick={() => navigate(`/seller/product-list/edit/${product._id}`)}
//                       className="w-4 cursor-pointer"
//                       src={assets.pen_icon || "https://cdn-icons-png.flaticon.com/512/84/84380.png"}
//                       alt="edit"
//                       title="Edit"
//                     />
//                     <img
//                       onClick={() => removeProduct(product._id)}
//                       className="w-4 cursor-pointer"
//                       src={assets.remove_icon}
//                       alt="delete"
//                       title="Delete"
//                     />
//                   </td> */}
//                   <td className="text-center align-middle">
//   <div className="flex justify-around items-center">
//     <img
//       onClick={() => navigate(`/seller/product-list/edit/${product._id}`)}
//       className="w-4 cursor-pointer"
//       src={assets.pen_icon || "https://cdn-icons-png.flaticon.com/512/84/84380.png"}
//       alt="edit"
//       title="Edit"
//     />
//     <img
//       onClick={() => removeProduct(product._id)}
//       className="w-4 cursor-pointer"
//       src={assets.remove_icon}
//       alt="delete"
//       title="Delete"
//     />
//   </div>
// </td>

//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ProductList;

import React from "react";
import { useAppContext } from "../../../context/AppContext";
import { assets } from "../../../assets/assets";
import toast from "react-hot-toast";

const ProductList = () => {
  const { products, currency, axios, fetchProducts, navigate } = useAppContext();

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      data.success ? (fetchProducts(), toast.success(data.message)) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const { data } = await axios.post("/api/product/delete", { id });
      data.success ? (fetchProducts(), toast.success(data.message)) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 h-[95vh] overflow-y-auto no-scrollbar">
      <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>

        <div className="overflow-x-auto bg-white border border-gray-200 rounded-md">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">
                  Selling Price
                </th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">Action</th>
              </tr>
            </thead>

            <tbody className="text-gray-600">
              {products.map((product) => (
                <tr key={product._id} className="border-t">
                  {/* Product */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="border rounded p-1 shrink-0">
                        <img
                          src={product.image[0]}
                          alt="product"
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <span className="truncate hidden sm:block max-w-[180px]">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">{product.category}</td>

                  {/* Price */}
                  <td className="px-4 py-3">
                    {product.weightVariants && product.weightVariants.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {product.weightVariants.map((variant, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium text-gray-700">{variant.weight}: </span>
                            <span className="text-gray-900">{currency}{variant.offerPrice}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span>{currency}{product.offerPrice}</span>
                    )}
                  </td>

                  {/* Stock Toggle */}
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={product.inStock}
                        onChange={() =>
                          toggleStock(product._id, !product.inStock)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition"></div>
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></span>
                    </label>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex justify-around items-center">
                      <img
                        onClick={() =>
                          navigate(`/seller/product-list/edit/${product._id}`)
                        }
                        className="w-4 cursor-pointer hover:scale-110 transition"
                        src={
                          assets.pen_icon ||
                          "https://cdn-icons-png.flaticon.com/512/84/84380.png"
                        }
                        alt="edit"
                        title="Edit"
                      />
                      <img
                        onClick={() => removeProduct(product._id)}
                        className="w-4 cursor-pointer hover:scale-110 transition"
                        src={assets.remove_icon}
                        alt="delete"
                        title="Delete"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
