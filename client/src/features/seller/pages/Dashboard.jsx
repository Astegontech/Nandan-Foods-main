import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { assets } from "../../../assets/assets";
import { toast } from "react-hot-toast";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from "recharts";

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
        <div className="flex-1 overflow-y-auto w-full p-6 bg-gray-50/50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
                <p className="text-sm text-gray-500">Overview of your store's performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-blue-50 rounded-full">
                        <img src={assets.coin_icon || assets.logo} className="w-8 h-8 opacity-70" alt="Sales" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Sales</p>
                        <p className="text-2xl font-bold text-gray-900">{currency}{stats.totalSales.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-green-50 rounded-full">
                        <img src={assets.order_icon} className="w-8 h-8 opacity-70" alt="Orders" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-purple-50 rounded-full">
                        <img src={assets.product_list_icon} className="w-8 h-8 opacity-70" alt="Products" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Products</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Sales Trend Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-6 text-gray-800">Sales Trend (Last 7 Days)</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.last7DaysSales}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `${currency}${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`${currency}${value}`, 'Revenue']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-6 text-gray-800">Top Selling Products</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.topSellingProducts} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#4b5563' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="quantity" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Recent Orders */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold mb-4 text-gray-800">Recent Orders</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-md">Order ID</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3 rounded-r-md">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs text-gray-600">#{order._id.slice(-6)}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">{order.address?.firstname} {order.address?.lastname}</td>
                                        <td className="px-4 py-3 font-bold text-gray-800">{currency}{order.amount}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${order.status === 'Order Placed' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        'bg-gray-50 text-gray-700 border-gray-200'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {stats.recentOrders.length === 0 && (
                                    <tr><td colSpan="4" className="text-center py-8 text-gray-400">No recent orders found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold mb-4 text-red-600 flex items-center gap-2">
                        Low Stock Alert
                        {stats.lowStockProducts.length > 0 &&
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full animate-pulse">{stats.lowStockProducts.length}</span>
                        }
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-red-50 text-xs uppercase text-red-700">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-md">Product</th>
                                    <th className="px-4 py-3 rounded-r-md text-right">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.lowStockProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-red-50/30 transition-colors">
                                        <td className="px-4 py-3 flex items-center gap-3">
                                            <img src={product.image[0]} alt={product.name} className="w-10 h-10 rounded-md object-cover border border-gray-200" />
                                            <span className="font-medium text-gray-800 truncate max-w-[150px]">{product.name}</span>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-red-600 text-right">
                                            {product.quantity}
                                        </td>
                                    </tr>
                                ))}
                                {stats.lowStockProducts.length === 0 && (
                                    <tr><td colSpan="2" className="text-center py-8 text-green-600 bg-green-50/20 rounded-md border border-green-100 border-dashed mt-2">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-xl">🎉</span>
                                            <span className="font-medium">All products well stocked!</span>
                                        </div>
                                    </td></tr>
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
