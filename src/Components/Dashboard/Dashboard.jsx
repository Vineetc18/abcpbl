import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import { FaBoxOpen } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import { IoSyncOutline } from "react-icons/io5";
import { GiDeadHead } from "react-icons/gi";
import { FiLogOut, FiPlus, FiFilter, FiUserPlus } from "react-icons/fi";
import Foodcard from "./Foodcard"; 
import dairyimg from "../Dashboard/Dashboardassets/dairyimg.png"; 
import Bakeryimg from "../Dashboard/Dashboardassets/bakeryimg.png"; 
import Restaurantimg from "../Dashboard/Dashboardassets/restoimg.png"; 
import vegetablesimg from "../Dashboard/Dashboardassets/veggieimg.png"; 


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("available");
  const navigate = useNavigate(); // Initialize navigation

  const tabs = [
    { id: "available", label: "Available", icon: <FaBoxOpen /> },
    { id: "donations", label: "My Donations", icon: <MdFastfood /> },
    { id: "pickups", label: "My Pickups", icon: <IoSyncOutline /> },
    { id: "expired", label: "Expired", icon: <GiDeadHead /> },
  ];

  const handleTabClick = (tabId) => {
    if (tabId === "expired") {
      navigate("/Rdashboard"); // Navigate when "Expired" tab is clicked
    } else {
      setActiveTab(tabId); // Update active tab for others
    }
  };

  const foodItems = [
    { id: 1, title: "Fresh Vegetables & Fruits", location: "Central Market", description: "Excess produce from weekend farmers market. Includes leafy greens, tomatoes, apples, and berries.", servings: 15, expiry: "Expires in 2 days", badge: "Produce", image: vegetablesimg },
    { id: 2, title: "Bakery Items", location: "Downtown Bakery", description: "Freshly baked bread, croissants, and muffins available for donation. Best before tomorrow.", servings: 10, expiry: "Expires in 1 day", badge: "Bakery", image: Bakeryimg },
    { id: 3, title: "Restaurant Leftovers", location: "City Diner", description: "Excess meals from daily kitchen operations. Includes rice, pasta, and curries.", servings: 20, expiry: "Expires in 5 hours", badge: "Cooked Meal", image: Restaurantimg },
    { id: 4, title: "Dairy Products", location: "Local Dairy Farm", description: "Surplus milk, cheese, and yogurt available. Safe for consumption for another 3 days.", servings: 12, expiry: "Expires in 3 days", badge: "Dairy", image: dairyimg },
  ];

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 w-full">
          <h1 className="text-2xl font-bold pr-180">Dashboard</h1>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-green-700 transition cursor-pointer">
              <FiPlus /> Report Food
            </button>
            <button className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 hover:text-white active:bg-orange-600 transition cursor-pointer">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <p className="font-semibold">Welcome, User!</p>
          <p className="text-gray-600 text-sm">
            Thank you for being part of our food-sharing community. You're making a real difference in reducing food waste and helping those in need.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 w-fit mt-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer
                ${activeTab === tab.id ? "bg-white shadow-md text-green-600 border border-green-500" : "text-gray-600 hover:bg-green-500 hover:text-white active:bg-white-600"}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <h2 className="font-semibold text-lg">
            {activeTab === "available" ? "Available Donations" : "Donations"}
          </h2>

          <div className="flex items-center gap-2 pr-160">
            {activeTab === "available" && <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">{foodItems.length} items</span>}

            <button className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 hover:text-white active:bg-orange-600 transition cursor-pointer">
              <FiFilter /> Filter
            </button>

            <button className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 hover:text-white active:bg-orange-600 transition cursor-pointer">
              <FiUserPlus /> Volunteer
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-8 mt-6">
        {activeTab === "available" && foodItems.map((item) => <Foodcard key={item.id} item={item} />)}

        {activeTab === "donations" && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center w-full">
            <h2 className="text-lg font-semibold">No Donations Yet</h2>
            <p className="text-gray-500 mt-2">You haven't reported any food donations yet. Start making an impact by donating excess food.</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 cursor-pointer">+ Report Food</button>
          </div>
        )}

        {activeTab === "pickups" && (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold">No Pickups Yet</h2>
            <p className="text-gray-600">You haven't volunteered for any food pickups yet. Browse available donations and start making a difference.</p>
            <button className="mt-4 px-6 py-2 border rounded-full text-sm font-medium hover:bg-orange-500 hover:text-white active:bg-orange-600 transition cursor-pointer flex items-center gap-2">
              <FiUserPlus /> Become a Volunteer
            </button>
          </div>
        )}

        {activeTab === "expired" && <div className="p-6 text-center w-full">Navigating to Retailers Dashboard...</div>}
      </div>
    </>
  );
};

export default Dashboard;
