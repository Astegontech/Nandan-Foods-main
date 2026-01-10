import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    _id: { type: String },
    userId: { type: String, required: true, ref: "user" },
    items: [
      {
        product: { type: String, required: true, ref: "product" },
        quantity: { type: Number, required: true },
        weight: { type: String, default: "" },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: String, required: true, ref: "address" },
    status: { type: String, required: true, default: "Order Placed" },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    razorpayOrderId: { type: String },
    payment: { type: Object },
    paymentMethod: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.models.order || mongoose.model("order", orderSchema);

export default Order;
