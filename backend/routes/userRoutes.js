const express = require("express");
const router = express.Router();

const User = require("../models/User"); 
const Product = require("../models/Product"); 

// 🛑 পরিবর্তন এখানে: অবজেক্ট থেকে শুধু verifyToken-টি নিন
const { verifyToken } = require("../middleware/auth"); 

// ১. ইউজারের প্রোফাইল ফেচ করা
// 🛑 পরিবর্তন এখানে: authMiddleware-এর বদলে verifyToken ব্যবহার করুন
router.get("/me", verifyToken, async (req, res) => {
  try {
    // আপনার আগের কোডে req.user.id ছিল, কিন্তু jwt.verify সাধারণত 'id' নয়, '_id' বা সরাসরি ইউজারের ডেটা দেয়। 
    // যদি আপনার টোকেনে 'id' থাকে তবে ঠিক আছে, নাহলে req.user._id চেক করুন।
    const user = await User.findById(req.user.id).select("-password"); 
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ২. প্রোফাইল আপডেট করা
router.put("/update", verifyToken, async (req, res) => {
  const { name, rollNo, phone, roomNo, hostelNo } = req.body;
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { name, rollNo, phone, roomNo, hostelNo },
      { new: true } 
    );
    res.json({ message: "Profile updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Could not update profile" });
  }
});

// ৩. অ্যাকাউন্ট ডিলিট করা
router.delete("/delete", verifyToken, async (req, res) => {
  try {
    await Product.deleteMany({ seller: req.user.id }); 
    await User.findByIdAndDelete(req.user.id); 
    res.json({ message: "Account and all associated products deleted forever." });
  } catch (err) {
    res.status(500).json({ error: "Could not delete account" });
  }
});

module.exports = router;