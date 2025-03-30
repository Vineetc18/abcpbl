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
    localStorage.setItem("isLoggedIn", "true"); // Save login status
    setIsLoggedIn(true);
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Remove login status
    setIsLoggedIn(false);
    navigate("/"); // Redirect to Home after logout
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <span>💚 WasteNot Connect</span>
      </div>
      <ul className="nav-links">
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={() => navigate("/update")}>Update</li>
        <li onClick={() => navigate("/volunteer")}>Volunteer</li>
        <li onClick={() => navigate("/about")}>About</li>
        <li onClick={() => navigate("/impact")}>Impact</li>
        <li onClick={() => navigate("/Dashboard")}>Dashboard</li>
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
