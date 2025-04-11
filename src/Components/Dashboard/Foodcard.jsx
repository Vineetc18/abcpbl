import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaClock, FaMapMarkerAlt, FaUtensils } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const FoodCard = ({ item, onDelete, onEdit }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!item) {
      console.error("FoodCard: Missing required 'item' prop");
      return;
    }

    // Enhanced debug logging
    console.log("FoodCard received item:", {
      id: item.id,
      title: item.title,
      description: item.description,
      location: item.location,
      servings: item.servings,
      foodType: item.foodType,
      expiresIn: item.expiresIn,
      is_user_donation: item.is_user_donation,
      is_recent_donation: item.is_recent_donation,
      is_expired: item.is_expired,
      user: item.user
    });

    setIsLoading(false);
  }, [item]);

  if (!item) {
    console.warn("FoodCard: Rendering loading state due to missing item");
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Debug component
  const DebugInfo = () => (
    <div className="bg-gray-100 p-2 text-xs border-t">
      <p>Debug Info:</p>
      <ul className="list-disc pl-4">
        <li>ID: {item.id}</li>
        <li>Is User Donation: {item.is_user_donation ? 'Yes' : 'No'}</li>
        <li>Is Recent: {item.is_recent_donation ? 'Yes' : 'No'}</li>
        <li>Is Expired: {item.is_expired ? 'Yes' : 'No'}</li>
        <li>User ID: {item.user?.id}</li>
      </ul>
    </div>
  );

  const handleImageError = () => {
    setImageError(true);
    console.log("Image failed to load for item:", item.id);
  };

  const formatExpiryDate = (dateString) => {
    if (!dateString) return "No expiry date";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      const now = new Date();
      const diffTime = date - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return "Expired";
      if (diffDays === 0) return "Expires today";
      if (diffDays === 1) return "Expires tomorrow";
      return `Expires in ${diffDays} days`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Function to handle undefined or empty values
  const getDisplayValue = (value, defaultText) => {
    if (value === undefined || value === null || value === '') {
      return defaultText;
    }
    return value;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
      item.is_recent_donation ? 'border-2 border-amber-500' : ''
    }`}>
      {/* Image Section */}
      <div className="relative h-48 w-full bg-gray-100">
        {!imageError && item.image ? (
          <img
            src={item.image}
            alt={getDisplayValue(item.title, 'Food Donation')}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <MdFastfood className="text-4xl mb-2" />
            <span className="text-sm">No image available</span>
          </div>
        )}
        
        {/* Badge for recent donations */}
        {item.is_recent_donation && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Just Added!
          </div>
        )}
        
        {/* Badge for user donations */}
        {item.is_user_donation && !item.is_recent_donation && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Your Donation
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`p-4 ${item.is_recent_donation ? 'bg-amber-50' : ''}`}>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {getDisplayValue(item.title, 'Food Donation')}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <FaClock className="mr-2" />
            <span>{formatExpiryDate(item.expiresIn)}</span>
          </div>
          
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            <span className="line-clamp-1">
              {getDisplayValue(item.location, 'No location specified')}
            </span>
          </div>
          
          <div className="flex items-center">
            <FaUtensils className="mr-2" />
            <span>
              {getDisplayValue(item.servings, '0')} servings
            </span>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          {getDisplayValue(item.description, 'No description available')}
        </p>

        {/* Action Buttons */}
        {item.is_user_donation && (
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={onEdit}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <FaEdit className="text-lg" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <FaTrash className="text-lg" />
            </button>
          </div>
        )}
      </div>

      {/* Debug Info */}
      <DebugInfo />
    </div>
  );
};

export default FoodCard;
