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
            {/* Header: Order ID & Date */}
            <div className="flex justify-between items-start w-full border-b pb-2 mb-2">
              <div>
                <p className="text-sm font-bold text-gray-700">Order ID: <span className="font-mono text-gray-500">#{order._id}</span></p>
                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              {order.status === "Order Placed" && (
                <span className="text-red-500 font-bold text-xs animate-pulse">New Order</span>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-5 justify-between w-full">
              {/* Left: Items */}
              <div className="flex-1">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Ordered Items</h4>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-start p-2 bg-gray-50 rounded">
                      <img
                        className="w-10 h-10 object-contain bg-white border rounded"
                        src={item.product?.image?.[0] || assets.box_icon}
                        alt={item.product?.name}
                      />
                      <div>
                        <p className="font-medium text-sm text-gray-800">
                          {item.product?.name || "Product Deleted"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.weight && <span className="font-medium text-gray-600">{item.weight}</span>}
                          <span className="mx-1">x</span>
                          <span className="font-bold text-primary">{item.quantity}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle: Customer & Address */}
              <div className="flex-1 border-l pl-0 md:pl-5 border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Shipping To</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-semibold">{order.address?.firstName} {order.address?.lastName}</p>
                  <p>{order.address?.phone}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {order.address?.street},<br />
                    {order.address?.city}, {order.address?.state} - {order.address?.zipcode}<br />
                    {order.address?.country}
                  </p>
                </div>
              </div>

              {/* Right: Payment & Status */}
              <div className="flex-1 border-l pl-0 md:pl-5 border-gray-100 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Payment Info</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-gray-500">Method:</span> <span className="font-mono font-medium">{order.paymentType}</span></p>
                    <p>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </p>
                    {order.paymentType === 'ONLINE' && order.payment?.razorpayPaymentId && (
                      <p className="text-xs text-gray-400 mt-1 break-all">
                        Txn: <span className="font-mono">{order.payment.razorpayPaymentId}</span>
                      </p>
                    )}
                    <p className="mt-2 text-lg font-bold text-gray-800">{currency}{order.amount}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Update Status</h4>
                  <select
                    onChange={(event) => statusHandler(event, order._id || "")}
                    value={order.status}
                    className="w-full p-2 border rounded font-medium text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
