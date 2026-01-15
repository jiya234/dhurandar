import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; 

const Login = ({ goBack }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

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

    console.log("Login data:", form);

    const role = localStorage.getItem("role") || "User";

    if (role === "Admin") navigate("/admin/dashboard");
    else if (role === "Researcher") navigate("/researcher/dashboard");
    else navigate("/user/dashboard");
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

          <button type="submit" className="btn-primary">Login</button>
        </form>

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
