import React, { useState } from "react";
import "./Login.css"; // same CSS use karlo
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Reset link sent to your email!");
      } else {
        alert(data.error || "Something went wrong!");
      }
    } catch (error) {
      alert("Server error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="logo">
          <span className="logo-icon">🌱</span>
          <span className="logo-text">AgriSmart</span>
        </div>

        <h2 className="login-title">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="signup-text">
          Back to Login?{" "}
          <Link to="/login" className="signup-link">
            Click here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;