// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";

// Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserDashboard from "./pages/admin/UserDashboard.jsx";
import ResearcherDashboard from "./pages/admin/ResearcherDashboard.jsx"; // <-- Bas ye
import GuestDashboard from "./pages/admin/GuestDashboard.jsx";

// Admin nested pages
// ... (aapke admin imports) ...

// ResearcherHome aur MapView ke imports YAHAN SE HATA DEIN

function App() {
  return (
    <Router>
      <Routes>
        {/* ... (aapke home, signup, login, admin routes) ... */}

        {/* Other dashboards */}
        <Route path="/user/dashboard/*" element={<UserDashboard />} />
        
        {/* Researcher route ko aisa rakhein (simple) */}
        <Route path="/researcher/dashboard/*" element={<ResearcherDashboard />} /> 
        
        <Route path="/guest/dashboard/*" element={<GuestDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;