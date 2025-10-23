// Login.jsx (Updated)

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Ye aapne provide kiya tha, agar "Login.css" hai toh change kar lein

const Login = ({ goBack }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // --- YAHAN UPDATE KIYA GAYA HAI ---
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", form);

    // Aapke signup logic ke hisab se role 'localStorage' se padh rahe hain
    // Real app mein, ye login API response se aana chahiye
    const role = localStorage.getItem("role") || "User";

    // Role ke hisab se sahi dashboard par redirect karein
    if (role === "Admin") {
      navigate("/admin/dashboard");
    } else if (role === "Researcher") {
      navigate("/researcher/dashboard"); // <-- Researcher ke lie add kiya
    } else if (role === "Guest") {
      navigate("/guest/dashboard"); // <-- Guest ke lie add kiya
    } else {
      // "User" ya koi aur default role
      navigate("/user/dashboard");
    }
  };
  // --- UPDATE ENDS HERE ---

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h1 className="brand">🌱 AgriSmart</h1>
        <p className="subtitle">Sign in</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-primary">Login</button>
        </form>

        {/* goBack prop
         agar Home.jsx se aa raha hai tabhi dikhega */}
        {goBack && (
          <button type="button" onClick={goBack} className="btn-secondary">
            ← Back to Home
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;