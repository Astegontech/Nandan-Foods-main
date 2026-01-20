import React from "react";
import { useAppContext } from "../../../context/AppContext";
import { assets } from "../../../assets/assets";
import { Link, NavLink, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

const SellerLayout = () => {
  const { isSeller, setIsSeller, axios, navigate } = useAppContext();

  const sidebarLinks = [
    { name: "Dashboard", path: "/seller", icon: assets.home_icon || assets.menu_icon },
    { name: "Add Product", path: "/seller/add-product", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.post("/api/seller/logout");
      if (data.success) {
        setIsSeller(false);
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 md:px-8 py-3">
          {/* Logo */}
          <Link to="/">
            <img
              src={assets.logo}
              alt="logo"
              className="cursor-pointer w-28 md:w-32"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.name}
                end={item.path === "/seller"}
                className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors duration-200 
                  ${isActive
                    ? "text-primary border-b-2 border-primary pb-0.5"
                    : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                <img src={item.icon} alt="" className="w-5 h-5 opacity-70" />
                <p>{item.name}</p>
              </NavLink>
            ))}
          </div>

          {/* Right Side: Admin & Logout */}
          <div className="flex items-center gap-5 text-gray-500">
            <p className="hidden md:block text-sm font-medium">Hi! Seller</p>
            <button
              onClick={logout}
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-full text-xs font-bold px-4 py-2 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation (Visible on small screens) */}
        <div className="md:hidden flex justify-around border-t border-gray-100 py-2 bg-white overflow-x-auto">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/seller"}
              className={({ isActive }) => `flex flex-col items-center gap-1 min-w-[60px] p-1 rounded-md
                  ${isActive ? "bg-primary/5 text-primary" : "text-gray-500"}`}
            >
              <img src={item.icon} alt="" className="w-5 h-5" />
              <span className="text-[10px] font-medium whitespace-nowrap">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main Content Area - Full Width */}
      <div className="md:px-8 px-4 py-6 max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SellerLayout;
