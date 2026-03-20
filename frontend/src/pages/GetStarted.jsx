import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import "./GetStarted.css";

const GetStarted = () => {
  const [show, setShow] = useState(""); // "signup" or "login"
  const navigate = useNavigate();

  return (
    <div className="getstarted-wrapper">
    <div className="getstarted-container">
      {!show && (
        <>
          <h1>Welcome!</h1>
          <p>Please choose an option to continue</p>

          {/* Signup & Login buttons */}
          <div className="choice-buttons">
            <button onClick={() => setShow("signup")} className="signup-btn">
              Signup
            </button>
            <button onClick={() => setShow("login")} className="login-btn">
              Login
            </button>
          </div>

          {/* Already have account */}
          <div className="already-text">
            Already have an account?{" "}
            <span onClick={() => setShow("login")}>Login</span>
          </div>

          {/* Back to Home */}
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </>
      )}

      {show === "signup" && <Signup goBack={() => setShow("")} />}
      {show === "login" && <Login goBack={() => setShow("")} />}
    </div>
    </div>
  );
};

export default GetStarted;
