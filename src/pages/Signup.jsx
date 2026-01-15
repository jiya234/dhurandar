import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = ({ goBack }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "User",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};

    // Name: only letters + spaces
    if (!/^[A-Za-z ]+$/.test(form.fullName)) {
      newErrors.fullName = "Name should contain only alphabets";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password:
    // Minimum 8 characters, at least 1 letter and 1 number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      newErrors.password =
        "Password must be at least 8 characters and include letters & numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    console.log("Signup data:", form);

    localStorage.setItem("role", form.role);

    if (form.role === "Admin") navigate("/admin/dashboard");
    else if (form.role === "User") navigate("/user/dashboard");
    else if (form.role === "Researcher") navigate("/researcher/dashboard");
  };

  const roleOptions = [
    { role: "Admin", icon: "⚙️" },
    { role: "User", icon: "👤" },
    { role: "Researcher", icon: "🔬" },
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
          {errors.fullName && <p className="error">{errors.fullName}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}

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
