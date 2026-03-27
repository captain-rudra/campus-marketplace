const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require("./emailController");

const SECRET = process.env.JWT_SECRET; // রিয়েল প্রজেক্টে এটি .env ফাইলে রাখতে হয়

// ১. SIGNUP & SEND OTP (Smart Version)
exports.signup = async (req, res) => {
  try {
    const { name, email, password, rollNo, hostelNo, roomNo, phone } = req.body;
    
    // ৬ ডিজিটের নতুন ওটিপি জেনারেট
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // ১০ মিনিট মেয়াদ
    const hashedPassword = await bcrypt.hash(password, 10);

    // চেক করি ইমেইলটা আগে থেকে আছে কি না
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ error: "Email already registered. Please Login." });
      } else {
        // যদি ভেরিফাইড না থাকে, তবে ডেটা আপডেট করে নতুন ওটিপি পাঠাব
        existingUser.name = name;
        existingUser.password = hashedPassword;
        existingUser.rollNo = rollNo;
        existingUser.hostelNo = hostelNo;
        existingUser.roomNo = roomNo;
        existingUser.phone = phone;
        existingUser.otp = otp;
        existingUser.otpExpires = otpExpires;
        
        await existingUser.save();
        await sendOTPEmail(email, otp);
        return res.status(200).json({ message: "New OTP sent to your email!" });
      }
    }

    // নতুন ইউজার হলে
    const newUser = new User({
      name, email, password: hashedPassword, rollNo, hostelNo, roomNo, phone,
      otp, otpExpires
    });

    await newUser.save();
    await sendOTPEmail(email, otp);
    
    res.status(200).json({ message: "OTP Sent to your email!" });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Signup Failed on server" });
  }
};

// ২. VERIFY OTP (Robust Version)
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found. Please signup again." });
    }

    // OTP মেলানো (String এ কনভার্ট করে এবং স্পেস মুছে)
    if (user.otp !== String(otp).trim()) {
      return res.status(400).json({ error: "Invalid OTP! Please check the code." });
    }

    // টাইম চেক (১০ মিনিট পার হয়ে গেছে কি না)
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    // সব ঠিক থাকলে ভেরিফাইড করে দিই
    user.isVerified = true;
    user.otp = undefined; 
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Verified successfully! You can now login." });

  } catch (error) {
    console.error("VerifyOTP Error:", error);
    res.status(500).json({ error: "Verification failed on server" });
  }
};

// ৩. LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid Email or Password" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ error: "Please verify your email first. Go to Signup." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "7d" });
    res.json({ token, role: user.role, message: "Login Successful!" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed on server" });
  }
};

// ৪. FORGOT PASSWORD (OTP পাঠানো)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found with this email." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();

    await sendOTPEmail(email, otp); 
    res.json({ message: "Reset OTP sent to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// ৫. RESET PASSWORD (নতুন পাসওয়ার্ড সেট করা)
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== String(otp).trim() || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful! You can now login." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Failed to reset password." });
  }
};




// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password, rollNo, hostelNo, roomNo, phone } = req.body;

//     // College Email Validation
//     if (!email.endsWith("@iiita.ac.in")) {
//       return res.status(400).json({ error: "Only @iiita.ac.in emails are allowed." });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ error: "Email already exists." });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name, email, password: hashedPassword, rollNo, hostelNo, roomNo, phone
//     });

//     await newUser.save();
//     res.status(201).json({ message: "Signup successful! You can now login." });
//   } catch (error) {
//     res.status(500).json({ error: "Server error during signup" });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "User not found." });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: "Invalid password." });

//     // টোকেনের ভেতর ইউজারের ID সেভ করা হচ্ছে
//     const token = jwt.sign({ id: user._id }, "YOUR_SECRET_KEY", { expiresIn: "7d" });
//     res.json({ message: "Login successful", token });
//   } catch (error) {
//     res.status(500).json({ error: "Server error during login" });
//   }
// };