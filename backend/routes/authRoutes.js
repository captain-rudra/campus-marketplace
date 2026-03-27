const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// আমাদের authController থেকে সব ফাংশন ইমপোর্ট করছি
const { 
  signup, 
  verifyOTP, 
  login, 
  forgotPassword, 
  resetPassword 
} = require("../controllers/authController");

// রাস্তা (Routes) তৈরি করছি
router.post("/signup", signup);
router.post("/verify-otp", verifyOTP); // <-- সম্ভবত আপনার ফাইলে এই লাইনটি মিসিং ছিল!
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;