import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    location: "",
    transportationMethod: "",
    availableDays: [],
    availableTimeSlots: [],
    additionalInfo: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTransportSelect = (transportId) => {
    setSelectedTransport(transportId);
    setFormData({
      ...formData,
      transportationMethod: transportId,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    if (type === "checkbox") {
      if (name === "agreeToTerms") {
        setFormData({
          ...formData,
          [name]: checked,
        });
      } else if (name.startsWith("day-")) {
        const day = value;
        const updatedDays = checked 
          ? [...formData.availableDays, day] 
          : formData.availableDays.filter(d => d !== day);
        
        setFormData({
          ...formData,
          availableDays: updatedDays,
        });
      } else if (name.startsWith("time-")) {
        const timeSlot = value;
        const updatedTimeSlots = checked 
          ? [...formData.availableTimeSlots, timeSlot] 
          : formData.availableTimeSlots.filter(t => t !== timeSlot);
        
        setFormData({
          ...formData,
          availableTimeSlots: updatedTimeSlots,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      setMessage("Please agree to the volunteer terms and conditions.");
      return;
    }
    
    if (formData.availableDays.length === 0 || formData.availableTimeSlots.length === 0) {
      setMessage("Please select at least one available day and time slot.");
      return;
    }
    
    setIsLoading(true);
    setMessage("");
    
    try {
      const volunteerData = {
        availability: JSON.stringify({
          days: formData.availableDays,
          timeSlots: formData.availableTimeSlots,
          transportation: formData.transportationMethod,
        }),
        skills: formData.additionalInfo
      };
      
      const response = await fetch("http://localhost:8000/api/volunteers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": document.cookie.match(/csrftoken=([^;]*)/)?.[1] || ""
        },
        credentials: "include",
        body: JSON.stringify(volunteerData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage("Volunteer registration successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        // Extract the detailed error message from the response
        let errorMessage = "Failed to register as volunteer. Please try again.";
        
        if (data) {
          if (data.error) {
            errorMessage = data.error;
          } else if (data.detail) {
            errorMessage = data.detail;
          } else if (typeof data === 'object') {
            // Handle Django REST framework error format where errors are per field
            const errors = Object.entries(data)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('; ');
            
            if (errors) {
              errorMessage = errors;
            }
          }
        }
        
        console.error("Volunteer registration failed:", data);
        setMessage(errorMessage);
      }
    } catch (error) {
      console.error("Volunteer registration error:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      {/* Header */}
      <div className="flex items-center mb-6">
        <FaUser className="text-green-600 text-2xl mr-2" />
        <h2 className="text-2xl font-semibold">Volunteer Registration</h2>
      </div>

      {message && (
        <div className={`p-3 mb-4 rounded-md ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <FaUser className="text-gray-400 mr-2" />
              <input 
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Your name" 
                className="w-full outline-none bg-transparent"
                required 
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <FaPhone className="text-gray-400 mr-2" />
              <input 
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Your phone number" 
                className="w-full outline-none bg-transparent"
                required 
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Your Location</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <FaMapMarkerAlt className="text-gray-400 mr-2" />
            <input 
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter location address" 
              className="w-full outline-none bg-transparent"
              required 
            />
            <button type="button" className="bg-gray-200 px-4 py-1 rounded-md text-gray-700 font-medium ml-2">Find</button>
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
                type="button"
                key={method.id}
                className={`flex items-center justify-center border w-full px-3 rounded-lg text-gray-700 transition ${
                  selectedTransport === method.id
                    ? "bg-green-500 text-white border-green-500"
                    : "border-gray-300 hover:bg-orange-500"
                }`}
                onClick={() => handleTransportSelect(method.id)}
              >
                <span className="mr-2">{method.icon}</span> {method.label}
              </button>
            ))}
          </div>
        </div>

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
                  name={`day-${day}`}
                  value={day}
                  onChange={handleCheckboxChange}
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
          <div className="flex items-start text-left mb-4">
            <FaRegClock className="text-gray-600" />
            <label className="text-gray-700 font-medium ">Available Time Slots</label>
          </div>
          <div className="flex flex-col items-start gap-2 text-left mb-20">
            {timeSlots.map((slot) => (
              <div key={slot} className="flex items-center w-full">
                <input
                  type="checkbox"
                  id={slot}
                  name={`time-${slot}`}
                  value={slot}
                  onChange={handleCheckboxChange}
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
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-3 h-24 outline-none"
            placeholder="Any additional details about your availability or preferences"
          ></textarea>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-6 flex items-start">
          <input 
            type="checkbox" 
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleCheckboxChange}
            className="mt-1 scale-125" 
          />
          <label htmlFor="agreeToTerms" className="text-gray-700 ml-2 text-sm">
            I agree to the volunteer terms and conditions, including adherence to food safety guidelines and timely pickups.
          </label>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg mt-6 disabled:bg-gray-400"
        >
          {isLoading ? "Processing..." : "Register as Volunteer"}
        </button>
      </form>
    </div>
  );
};

export default VolunteerRegistration;
