import { Route, Routes, useLocation, Navigate, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

import Home from "./pages/Home";
import AllProducts from "./features/shop/pages/AllProducts";
import { Toaster } from "react-hot-toast";
import Footer from "./components/layout/Footer";
import { useAppContext } from "./context/AppContext";
import Login from "./features/auth/components/Login";
import ProductCategory from "./features/shop/pages/ProductCategory";
import ProductDetails from "./features/shop/pages/ProductDetails";
import Cart from "./features/shop/pages/Cart";
import AddAddress from "./features/user/pages/AddAddress";
import MyOrders from "./features/user/pages/MyOrders";
import SellerLogin from "./features/seller/components/SellerLogin";
import SellerLayout from "./features/seller/pages/SellerLayout";
import Navbar from "./components/layout/Navbar";
import AddProducts from "./features/seller/pages/AddProducts";
import ProductList from "./features/seller/pages/ProductList";
import Orders from "./features/seller/pages/Orders";
import EditProduct from "./features/seller/pages/EditProduct";
import Loading from "./components/ui/Loading";
import Contact from "./pages/Contact";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";



function App() {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext();

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}

      <Toaster />

      <div
        className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"} `}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/loader" element={<Loading />} />

          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-address"
            element={
              <ProtectedRoute>
                <AddAddress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller"
            element={isSeller ? <SellerLayout /> : <SellerLogin />}
          >
            <Route index element={isSeller ? <AddProducts /> : null} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="product-list/edit/:id" element={<EditProduct />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
}

export default App;
