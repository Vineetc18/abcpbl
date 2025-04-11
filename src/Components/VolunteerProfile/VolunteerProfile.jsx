import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaUserEdit, FaTrash } from "react-icons/fa";
import { FaMotorcycle, FaCar, FaWalking, FaBicycle, FaBus } from "react-icons/fa";
import "./VolunteerProfile.css";

const VolunteerProfile = () => {
  const navigate = useNavigate();
  const [volunteerData, setVolunteerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const getTransportIcon = (transportType) => {
    switch (transportType) {
      case "walking":
        return <FaWalking className="text-lg" />;
      case "bicycle":
        return <FaBicycle className="text-lg" />;
      case "motorcycle":
        return <FaMotorcycle className="text-lg" />;
      case "car":
        return <FaCar className="text-lg" />;
      case "publicTransport":
        return <FaBus className="text-lg" />;
      default:
        return <FaCar className="text-lg" />;
    }
  };

  useEffect(() => {
    const fetchVolunteerData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/api/volunteers/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": document.cookie.match(/csrftoken=([^;]*)/)?.[1] || ""
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch volunteer profile");
        }

        const data = await response.json();
        if (data && data.length > 0) {
          setVolunteerData(data[0]); // Get the first volunteer profile
        } else {
          throw new Error("No volunteer profile found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolunteerData();
  }, []);

  const handleEdit = () => {
    navigate("/volunteer"); // Navigate to the volunteer registration page
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/volunteers/${volunteerData.id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": document.cookie.match(/csrftoken=([^;]*)/)?.[1] || ""
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete volunteer profile");
      }

      // Navigate to dashboard after successful deletion
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setConfirmDelete(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg mx-auto max-w-3xl text-center">
        {error}
      </div>
    );
  }

  if (!volunteerData) {
    return (
      <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mx-auto max-w-3xl text-center">
        No volunteer profile found. <a className="underline" href="/volunteer">Register as a volunteer</a>.
      </div>
    );
  }

  // Parse the availability data from JSON string
  const availabilityData = volunteerData.availability ? JSON.parse(volunteerData.availability) : {};
  const { days = [], timeSlots = [], transportation = "" } = availabilityData;

  return (
    <div className="max-w-3xl mx-auto p-6 volunteer-profile-container">
      <div className="bg-white rounded-lg shadow-md overflow-hidden volunteer-card">
        <div className="p-6 bg-green-50 border-b border-green-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-green-800">Volunteer Profile</h2>
          <div className="flex gap-2">
            <button 
              onClick={handleEdit}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              <FaUserEdit /> Edit
            </button>
            <button 
              onClick={handleDelete}
              className={`flex items-center gap-1 px-3 py-1 ${confirmDelete ? 'bg-red-600' : 'bg-red-500'} text-white rounded-md hover:bg-red-600 transition delete-button`}
            >
              <FaTrash /> {confirmDelete ? "Confirm" : "Delete"}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Availability</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-600 flex items-center gap-2 mb-2">
                  <FaCalendarAlt /> Available Days
                </h4>
                <div className="flex flex-wrap gap-2">
                  {days.length > 0 ? (
                    days.map((day) => (
                      <span key={day} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm availability-tag">
                        {day}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No days specified</span>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-600 flex items-center gap-2 mb-2">
                  <FaClock /> Available Time Slots
                </h4>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot) => (
                      <span key={slot} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm availability-tag">
                        {slot}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No time slots specified</span>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Transportation</h3>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                {transportation ? (
                  <>
                    <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                      {getTransportIcon(transportation)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800 capitalize">
                        {transportation === "publicTransport" ? "Public Transport" : transportation}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-500">No transportation method specified</span>
                )}
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Additional Skills</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">{volunteerData.skills || "No additional skills specified"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Status</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium status-badge ${
              volunteerData.status === 'active' ? 'bg-green-100 text-green-800 active' :
              volunteerData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {volunteerData.status ? volunteerData.status.charAt(0).toUpperCase() + volunteerData.status.slice(1) : 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfile; 