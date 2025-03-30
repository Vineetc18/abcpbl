import { useState } from "react";
import { FaUpload, FaCheckCircle } from "react-icons/fa";
import Footer from "../Homepage/Footer";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-2">Update Surplus Food</h2>
      <p className="text-center text-gray-600 mb-6">
        Report food that would otherwise go to waste. Local volunteers will help distribute it to those in need.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title & Servings */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Catered Event Leftovers"
            className="w-full p-3 border border-gray-300 shadow-sm rounded-lg focus:outline-green-500"
          />
          <input
            type="number"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            placeholder="Estimated Servings"
            className="w-full p-3 border border-gray-300 shadow-sm rounded-lg focus:outline-green-500"
          />
        </div>

        {/* Description */}
        <label htmlFor="description" className="font-bold block mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the food items, packaging, and any other relevant details"
          className="w-full p-3 border border-gray-300 shadow-sm rounded-lg focus:outline-green-500"
          rows="3"
        />

        {/* Location */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location address"
            className="w-full p-3 border border-gray-300 shadow-sm rounded-lg focus:outline-green-500"
          />
          <button
            type="button"
            onClick={handleFindLocation}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Find
          </button>
        </div>

        {/* Food Type & Expiry */}
        <label htmlFor="foodType" className="font-bold block mb-2">
          Food Type & Expires In
        </label>
        <div className="grid grid-cols-2 gap-4">
          <select
            name="foodType"
            value={formData.foodType}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 shadow-sm rounded-lg focus:outline-green-500"
          >
            <option>Select food type</option>
            <option>Baked</option>
            <option>Canned Food</option>
            <option>Prepared Food</option>
            <option>Dairy Products</option>
            <option>Others</option>
          </select>
    
          <input
            type="datetime-local"
            name="expiresIn"
            value={formData.expiresIn}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 shadow-sm rounded-lg focus:outline-green-500"
          />
        </div>

        {/* Image Upload */}
        <label htmlFor="image" className="font-bold block mb-2">
          Food Image
        </label>
        <div className="border border-gray-300 shadow-sm rounded-lg p-4 flex flex-col items-center">
          <label className="cursor-pointer">
            <FaUpload className="text-gray-500 text-2xl mb-2" />
            <input type="file" onChange={handleImageChange} className="hidden" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop (PNG, JPG, GIF up to 5MB)</p>
          </label>
        </div>

        {/* Food Safety Guidelines */}
        <div className="p-4 border-l-4 border-yellow-500 bg-orange-100 text-sm text-gray-700 rounded-lg">
          🛑 Ensure food is properly packaged and hasn't been sitting at room temperature for more than 2 hours.
          High-risk foods (meat, dairy, prepared meals) should be refrigerated. Include any allergen information.
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-3 border border-gray-300 shadow-sm rounded-lg focus:outline-green-500"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 shadow-sm rounded-lg focus:outline-green-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <FaCheckCircle />
            Submit Donation
          </button>
        </div>
      </form>
    </div>
    <Footer/>
    </>
  );
};

export default UpdateFoodForm;     