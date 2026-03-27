import React, { useState } from "react";

const API_BASE = "http://localhost:5000";

function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  
  // ফর্মের ডেটা
  const [formData, setFormData] = useState({
    name: "", rollNo: "", roomNo: "", hostelNo: "", phone: "", email: "", password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Signup-এর সময় Mandatory ভ্যালিডেশন
    if (!isLogin) {
      const { name, rollNo, roomNo, hostelNo, phone } = formData;
      if (!name || !rollNo || !roomNo || !hostelNo || !phone) {
        alert("Error: All fields are mandatory for Signup!");
        return;
      }
    }

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok && isLogin) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } else {
      alert(data.message || data.error || "Success! Please Login.");
      if(!isLogin && res.ok) setIsLogin(true); // সাইনআপ হলে লগইন পেজে নিয়ে যাবে
    }
  };

  return (
    <div className="card box-light">
      <h3>{isLogin ? "Login" : "Signup for IIIT-A Market"}</h3>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input type="text" name="name" placeholder="Full Name *" onChange={handleChange} required />
            <input type="text" name="rollNo" placeholder="Roll No *" onChange={handleChange} required />
            <input type="text" name="hostelNo" placeholder="Hostel No *" onChange={handleChange} required />
            <input type="text" name="roomNo" placeholder="Room No *" onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone Number *" onChange={handleChange} required />
          </>
        )}
        <input type="email" name="email" placeholder="College Email (@iiita.ac.in) *" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password *" onChange={handleChange} required />
        
        <button type="submit" className="btn-primary">{isLogin ? "Login" : "Signup"}</button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)} style={{ color: "blue", cursor: "pointer", marginTop:"10px" }}>
        {isLogin ? "New user? Create an account." : "Already have an account? Login."}
      </p>
    </div>
  );
}

export default Auth;