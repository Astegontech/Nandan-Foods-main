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
            className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 border-b border-gray-100">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Order ID</span>
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

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:divide-x divide-gray-100">

              {/* Left Column: Items (2/3 width) */}
              <div className="lg:col-span-2 p-5 bg-white">
                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Items ({order.items.length})
                </h4>
                <div className="space-y-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
                      <img
                        className="w-16 h-16 object-cover border rounded-md"
                        src={item.product?.image?.[0] || assets.box_icon}
                        alt={item.product?.name}
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm md:text-base leading-snug">
                          {item.product?.name || "Product Deleted"}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          {item.weight && (
                            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                              {item.weight}
                            </span>
                          )}
                          <div className="text-xs text-gray-500">
                            Qty: <span className="font-bold text-gray-900">{item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Details (1/3 width) */}
              <div className="lg:col-span-1 p-5 bg-gray-50/50 space-y-6">

                {/* Shipping */}
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

                <div className="h-px bg-gray-200 w-full"></div>

                {/* Payment */}
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    Payment
                  </h4>
                  <div className="bg-white border border-gray-200 rounded-md p-3 shadow-sm">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs text-gray-500">Order Total</span>
                      <span className="text-xl font-bold text-gray-900">{currency}{order.amount}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-gray-50 border border-gray-100 rounded p-1.5">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold">Method</span>
                        <span className="text-xs font-semibold text-gray-700">{order.paymentType}</span>
                      </div>
                      <div className={`border rounded p-1.5 ${order.isPaid ? 'bg-green-50 border-green-100 text-green-700' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
                        <span className="block text-[10px] uppercase font-bold opacity-70">Status</span>
                        <span className="text-xs font-bold">{order.isPaid ? "PAID" : "PENDING"}</span>
                      </div>
                    </div>
                    {order.paymentType === 'ONLINE' && order.payment?.razorpayPaymentId && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase mb-0.5">Transaction ID</p>
                        <p className="font-mono text-[10px] text-gray-500 break-all">{order.payment.razorpayPaymentId}</p>
                      </div>
                    )}
                  </div>
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
