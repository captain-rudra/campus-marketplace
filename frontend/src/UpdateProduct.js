import React, { useState } from "react";

const API_BASE = "https://campus-marketplace-aye7.onrender.com";

function UpdateProduct({ token }) {
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  
  const [images, setImages] = useState([null, null, null, null, null, null]);

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!productId) {
      alert("Product ID is mandatory to update!");
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId);
    
    if (price) formData.append("price", price);
    if (phone) formData.append("phone", phone);
    if (status) formData.append("status", status); // e.g., "SOLD"

    const selectedImages = images.filter((img) => img !== null);
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("images", selectedImages[i]);
    }

    const res = await fetch(`${API_BASE}/api/update`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) window.location.reload();
  };

  return (
    <div className="card box-orange" style={{ background: "#fff4e6", padding: "15px", marginBottom: "20px" }}>
      <h3>🔄 Update Existing Product</h3>
      <p style={{ fontSize: "12px", color: "gray" }}>Copy the Product ID from the list below to update it.</p>
      
      <form onSubmit={handleUpdate}>
        <input type="text" placeholder="Paste Product ID here (Mandatory)" onChange={(e) => setProductId(e.target.value)} required />
        <input type="number" placeholder="New Price (Optional)" onChange={(e) => setPrice(e.target.value)} />
        <input type="text" placeholder="New Phone (Optional)" onChange={(e) => setPhone(e.target.value)} />
        <input type="text" placeholder="Status (e.g. SOLD) (Optional)" onChange={(e) => setStatus(e.target.value)} />

        <div style={{ marginTop: "15px" }}>
          <p><strong>Update Images (Will replace old ones):</strong></p>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              <label>New Image {index + 1}: </label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageChange(index, e.target.files[0])} 
              />
            </div>
          ))}
        </div>
        
        <button type="submit" style={{ background: "#ff9800", color: "white", padding: "10px", width: "100%", marginTop: "10px" }}>
          Update Product
        </button>
      </form>
    </div>
  );
}

export default UpdateProduct;
