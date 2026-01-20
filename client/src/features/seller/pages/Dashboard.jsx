import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { assets } from "../../../assets/assets";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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
    Area,
    AreaChart,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

const Dashboard = () => {
    const { axios, currency } = useAppContext();
    const navigate = useNavigate();
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
        return (
            <div className="flex-1 flex items-center justify-center h-[80vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return <div className="p-8 text-center text-gray-500">No data available</div>;
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-lg">
                    <p className="text-sm font-bold text-gray-800 mb-1">{label}</p>
                    <p className="text-sm text-primary font-semibold">
                        {currency}{payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomBarTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-lg">
                    <p className="text-sm font-bold text-gray-800 mb-1">{payload[0].payload.name}</p>
                    <p className="text-sm text-emerald-600 font-semibold">
                        Qty: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex-1 w-full bg-gray-50/30 p-4 md:p-8 overflow-y-auto pb-20">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store today.</p>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Total Sales Card */}
                <div onClick={() => navigate('/seller/orders')} className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-md">Revenue</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{currency}{(stats.totalSales || 0).toLocaleString()}</h3>
                    <p className="text-sm text-gray-500 font-medium">Total Lifetime Sales</p>
                </div>

                {/* Total Orders Card */}
                <div onClick={() => navigate('/seller/orders')} className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-orange-50 text-orange-600 rounded-md">Orders</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalOrders}</h3>
                    <p className="text-sm text-gray-500 font-medium">Total Orders Placed</p>
                </div>

                {/* AOV Card */}
                <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-teal-50 text-teal-600 rounded-md">Avg. Value</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{currency}{stats.averageOrderValue || 0}</h3>
                    <p className="text-sm text-gray-500 font-medium">Average Order Value</p>
                </div>

                {/* Pending Orders Card */}
                <div onClick={() => navigate('/seller/orders')} className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-pink-50 text-pink-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-pink-50 text-pink-600 rounded-md animate-pulse">Action Needed</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.pendingOrders || 0}</h3>
                    <p className="text-sm text-gray-500 font-medium">Pending Orders</p>
                </div>
            </div>

            {/* Revenue Trend - Full Width */}
            <div className="mb-8 overflow-hidden">
                <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Revenue Trend</h2>
                        <div className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Last 7 Days</div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.last7DaysSales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(value) => `${currency}${value}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Analytics Grid - 3 Columns Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Sales by Category (Pie Chart) - Condensed */}
                <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-bold text-gray-800">Sales by Category</h2>
                        <div className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Proportional</div>
                    </div>
                    <div className="flex-1 w-full relative min-h-[220px]">
                        {stats.categorySales && stats.categorySales.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height="220">
                                    <PieChart>
                                        <Pie
                                            data={stats.categorySales}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={45}
                                            outerRadius={65}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {stats.categorySales.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomBarTooltip />} />
                                        <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute top-[38%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                    <p className="text-lg font-bold text-gray-800">{stats.totalProducts}</p>
                                    <p className="text-[9px] text-gray-400 uppercase tracking-wider">Products</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                                No category data
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Selling Products - Condensed */}
                <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-gray-800">Top Selling Products</h2>
                        <div className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">By Volume</div>
                    </div>
                    <div className="flex-1 w-full min-h-[220px]">
                        {stats.topSellingProducts && stats.topSellingProducts.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={stats.topSellingProducts.slice(0, 5)} layout="vertical" margin={{ left: -20, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={100}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#4b5563', fontWeight: 500 }}
                                    />
                                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f9fafb' }} />
                                    <Bar dataKey="quantity" fill="#10b981" radius={[0, 4, 4, 0]} barSize={16} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-xs">No sales data</div>
                        )}
                    </div>
                </div>

                {/* Order Status Distribution - Condensed */}
                <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_-4_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-gray-800">Order Status</h2>
                        <div className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">All Time</div>
                    </div>
                    <div className="flex-1 w-full min-h-[220px]">
                        {stats.orderStatusDistribution && stats.orderStatusDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={stats.orderStatusDistribution} layout="vertical" margin={{ left: -20, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={100}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 500 }}
                                    />
                                    <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={16}>
                                        {stats.orderStatusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={
                                                entry.name === 'Order Placed' ? '#f59e0b' :
                                                    entry.name === 'Delivered' ? '#10b981' :
                                                        entry.name === 'Shipped' ? '#3b82f6' : '#9ca3af'
                                            } />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-xs">No orders yet</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Recent Orders - Takes up 2 columns on large screens */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h2 className="text-lg font-bold text-gray-800">Recent Pending Orders</h2>
                        <button onClick={() => navigate('/seller/orders')} className="text-sm text-primary font-medium hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold tracking-wide">
                                <tr>
                                    <th className="px-6 py-4">Order Details</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats.recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors group cursor-default">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-xs font-bold text-gray-600 mb-1 rounded bg-gray-100 w-fit px-1.5 py-0.5">#{order._id.slice(-6)}</span>
                                                <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                                                    {order.address?.firstname?.[0] || 'U'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-900">{order.address?.firstname} {order.address?.lastname}</span>
                                                    <span className="text-xs text-gray-500">{order.address?.city}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-gray-900">{currency}{order.amount}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                             ${order.status === 'Order Placed' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                        'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                {order.status === 'Order Placed' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>}
                                                {order.status === 'Delivered' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {stats.recentOrders.length === 0 && (
                                    <tr><td colSpan="4" className="text-center py-12 text-gray-400">No recent orders found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            Low Stock
                            {stats.lowStockProducts.length > 0 && <span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded border border-red-100">{stats.lowStockProducts.length} Items</span>}
                        </h2>
                    </div>
                    <div className="overflow-y-auto max-h-[400px]">
                        {stats.lowStockProducts.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {stats.lowStockProducts.map((product) => (
                                    <div key={product._id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="relative">
                                            <img src={product.image[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">!</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h4>
                                            <p className="text-xs text-red-500 font-medium">Only {product.quantity} left in stock</p>
                                        </div>
                                        <button className="text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors">Restock</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center p-6">
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <p className="text-gray-900 font-medium">All stocked up!</p>
                                <p className="text-xs text-gray-500 mt-1">No products are currently running low.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
