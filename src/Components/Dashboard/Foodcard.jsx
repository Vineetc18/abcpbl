import { FaUsers } from "react-icons/fa";
import { MdAccessTime, MdLocationOn } from "react-icons/md";

const FoodCard = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full sm:w-[280px]">
      {/* Image Section */}
      <div className="relative">
      <img
          src={item.image} // Use item.image here
          alt={item.title}
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {item.badge || "Category"}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h2 className="font-semibold text-lg">{item.title}</h2>
        <p className="text-gray-500 flex items-center gap-1 text-sm">
          <MdLocationOn className="text-gray-400" />
          {item.location}
        </p>
        <p className="text-gray-600 text-sm mt-1">{item.description}</p>

        {/* Stats Section */}
        <div className="flex justify-between items-center mt-3 text-gray-600 text-sm">
          <span className="flex items-center gap-1">
            <FaUsers className="text-green-600" /> {item.servings} servings
          </span>
          <span className="flex items-center gap-1">
            <MdAccessTime className="text-green-600" /> {item.expiry}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4">
        <button className="w-full bg-green-600 text-white text-sm font-semibold py-2 rounded-full hover:bg-green-700 transition">
          Volunteer to Pick Up
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
