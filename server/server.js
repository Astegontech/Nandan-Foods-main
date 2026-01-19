import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;
await connectDB();
await connectCloudinary();

console.log("Server Startup - NODE_ENV:", process.env.NODE_ENV, "RENDER:", process.env.RENDER);


const allowedOrigins = [
  "https://nandanfoods.store",
  "https://www.nandanfoods.store"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin) return callback(null, true);

    // Check if origin is in strict allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // Allow any Vercel deployment
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    // Allow your specific custom domain if you have one
    // if (origin === 'https://your-custom-domain.com') return callback(null, true);

    const msg =
      "The CORS policy for this site does not allow access from the specified Origin.";
    return callback(new Error(msg), false);
  },
  credentials: true,
};

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use((req, res, next) => {
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

// Export app for Vercel
export default app;

// Listen if strictly local OR running on Render
// Vercel serverless will skip this because NODE_ENV is production and RENDER is undefined
if (process.env.NODE_ENV !== "production" || process.env.RENDER) {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}
