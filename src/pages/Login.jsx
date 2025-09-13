import React, { useState } from "react";
import "./Home.css"; // ya apna auth css import kar

const Login = ({ goBack }) => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", form);
    alert("Login submitted! Check console.");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h1 className="brand">🌱 AgriSmart</h1>
        <p className="subtitle">Sign in to access your agricultural dashboard</p>

        <h2 className="form-title">Login</h2>
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

          {/* 🔙 Back to Home at bottom */}
          <button type="button" onClick={goBack} className="btn-secondary">
            ← Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
