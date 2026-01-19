import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "../../../context/AppContext";
import { assets } from "../../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrder = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };
  const ordersRef = useRef([]);
  const firstLoad = useRef(true);

  const [audioAllowed, setAudioAllowed] = useState(false);

  useEffect(() => {
    // Check for user interaction to enable audio
    const handleInteraction = () => setAudioAllowed(true);
    window.addEventListener("click", handleInteraction);
    return () => window.removeEventListener("click", handleInteraction);
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/list");
      if (data.success) {
        // Sort orders so the newest ones are first
        const sortedOrders = data.orders.reverse();
        setOrders(sortedOrders);

        // Check for new orders only if audio is allowed
        if (audioAllowed) {
          const newOrderIds = sortedOrders.map(order => order._id);
          // On first load, just set the ref, don't play sound
          if (firstLoad.current) {
            ordersRef.current = newOrderIds;
            firstLoad.current = false;
          } else {
            // If we have more orders than before, or different orders at the top
            const hasNewOrder = newOrderIds.length > ordersRef.current.length || (newOrderIds.length > 0 && !ordersRef.current.includes(newOrderIds[0]));

            if (hasNewOrder) {
              const audio = new Audio(assets.notification_sound);
              audio.play().catch(err => console.error("Audio play failed", err));
              toast.success("New Order Received! 🔔");
            }
            ordersRef.current = newOrderIds;
          }
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const { data } = await axios.post("/api/order/status", {
        orderId,
        status: event.target.value,
      });
      if (data.success) {
        await fetchOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(fetchOrders, 5000);
    return () => clearInterval(intervalId);
  }, [audioAllowed]);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-200"
          >
            {/* Header / Summary Row */}
            <div
              className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleOrder(order._id)}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-full transition-transform duration-200 ${expandedOrders[order._id] ? 'rotate-180 bg-gray-200' : 'rotate-0 bg-white border'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <span className="bg-white border text-gray-800 font-mono font-bold px-2 py-0.5 rounded text-sm">#{order._id.slice(-6)}...</span>
                  <span className="text-sm font-semibold text-gray-700">{order.address?.firstname} {order.address?.lastname}</span>
                </div>
                <p className="text-xs text-gray-500 pl-9">
                  {new Date(order.createdAt).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} • <span className="text-gray-400">{order.items.length} Items</span>
                </p>
              </div>

              <div className="mt-3 md:mt-0 flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                <p className="font-bold text-gray-900">{currency}{order.amount}</p>

                {order.status === "Order Placed" && (
                  <span className="bg-red-100/60 text-red-600 border border-red-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">New</span>
                )}

                <select
                  onChange={(event) => statusHandler(event, order._id || "")}
                  value={order.status}
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all cursor-pointer shadow-sm
                      ${order.status === 'Order Placed'
                      ? 'bg-red-50 text-red-700 border-red-200 focus:ring-red-200'
                      : order.status === 'Delivered' || order.status === 'Successfully Refunded'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-200'
                        : 'bg-white text-gray-700 border-gray-300 focus:ring-gray-200'
                    }`}
                >
                  <option value="Order Placed" className="text-gray-700 bg-white">Order Placed</option>
                  <option value="Packing" className="text-gray-700 bg-white">Packing</option>
                  <option value="Shipped" className="text-gray-700 bg-white">Shipped</option>
                  <option value="Out for Delivery" className="text-gray-700 bg-white">Out for Delivery</option>
                  <option value="Delivered" className="text-emerald-600 font-bold bg-white">Delivered</option>
                  <option value="Canceled" className="text-red-500 bg-white">Canceled</option>
                  <option value="Successfully Refunded" className="text-emerald-600 font-bold bg-white">Refunded</option>
                </select>
              </div>
            </div>

            {/* Collapsible Content - Restructured Invoice Style */}
            {expandedOrders[order._id] && (
              <div className="p-6 bg-white border-t border-gray-100 animate-fadeIn">

                {/* Top Section: Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100">
                  {/* Shipping Details */}
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Shipping Details
                    </h4>
                    <div className="text-sm">
                      <p className="font-black text-gray-900 text-base mb-1">{order.address?.firstname} {order.address?.lastname}</p>
                      <a href={`tel:${order.address?.phone}`} className="text-blue-600 font-medium hover:underline text-xs block mb-2">
                        {order.address?.phone}
                      </a>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {order.address?.street},<br />
                        {order.address?.city}, {order.address?.state}<br />
                        <span className="font-semibold text-gray-800">PIN: {order.address?.zipcode}</span><br />
                        {order.address?.country}
                      </p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      Payment
                    </h4>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-xs text-gray-500 font-medium">Order Total</span>
                        <span className="text-2xl font-bold text-gray-900">{currency}{order.amount}</span>
                      </div>
                      <div className="flex gap-3 text-center">
                        <div className="flex-1 bg-white border border-gray-200 rounded p-1.5">
                          <span className="block text-[10px] text-gray-400 uppercase font-bold">Method</span>
                          <span className="text-xs font-semibold text-gray-700">{order.paymentType}</span>
                        </div>
                        <div className={`flex-1 border rounded p-1.5 ${order.isPaid ? 'bg-green-50 border-green-100 text-green-700' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
                          <span className="block text-[10px] uppercase font-bold opacity-70">Status</span>
                          <span className="text-xs font-bold">{order.isPaid ? "PAID" : "PENDING"}</span>
                        </div>
                      </div>
                      {order.paymentType === 'ONLINE' && order.payment?.razorpayPaymentId && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-[10px] text-gray-400 uppercase mb-0.5">Transaction ID</p>
                          <p className="font-mono text-[10px] text-gray-500 break-all">{order.payment.razorpayPaymentId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Full Width Items */}
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    Ordered Items ({order.items.length})
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-4 items-start p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                        <img
                          className="w-16 h-16 object-cover border border-gray-200 rounded-md shadow-sm"
                          src={item.product?.image?.[0] || assets.box_icon}
                          alt={item.product?.name}
                        />
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-sm md:text-base leading-snug">
                            {item.product?.name || "Product Deleted"}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            {item.weight && (
                              <span className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
                                {item.weight}
                              </span>
                            )}
                            <div className="text-xs text-gray-500 font-medium">
                              Qty: <span className="font-bold text-gray-900">{item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
