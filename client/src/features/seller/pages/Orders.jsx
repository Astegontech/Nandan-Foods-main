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
            {/* Header: Order ID & Status */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full border-b pb-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Order ID</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-lg font-bold text-gray-800">#{order._id}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 md:mt-0">
                <select
                  onChange={(event) => statusHandler(event, order._id || "")}
                  value={order.status}
                  className={`p-2 rounded-md border font-medium text-sm focus:outline-none focus:ring-2 transition-all
                      ${order.status === 'Order Placed' ? 'bg-red-50 text-red-700 border-red-200 focus:ring-red-200' :
                      order.status === 'Delivered' || order.status === 'Successfully Refunded' ? 'bg-green-50 text-green-700 border-green-200 focus:ring-green-200' :
                        'bg-white text-gray-700 border-gray-300 focus:ring-primary'}`}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {/* Column 1: Items */}
              <div className="col-span-1">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase mb-3 border-b pb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Items
                </h4>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                      <img
                        className="w-12 h-12 object-cover bg-white border rounded-md shadow-sm"
                        src={item.product?.image?.[0] || assets.box_icon}
                        alt={item.product?.name}
                      />
                      <div>
                        <p className="font-semibold text-sm text-gray-800 line-clamp-1">
                          {item.product?.name || "Product Deleted"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.weight && <span className="font-medium text-gray-700 bg-gray-100 px-1 rounded mr-1">{item.weight}</span>}
                          Qty: <span className="font-bold text-primary">{item.quantity}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Customer */}
              <div className="col-span-1 border-l-0 md:border-l md:pl-6 border-gray-100">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase mb-3 border-b pb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Shipping To
                </h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>
                    <p className="text-xs text-gray-400">Customer</p>
                    <p className="font-bold text-gray-900 text-lg">{order.address?.firstName} {order.address?.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Contact</p>
                    <p className="font-medium font-mono">{order.address?.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Address</p>
                    <div className="mt-1 p-2 bg-gray-50 rounded text-xs leading-relaxed border border-gray-100">
                      {order.address?.street}, {order.address?.city},<br />
                      {order.address?.state} - <span className="font-semibold">{order.address?.zipcode}</span><br />
                      {order.address?.country}
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: Payment */}
              <div className="col-span-1 border-l-0 md:border-l md:pl-6 border-gray-100 flex flex-col h-full">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase mb-3 border-b pb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  Payment Details
                </h4>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-50 border-dashed">
                    <span className="text-sm text-gray-500">Total Amount</span>
                    <span className="text-xl font-bold text-gray-800">{currency}{order.amount}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Method</span>
                    <span className="font-mono font-bold text-xs bg-gray-100 px-2 py-1 rounded">{order.paymentType}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {order.isPaid ? "PAID" : "PENDING"}
                    </span>
                  </div>

                  {order.paymentType === 'ONLINE' && order.payment?.razorpayPaymentId && (
                    <div className="mt-2 bg-blue-50 p-2 rounded border border-blue-100">
                      <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wide mb-1">Transaction ID</p>
                      <p className="font-mono text-xs text-blue-800 break-all select-all cursor-pointer" title="Click to copy">
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
