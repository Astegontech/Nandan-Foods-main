import jwt from "jsonwebtoken";
import Order from "../models/order.js";
import Product from "../models/product.js";

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message: "Seller logged in successfully",
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getSellerDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});

    // Calculate total sales
    const orders = await Order.find({}).populate("items.product", "name image category");

    // Filter paid orders only for revenue calculation
    const paidOrders = orders.filter(order => order.isPaid);
    const totalSales = paidOrders.reduce((acc, order) => acc + order.amount, 0);

    // Get low stock products (< 5)
    const lowStockProducts = await Product.find({ quantity: { $lt: 5 } }).select("name quantity image");

    // Get recent orders (last 5)
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("address", "firstname lastname city");

    // --- Graph Data ---

    // 1. Last 7 Days Sales
    const last7DaysSales = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayString = date.toLocaleDateString("en-US", { weekday: 'short' });

      // Filter orders for this specific date
      // Note: paidOrders have string dates usually, or Date objects if Mongoose handles it. 
      // Safer to convert to Date.
      const dailyOrders = paidOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getDate() === date.getDate() &&
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear();
      });

      const dailyRevenue = dailyOrders.reduce((acc, order) => acc + order.amount, 0);
      last7DaysSales.push({ name: dayString, sales: dailyRevenue });
    }

    // 2. Top Selling Products & Category Sales
    const productSalesMap = {};
    const categorySalesMap = {};

    // Use all orders for popularity metrics (even if COD/unpaid yet) to show what's moving
    // Or strictly paid? Dashboard "Top Selling" usually implies volume. 
    // Let's use 'orders' (all) but filtered for logic if needed. 
    // To match revenue, we should use paidOrders, but for "Demand" we use all.
    // Let's us paidOrders for consistency with Revenue. 
    const validOrders = paidOrders;

    validOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.product) {
          const productId = item.product._id;
          const productName = item.product.name;
          const category = item.product.category; // Ensure Product model has category
          const quantity = item.quantity;

          // Product Sales
          if (!productSalesMap[productId]) {
            productSalesMap[productId] = { name: productName, quantity: 0 };
          }
          productSalesMap[productId].quantity += quantity;

          // Category Sales
          if (category) {
            if (!categorySalesMap[category]) {
              categorySalesMap[category] = 0;
            }
            categorySalesMap[category] += quantity;
          }
        }
      });
    });

    // Top Selling Products Array
    const topSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Category Sales Array
    const categorySales = Object.entries(categorySalesMap).map(([name, value]) => ({ name, value }));

    // 3. Order Status Distribution
    const statusMap = {};
    orders.forEach(order => { // Use ALL orders for status distribution (Placed, Shipped, etc.)
      if (!statusMap[order.status]) {
        statusMap[order.status] = 0;
      }
      statusMap[order.status]++;
    });
    const orderStatusDistribution = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

    // 4. Extra Stats
    // AOV = Total Sales / Number of Paid Orders (that contributed to sales)
    const paidOrdersCount = paidOrders.length;
    const realAOV = paidOrdersCount > 0 ? (totalSales / paidOrdersCount).toFixed(0) : 0;

    const pendingOrders = orders.filter(o => o.status === 'Order Placed').length;

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalProducts,
        totalSales,
        lowStockProducts,
        recentOrders,
        last7DaysSales,
        topSellingProducts,
        categorySales,
        orderStatusDistribution,
        averageOrderValue: realAOV,
        pendingOrders
      }
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
