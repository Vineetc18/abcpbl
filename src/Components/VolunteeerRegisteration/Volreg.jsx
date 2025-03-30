import React, { useState } from "react";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaSearchLocation,
  FaWalking,
  FaBicycle,
  FaMotorcycle,
  FaCar,
  FaBus,
  FaRegCalendarAlt,
  FaRegClock,
} from "react-icons/fa";

const transportationMethods = [
  { id: "walking", label: "Walking", icon: <FaWalking /> },
  { id: "bicycle", label: "Bicycle", icon: <FaBicycle /> },
  { id: "motorcycle", label: "Motorcycle", icon: <FaMotorcycle /> },
  { id: "car", label: "Car", icon: <FaCar /> },
  { id: "publicTransport", label: "Public Transport", icon: <FaBus /> },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = [
  "Morning (8AM - 12PM)",
  "Afternoon (12PM - 4PM)",
  "Evening (4PM - 8PM)",
  "Night (8PM - 12AM)",
];

const VolunteerRegistration = () => {
  const [selectedTransport, setSelectedTransport] = useState(null);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      {/* Header */}
      <div className="flex items-center mb-6">
        <FaUser className="text-green-600 text-2xl mr-2" />
        <h2 className="text-2xl font-semibold">Volunteer Registration</h2>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Full Name</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <FaUser className="text-gray-400 mr-2" />
            <input type="text" placeholder="Your name" className="w-full outline-none bg-transparent" />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <FaPhone className="text-gray-400 mr-2" />
            <input type="text" placeholder="Your phone number" className="w-full outline-none bg-transparent" />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Your Location</label>
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
          <FaMapMarkerAlt className="text-gray-400 mr-2" />
          <input type="text" placeholder="Enter location address" className="w-full outline-none bg-transparent" />
          <button className="bg-gray-200 px-4 py-1 rounded-md text-gray-700 font-medium ml-2">Find</button>
          <FaSearchLocation className="text-gray-400 ml-2 cursor-pointer" />
        </div>
        <p className="text-gray-500 text-sm mt-1">This helps us match you with nearby food donations.</p>
      </div>

      {/* Transportation Method */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Transportation Method</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {transportationMethods.map((method) => (
            <button
              key={method.id}
              className={`flex items-center justify-center border w-full px-3 rounded-lg text-gray-700 transition ${
                selectedTransport === method.id
                  ? "bg-green-500 text-white border-green-500"
                  : "border-gray-300 hover:bg-orange-500"
              }`}
              onClick={() => setSelectedTransport(method.id)}
            >
              <span className="mr-2">{method.icon}</span> {method.label}
            </button>
          ))}
        </div>
      </div>

{/* Available Days and Time Slots */}
{/* Available Days and Time Slots */}
<div className="flex flex-col md:flex-row gap-8 mb-6">
  {/* Available Days */}
  <div className="flex-1">
    <div className="flex items-start mb-3">
      <FaRegCalendarAlt className="text-gray-600" />
      <label className="text-gray-700 font-medium ml-2">Available Days</label>
    </div>
    <div className="flex flex-col items-start gap-2 text-left">
      {days.map((day) => (
        <div key={day} className="flex items-center w-full">
          <input
            type="checkbox"
            id={day}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor={day} className="ml-2 text-gray-700 w-full cursor-pointer">
            {day}
          </label>
        </div>
      ))}
    </div>
  </div>

  {/* Available Time Slots */}
  <div className="flex-1">
    <div className="flex items-start  text-left mb-4">
      <FaRegClock className="text-gray-600" />
      <label className="text-gray-700 font-medium ">Available Time Slots</label>
    </div>
    <div className="flex flex-col items-start gap-2 text-left mb-20">
      {timeSlots.map((slot) => (
        <div key={slot} className="flex items-center w-full">
          <input
            type="checkbox"
            id={slot}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor={slot} className="ml-2 text-gray-700 w-full cursor-pointer">
            {slot}
          </label>
        </div>
      ))}
    </div>
  </div>
</div>

      {/* Additional Information */}
      <div className="mt-6">
        <label className="block text-gray-700 font-medium mb-2">Additional Information (Optional)</label>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 h-24 outline-none"
          placeholder="Any additional details about your availability or preferences"
        ></textarea>
      </div>

      {/* Terms & Conditions */}
      <div className="mt-6 flex items-start">
        <input type="checkbox" className="mt-1 scale-125" />
        <p className="text-gray-700 ml-2 text-sm">
          I agree to the volunteer terms and conditions, including adherence to food safety guidelines and timely pickups.
        </p>
      </div>

      {/* Submit Button */}
      <button className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg mt-6">
        Register as Volunteer
      </button>
    </div>
  );
};

export default VolunteerRegistration;
