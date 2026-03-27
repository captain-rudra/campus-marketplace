const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
   
    price: { type: Number, required: true },
    
    // নতুন দুটো ফিল্ড যোগ করা হলো
    isNegotiable: { type: String, default: "Negotiable" }, 
    status: { type: String, default: "Available" }, 
    
    description: { 
    type: String, 
    required: false // Optional করা হলো
  },       
    
    images: [{ type: String }], // একাধিক ছবির নাম সেভ করার জন্য Array
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);