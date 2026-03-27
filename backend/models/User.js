const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, 
    required: true },

  email: { type: String, 
    required: true, 
    unique: true },

  password: { type: String,
     required: true },

  rollNo: { type: String, 
    required: true },

  hostelNo: { type: String,
     required: true },

  roomNo: { type: String,
     required: true },

  phone: { type: String,
     required: true },

  role: { type: String,
     enum: ["user", "admin"],
      default: "user" },
      
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false }
});
module.exports = mongoose.model("User", userSchema);






// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
  
//   // নতুন ফিল্ডগুলো যোগ করা হলো
//   rollNo: { type: String, required: true },
//   hostelNo: { type: String, required: true },
//   roomNo: { type: String, required: true },
//   phone: { type: String, required: true }
// });

// module.exports = mongoose.model("User", userSchema);