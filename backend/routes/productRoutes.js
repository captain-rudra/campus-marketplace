const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product"); 

// .env ফাইল থেকে সিক্রেট কি নেওয়া হচ্ছে
const SECRET = process.env.JWT_SECRET; 

// 🛡️ টোকেন ভেরিফাই করার মিডলওয়্যার
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access Denied. Please login." });
  try {
    const verified = jwt.verify(token, SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

// 📂 Multer সেটআপ (ছবিগুলো uploads ফোল্ডারে সেভ হবে)

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "campus-marketplace",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// 🚀 ১. নতুন প্রোডাক্ট আপলোড (সর্বোচ্চ ৪টি ছবি)
router.post("/", verifyToken, upload.array("images", 4), async (req, res) => {
  try {
    const { title, description, price, isNegotiable, status } = req.body;
    
    // ফ্রন্টএন্ড থেকে আসা ছবিগুলোর নামগুলো একটা Array-তে নিচ্ছি
    const imagePaths = req.files ? req.files.map((file) => file.path) : [];

    const newProduct = new Product({
      title,
      description,
      price,
      isNegotiable,
      status,
      images: imagePaths, // একাধিক ছবি সেভ হচ্ছে
      seller: req.user.id, 
    });

    await newProduct.save();
    res.status(201).json({ message: "Product uploaded successfully!" });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Failed to upload product on server" });
  }
});

// 📦 ২. আমার আপলোড করা প্রোডাক্টগুলো দেখা (নতুনগুলো আগে দেখাবে)
router.get("/my-products", verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// 🗑️ ৩. প্রোডাক্ট ডিলিট করা
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// 🌍 ৪. হোম পেজের জন্য সব প্রোডাক্ট দেখা
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "name email roomNo hostelNo phone")
      .sort({ createdAt: -1 }); // লেটেস্ট প্রোডাক্ট আগে দেখাবে
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all products" });
  }
});


// ✏️ ৫. প্রোডাক্ট আপডেট (Update/Edit)
router.put("/:id", verifyToken, upload.array("images", 4), async (req, res) => {
  try {
    const { title, description, price, isNegotiable, status } = req.body;
    
    // প্রথমে প্রোডাক্টটা খুঁজে বের করি
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    
    // সিকিউরিটি চেক: অন্য কেউ যেন আপনার অ্যাড আপডেট না করতে পারে
    if (product.seller.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized to update this ad" });
    }

    let imagePaths = product.images; // আগে থেকে থাকা ছবিগুলো
    
    // 🛑 ফিক্স: নতুন ছবি দিলে সেগুলো আগের ছবির সাথে যুক্ত (Append) হবে
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      imagePaths = [...product.images, ...newImages]; // পুরনো + নতুন

      // যদি মোট ছবি ৪টার বেশি হয়ে যায়, তবে প্রথম ৪টি রেখে বাকিগুলো বাদ দেব
      if (imagePaths.length > 4) {
        imagePaths = imagePaths.slice(0, 4); 
      }
    }

    // ডেটা আপডেট করা হচ্ছে
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.isNegotiable = isNegotiable || product.isNegotiable;
    product.status = status || product.status;
    product.images = imagePaths; // আপডেট করা ছবির লিস্ট

    await product.save();
    res.json({ message: "Product updated successfully!", product });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

module.exports = router;
