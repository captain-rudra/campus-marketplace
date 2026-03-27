import React, { useState, useEffect } from "react";

// ব্যাকএন্ডের অ্যাড্রেস
const API_BASE = "https://campus-marketplace-aye7.onrender.com";

function AdminDashboard({ token }) {
  // ---------------------------------------------------------
  // ১. States (স্টেটসমূহ)
  // ---------------------------------------------------------
  const [products, setProducts] = useState([]); // সব প্রোডাক্টের লিস্ট রাখার জন্য
  const [users, setUsers] = useState([]);       // সব ইউজারের লিস্ট রাখার জন্য
  const [activeTab, setActiveTab] = useState("products"); // অ্যাডমিন এখন কোন ট্যাবে আছে (products নাকি users)
  const [loading, setLoading] = useState(true); // ডেটা লোডিং স্টেট

  // ---------------------------------------------------------
  // ২. ডেটা ফেচিং (প্রোডাক্ট এবং ইউজার নিয়ে আসা)
  // ---------------------------------------------------------
  
  // সব প্রোডাক্ট নিয়ে আসার ফাংশন
  const fetchAllProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  // সব ইউজার নিয়ে আসার ফাংশন (ব্যাকএন্ডে এই রাউট থাকতে হবে)
  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  // পেজ লোড হলে দুটো ফাংশনই একসাথে কল করা হচ্ছে
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAllProducts();
      await fetchAllUsers();
      setLoading(false);
    };
    loadData();
    // eslint-disable-next-line
  }, [token]);

  // ---------------------------------------------------------
  // ৩. ডিলিট লজিক (অ্যাডমিন পাওয়ার)
  // ---------------------------------------------------------

  // অ্যাডমিন যেকোনো প্রোডাক্ট ডিলিট করতে পারবে
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Admin: Are you sure you want to delete this product?")) return;
    try {
      // অ্যাডমিন রাউট বা নরমাল প্রোডাক্ট ডিলিট রাউট ব্যবহার করা যেতে পারে
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Product deleted by Admin!");
        fetchAllProducts(); // ডিলিট করার পর লিস্ট আপডেট
      }
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  // অ্যাডমিন যেকোনো ইউজারকে ডিলিট/ব্যান করতে পারবে
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Admin: Are you sure you want to REMOVE this user completely?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("User deleted successfully!");
        fetchAllUsers(); // লিস্ট আপডেট
      }
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  // ---------------------------------------------------------
  // ৪. UI (ইউজার ইন্টারফেস) - Loading State
  // ---------------------------------------------------------
  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading Admin Dashboard... ⏳</h2>;
  }

  // ---------------------------------------------------------
  // ৫. মূল অ্যাডমিন প্যানেল UI
  // ---------------------------------------------------------
  return (
    <div style={{ maxWidth: "1000px", margin: "20px auto", padding: "20px" }}>
      
      {/* অ্যাডমিন হেডার */}
      <h2 style={{ textAlign: "center", color: "#d32f2f", borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>
        🛡️ Admin Control Panel
      </h2>

      {/* --- ট্যাব নেভিগেশন (Tab Navigation) --- */}
      {/* এই বাটনগুলো দিয়ে অ্যাডমিন 'Products' এবং 'Users' পেজে সুইচ করতে পারবে */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "30px" }}>
        <button 
          onClick={() => setActiveTab("products")} 
          style={{ ...styles.tabBtn, background: activeTab === "products" ? "#0056b3" : "#e9ecef", color: activeTab === "products" ? "white" : "black" }}
        >
          📦 Manage Products ({products.length})
        </button>
        <button 
          onClick={() => setActiveTab("users")} 
          style={{ ...styles.tabBtn, background: activeTab === "users" ? "#28a745" : "#e9ecef", color: activeTab === "users" ? "white" : "black" }}
        >
          👥 Manage Users ({users.length})
        </button>
      </div>

      {/* ------------------------------------------------------
          ট্যাব ১: প্রোডক্ট ম্যানেজমেন্ট (Manage Products)
      ------------------------------------------------------- */}
      {activeTab === "products" && (
        <div>
          <h3>All Uploaded Ads</h3>
          <div style={{ display: "grid", gap: "15px" }}>
            {products.map((p) => (
              // প্রত্যেকটা প্রোডাক্টের জন্য একটা করে রো (Row)
              <div key={p._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", border: "1px solid #ccc", borderRadius: "8px", background: "white" }}>
                
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                  {/* প্রোডাক্টের ছবি */}
                  <div style={{ width: "50px", height: "50px", background: "#eee", borderRadius: "5px", overflow: "hidden" }}>
                    {p.images && p.images.length > 0 ? (
                      <img src={`${API_BASE}/uploads/${p.images[0]}`} alt="product" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ textAlign: "center", fontSize: "10px", color: "gray", marginTop: "15px" }}>No Img</div>
                    )}
                  </div>
                  
                  {/* প্রোডাক্টের তথ্য এবং সেলারের নাম */}
                  <div>
                    <h4 style={{ margin: "0 0 5px 0" }}>{p.title} <span style={{ color: "green", fontSize: "14px" }}>(₹{p.price})</span></h4>
                    <p style={{ margin: "0", fontSize: "12px", color: "gray" }}>👤 Seller: {p.seller?.name || "Unknown"} | 📍 Status: {p.status}</p>
                  </div>
                </div>

                {/* অ্যাডমিন ডিলিট বাটন */}
                <button onClick={() => handleDeleteProduct(p._id)} style={styles.deleteBtn}>
                  Delete Ad
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------
          ট্যাব ২: ইউজার ম্যানেজমেন্ট (Manage Users)
      ------------------------------------------------------- */}
      {activeTab === "users" && (
        <div>
          <h3>All Registered Users</h3>
          <div style={{ display: "grid", gap: "15px" }}>
            {users.map((u) => (
              // প্রত্যেকটা ইউজারের জন্য একটা করে রো (Row)
              <div key={u._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", border: "1px solid #ccc", borderRadius: "8px", background: "#f8f9fa" }}>
                
                {/* ইউজারের বিস্তারিত তথ্য */}
                <div>
                  <h4 style={{ margin: "0 0 5px 0" }}>
                    {u.name} {u.isAdmin && <span style={{ color: "white", background: "#d32f2f", padding: "2px 5px", borderRadius: "3px", fontSize: "12px", marginLeft: "10px" }}>ADMIN</span>}
                  </h4>
                  <p style={{ margin: "0", fontSize: "13px", color: "#555" }}>📧 {u.email} | 📞 {u.phone}</p>
                  <p style={{ margin: "0", fontSize: "13px", color: "#555" }}>📍 Room: {u.roomNo}, Hostel: {u.hostelNo}</p>
                </div>

                {/* ডিলিট বাটন (অ্যাডমিন নিজেকে ডিলিট করতে পারবে না) */}
                {!u.isAdmin && (
                  <button onClick={() => handleDeleteUser(u._id)} style={styles.deleteBtn}>
                    Remove User
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// বারবার ব্যবহার করা সিএসএস স্টাইল
const styles = {
  tabBtn: { padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", transition: "0.3s" },
  deleteBtn: { background: "red", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }
};

export default AdminDashboard;
