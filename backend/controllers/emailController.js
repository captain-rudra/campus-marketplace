const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
 host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // এটা আপনার সাধারণ পাসওয়ার্ড নয়, জিমেইলের 16 অক্ষরের 'App Password' হতে হবে
  },
});

const sendOTPEmail = async (userEmail, otp) => {
  try {
    const mailOptions = {
      // from-এ হার্ডকোড করা ইমেইলের বদলে আপনার Environment Variable বসিয়ে দিলাম
      from: `"Campus Marketplace" <${process.env.EMAIL_USER}>`, 
      to: userEmail,
      subject: "Your OTP Code 🔐",
      text: `Your OTP is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Campus Marketplace!</h2>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>Please do not share this code with anyone.</p>
        </div>
      ` // HTML টা একটু সুন্দর করে দিলাম যাতে ইমেইলটা দেখতে প্রফেশনাল লাগে
    };
    
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to: " + userEmail);
  } catch (error) {
    console.error("Email error:", error);
  }
};

module.exports = { sendOTPEmail };


// const nodemailer = require("nodemailer");



// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com", // service: "gmail" এর বদলে সরাসরি host ব্যবহার করা হলো
//   port: 465,              // Render-এ ইমেইল পাঠানোর জন্য 465 পোর্ট সবচেয়ে নিরাপদ
//   secure: true,
//  auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
// },
// });

// const sendOTPEmail = async (userEmail, otp) => {
//   try {
//     const mailOptions = {
//       from: '"Campus Marketplace" <${process.env.EMAIL_USER}>',
      
//       to: userEmail,
//       subject: "Your OTP Code 🔐",
//       text: `Your OTP is: ${otp}`,
//       html: `<h1>Your OTP is: ${otp}</h1>`
//     };
//     await transporter.sendMail(mailOptions);
//     console.log("Email sent to " + userEmail);
//   } catch (error) {
//     console.error("Email error:", error);
//   }
// };

// module.exports = { sendOTPEmail };
