import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

function ForgotPassword() {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 📧 Step 1: OTP পাঠানোর ফাংশন (যেটা আপনার আগে থেকেই কাজ করছে)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (res.ok) {
        alert("OTP sent to your email! 📩");
        setStep(2); // OTP সেন্ড হলে ২য় ধাপে চলে যাবে
      } else {
        alert(data.error || "Failed to send OTP");
      }
    } catch (err) {
      alert("Server error. Try again.");
    }
    setLoading(false);
  };

  // 🔐 Step 2: OTP ভেরিফাই করে নতুন পাসওয়ার্ড সেট করার ফাংশন
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ইমেইল, ওটিপি এবং নতুন পাসওয়ার্ড ৩টেই ব্যাকএন্ডে পাঠাচ্ছি
        body: JSON.stringify({ email, otp, newPassword }), 
      });
      const data = await res.json();
      
      if (res.ok) {
        alert("Password updated successfully! 🎉 Please login.");
        navigate("/login"); // লগইন পেজে পাঠিয়ে দিচ্ছি
      } else {
        alert(data.error || "Invalid OTP or failed to reset");
      }
    } catch (err) {
      alert("Server error. Try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
      <h2 style={{ textAlign: "center", color: "#0056b3" }}>Reset Password 🔐</h2>

      {step === 1 ? (
        // 🟢 Step 1 Form: শুধু ইমেইল চাইবে
        <form onSubmit={handleSendOtp}>
          <p style={{ color: "gray", fontSize: "14px", marginBottom: "15px" }}>
            Enter your email address and we'll send you an OTP to reset your password.
          </p>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={styles.input} 
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      ) : (
        // 🟢 Step 2 Form: OTP এবং নতুন পাসওয়ার্ড চাইবে
        <form onSubmit={handleResetPassword}>
          <p style={{ color: "green", fontSize: "14px", marginBottom: "15px", fontWeight: "bold" }}>
            OTP sent to {email}
          </p>
          <input 
            type="text" 
            placeholder="Enter 6-digit OTP" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            required 
            style={styles.input} 
          />
          <input 
            type="password" 
            placeholder="Enter New Password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
            style={styles.input} 
          />
          <button type="submit" disabled={loading} style={{ ...styles.button, background: "#28a745" }}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
}

const styles = {
  input: { width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box", fontSize: "15px" },
  button: { width: "100%", padding: "14px", background: "#0056b3", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }
};

export default ForgotPassword;