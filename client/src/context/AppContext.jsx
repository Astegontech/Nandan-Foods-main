import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();
export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setshowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);

  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
    }
  };

  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        console.log("Fetch User Success: false", data);
        toast.error(data.message || "Session expired (Unauthorized)");
        setUser(null);
      }
    } catch (error) {
      console.error("Fetch User Error:", error);
      if (error.response) {
        console.error("Error Response:", error.response.data);
        toast.error(`Auth Error: ${error.response.status} - ${error.response.data.message}`);
      } else {
        toast.error(`Auth Error: ${error.message}`);
      }
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addToCart = (itemId, weight = "") => {
    if (!user) {
      setshowUserLogin(true);
      toast.error("Please login to add items to cart");
      return;
    }

    let cartData = structuredClone(cartItems);
    const cartKey = weight ? `${itemId}-${weight}` : itemId;

    if (cartData[cartKey]) {
      cartData[cartKey] += 1;
    } else {
      cartData[cartKey] = 1;
    }
    setCartItems(cartData);
    toast.success(`Added to Cart${weight ? ` (${weight})` : ""}`);
  };

  const updateCartItem = (itemId, quantity, weight = "") => {
    let cartData = structuredClone(cartItems);
    const cartKey = weight ? `${itemId}-${weight}` : itemId;
    cartData[cartKey] = quantity;
    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  const removeFromCart = (itemId, weight = "") => {
    let cartData = structuredClone(cartItems);
    const cartKey = weight ? `${itemId}-${weight}` : itemId;
    if (cartData[cartKey]) {
      cartData[cartKey] -= 1;
      if (cartData[cartKey] === 0) {
        delete cartData[cartKey];
      }
    }
    toast.success("Removed from cart");
    setCartItems(cartData);
  };

  const getCartCount = () => {
    if (!cartItems) return 0;

    let totalCount = 0;
    for (const key in cartItems) {
      totalCount += cartItems[key];
    }
    return totalCount;
  };

  const getCartAmount = () => {
    if (!cartItems) return 0;

    let totalAmount = 0;
    for (const key in cartItems) {
      // Parse cart key to extract productId (handle both "productId" and "productId-weight" formats)
      const [productId, weight] = key.includes('-') ? key.split('-') : [key, ''];

      const product = products.find((item) => item._id === productId);
      if (product) {
        let itemPrice = product.offerPrice; // Default price

        // Check if product has weight variants and weight is specified
        if (weight && product.weightVariants && product.weightVariants.length > 0) {
          const variant = product.weightVariants.find(v => v.weight === weight);
          if (variant) {
            itemPrice = variant.offerPrice;
          }
        }

        totalAmount += itemPrice * cartItems[key];
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);

  const value = {
    navigate,

    user,
    isAuthLoading,
    getCartCount,
    getCartAmount,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setshowUserLogin,
    products,
    currency,
    cartItems,
    setCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    axios,
    fetchProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
