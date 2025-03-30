import { FaArrowRight } from "react-icons/fa";
import JoinUsImg from './Homepage assets/joinus.png'
const ImpactSection = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between">
      {/* Left Side - Text and Stats */}
      <div className="md:w-1/2 text-left">
        <h1 className="text-4xl font-bold text-gray-900">Ready to Make a Difference?</h1>
        <br />
        <br />
        <div className="bg-gray-100 p-6 pr-10 mr-0.5 rounded-lg shadow-md">
      <p className="text-gray-700 italic">
      "In the Bhagavad Gita, Lord Krishna emphasizes that selfless action is the path to true fulfillment. By sharing surplus food, we not only nourish bodies but uplift our collective spirit. Every meal rescued is a step towards a more just and sustainable world. Join us in this mission
     <b> - because food is meant to be shared, not wasted</b>.""
      </p>
      </div>
      <br />
        
        

      <div className="mt-6 flex items-center space-x-4">
  {/* First Button */}
  <button className="flex items-center bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition duration-300 cursor-pointer">
    Join Now <FaArrowRight className="ml-2" />
  </button>

  {/* Second Button with Orange Hover */}
     <button className="flex items-center bg-white-600 text-black px-8 py-3 rounded-full font-semibold hover:bg-orange-400 transition duration-300 cursor-pointer" >
    Explore
    </button>
    </div>

      </div>
      
      {/* Right Side - Image and Testimonial */}
      <div className="md:w-1/2 mt-10 md:mt-0 relative">
        <img
          src={JoinUsImg}
          alt="Helping Hand"
          className="rounded-lg shadow-lg w-full h-auto object-cover"
        />
      </div>
    </section>
  );
};

export default ImpactSection;
