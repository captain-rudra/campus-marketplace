const jwt = require("jsonwebtoken");

// 🛡️ ১. সাধারণ ইউজারদের টোকেন চেকার (আপনার আগের কোডটাই)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access Denied! No Token Provided." });
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // বিঃদ্রঃ প্রোডাকশনে "YOUR_SECRET_KEY" .env ফাইলে রাখবেন!
    req.user = verified;  //// টোকেন থেকে পাওয়া ইউজার ডেটা (id, role) রিকোয়েস্ট অবজেক্টে সেট করছি
    next();
  } catch (err) { 
    res.status(401).json({ error: "Invalid Token" }); 
  }
};

// 👑 ২. নতুন অ্যাডমিন চেকার
const isAdmin = (req, res, next) => {
  // verifyToken থেকে আমরা req.user পেয়ে যাচ্ছি, তাই এখানে শুধু role টা চেক করব
  if (req.user && req.user.role === "admin") {
    next(); // অ্যাডমিন হলে ভেতরে যেতে দাও
  } else {
    res.status(403).json({ error: "Access denied! Admins only. 🛑" }); // সাধারণ ইউজার হলে আটকে দাও
  }
};

// ৩. দুটো ফাংশনকেই এক্সপোর্ট করছি
module.exports = { verifyToken, isAdmin };





// const jwt = require("jsonwebtoken");
// module.exports = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ error: "No Token" });
//   try {
//     req.user = jwt.verify(token, "YOUR_SECRET_KEY");
//     next();
//   } catch (err) { res.status(401).json({ error: "Invalid Token" }); }
// };



// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     // কন্ট্রোলারের সাথে মিলিয়ে চাবির নাম "YOUR_SECRET_KEY" দেওয়া হলো
//     const decoded = jwt.verify(token, "YOUR_SECRET_KEY");

//     // আমাদের controllers-এ আমরা req.user.id খুঁজছি, তাই এখানেও সেভাবেই সেট করা হলো
//     req.user = decoded; 

//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };