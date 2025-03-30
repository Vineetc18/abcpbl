import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import HeroSection from "./Pages/Homepage/Home";
import Update from './Pages/Updatepage/Update';
import Login from './Components/Login/Login';
import Register from './Components/Register/Regiser';
import Volunteer from "./Pages/Volunteerpage/Volunteer";
import Dashboard from "./Components/Dashboard/Dashboard";
import CompostDashboard from "./Components/Dashboard/Rdashboard";


function App() {
  const location = useLocation(); // Get the current route

  return (
    <div>
      {/* Hide Navbar on Login and Register pages */}
      {!(location.pathname === "/login" || location.pathname === "/Register") && <Navbar />}
      
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/update" element={<Update />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Volunteer" element={<Volunteer />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Rdashboard" element={<CompostDashboard />} />
      </Routes>
    </div>
  );
}

export default App;



