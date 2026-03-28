import React, { useState, useEffect, useCallback } from "react";

const API_BASE = "https://campus-marketplace-aye7.onrender.com";

function MyProducts({ token }) {
  // ---------------------------------------------------------
  // ১. States (স্টেটসমূহ)
  // ---------------------------------------------------------
  const [products, setProducts] = useState([]); // ইউজারের নিজের প্রোডাক্টের লিস্ট
  const [loading, setLoading] = useState(false); // ফর্ম সাবমিট করার সময় বাটনে লোডিং দেখানোর জন্য
  const [editingId, setEditingId] = useState(null); // কোনো প্রোডাক্ট এডিট করতে চাইলে তার ID এখানে জমা হবে

  // আপলোড/এডিট ফর্মের ডেটা ধরে রাখার জন্য স্টেট
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    isNegotiable: "Negotiable",
    status: "Available",
  });
  
  // ৪টি ছবির স্লটের জন্য অ্যারে [প্রথম, দ্বিতীয়, তৃতীয়, চতুর্থ]
  const [images, setImages] = useState([null, null, null, null]); 

  // ---------------------------------------------------------
  // ২. API কল (নিজের প্রোডাক্ট নিয়ে আসা) - useCallback ব্যবহার করে ফিক্স করা হয়েছে
  // ---------------------------------------------------------
  const fetchMyProducts = useCallback(async () => {
    try {
      // ব্যাকএন্ডে রিকোয়েস্ট করা হচ্ছে, সাথে ইউজারের Token পাঠানো হচ্ছে
      const res = await fetch(`${API_BASE}/api/products/my-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  }, [token]); // token ডিপেন্ডেন্সি হিসেবে দেওয়া হলো

  // পেজ লোড হলে বা টোকেন চেঞ্জ হলে প্রোডাক্টগুলো আনবে  
  useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]); // fetchMyProducts ডিপেন্ডেন্সি হিসেবে দেওয়া হলো

  // ---------------------------------------------------------
  // ৩. হ্যান্ডলার ফাংশনসমূহ (Input Handlers)
  // ---------------------------------------------------------
  
  // টেক্সটবক্সে কিছু লিখলে স্টেটে আপডেট করার ফাংশন
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ছবি সিলেক্ট করলে নির্দিষ্ট ইনডেক্সে (০-৩) ছবিটা সেট করার ফাংশন
  const handleImageChange = (index, e) => {
    const newImages = [...images];
    newImages[index] = e.target.files[0]; 
    setImages(newImages);
  };

  // ---------------------------------------------------------
  // ৪. এডিট এবং ডিলিট লজিক
  // ---------------------------------------------------------
  
  // 'Edit' বাটনে ক্লিক করলে এই ফাংশন চলবে
  const handleEditClick = (product) => {
    setEditingId(product._id); // এডিট মোড অন হলো
    
    // যে প্রোডাক্টে ক্লিক করা হয়েছে, তার পুরনো ডেটাগুলো ফর্মে বসিয়ে দেওয়া হলো
    setFormData({
      title: product.title,
      description: product.description || "", 
      price: product.price,
      isNegotiable: product.isNegotiable,
      status: product.status,
    });
    setImages([null, null, null, null]); // ছবির স্লটগুলো রিসেট করলাম
    window.scrollTo({ top: 0, behavior: "smooth" }); // পেজের উপরে স্ক্রোল করে ফর্মে নিয়ে যাওয়া হলো
  };

  // এডিট ক্যানসেল করার ফাংশন (ফর্ম খালি করে দেওয়া)
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", price: "", isNegotiable: "Negotiable", status: "Available" });
    setImages([null, null, null, null]);
  };

  // ---------------------------------------------------------
  // ৫. ফর্ম সাবমিট করা (POST বা PUT)
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault(); // পেজ রিলোড হওয়া আটকালাম
    
    // নতুন আপলোডের সময় প্রথম ছবিটা দেওয়া বাধ্যতামূলক
    if (!editingId && !images[0]) return alert("Please upload the Main Photo! (Slot 1)");

    setLoading(true);
    
    // যেহেতু ছবি আছে, তাই সাধারণ JSON-এর বদলে FormData ব্যবহার করতে হবে
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description); 
    data.append("price", formData.price);
    data.append("isNegotiable", formData.isNegotiable);
    data.append("status", formData.status);
    
    // যে স্লটগুলোতে ছবি সিলেক্ট করা হয়েছে, সেগুলো FormData-তে যোগ করা হচ্ছে
    images.forEach((img) => {
      if (img) data.append("images", img);
    });

    try {
      // যদি editingId থাকে তারমানে আপডেট (PUT), না থাকলে নতুন আপলোড (POST)
      const url = editingId ? `${API_BASE}/api/products/${editingId}` : `${API_BASE}/api/products`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: data, // FormData পাঠানো হলো
      });

      if (res.ok) {
        alert(editingId ? "Ad Updated Successfully! ✏️" : "Product Uploaded Successfully! 🚀");
        handleCancelEdit(); // ফর্ম রিসেট
        fetchMyProducts();  // আপডেট হওয়া লিস্ট আবার লোড করা হলো
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to save");
      }
    } catch (err) {
      alert("Server error during save.");
    }
    setLoading(false);
  };

  // ডিলিট করার লজিক
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Product deleted!");
        fetchMyProducts(); // লিস্ট আপডেট
      }
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // ---------------------------------------------------------
  // ৬. UI রেন্ডার (HTML/JSX অংশ)
  // ---------------------------------------------------------
  return (
    <div style={{ maxWidth: "800px", margin: "30px auto", padding: "20px" }}>
      
      {/* হেডিং: এডিট মোডে থাকলে একরকম, নরমাল থাকলে অন্যরকম */}
      <h2 style={{ color: editingId ? "#d35400" : "#0056b3" }}>
        {editingId ? "Update Your Ad ✏️" : "Sell a New Item 📦"}
      </h2>
      
      {/* --- আপলোড/এডিট ফর্ম --- */}
      <form onSubmit={handleSubmit} style={{ background: editingId ? "#fff3e0" : "#f9f9f9", padding: "20px", borderRadius: "8px", border: editingId ? "2px solid #ff9800" : "1px solid #ddd", marginBottom: "30px", transition: "0.3s" }}>
        
        {/* Title Input */}
        <input type="text" name="title" placeholder="Product Title" value={formData.title} onChange={handleChange} required style={styles.input} />
        
        {/* Description Input */}
        <textarea name="description" placeholder="Product Description (Optional)" value={formData.description} onChange={handleChange} style={{ ...styles.input, minHeight: "80px", resize: "vertical" }} />
        
        {/* Price & Negotiable Dropdown (পাশাপাশি দেখানোর জন্য Grid) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
          <input type="number" name="price" placeholder="Price in ₹" value={formData.price} onChange={handleChange} required style={{ ...styles.input, marginBottom: "0" }} />
          <select name="isNegotiable" value={formData.isNegotiable} onChange={handleChange} style={{ ...styles.input, marginBottom: "0" }}>
            <option value="Negotiable">🤝 Negotiable</option>
            <option value="🔒 Fixed Price">🔒 Fixed Price</option>
          </select>
        </div>

        {/* Status Dropdown (Available / Sold) */}
        <select name="status" value={formData.status} onChange={handleChange} style={styles.input}>
          <option value="Available">✅ Available for Sale</option>
          <option value="Sold">❌ Already Sold</option>
        </select>
        
        {/* ৪টি ছবির স্লট তৈরি করা হচ্ছে Array Map দিয়ে */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
          {[0, 1, 2, 3].map((index) => (
            <div key={index} style={{ padding: "10px", border: "1px dashed #ccc", borderRadius: "8px", background: "white" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "gray", fontSize: "14px" }}>
                {index === 0 && !editingId ? "📸 Main Photo *" : `🖼️ Photo ${index + 1}`}
              </label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(index, e)} required={!editingId && index === 0} style={{ fontSize: "12px" }} />
            </div>
          ))}
        </div>

        {/* সাবমিট এবং ক্যানসেল বাটন */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" disabled={loading} style={{ ...styles.button, background: editingId ? "#ff9800" : "#28a745" }}>
            {loading ? "Processing..." : editingId ? "Update Ad" : "Post Ad"}
          </button>
          
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ ...styles.button, background: "#6c757d", width: "50%" }}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* --- ইউজারের নিজের অ্যাডগুলোর লিস্ট দেখানোর অংশ --- */}
      <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>My Active Ads</h3>
      
      {products.length === 0 ? (
        <p style={{ color: "gray" }}>You haven't posted any ads yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          
          {products.map((p) => (
            // যদি প্রোডাক্ট বিক্রি হয়ে যায় (Sold), তাহলে ব্যাকগ্রাউন্ড হালকা লাল হবে
            <div key={p._id} style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", background: p.status === "Sold" ? "#ffe6e6" : "white" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px" }}>
                
                {/* একাধিক ছবির ছোট গ্যালারি (Thumbnail Slider) */}
                <div style={{ display: "flex", gap: "5px", overflowX: "auto", maxWidth: "250px" }}>
                  {p.images && p.images.length > 0 ? (
                    p.images.map((img, i) => (
                      <img key={i} src={img} alt="thumbnail" style={{ width: "160px", height: "160px", objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }} />
                    ))
                  ) : (
                    <div style={{ padding: "10px", textAlign: "center", fontSize: "10px", color: "gray", width: "60px", height: "60px", background: "#eee" }}>No Image</div>
                  )}
                </div>

                {/* প্রোডাক্টের সাধারণ তথ্য */}
                <div style={{ flex: 1, minWidth: "150px" }}>
                  <h4 style={{ margin: "0 0 5px 0" }}>
                    {p.title} 
                    {p.status === "Sold" && <span style={{ color: "red", fontSize: "12px", marginLeft: "10px", background: "white", padding: "2px 5px", borderRadius: "3px", border: "1px solid red" }}>(SOLD)</span>}
                  </h4>
                  <p style={{ margin: "0 0 5px 0", color: "green", fontWeight: "bold" }}>
                    ₹{p.price} <span style={{fontSize: "12px", color: "gray", fontWeight: "normal"}}>({p.isNegotiable})</span>
                  </p>
                  
                  {/* ডেসক্রিপশনের প্রথম ৪০টা অক্ষর দেখাবো */}
                  {p.description && (
                    <p style={{ margin: "0", fontSize: "12px", color: "gray" }}>
                      {p.description.length > 40 ? p.description.substring(0, 40) + "..." : p.description}
                    </p>
                  )}
                </div>

                {/* এডিট এবং ডিলিট বাটন */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => handleEditClick(p)} style={{ background: "#ffc107", color: "black", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Edit</button>
                  <button onClick={() => handleDelete(p._id)} style={{ background: "red", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Delete</button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// সিএসএস স্টাইলগুলো একটা অবজেক্টের মধ্যে রাখা হয়েছে বারবার না লেখার জন্য
const styles = {
  input: { width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box", fontSize: "15px", fontFamily: "inherit" },
  button: { width: "100%", padding: "14px", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }
};

export default MyProducts;
