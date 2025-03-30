import React from "react";
import VolunteerRegistration from "../../Components/VolunteeerRegisteration/Volreg";
import { FaMapMarkerAlt, FaCalendarCheck, FaHandHoldingHeart, FaExclamationTriangle } from "react-icons/fa";
import Footer from "../Homepage/Footer";

const Volunteer = () => {
  return (
    <>
    <div className="max-w-4xl mx-auto p-6 text-center">
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-2">Join Our Volunteer Network</h2>
      <p className="text-gray-600 mb-6">
        Help us deliver surplus food to those in need. As a volunteer, you'll be notified of 
        nearby food donations that you can help transport to distribution centers or directly 
        to recipients.
      </p>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="flex justify-center items-center mb-3">
            <div className="bg-green-100 p-3 rounded-full">
              <FaMapMarkerAlt className="text-green-600 text-2xl" />
            </div>
          </div>
          <h3 className="font-semibold text-lg">Nearby Pickups</h3>
          <p className="text-gray-600 text-sm">
            Get notified about food donations in your area that need to be collected.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="flex justify-center items-center mb-3">
            <div className="bg-green-100 p-3 rounded-full">
              <FaCalendarCheck className="text-green-600 text-2xl" />
            </div>
          </div>
          <h3 className="font-semibold text-lg">Flexible Schedule</h3>
          <p className="text-gray-600 text-sm">
            Choose when you're available. Volunteer on your own schedule, as little or as much as you can.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="flex justify-center items-center mb-3">
            <div className="bg-green-100 p-3 rounded-full">
              <FaHandHoldingHeart className="text-green-600 text-2xl" />
            </div>
          </div>
          <h3 className="font-semibold text-lg">Make an Impact</h3>
          <p className="text-gray-600 text-sm">
            Every delivery helps reduce food waste and supports those facing food insecurity.
          </p>
        </div>
      </div>

      {/* Safety Information */}
      <div className="bg-orange-100 border-l-4 border-orange-400 p-4 mt-8 rounded-lg">
        <div className="flex items-center">
          <FaExclamationTriangle className="text-orange-500 text-xl mr-2" />
          <h3 className="font-semibold text-orange-800">Important Safety Information</h3>
        </div>
        <p className="text-sm text-orange-700 mt-1">
          All volunteers are required to follow our food safety guidelines. We recommend using insulated bags 
          for transport and ensuring timely delivery. Never pick up food that seems unsafe or handle food if 
          you're unwell.
        </p>
      </div>
    </div>
    <VolunteerRegistration/>
    <Footer/>

    </>
  ); 
 
};

export default Volunteer;
