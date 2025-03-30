import { FaMapMarkerAlt, FaClock, FaShieldAlt, FaChartBar } from "react-icons/fa";
import "./Features.css";

// const features = [
//   {
//     icon: <FaMapMarkerAlt className="text-green-600 text-3xl" />,
//     title: "Geotagging & Route Optimization",
//     description:
//       "Efficiently connect food donors with nearby volunteers through precise location tracking and optimized routes for quick food pickup and delivery.",
//   },
//   {
//     icon: <FaClock className="text-green-600 text-3xl" />,
//     title: "Real-time Notifications",
//     description:
//       "Instant alerts notify volunteers about food availability, ensuring timely collection and distribution to those in need.",
//   },
//   {
//     icon: <FaShieldAlt className="text-green-600 text-3xl" />,
//     title: "Food Safety Verification",
//     description:
//       "Built-in safety checks ensure all food meets quality standards, with detailed information about food type, quantity, and freshness.",
//   },
//   {
//     icon: <FaChartBar className="text-green-600 text-3xl" />,
//     title: "Impact Dashboard",
//     description:
//       "Track your contribution with real-time metrics showing meals saved, people fed, and environmental impact of reduced food waste.",
//   },
// ];

// const SmartFeatures = () => {
//   return (
//     <section className="py-12 px-4 lg:px-20 text-center">
//       <h2 className="text-3xl font-bold mb-2">Smart Features That Make A Difference</h2>
//       <p className="text-gray-600 mb-8">
//         Our platform leverages technology to create an efficient ecosystem for food redistribution
//       </p>
//       <div className="grid md:grid-cols-2 gap-6">
//         {features.map((feature, index) => (
//           <div
//             key={index}
//             className="p-6 border rounded-xl shadow-sm flex items-start space-x-4"
//           >
//             <div className="bg-green-100 p-3 rounded-full">{feature.icon}</div>
//             <div className="text-left">
//               <h3 className="font-semibold text-lg">{feature.title}</h3>
//               <p className="text-gray-600">{feature.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default SmartFeatures;


const features = [
  {
    icon: <FaMapMarkerAlt className="text-green-1000 text-3xl" />,
    title: "Geotagging & Route Optimization",
    description:
      "Efficiently connect food donors with nearby volunteers through precise location tracking and optimized routes for quick food pickup and delivery.",
  },
  {
    icon: <FaClock className="text-green-1000 text-3xl" />,
    title: "Real-time Notifications",
    description:
      "Instant alerts notify volunteers about food availability, ensuring timely collection and distribution to those in need.",
  },
  {
    icon: <FaShieldAlt className="text-green-1000 text-3xl" />,
    title: "Food Safety Verification",
    description:
      "Built-in safety checks ensure all food meets quality standards, with detailed information about food type, quantity, and freshness.",
  },
  {
    icon: <FaChartBar className="text-green-1000 text-3xl" />,
    title: "Impact Dashboard",
    description:
      "Track your contribution with real-time metrics showing meals saved, people fed, and environmental impact of reduced food waste.",
  },
];

const SmartFeatures = () => {
  return (
    <section className="py-12 px-4 lg:px-20 text-center max-w-4x1 mx-auto">
      <h2 className="text-3xl font-bold mb-2">Smart Features That Make A Difference</h2>
      <p className="text-gray-600 mb-8">
        Our platform leverages technology to create an efficient ecosystem for food redistribution
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 border border-gray-300 rounded-xl shadow-md flex items-start space-x-4"
          >
            <div className="bg-green-100 p-3 rounded-full">{feature.icon}</div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SmartFeatures;
