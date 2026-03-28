const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
  service: "gmail",
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
