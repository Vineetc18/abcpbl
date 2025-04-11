import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import HeroSection from "./Pages/Homepage/Home";
import Update from './Pages/Updatepage/Update';
import Login from './Components/Login/Login';
import Register from './Components/Register/Regiser';
import Volunteer from "./Pages/Volunteerpage/Volunteer";
import Dashboard from "./Components/Dashboard/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import VolunteerProfile from "./Components/VolunteerProfile/VolunteerProfile";

function App() {
  const location = useLocation(); // Get the current route

  return (
    <div>
      {/* Hide Navbar on Login and Register pages */}
      {!(location.pathname === "/login" || location.pathname === "/register") && <Navbar />}
      
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/update" element={
          <ProtectedRoute>
            <Update />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/volunteer" element={
          <ProtectedRoute>
            <Volunteer />
          </ProtectedRoute>
        } />
        <Route path="/volunteer-profile" element={
          <ProtectedRoute>
            <VolunteerProfile />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<HeroSection />} />
        <Route path="/impact" element={<HeroSection />} />
      </Routes>
    </div>
  );
}

export default App;



