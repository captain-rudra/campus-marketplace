import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Form, 2 = OTP screen
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", rollNo: "", hostelNo: "", roomNo: "", phone: ""
  });
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Request OTP
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2); // Go to OTP screen
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      alert("Server error. Please try again.");
    }
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration Successful! Please login.");
        navigate("/login");
      } else {
        alert(data.error || "Invalid OTP");
      }
    } catch (err) {
      alert("Verification failed.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", background: "white" }}>
      {step === 1 ? (
        <form onSubmit={handleSignupSubmit}>
          <h2 style={{ textAlign: "center", color: "#0056b3" }}>Create Account</h2>
          <p style={{ textAlign: "center", fontSize: "12px", color: "gray" }}>Use your @iiita.ac.in email</p>
          
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required style={styles.input} />
          <input type="email" name="email" placeholder="College Email" onChange={handleChange} required style={styles.input} />
          <input type="password" name="password" placeholder="Create Password" onChange={handleChange} required style={styles.input} />
          
          <div style={{ display: "flex", gap: "10px" }}>
            <input type="text" name="rollNo" placeholder="Roll No" onChange={handleChange} required style={styles.input} />
            <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required style={styles.input} />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <input type="text" name="hostelNo" placeholder="Hostel (e.g. BH-1)" onChange={handleChange} required style={styles.input} />
            <input type="text" name="roomNo" placeholder="Room No" onChange={handleChange} required style={styles.input} />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Sending OTP..." : "Get OTP"}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#28a745" }}>Verify Email 🔐</h2>
          <p>We've sent a 6-digit code to <b>{formData.email}</b></p>
          
          <form onSubmit={handleVerifyOTP}>
            <input 
              type="text" 
              placeholder="Enter 6-digit OTP" 
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required 
              style={{ ...styles.input, textAlign: "center", fontSize: "24px", letterSpacing: "10px", fontWeight: "bold" }} 
            />
            
            <button type="submit" disabled={loading} style={{ ...styles.button, background: "#28a745" }}>
              {loading ? "Verifying..." : "Verify & Register"}
            </button>
          </form>
          
          <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#0056b3", cursor: "pointer", marginTop: "15px", fontWeight: "bold" }}>
            ← Back to Edit Email
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  input: { width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #ccc", borderRadius: "6px", boxSizing: "border-box" },
  button: { width: "100%", padding: "12px", background: "#0056b3", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }
};

export default Signup;