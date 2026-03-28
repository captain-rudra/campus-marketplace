const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // service: "gmail" এর বদলে সরাসরি host ব্যবহার করা হলো
  port: 465,              // Render-এ ইমেইল পাঠানোর জন্য 465 পোর্ট সবচেয়ে নিরাপদ
  secure: true,
 auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
},
});

const sendOTPEmail = async (userEmail, otp) => {
  try {
    const mailOptions = {
      from: '"Campus Marketplace" <your-email@gmail.com>',
      
      to: userEmail,
      subject: "Your OTP Code 🔐",
      text: `Your OTP is: ${otp}`,
      html: `<h1>Your OTP is: ${otp}</h1>`
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent to " + userEmail);
  } catch (error) {
    console.error("Email error:", error);
  }
};

module.exports = { sendOTPEmail };
