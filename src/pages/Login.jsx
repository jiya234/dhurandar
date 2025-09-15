import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Login = ({ goBack }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", form);

    // Read role stored during signup
    const role = localStorage.getItem("role") || "User";

    if (role === "Admin") navigate("/admin/dashboard");
    else navigate("/user/dashboard"); // User goes to LandingPage
  };

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

        <button type="button" onClick={goBack} className="btn-secondary">
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default Login;
