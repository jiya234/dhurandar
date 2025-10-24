import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = ({ goBack }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "User", // default role
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup data:", form);

    // Store role locally
    localStorage.setItem("role", form.role);

    // Role-based redirect
    if (form.role === "Admin") navigate("/admin/dashboard");
    else if (form.role === "User") navigate("/user/dashboard");
    else if (form.role === "Researcher") navigate("/researcher/dashboard");
    else if (form.role === "Guest") navigate("/guest/dashboard");
  };

  const roleOptions = [
    { role: "Admin", icon: "⚙️" },
    { role: "User", icon: "👤" },
    { role: "Researcher", icon: "🔬" },
    { role: "Guest", icon: "🌍" },
  ];

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h1 className="brand">🌱 AgriSmart</h1>
        <p className="subtitle">Create your account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
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

          <label className="role-label">Choose Role</label>
          <div className="role-options">
            {roleOptions.map((item) => (
              <label
                key={item.role}
                className={`role-card ${
                  form.role === item.role ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={item.role}
                  checked={form.role === item.role}
                  onChange={handleChange}
                />
                <span className="role-icon">{item.icon}</span>
                <span>{item.role}</span>
              </label>
            ))}
          </div>

          <button type="submit" className="btn-primary">Sign Up</button>
        </form>

        <button type="button" onClick={goBack} className="btn-secondary">
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default Signup;
