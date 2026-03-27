import React, { useState } from "react";

const API_BASE = "http://localhost:5000";

function UploadProduct({ token }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState("Negotiable");
  const [images, setImages] = useState([null, null, null, null, null, null]);

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const selectedImages = images.filter((img) => img !== null);

    if (selectedImages.length === 0) {
      alert("Error: At least 1 image is required!"); 
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("negotiable", negotiable);
    
    // শুধু ছবিগুলো যোগ করা হচ্ছে
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("images", selectedImages[i]);
    }

    const res = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    
    const data = await res.json();
    alert(data.message || data.error);
    if(res.ok) window.location.reload();
  };

  return (
    <div className="card box-green" style={{ background: "#eef9ee", padding: "15px" }}>
      <h3>📤 Post a New Ad</h3>
      <form onSubmit={handleUpload}>
        <input type="text" placeholder="Product Title *" onChange={(e) => setTitle(e.target.value)} required />
        <input type="number" placeholder="Price (₹) *" onChange={(e) => setPrice(e.target.value)} required />
        
        <select onChange={(e) => setNegotiable(e.target.value)} style={{ width:"100%", padding:"10px", margin:"8px 0" }}>
          <option value="Negotiable">Price is Negotiable</option>
          <option value="Not Negotiable">Price is Fixed</option>
        </select>

        <p><strong>Upload Images (Max 6):</strong></p>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ marginBottom: "5px" }}>
             <label style={{ fontSize: "14px" }}>Image {i + 1} {i === 0 ? <span style={{color:"red"}}>*</span> : ""}: </label>
             <input type="file" accept="image/*" onChange={(e) => handleImageChange(i, e.target.files[0])} />
          </div>
        ))}
        
        <button type="submit" style={{ background: "#28a745", color: "white", padding: "10px", width: "100%", marginTop: "10px" }}>
          Upload Product
        </button>
      </form>
    </div>
  );
}

export default UploadProduct;