import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";  
import Land from "./pages/LandingPage.jsx";   // ✅ Auth import kiya

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/get-started" element={<Auth />} />  
        <Route path="/landingpage" element={<Land />} />  {/* ✅ direct Auth page */}
      </Routes>
    </Router>
  );
}

export default App;
