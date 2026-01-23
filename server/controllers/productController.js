import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.js";

export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    await Product.create({ ...productData, image: imagesUrl });

    // Emit stock update event
    const io = req.app.get("io");
    if (io) {
      io.emit("stockUpdate");
    }

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });

    // Emit stock update event
    const io = req.app.get("io");
    if (io) {
      io.emit("stockUpdate");
    }

    res.json({ success: true, message: "Stock Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await Product.findByIdAndDelete(id);

    // Emit stock update event
    const io = req.app.get("io");
    if (io) {
      io.emit("stockUpdate");
    }

    res.json({ success: true, message: "Product Deleted" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const { id } = productData;

    if (req.files && req.files.length > 0) {
      const images = req.files;
      const imagesUrl = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
      productData.image = imagesUrl;
    }

    delete productData.id;

    await Product.findByIdAndUpdate(id, productData);

    // Emit stock update event
    const io = req.app.get("io");
    if (io) {
      io.emit("stockUpdate");
    }

    res.json({ success: true, message: "Product Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
