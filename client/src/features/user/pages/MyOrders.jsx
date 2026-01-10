import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { assets } from "../../../assets/assets";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const toggleDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="max-w-6xl mx-auto mt-16 mb-24 px-6 min-h-[60vh]">
      <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-4xl font-light text-gray-900 tracking-tight mb-2">Order History</h1>
          <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">Your recent purchases</p>
        </div>
        <div className="hidden md:block">
          <p className="text-3xl font-light text-gray-200">{myOrders.length} <span className="text-sm font-normal text-gray-400">Total Orders</span></p>
        </div>
      </div>

      {myOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center opacity-60">
          <div className="mb-4 text-4xl">🛍️</div>
          <p className="text-xl font-light text-gray-400">Review your past tastes here.</p>
        </div>
      ) : (
        <div className="space-y-0 divide-y divide-gray-100">
          <div className="grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wider py-4 px-4 bg-gray-50/50 rounded-t-lg hidden md:grid">
            <div className="col-span-3">Order ID</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-3 text-right">Start Action</div>
          </div>

          {myOrders.map((order, index) => {
            const isExpanded = expandedOrder === order._id;
            return (
              <div key={index} className="group transition-all duration-300">
                {/* Order Summary Row */}
                <div
                  onClick={() => toggleDetails(order._id)}
                  className={`grid grid-cols-2 md:grid-cols-12 gap-y-2 md:gap-y-0 py-4 md:py-6 px-4 cursor-pointer transition-colors items-center
                                    ${isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50/30 bg-white'}`}
                >
                  <div className="col-span-1 md:col-span-3 font-mono text-sm text-gray-600 truncate pr-2">
                    <span className="md:hidden text-xs text-gray-400 uppercase mr-1">#</span>
                    {order._id?.toUpperCase()}
                  </div>
                  <div className="col-span-1 md:col-span-2 text-sm text-gray-500 text-right md:text-left">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="col-span-1 md:col-span-2 mt-1 md:mt-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                        ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                          'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="col-span-1 md:col-span-2 text-right font-medium text-gray-900 mt-1 md:mt-0">
                    {currency}{order.amount.toFixed(2)}
                  </div>
                  <div className="col-span-2 md:col-span-3 flex justify-end items-center gap-3 md:opacity-0 group-hover:opacity-100 transition-opacity mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-50 md:border-transparent">
                    <button className="text-xs font-medium text-gray-400 md:text-gray-500 hover:text-gray-900 underline underline-offset-4 decoration-gray-300">
                      {isExpanded ? 'Close' : 'Details'}
                    </button>
                    <div className={`transform transition-transform duration-300 text-gray-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out bg-gray-50/50 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-6 md:p-10 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Items Ordered</h3>
                        <ul className="space-y-4">
                          {order.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-white rounded border border-gray-100 p-1 flex-shrink-0">
                                <img src={item.product?.image?.[0]} alt="" className="w-full h-full object-contain" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{item.product?.name}</p>
                                <p className="text-xs text-gray-500">
                                  {item.quantity} x {currency}{item.product?.offerPrice}
                                  {item.weight && <span className="ml-2 text-gray-400">({item.weight})</span>}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-gray-900">{currency}{(item.quantity * item.product?.offerPrice).toFixed(2)}</p>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Delivery & Payment</h3>
                          <div className="grid grid-cols-2 gap-6 text-sm">
                            <div>
                              <p className="text-gray-500 mb-1">Payment Method</p>
                              <p className="font-medium text-gray-900">{order.paymentMethod === 'Stripe' ? 'Card Payment' : 'Cash on Delivery'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Payment Status</p>
                              <p className={`font-medium ${order.payment ? 'text-green-600' : 'text-orange-500'}`}>
                                {order.payment ? 'Paid' : 'Pending'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Timeline</h3>
                          <div className="flex items-center gap-4 text-xs max-w-sm">
                            <div className={`flex-1 h-3 rounded-full ${['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Out for delivery', 'Delivered'].indexOf(order.status) >= 0 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                            <div className={`flex-1 h-3 rounded-full ${['Packing', 'Shipped', 'Out for Delivery', 'Out for delivery', 'Delivered'].indexOf(order.status) >= 0 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                            <div className={`flex-1 h-3 rounded-full ${['Shipped', 'Out for Delivery', 'Out for delivery', 'Delivered'].indexOf(order.status) >= 0 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                            <div className={`flex-1 h-3 rounded-full ${['Out for Delivery', 'Out for delivery', 'Delivered'].indexOf(order.status) >= 0 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                            <div className={`flex-1 h-3 rounded-full ${order.status === 'Delivered' ? 'bg-primary' : 'bg-gray-200'}`}></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">
                            <span>Placed</span>
                            <span>Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="flex justify-end pt-6 border-t border-gray-200/50 gap-4">
                      <button className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded hover:bg-white hover:border-gray-300 transition-colors">
                        Download Invoice
                      </button>
                      <button className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
                        Track Order
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
