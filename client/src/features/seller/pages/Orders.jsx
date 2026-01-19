import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "../../../context/AppContext";
import { assets } from "../../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const ordersRef = useRef([]);
  const firstLoad = useRef(true);

  const [audioAllowed, setAudioAllowed] = useState(false);

  useEffect(() => {
    const unlockAudio = () => {
      const audio = new Audio(assets.order_sound);
      audio.muted = true;
      audio.play().then(() => {
        setAudioAllowed(true);
        // audio.muted = false; // logic checks audioAllowed, so next play will be audible new instance
        console.log("Audio unlocked");
      }).catch((e) => console.log("Audio unlock failed", e));

      // Request browser notification permission
      if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
      }

      document.removeEventListener('click', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);
    return () => document.removeEventListener('click', unlockAudio);
  }, []);

  const statusHandler = async (event, orderId) => {
    try {
      const { data } = await axios.post("/api/order/status", {
        orderId,
        status: event.target.value,
      });
      if (data.success) {
        await fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      // Add timestamp to prevent caching
      const { data } = await axios.get(`/api/order/seller?t=${new Date().getTime()}`);
      if (data.success) {
        // Debugging logs
        console.log("Polling orders: ", data.orders.length, "Previous:", ordersRef.current.length, "FirstLoad:", firstLoad.current);

        if (data.orders.length > ordersRef.current.length && !firstLoad.current) {
          console.log("New order detected!");
          toast.success("New Order Received!");

          if (audioAllowed) {
            const audio = new Audio(assets.order_sound);
            audio.play().catch((error) => {
              console.error("Audio play failed:", error);
            });
          }
        }

        setOrders(data.orders);
        ordersRef.current = data.orders;
        firstLoad.current = false;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(fetchOrders, 5000);
    return () => clearInterval(intervalId);
  }, [audioAllowed]); // Add audioAllowed dependency to keep closure fresh if needed, though ref usage is better. simpler to just leave dependency array or add it.

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>
        {orders.map((order, index) => (
          <div
            key={index}
            className="relative flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full border-b pb-3 mb-3 bg-gray-50 -mx-5 -mt-5 p-5 rounded-t-md">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium text-xs uppercase tracking-wider">Order ID</span>
                  <span className="bg-white border text-gray-800 font-mono font-bold px-2 py-0.5 rounded text-sm">#{order._id}</span>
                </div>
                <p className="text-xs text-gray-400 pl-1">{new Date(order.createdAt).toLocaleString()}</p>
              </div>

              <div className="mt-3 md:mt-0 flex items-center gap-3">
                {order.status === "Order Placed" && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">New Order</span>
                )}
                <select
                  onChange={(event) => statusHandler(event, order._id || "")}
                  value={order.status}
                  className={`p-2 rounded-md border font-medium text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer shadow-sm
                      ${order.status === 'Order Placed' ? 'bg-white text-red-600 border-red-200 ring-red-100' :
                      order.status === 'Delivered' || order.status === 'Successfully Refunded' ? 'bg-white text-emerald-600 border-emerald-200 ring-emerald-100' :
                        'bg-white text-gray-700 border-gray-300 ring-gray-100'}`}
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Canceled">Canceled</option>
                  <option value="Successfully Refunded">Successfully Refunded</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
              {/* Items Section - spans 5 columns */}
              <div className="md:col-span-5">
                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Items ({order.items.length})
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-start p-2 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <img
                        className="w-14 h-14 object-cover border rounded-md"
                        src={item.product?.image?.[0] || assets.box_icon}
                        alt={item.product?.name}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-800 line-clamp-2 leading-tight">
                          {item.product?.name || "Product Deleted"}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {item.weight && <span className="text-xs font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">{item.weight}</span>}
                          <span className="text-xs text-gray-400">Qty:</span>
                          <span className="font-bold text-sm text-primary">{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Section - spans 4 columns */}
              <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Shipping Details
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
                  <p className="font-bold text-gray-900 text-base mb-1">{order.address?.firstName} {order.address?.lastName}</p>
                  <a href={`tel:${order.address?.phone}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-3 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {order.address?.phone}
                  </a>
                  <p className="text-gray-600 leading-relaxed text-xs">
                    {order.address?.street},<br />
                    {order.address?.city}, {order.address?.state}<br />
                    <span className="font-semibold text-gray-800">PIN: {order.address?.zipcode}</span><br />
                    {order.address?.country}
                  </p>
                </div>
              </div>

              {/* Payment Section - spans 3 columns */}
              <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex flex-col h-full">
                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  Payment
                </h4>

                <div className="bg-white border rounded-lg p-3 shadow-sm flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Amount</span>
                      <span className="text-lg font-bold text-gray-800">{currency}{order.amount}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Method</span>
                      <span className="font-mono font-bold text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{order.paymentType}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${order.isPaid ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                        {order.isPaid ? "PAID" : "PENDING"}
                      </span>
                    </div>
                  </div>

                  {order.paymentType === 'ONLINE' && order.payment?.razorpayPaymentId && (
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Transaction ID
                      </p>
                      <p className="font-mono text-[10px] text-gray-600 bg-gray-50 p-1.5 rounded border border-gray-100 break-all select-all hover:bg-white hover:border-blue-200 transition-colors cursor-pointer" title="Click to copy">
                        {order.payment.razorpayPaymentId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
