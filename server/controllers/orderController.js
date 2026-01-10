import Order from "../models/order.js";
import Product from "../models/product.js";
import stripe from "stripe";
import User from "../models/User.js";
import Address from "../models/Address.js";
import mongoose from "mongoose";

export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address } = req.body;
    if (!address || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }

    // 1. Validate Address Ownership
    const addressExists = await Address.findOne({ _id: address, userId });
    if (!addressExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid address selected",
      });
    }

    let amount = 0;

    // Fetch User to get Cart Items
    const user = await User.findById(userId);
    const cartItems = user.cartItems || {};

    // 2. Validate Items & Calculate Amount
    for (const item of items) {
      // Create Cart Key
      const cartKey = item.weight ? `${item.product}-${item.weight}` : item.product;

      // Validate Item exists in Cart
      if (!cartItems[cartKey]) {
        return res.status(400).json({
          success: false,
          message: `Item not found in cart`,
        });
      }

      // OVERRIDE quantity from Database
      item.quantity = cartItems[cartKey];

      // Validate Quantity (Double check, though DB should be correct)
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity for item",
        });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      let itemPrice = product.offerPrice; // Default price

      // Check Weight Variant & Stock
      if (item.weight && product.weightVariants && product.weightVariants.length > 0) {
        const variant = product.weightVariants.find(v => v.weight === item.weight);
        if (!variant) {
          return res.status(400).json({ success: false, message: `Variant ${item.weight} not found for ${product.name}` });
        }

        // Stock Check for Variant
        if (variant.stock < item.quantity) {
          return res.status(400).json({ success: false, message: `${product.name} (${item.weight}) is out of stock` });
        }

        itemPrice = variant.offerPrice;
      } else {
        // Stock Check for Standard Product
        if (!product.inStock) {
          return res.status(400).json({ success: false, message: `${product.name} is out of stock` });
        }
      }

      amount += itemPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02);

    // Generate custom Order ID
    const newOrderId = `#RN-${new mongoose.Types.ObjectId()}`;

    await Order.create({
      _id: newOrderId,
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });
    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId;
    const { origin } = req.headers;
    const { items, address } = req.body;

    if (!address || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }

    // 1. Validate Address Ownership
    const addressExists = await Address.findOne({ _id: address, userId });
    if (!addressExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid address selected",
      });
    }

    let productData = [];
    let amount = 0;

    // Fetch User to get Cart Items
    const user = await User.findById(userId);
    const cartItems = user.cartItems || {};

    // 2. Validate Items & Calculate Amount
    for (const item of items) {
      // Create Cart Key
      const cartKey = item.weight ? `${item.product}-${item.weight}` : item.product;

      // Validate Item exists in Cart
      if (!cartItems[cartKey]) {
        return res.status(400).json({
          success: false,
          message: `Item not found in cart`,
        });
      }

      // OVERRIDE quantity from Database
      item.quantity = cartItems[cartKey];

      // Validate Quantity
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ success: false, message: "Invalid quantity" });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      let itemPrice = product.offerPrice;

      if (item.weight && product.weightVariants && product.weightVariants.length > 0) {
        const variant = product.weightVariants.find(v => v.weight === item.weight);
        if (!variant) {
          return res.status(400).json({ success: false, message: `Variant ${item.weight} not found for ${product.name}` });
        }
        // Stock Check
        if (variant.stock < item.quantity) {
          return res.status(400).json({ success: false, message: `${product.name} (${item.weight}) is out of stock` });
        }
        itemPrice = variant.offerPrice;
      } else {
        // Stock Check
        if (!product.inStock) {
          return res.status(400).json({ success: false, message: `${product.name} is out of stock` });
        }
      }

      productData.push({
        name: `${product.name} ${item.weight ? `(${item.weight})` : ""}`,
        price: itemPrice,
        quantity: item.quantity,
      });

      amount += itemPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02);

    // Generate custom Order ID
    const newOrderId = `#RN-${new mongoose.Types.ObjectId()}`;

    const order = await Order.create({
      _id: newOrderId,
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
      isPaid: false, // Should be false initially
    });

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price + item.price * 0.02) * 100, // Reduced 'math' complexity
        },
        quantity: item.quantity,
      };
    });

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/verify?success=true&orderId=${order._id}`, // Updated success URL pattern usually
      cancel_url: `${origin}/verify?success=false&orderId=${order._id}`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      url: session.url,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const stripeWebhooks = async (request, response) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    response.status(400).send(`Webhook Error: ${error.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { orderId, userId } = session.data[0].metadata;
      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      await User.findByIdAndUpdate(userId, { cart: {} });
      break;
    }
    case "payment_intent.failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { orderId } = session.data[0].metadata;
      await Order.findByIdAndDelete(orderId);
      break;
    }

    default:
      {
        console.error(`Unhandled event type ${event.type}`);
        break;
      }
      response.json({ received: true });
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
    console.log("Fetched Orders:", JSON.stringify(orders, null, 2));
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
