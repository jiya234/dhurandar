import React, { useState } from "react";
import "./Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("user");

  return (
    <div className="auth-wrapper">
      <h1 className="auth-title">🌱 Welcome to AgriSmart</h1>

      <div className="auth-toggle">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
        >
          🔑 Login
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
        >
          ✨ Signup
        </button>
      </div>

      <div className="auth-box">
        <form className="auth-form">
          {!isLogin && <input type="text" placeholder="Full Name" required />}
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          {!isLogin && (
            <div className="role-options">
              <div
                className={`role-card ${role === "researcher" ? "active" : ""}`}
                onClick={() => setRole("researcher")}
              >
                👨‍🔬 Researcher
              </div>
              <div
                className={`role-card ${role === "admin" ? "active" : ""}`}
                onClick={() => setRole("admin")}
              >
                👑 Admin
              </div>
              <div
                className={`role-card ${role === "user" ? "active" : ""}`}
                onClick={() => setRole("user")}
              >
                👤 User
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary">
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
