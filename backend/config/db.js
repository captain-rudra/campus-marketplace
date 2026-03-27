const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Replace: "mongodb://127.0.0.1:27017/..."
await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;