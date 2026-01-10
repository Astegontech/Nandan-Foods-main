import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/User.js";
import Address from "../models/Address.js";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";

export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.userId;
    const { address } = req.body;
    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });
    }

    // Fetch user & cart
    const user = await User.findById(userId);
    const cartItems = user.cartItems || {};
    if (!cartItems || Object.keys(cartItems).length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 1. Validate Address Ownership
    const addressExists = await Address.findOne({ _id: address, userId });
    if (!addressExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid address selected" });
    }

    // Build items from user's cart (server authoritative)
    const items = [];
    for (const [cartKey, qty] of Object.entries(cartItems)) {
      const [productId, weight] = cartKey.includes("-")
        ? cartKey.split("-")
        : [cartKey, ""];
      items.push({ product: productId, quantity: qty, weight });
    }

    let amount = 0;

    // 2. Validate Items & Calculate Amount
    for (const item of items) {
      // Create Cart Key
      const cartKey = item.weight
        ? `${item.product}-${item.weight}`
        : item.product;

      // Validate Item exists in Cart
      const dbQty = cartItems[cartKey];
      if (typeof dbQty === "undefined" || dbQty <= 0) {
        return res
          .status(400)
          .json({ success: false, message: `Item not found in cart` });
      }

      // OVERRIDE quantity from Database
      item.quantity = dbQty;

      // Validate Quantity (Double check, though DB should be correct)
      if (!item.quantity || item.quantity <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid quantity for item" });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      let itemPrice = product.offerPrice; // Default price

      // Check Weight Variant & Stock
      if (
        item.weight &&
        product.weightVariants &&
        product.weightVariants.length > 0
      ) {
        const variant = product.weightVariants.find(
          (v) => v.weight === item.weight
        );
        if (!variant) {
          return res.status(400).json({
            success: false,
            message: `Variant ${item.weight} not found for ${product.name}`,
          });
        }

        // Stock Check for Variant
        if (variant.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `${product.name} (${item.weight}) is out of stock`,
          });
        }

        itemPrice = variant.offerPrice;
      } else {
        // Stock Check for Standard Product
        if (!product.inStock) {
          return res.status(400).json({
            success: false,
            message: `${product.name} is out of stock`,
          });
        }
      }

      amount += itemPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02);

    // Generate Order ID
    const newOrderId = new mongoose.Types.ObjectId().toString();

    await Order.create({
      _id: newOrderId,
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    // Clear user's cart after placing COD order
    await User.findByIdAndUpdate(userId, { cartItems: {} });

    return res
      .status(200)
      .json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { address } = req.body;
    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });
    }

    const user = await User.findById(userId);
    const cartItems = user.cartItems || {};
    if (!cartItems || Object.keys(cartItems).length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const addressExists = await Address.findOne({ _id: address, userId });
    if (!addressExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid address selected" });
    }

    // Build items from user's cart (server authoritative)
    const items = [];
    for (const [cartKey, qty] of Object.entries(cartItems)) {
      const [productId, weight] = cartKey.includes("-")
        ? cartKey.split("-")
        : [cartKey, ""];
      items.push({ product: productId, quantity: qty, weight });
    }

    let amount = 0;

    for (const item of items) {
      const cartKey = item.weight
        ? `${item.product}-${item.weight}`
        : item.product;
      const dbQty = cartItems[cartKey];
      if (typeof dbQty === "undefined" || dbQty <= 0) {
        return res
          .status(400)
          .json({ success: false, message: `Item not found in cart` });
      }
      item.quantity = dbQty;
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      let itemPrice = product.offerPrice;
      if (
        item.weight &&
        product.weightVariants &&
        product.weightVariants.length > 0
      ) {
        const variant = product.weightVariants.find(
          (v) => v.weight === item.weight
        );
        if (!variant) {
          return res.status(400).json({
            success: false,
            message: `Variant ${item.weight} not found for ${product.name}`,
          });
        }
        if (variant.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `${product.name} (${item.weight}) is out of stock`,
          });
        }
        itemPrice = variant.offerPrice;
      } else {
        if (!product.inStock) {
          return res.status(400).json({
            success: false,
            message: `${product.name} is out of stock`,
          });
        }
      }

      amount += itemPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02);

    const newOrderId = new mongoose.Types.ObjectId().toString();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const rpOrder = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: newOrderId,
      payment_capture: 1,
    });

    await Order.create({
      _id: newOrderId,
      userId,
      items,
      amount,
      address,
      paymentType: "ONLINE",
      razorpayOrderId: rpOrder.id,
      isPaid: false,
    });

    return res.status(200).json({
      success: true,
      order: rpOrder,
      key: process.env.RAZORPAY_KEY_ID,
      newOrderId,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payload" });
    }

    // Load order from DB
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Idempotency: don't accept repeated confirmations
    if (order.isPaid) {
      return res
        .status(400)
        .json({ success: false, message: "Order already paid" });
    }

    // The razorpay_order_id provided by client must match the server-saved one
    if (order.razorpayOrderId && order.razorpayOrderId !== razorpay_order_id) {
      return res
        .status(400)
        .json({ success: false, message: "Razorpay order id mismatch" });
    }

    // Verify signature first (HMAC)
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Verify amount and payment status directly with Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Fetch order and payment from Razorpay
    const rpOrder = await razorpay.orders.fetch(razorpay_order_id);
    const rpPayment = await razorpay.payments.fetch(razorpay_payment_id);

    // Amount check
    if (rpOrder.amount !== Math.round(order.amount * 100)) {
      return res
        .status(400)
        .json({ success: false, message: "Amount mismatch" });
    }

    // Ensure payment is captured (or captured/authorized depending on flow)
    if (
      !rpPayment ||
      (rpPayment.status !== "captured" && rpPayment.status !== "authorized")
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Payment not captured" });
    }

    // Mark order as paid and store payment details
    await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      payment: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        raw: rpPayment,
      },
      paymentMethod: "Razorpay",
    });

    // Clear user's cart
    if (order) {
      await User.findByIdAndUpdate(order.userId, { cartItems: {} });
    }

    return res
      .status(200)
      .json({ success: true, message: "Payment verified and order completed" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
