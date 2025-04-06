import React from "react";
import { FaHeart } from "react-icons/fa"; // Top badge icon
import { FiArrowRight } from "react-icons/fi"; // Button arrow icon
import { useNavigate } from "react-router-dom";
import JoinUs from "./JoinUs";
import SmartFeatures from "./Features";
import HowItWorks from "./working";
import Footer from "./Footer";
import Dashboard from "../../Components/Dashboard/Dashboard";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <>
    <section className="flex flex-col items-center text-center py-16 bg-gradient-to-b from-green-50 to-white">
      {/* Badge */}
      <div className="flex items-center gap-2 px-8 py-3 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
        <FaHeart />
        <span>Reducing Waste, Fighting Hunger</span>
      </div>

      {/* Heading */}
      <h1 className="mt-6 text-6xl font-bold text-black leading-tight max-w-4xl">
        Connect surplus food with those
        <span className="text-green-600"> who need it most</span>
      </h1>

      {/* Description */}
      <p className="mt-4 text-gray-600 text-lg max-w-2xl">
        Our platform bridges the gap between food waste and hunger, creating an efficient ecosystem where everyone can contribute to a sustainable solution.
      </p>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button 
          onClick={() => navigate('/update')}
          className="flex items-center gap-2 px-7 py-3 text-lg font-semibold text-white bg-green-600 rounded-full shadow-md hover:bg-green-700 transition cursor-pointer"
        >
          Update Food <FiArrowRight />
        </button>
        <button 
          onClick={() => navigate('/volunteer')}
          className="px-7 py-3 text-lg font-semibold text-black bg-white border-1 border-gray-300 rounded-full shadow-md hover:bg-orange-400 transition cursor-pointer"
        >
          Volunteer
        </button>
      </div>

      {/* Stats Section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md">
          <div className="flex items-center justify-center w-12 h-12 text-green-700 bg-green-100 rounded-full text-2xl">
            🍽
          </div>
          <h3 className="mt-3 text-2xl font-bold">10,000+</h3>
          <p className="text-gray-600">Meals Rescued</p>
        </div>

        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md">
          <div className="flex items-center justify-center w-12 h-12 text-green-700 bg-green-100 rounded-full text-2xl">
            👥
          </div>
          <h3 className="mt-3 text-2xl font-bold">500+</h3>
          <p className="text-gray-600">Active Volunteers</p>
        </div>

        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md">
          <div className="flex items-center justify-center w-12 h-12 text-green-700 bg-green-100 rounded-full text-2xl">
            💚
          </div>
          <h3 className="mt-3 text-2xl font-bold">50+</h3>
          <p className="text-gray-600">Partner Organizations</p>
        </div>
      </div>
    </section>
    <HowItWorks/>
    <SmartFeatures/>
     
    <JoinUs/>
    <Footer/>
    </>
  );
};

export default HeroSection;
