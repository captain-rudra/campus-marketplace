import React, { useState, useEffect } from "react";

// ব্যাকএন্ডের অ্যাড্রেস (লোকালহোস্ট)
const API_BASE = "https://campus-marketplace-aye7.onrender.com";

function ProductList() {
  // ---------------------------------------------------------
  // ১. State (স্টেট) ডিক্লেয়ারেশন
  // ---------------------------------------------------------
  const [products, setProducts] = useState([]); // সব প্রোডাক্ট এই অ্যারেতে জমা হবে
  const [loading, setLoading] = useState(true); // ডেটা লোড হওয়ার সময় 'Loading' দেখানোর জন্য

  // ---------------------------------------------------------
  // ২. ডেটা ফেচিং (Data Fetching)
  // ---------------------------------------------------------
  // পেজটা যখন প্রথমবার ওপেন হবে, তখন এই useEffect কাজ করবে
  useEffect(() => {
    fetch(`${API_BASE}/api/products`) // ব্যাকএন্ডের রাউটে রিকোয়েস্ট পাঠানো হচ্ছে
      .then((res) => res.json()) // রেসপন্সটাকে JSON-এ কনভার্ট করা হচ্ছে
      .then((data) => {
        setProducts(data); // ডাটাবেস থেকে পাওয়া প্রোডাক্টগুলো স্টেটে সেভ করা হলো
        setLoading(false); // লোডিং শেষ, তাই false করে দিলাম
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false); // এরর আসলেও লোডিং বন্ধ করে দিতে হবে
      });
  }, []);

  // ---------------------------------------------------------
  // ৩. লোডিং UI
  // ---------------------------------------------------------
  // ডেটা আসতে সময় লাগলে স্ক্রিনে এটা দেখাবে
  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px", color: "#555" }}>Loading products... ⏳</h2>;
  }

  // ---------------------------------------------------------
  // ৪. মূল UI (ইউজার ইন্টারফেস) রেন্ডারিং
  // ---------------------------------------------------------
  return (
    <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#0056b3", marginBottom: "30px" }}>
        🛒 Campus Marketplace
      </h2>
      
      {/* যদি ডাটাবেসে কোনো প্রোডাক্ট না থাকে */}
      {products.length === 0 ? (
        <p style={{ textAlign: "center", color: "gray", fontSize: "18px" }}>No products available right now.</p>
      ) : (
        
        // প্রোডাক্ট দেখানোর গ্রিড (পাশাপাশি কার্ড সাজানোর জন্য)
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
          
          {/* লুপ চালিয়ে প্রত্যেকটা প্রোডাক্টের জন্য একটা করে কার্ড তৈরি করা হচ্ছে */}
          {products.map((p) => (
            <div key={p._id} style={{ border: "1px solid #ddd", borderRadius: "14px", overflow: "hidden", background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", transition: "0.3s" }}>
              
              {/* --- ছবির সেকশন (Image Gallery) --- */}
              {/* display: 'flex' এবং overflowX: 'auto' দিয়ে হরাইজন্টাল স্ক্রোল বা স্লাইডার বানানো হয়েছে */}
              <div style={{ width: "100%", height: "350px", background: "#f8f9fa", display: "flex", overflowX: "auto", scrollSnapType: "x mandatory" }}>
                
                {/* যদি প্রোডাক্টের ছবি থাকে, তাহলে ম্যাপ করে সব ছবি দেখাবে */}
                {p.images && p.images.length > 0 ? (
                  p.images.map((img, index) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`${p.title} ${index + 1}`} 
                      style={{ width: "100%", height: "100%", objectFit: "contain", background: "#fff", flexShrink: 0, scrollSnapAlign: "start" }} 
                    />
                  ))
                ) : (
                  // ছবি না থাকলে এই ডেমো টেক্সট দেখাবে
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "gray", fontStyle: "italic", flexShrink: 0 }}>No Image Available</div>
                )}
              </div>

              {/* --- প্রোডাক্টের বিস্তারিত তথ্য (Details Section) --- */}
              <div style={{ padding: "15px" }}>
                
                {/* প্রোডাক্টের নাম এবং Sold স্ট্যাটাস */}
                <h3 style={{ margin: "0 0 10px 0", color: "#333", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {p.title} 
                  {p.status === "Sold" && (
                    <span style={{ color: "red", fontSize: "30px", border: "1px solid red", padding: "2px 6px", borderRadius: "4px", background: "#ffe6e6" }}>SOLD</span>
                  )}
                </h3>
                
                {/* দাম এবং দরাদরি করা যাবে কি না (Negotiable) */}
                <p style={{ fontSize: "20px", fontWeight: "bold", color: "#28a745", margin: "0 0 10px 0" }}>
                  ₹{p.price} <span style={{ fontSize: "18px", color: "black", fontWeight: "bold" }}>({p.isNegotiable || "Negotiable"})</span>
                </p>

                {/* ডেসক্রিপশন (যদি ইউজার দিয়ে থাকে তবেই এই বক্সটা রেন্ডার হবে) */}
                {p.description && (
                  <div style={{ background: "#f9f9f9", padding: "10px", borderRadius: "5px", borderLeft: "4px solid #0056b3", marginBottom: "15px" }}>
                    <p style={{ margin: "0", fontSize: "14px", color: "#555", lineHeight: "1.5" }}>
                      {p.description}
                    </p>
                  </div>
                )}

                {/* সেলারের তথ্য (নাম, ইমেইল, ফোন, রুম নম্বর) */}
                <div style={{ background: "#eef5ff", padding: "12px", borderRadius: "8px", fontSize: "14px", color: "#333", border: "1px solid #cce5ff" }}>
                  <p style={{ margin: "0 0 6px 0" }}><strong>👤 Seller:</strong> {p.seller?.name || "Unknown User"}</p>
                  <p style={{ margin: "0 0 6px 0" }}><strong>📧 Email:</strong> {p.seller?.email || "Not provided"}</p>
                  <p style={{ margin: "0 0 6px 0" }}><strong>📞 Phone:</strong> {p.seller?.phone}</p>
                  <p style={{ margin: "0" }}><strong>📍 Address:</strong> Room {p.seller?.roomNo}, {p.seller?.hostelNo}</p>
                </div>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default ProductList;



// import React, { useState, useEffect } from "react";

// const API_BASE = "http://localhost:5000";

// function ProductList() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // পেজ লোড হলে সব প্রোডাক্ট ফেচ করবে
//   useEffect(() => {
//     fetch(`${API_BASE}/api/products`)
//       .then((res) => res.json())
//       .then((data) => {
//         setProducts(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching products:", err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <h2 style={{ textAlign: "center", marginTop: "50px", color: "#555" }}>Loading products... ⏳</h2>;
//   }

//   return (
//     <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "20px" }}>
//       <h2 style={{ textAlign: "center", color: "#0056b3", marginBottom: "30px" }}>
//         🛒 Campus Marketplace
//       </h2>
      
//       {products.length === 0 ? (
//         <p style={{ textAlign: "center", color: "gray", fontSize: "18px" }}>No products available right now.</p>
//       ) : (
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
          
//           {products.map((p) => (
//             <div key={p._id} style={{ border: "1px solid #ddd", borderRadius: "10px", overflow: "hidden", background: "white", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", transition: "0.3s" }}>
              
//               {/* 🖼️ Product Image Section */}
//               <div style={{ width: "100%", height: "420px", background: "#f8f9fa" }}>
//                 {p.images && p.images.length > 0 ? (
//                   <img src={`${API_BASE}/uploads/${p.images[0]}`} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                 ) : (
//                   <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "gray", fontStyle: "italic" }}>No Image Available</div>
//                 )}
//               </div>

//               {/* 📝 Product Details Section */}
//               <div style={{ padding: "15px" }}>
                
//                 {/* Title & Status */}
//                 <h3 style={{ margin: "0 0 10px 0", color: "#333", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   {p.title} 
//                   {p.status === "Sold" && (
//                     <span style={{ color: "red", fontSize: "12px", border: "1px solid red", padding: "2px 6px", borderRadius: "4px", background: "#ffe6e6" }}>SOLD</span>
//                   )}
//                 </h3>
                
//                 {/* Price */}
//                 <p style={{ fontSize: "20px", fontWeight: "bold", color: "#28a745", margin: "0 0 10px 0" }}>
//                   ₹{p.price} <span style={{ fontSize: "13px", color: "gray", fontWeight: "normal" }}>({p.isNegotiable || "Negotiable"})</span>
//                 </p>

//                 {/* 🛑 নতুন: Description Section (যদি থাকে তবেই দেখাবে) */}
//                 {p.description && (
//                   <div style={{ background: "#f9f9f9", padding: "10px", borderRadius: "5px", borderLeft: "4px solid #0056b3", marginBottom: "15px" }}>
//                     <p style={{ margin: "0", fontSize: "14px", color: "#555", lineHeight: "1.5" }}>
//                      <strong>{p.description}</strong> 
//                     </p>
//                   </div>
//                 )}

//                 {/* 🛑 নতুন: Seller Info Section (Email সহ) */}
//                 <div style={{ background: "#eef5ff", padding: "12px", borderRadius: "8px", fontSize: "14px", color: "#333", border: "1px solid #cce5ff" }}>
//                   <p style={{ margin: "0 0 6px 0" }}><strong>👤 Seller:</strong> {p.seller?.name || "Unknown User"}</p>
                  
//                   {/* ইমেইল যুক্ত করা হলো */}
//                   <p style={{ margin: "0 0 6px 0" }}><strong>📧 Email:</strong> {p.seller?.email || "Not provided"}</p>
                  
//                   <p style={{ margin: "0 0 6px 0" }}><strong>📞 Phone:</strong> {p.seller?.phone}</p>
//                   <p style={{ margin: "0" }}><strong>📍 Address:</strong> Room {p.seller?.roomNo}, {p.seller?.hostelNo}</p>
//                 </div>

//               </div>
//             </div>
//           ))}

//         </div>
//       )}
//     </div>
//   );
// }

// export default ProductList;













// // import React, { useEffect, useState } from "react";
// // const API_BASE = "http://localhost:5000";

// // function ProductList() {
// //   const [products, setProducts] = useState([]);

// //   useEffect(() => {
// //     fetch(`${API_BASE}/api/products`)
// //       .then((res) => res.json())
// //       .then((data) => setProducts(data))
// //       .catch((err) => console.log(err));
// //   }, []);

// //   return (
// //     <div className="card box-white" style={{ padding: "20px", background: "#f8f9fa", borderRadius: "10px" }}>
// //       <h2>🛒 Available Products</h2>
// //       {products.length === 0 ? <p>Loading or no products available...</p> : null}
      
// //       {products.map((p) => (
// //         <div key={p._id} className="product-card" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "8px", background: "white" }}>
          
// //           <h3 style={{ color: "#0056b3", margin: "0 0 10px 0" }}>
// //             {p.title} - ₹{p.price} <span style={{fontSize: "14px", color: "gray"}}>({p.negotiable})</span>
// //           </h3>
          
// //           {/* Chobi Dekhanor Jayga */}
// //           <div style={{ display: "flex", gap: "10px", overflowX: "auto", marginBottom: "15px" }}>
// //             {p.images && p.images.map((img, index) => (
// //               <img key={index} src={`${API_BASE}/uploads/${img}`} alt="product" style={{ height: "120px", width: "120px", objectFit: "cover", borderRadius: "5px", border: "1px solid #ccc" }} />
// //             ))}
// //           </div>

// //           {/* Seller er Details */}
// //           <div style={{ background: "#eef9ee", padding: "10px", borderRadius: "5px", fontSize: "14px" }}>
// //             <p style={{ margin: "5px 0" }}><strong>👤 Seller:</strong> {p.seller?.name || "Unknown"} (Roll: {p.seller?.rollNo || "N/A"})</p>
// //             <p style={{ margin: "5px 0" }}><strong>📞 Contact:</strong> {p.seller?.phone || "N/A"}</p>
// //             <p style={{ margin: "5px 0" }}><strong>🏠 Address:</strong> Room {p.seller?.roomNo || "N/A"}, Hostel {p.seller?.hostelNo || "N/A"}</p>
// //             <p style={{ margin: "5px 0" }}>
// //               <strong>🏷️ Status:</strong> <span style={{ color: p.status === 'Available' ? 'green' : 'red', fontWeight: 'bold' }}>{p.status}</span>
// //             </p>
// //           </div>

// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

