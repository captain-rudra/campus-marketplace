require('dotenv').config(); // Eita sobar upore thakbe
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// রাউটগুলো ইমপোর্ট করা হচ্ছে
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); // <--- নতুন যোগ করা হলো (User Profile-এর জন্য)
const adminRoutes = require("./routes/adminRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));

// API এন্ডপয়েন্টগুলো সেট করা হচ্ছে
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));