import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
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
    if (!/^[A-Za-z ]+$/.test(form.fullName)) newErrors.fullName = "Name should contain alphabets only";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) newErrors.email = "Enter a valid email";
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(form.password)) newErrors.password = "Min 8 chars, must include letters & numbers";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    localStorage.setItem("role", form.role);
    navigate(form.role === "Admin" ? "/admin/dashboard" : form.role === "Researcher" ? "/researcher/dashboard" : "/user/dashboard");
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <div className="brand-section">
          <h1 className="brand-logo">🌱 AgriSmart</h1>
          <p className="brand-tagline">Join the future of precision farming</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
            {errors.fullName && <p className="error-msg">{errors.fullName}</p>}
          </div>

          <div className="input-group">
            <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>

          <div className="input-group">
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            {errors.password && <p className="error-msg">{errors.password}</p>}
          </div>

          <div className="role-selector">
            <p className="section-title">Select Your Role</p>
            <div className="role-grid">
              {["Admin", "User", "Researcher"].map((r) => (
                <label key={r} className={`role-item ${form.role === r ? "selected" : ""}`}>
                  <input type="radio" name="role" value={r} checked={form.role === r} onChange={handleChange} />
                  <span className="role-name">{r}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-signup-premium">Create Account</button>
        </form>

        {/* --- IDHAR CHANGE KIYA HAI BAS --- */}
        <div className="card-footer">
          <p>
            Already a member? <Link to="/login" className="login-link-alt">Login Here</Link>
          </p>
          <button onClick={() => navigate("/")} className="btn-ghost">← Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;