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
            {order.status === "Order Placed" && (
              <p className="absolute top-0 right-2 text-red-500 font-medium text-sm">
                New
              </p>
            )}
            <div className="flex gap-5 max-w-80">
              <img
                className="w-12 h-12 object-cover "
                src={assets.box_icon}
                alt="boxIcon"
              />
              <div>
                {order.items.map((item, index) => (
                  <div key={index} className="flex flex-col ">
                    <p className="font-medium">
                      {item.product?.name || "Product Deleted"}{" "}
                      {item.weight && <span className="text-emerald-600">({item.weight})</span>}{" "}
                      <span className="text-primary">x {item.quantity}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm md:text-base text-black/60">
              <p className="text-black/80">
                {order.address?.firstName} {order.address?.lastName}
              </p>
              <p>
                {order.address?.street}, {order.address?.city},
              </p>
              <p>
                {order.address?.state}, {order.address?.zipcode},
                {order.address?.country}
              </p>
              <p>{order.address?.phone}</p>
            </div>

            <p className="font-medium text-lg my-auto">
              {currency}
              {order.amount}
            </p>

            <div className="flex flex-col text-sm md:text-base text-black/60">
              <p>Method: {order.paymentType}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
            </div>

            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
