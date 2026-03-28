import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ setToken, setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("https://campus-marketplace-aye7.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      setToken(data.token);
      setRole(data.role);
      navigate("/");
    } else {
      alert(data.error);
    }
  };

  return (
    <div style={{ maxWidth: "350px", margin: "100px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="College Email" onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p><Link to="/forgot-password">Forgot Password?</Link></p>
      <p>New here? <Link to="/signup">Create Account</Link></p>
    </div>
  );
}

const styles = {
  input: { width: "100%", padding: "10px", margin: "10px 0", borderRadius: "5px", border: "1px solid #ccc" },
  button: { width: "100%", padding: "10px", background: "#0056b3", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }
};

export default Login;
