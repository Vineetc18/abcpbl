import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-white to-green-100 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Section */}
        <div>
          <h2 className="text-lg font-bold text-green-600 flex items-center">
            <span className="mr-2">💚</span> WasteNot Connect
          </h2>
          <p className="mt-2 text-sm">
            Connecting surplus food with those in need, creating a sustainable solution to reduce waste and fight hunger.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4 mt-4 text-gray-500">
            <a href="#" className="hover:text-green-600 cursor-pointer text-xl">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-green-600 cursor-pointer text-xl">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-green-600 cursor-pointer text-xl">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-green-600 cursor-pointer text-xl">
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Platform Section */}
        <div>
          <h3 className="font-bold">PLATFORM</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-600">Update Food</a></li>
            <li><a href="#" className="hover:text-green-600">Volunteer</a></li>
            <li><a href="#" className="hover:text-green-600">Organizations</a></li>
            <li><a href="#" className="hover:text-green-600">Our Impact</a></li>
          </ul>
        </div>

        {/* Resources Section */}
        <div>
          <h3 className="font-bold">RESOURCES</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-600">About Us</a></li>
            <li><a href="#" className="hover:text-green-600">Blog</a></li>
            <li><a href="#" className="hover:text-green-600">FAQ</a></li>
            <li><a href="#" className="hover:text-green-600">Contact</a></li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h3 className="font-bold">LEGAL</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-600">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-green-600">Terms of Service</a></li>
            <li><a href="#" className="hover:text-green-600">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 mt-10">
        © 2025 WasteNot Connect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
