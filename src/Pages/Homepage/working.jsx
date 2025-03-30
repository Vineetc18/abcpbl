import { MdPostAdd } from "react-icons/md";
import { FaMapMarkedAlt } from "react-icons/fa";
import { GiFoodTruck } from "react-icons/gi";
import { PiRecycleDuotone } from "react-icons/pi";

export default function HowItWorks() {
  return (
    <div className="relative bg-gradient-to-b from-green-50 to-white py-16">
      {/* Section Title */}
      <h2 className="text-4xl font-bold text-center mb-8">How it Works</h2>

      {/* Dotted Line with Dots */}
      <div className="flex justify-center items-center relative mb-12">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <div className="w-40 border-t-2 border-dashed border-green-400"></div>
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <div className="w-40 border-t-2 border-dashed border-green-400"></div>
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
      </div>

      <p className="text-2xl text-center mb-8">
        Our simple process connects contributors with volunteers and those in need
      </p>
      <br />

      {/* Features Grid */}
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Card 1 */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <MdPostAdd size={40} className="icon" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Report Surplus Food</h3>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipiscing elit.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <FaMapMarkedAlt size={40} className="icon" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Find Nearest Pickup</h3>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipiscing elit.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <GiFoodTruck size={40} className="icon" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Food Collection & Distribution
          </h3>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipiscing elit.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <PiRecycleDuotone size={40} className="icon" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Track & Reduce Waste</h3>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipiscing elit.
          </p>
        </div>
      </div>
    </div>
  );
}
