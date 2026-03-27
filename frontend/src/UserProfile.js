import React, { useState, useEffect } from "react";
const API_BASE = "http://localhost:5000";

function UserProfile({ token, setToken }) {
  const [profile, setProfile] = useState({
    name: "", rollNo: "", phone: "", roomNo: "", hostelNo: "", email: ""
  });

  useEffect(() => {
    fetch(`${API_BASE}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if(data.email) setProfile(data);
      })
      .catch(err => console.log(err));
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/user/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    alert(data.message || data.error);
    if(res.ok) window.location.reload();
  };

  // ACCOUNT DELETE LOGIC
  const handleDeleteAccount = async () => {
    if (window.confirm("🚨 WARNING: Are you sure you want to DELETE your account? All your products will also be deleted. This cannot be undone!")) {
      await fetch(`${API_BASE}/api/user/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem("token");
      setToken(""); // logout
      alert("Account and all products Deleted Successfully.");
    }
  };

  return (
    <div className="card" style={{ background: "#e6f2ff", padding: "20px", borderRadius: "8px", border: "1px solid #b3d7ff" }}>
      <h3>👤 My Personal Details</h3>
      
      <form onSubmit={handleUpdateProfile}>
        <label>Email (Cannot change):</label>
        <input type="email" value={profile.email} disabled style={{ background:"#ddd", width: "100%", padding: "8px", marginBottom: "10px" }} />
        
        <label>Name:</label>
        <input type="text" name="name" value={profile.name} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
        
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label>Roll No:</label>
            <input type="text" name="rollNo" value={profile.rollNo} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Phone:</label>
            <input type="text" name="phone" value={profile.phone} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label>Hostel:</label>
            <input type="text" name="hostelNo" value={profile.hostelNo} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Room No:</label>
            <input type="text" name="roomNo" value={profile.roomNo} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
          </div>
        </div>

        <button type="submit" style={{ background: "#0056b3", color:"white", padding: "10px", width: "100%", marginTop: "10px", border: "none", cursor: "pointer", fontWeight: "bold", borderRadius: "5px" }}>
          Save Changes
        </button>
      </form>

      {/* DELETE ACCOUNT BUTTON */}
      <button onClick={handleDeleteAccount} style={{ background: "#ff4d4d", color:"white", padding: "10px", width: "100%", marginTop: "20px", border: "none", cursor: "pointer", fontWeight: "bold", borderRadius: "5px" }}>
        🚨 Delete My Account
      </button>
    </div>
  );
}

export default UserProfile;