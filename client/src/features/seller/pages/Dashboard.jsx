
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { assets } from "../../../assets/assets";
import { toast } from "react-hot-toast";

const Dashboard = () => {
    const { axios, currency } = useAppContext();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get("/api/seller/dashboard-stats");
                if (data.success) {
                    setStats(data.stats);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="min-h-[80vh] flex items-center justify-center">Loading...</div>;
    }

    if (!stats) {
        return <div className="p-5">No data available</div>;
    }

    return (
        <div className="flex-1 overflow-y-auto w-full p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Seller Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-full">
                        <img src={assets.coin_icon || assets.logo} className="w-8 h-8 opacity-70" alt="Sales" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Sales</p>
                        <p className="text-2xl font-bold text-gray-900">{currency}{stats.totalSales.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-full">
                        <img src={assets.order_icon} className="w-8 h-8 opacity-70" alt="Orders" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-full">
                        <img src={assets.product_list_icon} className="w-8 h-8 opacity-70" alt="Products" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Products</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Recent Orders */}
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold mb-4 text-gray-800">Recent Orders</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th className="px-4 py-3">Order ID</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-xs">#{order._id.slice(-6)}</td>
                                        <td className="px-4 py-3">{order.address?.firstname} {order.address?.lastname}</td>
                                        <td className="px-4 py-3 font-semibold">{currency}{order.amount}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Order Placed' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {stats.recentOrders.length === 0 && (
                                    <tr><td colSpan="4" className="text-center py-4">No recent orders</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold mb-4 text-red-600 flex items-center gap-2">
                        Low Stock Alert
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{stats.lowStockProducts.length}</span>
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="px-4 py-3">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.lowStockProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 flex items-center gap-3">
                                            <img src={product.image[0]} alt={product.name} className="w-8 h-8 rounded object-cover" />
                                            <span className="truncate max-w-[150px]">{product.name}</span>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-red-600">
                                            {product.quantity}
                                        </td>
                                    </tr>
                                ))}
                                {stats.lowStockProducts.length === 0 && (
                                    <tr><td colSpan="2" className="text-center py-4 text-green-600">All products well stocked!</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
