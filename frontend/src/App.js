import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductList from "./ProductList";
import Signup from "./Signup";
import Login from "./Login";
import MyProducts from "./MyProducts";
import UserProfile from "./UserProfile";
import ForgotPassword from "./ForgotPassword";
import AdminDashboard from "./AdminDashboard";


function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "user");

  const logout = () => {
    localStorage.clear();
    setToken("");
    window.location.href = "/login";
  };

  return (
    <Router>
      <nav style={{ padding: "15px", background: "#0056b3", color: "white", display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "white" }}>Home</Link>
        {!token ? (
          <>
            <Link to="/signup" style={{ color: "white" }}>Signup</Link>
            <Link to="/login" style={{ color: "white" }}>Login</Link>
          </>
        ) : (
          <>
            <Link to="/my-products" style={{ color: "white" }}>My Ads</Link>
            <Link to="/profile" style={{ color: "white" }}>Profile</Link>
            {role === "admin" && <Link to="/admin" style={{ color: "gold", fontWeight: "bold" }}>🛡️ Admin</Link>}
            <button onClick={logout} style={{ background: "red", color: "white", border: "none", cursor: "pointer" }}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/my-products" element={<MyProducts token={token} />} />
        <Route path="/profile" element={<UserProfile token={token} setToken={setToken} />} />
        <Route path="/admin" element={<AdminDashboard token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;


// import React, { useState } from "react";
// import Auth from "./Auth";
// import UserProfile from "./UserProfile";
// import UploadProduct from "./UploadProduct";
// import MyProducts from "./MyProducts";
// import ProductList from "./ProductList"; // সবার প্রোডাক্ট দেখার জন্য
// import "./App.css";

// function App() {
//   // ইউজারের টোকেন চেক করা হচ্ছে
//   const [token, setToken] = useState(localStorage.getItem("token") || "");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setToken(""); 
//   };

//   return (
//     <div className="container" style={{ maxWidth: "1000px", margin: "auto", padding: "20px", fontFamily: "sans-serif" }}>
      
//       {/* হেডার সেকশন */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #ddd", paddingBottom: "10px", marginBottom: "20px" }}>
//         <h1 style={{ color: "#0056b3" }}>🎓 IIIT-A Marketplace</h1>
//         {token && (
//           <button onClick={handleLogout} style={{ background: "#dc3545", color: "white", padding: "10px 15px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
//             Logout
//           </button>
//         )}
//       </div>

//       {/* লগইন করা না থাকলে শুধু Auth (লগইন/সাইনআপ) এবং প্রোডাক্ট লিস্ট দেখাবে */}
//       {!token ? (
//         <div>
//           <Auth setToken={setToken} />
//           <hr style={{ margin: "40px 0", border: "1px solid #eee" }}/>
//           <ProductList /> {/* লগইন ছাড়াও যেন সবাই প্রোডাক্ট দেখতে পারে */}
//         </div>
//       ) : (
//         /* লগইন করা থাকলে ড্যাশবোর্ড দেখাবে */
//         <div>
//           {/* গ্রিড লেআউট: স্ক্রিনকে ২ ভাগে ভাগ করা হয়েছে */}
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "40px" }}>
            
//             {/* বাম দিক: ইউজারের প্রোফাইল আপডেট এবং নতুন প্রোডাক্ট আপলোড করার ফর্ম */}
//             <div>
//               <UserProfile token={token} setToken={setToken} />
//               <div style={{ marginTop: "20px" }}>
//                 <UploadProduct token={token} />
//               </div>
//             </div>

//             {/* ডান দিক: ইউজারের নিজের আপলোড করা প্রোডাক্ট ম্যানেজ (Update/Delete) করার জায়গা */}
//             <div>
//               <MyProducts token={token} />
//             </div>

//           </div>

//           <hr style={{ margin: "40px 0", border: "1px solid #eee" }}/>
          
//           {/* নিচে সবার আপলোড করা সব প্রোডাক্ট দেখাবে */}
//           <ProductList />
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;