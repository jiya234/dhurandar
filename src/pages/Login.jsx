import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = localStorage.getItem("role") || "User";

    if (role === "Admin") navigate("/admin/dashboard");
    else if (role === "Researcher") navigate("/researcher/dashboard");
    else navigate("/user/dashboard");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="logo">
          <span className="logo-icon">🌱</span>
          <span className="logo-text">AgriSmart</span>
        </div>

        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span className="eye-icon">👁</span>
            </div>
          </div>

          <div className="forgot-password">Forgot password?</div>

          <button type="submit" className="btn-login">
            Login
          </button>
        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;