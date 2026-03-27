const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");

// Middleware theke verifyToken ebong isAdmin niye aschi
const { verifyToken, isAdmin } = require("../middleware/auth"); // Apnar middleware filenam onujayi path thik korun

// 👥 ১. sob user-er list dekhabe (Admin only)
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching users" });
  }
});

// 📦 ২. sob product-er list dekhabe (Admin only)
router.get("/products", verifyToken, isAdmin, async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching products" });
  }
});

// 🗑️ ৩. Je kono product delete kora (Admin only)
router.delete("/product/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted by Admin!" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// 🗑️ ৪. User ডিলিট করা এবং তার আপলোড করা সব প্রোডাক্ট ডিলিট করা (Admin only)
router.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // সিকিউরিটি চেক: অ্যাডমিন যাতে নিজেকে নিজে ডিলিট করতে না পারে
    if (req.user.id === userId) {
      return res.status(400).json({ error: "Admin cannot delete themselves!" });
    }

    // ১. প্রথমে এই ইউজারের আপলোড করা সমস্ত প্রোডাক্ট ডিলিট করে দিচ্ছি (যাতে ডাটাবেস ক্লিন থাকে)
    await Product.deleteMany({ seller: userId });

    // ২. এবার ইউজারকে ডাটাবেস থেকে ডিলিট করছি
    await User.findByIdAndDelete(userId);

    res.json({ message: "User and all their products deleted successfully!" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;