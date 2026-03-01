import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      console.log("Logging in as:", role);
      alert("Login successful!");
      navigate("/landingpage"); // Navigate to LandingPage
    } else {
      console.log("Signing up as:", role);
      alert("Signup successful!");
      setIsLogin(true); // Switch to login after signup
    }
  };

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
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && <input type="text" placeholder="Full Name" required />}
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          {!isLogin && (
            <div className="role-options">
              {["researcher", "admin", "user"].map((r) => (
                <div
                  key={r}
                  className={`role-card ${role === r ? "active" : ""}`}
                  onClick={() => setRole(r)}
                >
                  {r === "researcher" && "👨‍🔬 Researcher"}
                  {r === "admin" && "👑 Admin"}
                  {r === "user" && "👤 User"}
                </div>
              ))}
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
