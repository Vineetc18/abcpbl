import { useState, useEffect } from "react";
import { FaUpload, FaCheckCircle, FaSpinner, FaImage, FaTrash } from "react-icons/fa";
import Footer from "../Homepage/Footer";
import { useNavigate, useLocation } from "react-router-dom";

const API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY;
console.log("API Key:", API_KEY); // Check if API Key is correctly loaded


const UpdateFoodForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    servings: "",
    description: "",
    location: "",
    foodType: "",
    expiresIn: "",
    phone: "",
    email: "",
    image: null,
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const editMode = queryParams.get('edit') === 'true';
    const itemId = localStorage.getItem("editDonationId");

    if (editMode && itemId) {
      setIsEditMode(true);
      setEditItemId(itemId);
      console.log(`Edit mode activated for item ID: ${itemId}`);
      fetchDonationData(itemId);
    } else {
      localStorage.removeItem("editDonationId");
    }
  }, [location]);

  const fetchDonationData = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/compost/${id}/`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch donation data for editing');
      }
      const data = await response.json();
      console.log("Fetched existing data:", data);
      
      let formattedExpiresIn = data.expiresIn ? new Date(data.expiresIn).toISOString().slice(0, 16) : "";

      setFormData({
        title: data.title || "",
        servings: data.servings || "",
        description: data.description || "",
        location: data.location || "",
        foodType: data.foodType || "",
        expiresIn: formattedExpiresIn,
        phone: data.phone || "",
        email: data.email || "",
        image: null
      });
      
      if (data.image) {
        const imageUrl = data.image.startsWith('http') ? data.image : `http://localhost:8000${data.image}`;
        setImagePreview(imageUrl);
        console.log("Setting image preview from URL:", imageUrl);
      }

    } catch (error) {
      console.error("Error fetching donation data:", error);
      setMessage({ type: 'error', text: 'Could not load donation details for editing.' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: 'error',
          text: 'Image size exceeds 5MB limit. Please choose a smaller image.'
        });
        return;
      }
      
      if (!file.type.match('image.*')) {
        setMessage({
          type: 'error',
          text: 'Please select a valid image file (JPEG, PNG, or GIF).'
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setFormData({ ...formData, image: file });
    }
  };
  
  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const getAddressFromCoordinates = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${API_KEY}&lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();

      if (data.display_name) {
        return data.display_name;
      } else {
        return "Location not found";
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      return "Location not found";
    }
  };

  const handleFindLocation = () => {
    if (!API_KEY) {
      alert("API Key is missing. Please check your .env file.");
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User Coordinates:", latitude, longitude);

          const address = await getAddressFromCoordinates(latitude, longitude);
          setFormData((prev) => ({ ...prev, location: address }));
        },
        (error) => {
          console.error("Geolocation Error:", error);
          setFormData((prev) => ({ ...prev, location: "Unable to get location" }));
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate required fields
      const requiredFields = {
        title: 'Title',
        location: 'Location',
        servings: 'Servings',
        foodType: 'Food Type'
      };

      const emptyFields = Object.entries(requiredFields)
        .filter(([key]) => !formData[key] || formData[key].toString().trim() === '')
        .map(([_, label]) => label);

      if (emptyFields.length > 0) {
        throw new Error(`Please fill in the following required fields: ${emptyFields.join(', ')}`);
      }

      const authResponse = await fetch('http://localhost:8000/api/users/check_auth/', {
        method: 'GET',
        credentials: 'include',
      });

      if (!authResponse.ok) {
        throw new Error('Please log in to submit food donations');
      }

      const csrfResponse = await fetch('http://localhost:8000/api/csrf/', {
        method: 'GET',
        credentials: 'include',
      });

      if (!csrfResponse.ok) {
        throw new Error('Failed to get CSRF token');
      }

      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }

      const submitData = new FormData();
      
      // Ensure required fields are not empty
      submitData.append('title', formData.title.trim() || 'Food Donation');
      submitData.append('servings', parseInt(formData.servings) || 1);
      submitData.append('description', formData.description.trim() || 'No description provided');
      submitData.append('location', formData.location.trim());
      submitData.append('foodType', formData.foodType.trim() || 'Others');
      
      // Handle expiry date
      if (formData.expiresIn) {
        const expiryDate = new Date(formData.expiresIn);
        if (!isNaN(expiryDate.getTime())) {
          submitData.append('expiresIn', expiryDate.toISOString());
        }
      }
      
      // Handle contact information
      submitData.append('phone', formData.phone ? formData.phone.trim() : '');
      submitData.append('email', formData.email ? formData.email.trim() : '');
      
      // Handle image
      if (formData.image instanceof File) {
        submitData.append('image', formData.image);
        console.log('Adding new image to form data:', formData.image.name);
      }

      console.log('Submitting form data:', Object.fromEntries(submitData.entries()));

      const apiUrl = isEditMode 
        ? `http://localhost:8000/api/compost/${editItemId}/` 
        : 'http://localhost:8000/api/compost/';
      const apiMethod = isEditMode ? 'PUT' : 'POST';

      console.log(`Submitting form data via ${apiMethod} to ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: apiMethod,
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken,
        },
        body: submitData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
      } catch (e) {
        if (responseText.includes('<!DOCTYPE html>')) {
          console.error('Server returned HTML error page:', responseText);
          throw new Error('Server error occurred. Please check the server logs.');
        }
        if (!response.ok) {
           throw new Error(`Server returned status ${response.status}. Response: ${responseText}`);
        } else {
           console.log("Request successful, but no JSON response body");
           data = { id: editItemId };
        }
      }

      if (response.ok) {
        setMessage({
          type: 'success',
          text: isEditMode ? 'Food donation updated successfully!' : 'Food donation submitted successfully!'
        });
        
        // Set refresh flag and last added donation ID
        localStorage.setItem("refreshDashboard", "true");
        
        if (isEditMode) {
          localStorage.removeItem("editDonationId");
        }
        
        if (data && data.id) {
          localStorage.setItem("lastAddedDonationId", data.id.toString());
          console.log("Saved donation ID to localStorage:", data.id);
        }
        
        // Navigate after a short delay to show success message
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);

      } else {
        const errorMsg = data?.detail || data?.message || `Request failed with status: ${response.status}`;
        throw new Error(errorMsg);
      }

    } catch (error) {
      console.error("Error submitting donation:", error);
      setMessage({
        type: 'error',
        text: `Submission failed: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-2">
          {isEditMode ? "Update Food Donation" : "Report Surplus Food"}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {isEditMode 
            ? "Update the details for this food donation." 
            : "Report food that would otherwise go to waste. Local volunteers will help distribute it."}
        </p>

        {message.type === 'error' && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{message.text}</div>}
        {message.type === 'success' && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{message.text}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Catered Event Leftovers"
                className="w-full p-3 border border-gray-300 shadow-sm rounded-lg focus:outline-green-500"
                required
              />
            </div>
            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">
                Servings <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                placeholder="Estimated Servings"
                className="w-full p-3 border border-gray-300 shadow-sm rounded-lg focus:outline-green-500"
                required
                min="1"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the food items, packaging, and any other relevant details"
              className="w-full p-3 border border-gray-300 shadow-sm rounded-lg focus:outline-green-500"
              rows="3"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location address"
                className="w-full p-3 border border-gray-300 shadow-sm rounded-lg focus:outline-green-500"
                required
              />
              <button
                type="button"
                onClick={handleFindLocation}
                className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Find
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="foodType" className="block text-sm font-medium text-gray-700 mb-1">
                Food Type <span className="text-red-500">*</span>
              </label>
              <select
                id="foodType"
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 shadow-sm rounded-lg focus:outline-green-500"
                required
              >
                <option value="">Select food type</option>
                <option value="Baked">Baked</option>
                <option value="Canned Food">Canned Food</option>
                <option value="Prepared Food">Prepared Food</option>
                <option value="Dairy Products">Dairy Products</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label htmlFor="expiresIn" className="block text-sm font-medium text-gray-700 mb-1">
                Expires In
              </label>
              <input
                type="datetime-local"
                id="expiresIn"
                name="expiresIn"
                value={formData.expiresIn}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 shadow-sm rounded-lg focus:outline-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-300 shadow-sm rounded-lg focus:outline-green-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 shadow-sm rounded-lg focus:outline-green-500"
              />
            </div>
          </div>

          <label htmlFor="image" className="font-bold block mb-2">
            Food Image
          </label>
          <div className="border border-gray-300 shadow-sm rounded-lg p-4">
            {imagePreview ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <img 
                    src={imagePreview} 
                    alt="Food preview" 
                    className="w-full max-h-48 object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
                <p className="text-sm text-gray-600">Image selected: {formData.image?.name}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <label className="cursor-pointer flex flex-col items-center">
                  <FaImage className="text-gray-500 text-3xl mb-2" />
                  <input 
                    type="file" 
                    onChange={handleImageChange} 
                    className="hidden" 
                    accept="image/jpeg, image/png, image/gif"
                  />
                  <p className="text-sm text-gray-600">Click to upload an image (PNG, JPG, GIF up to 5MB)</p>
                </label>
              </div>
            )}
          </div>

          <div className="p-4 border-l-4 border-yellow-500 bg-orange-100 text-sm text-gray-700 rounded-lg">
            🛑 Ensure food is properly packaged and hasn't been sitting at room temperature for more than 2 hours.
            High-risk foods (meat, dairy, prepared meals) should be refrigerated. Include any allergen information.
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {isEditMode ? "Updating..." : "Submitting..."}
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  {isEditMode ? "Update Donation" : "Submit Donation"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default UpdateFoodForm;     