import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getAllOrders,
  getUserOrders,
  placeOrderCOD,
  updateStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/orderController.js";
import authSeller from "../middlewares/authSeller.js";

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.post("/razorpay/create", authUser, createRazorpayOrder);
orderRouter.post("/razorpay/verify", authUser, verifyRazorpayPayment);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.get("/seller", authSeller, getAllOrders);
orderRouter.post("/status", authSeller, updateStatus);

export default orderRouter;
