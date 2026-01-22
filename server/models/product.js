import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    availableWeights: {
      type: [String],
      default: [],
    },
    weightVariants: [
      {
        weight: { type: String, required: true },
        price: { type: Number, required: true },
        offerPrice: { type: Number, required: true },
        stock: { type: Number, default: 0 },
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.product || mongoose.model("product", productSchema);

export default Product;
