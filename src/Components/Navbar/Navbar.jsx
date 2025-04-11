import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status when the component mounts
  useEffect(() => {
    const user = localStorage.getItem("isLoggedIn");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    // Only navigate to login page, don't set logged in yet
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Remove login status
    setIsLoggedIn(false);
    navigate("/"); // Redirect to Home after logout
  };

  const handleUpdateClick = () => {
    if (isLoggedIn) {
      navigate("/update");
    } else {
      // Set a message in localStorage to display on login page
      localStorage.setItem("loginMessage", "Please log in to update food donations");
      navigate("/login");
    }
  };

  const handleVolunteerClick = () => {
    if (isLoggedIn) {
      navigate("/volunteer");
    } else {
      // Set a message in localStorage to display on login page
      localStorage.setItem("loginMessage", "Please log in to access volunteer features");
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <span>💚 WasteNot Connect</span>
      </div>
      <ul className="nav-links">
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={handleUpdateClick}>Update</li>
        <li onClick={handleVolunteerClick}>Volunteer</li>
        <li onClick={() => navigate("/about")}>About</li>
        <li onClick={() => navigate("/impact")}>Impact</li>
        <li onClick={() => isLoggedIn ? navigate("/dashboard") : navigate("/login")}>Dashboard</li>
      </ul>

      {isLoggedIn ? (
        <div className="auth-section">
          <span className="welcome-text">👋 Hello!</span>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      ) : (
        <button className="login-btn" onClick={handleLogin}>
          <FaSignInAlt /> Login
        </button>
      )}
    </nav>
  );
};

export default Navbar;
