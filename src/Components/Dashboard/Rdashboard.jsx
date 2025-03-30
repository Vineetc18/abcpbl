import React, { useState } from "react";

const CompostRetailersDashboard = () => {
  const [activeTab, setActiveTab] = useState("available");

  return (
    <div className="p-6">
      {/* Heading */}
      <h1 className="text-2xl font-bold">Compost Retailers Dashboard</h1>
      <p className="text-gray-600">Find expired food items suitable for composting</p>

      {/* Tabs */}
      <div className="flex space-x-4 mt-4">
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "available" ? "bg-gray-200 font-semibold" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("available")}
        >
          🌿 Available Items
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "collected" ? "bg-gray-200 font-semibold" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("collected")}
        >
          ⏳ Collected Items
        </button>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center space-x-4">
        <button className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700">
          + Register As Composter
        </button>
        <button className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100">
          🔍 Filter
        </button>
      </div>

      {/* Expired Food List */}
      {activeTab === "available" && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold flex items-center">
            Expired Food for Composting{" "}
            <span className="ml-2 bg-gray-300 px-2 py-1 rounded-full text-sm">3 items</span>
          </h3>
          <ul className="mt-2 space-y-2">
            <li className="p-2 bg-gray-100 rounded-md">🍎 Apples - 5kg</li>
            <li className="p-2 bg-gray-100 rounded-md">🥦 Broccoli - 2kg</li>
            <li className="p-2 bg-gray-100 rounded-md">🍞 Bread - 3 loaves</li>
          </ul>
        </div>
      )}

      {/* Collected Items Section */}
      {activeTab === "collected" && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Collected Items</h3>
          <p className="text-gray-500">No items collected yet.</p>
        </div>
      )}
    </div>
  );
};
import React, { useState } from "react";

const CompostRetailersDashboard = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [expiredFoodItems, setExpiredFoodItems] = useState([
    { id: 1, name: "Apples", quantity: "5kg" },
    { id: 2, name: "Broccoli", quantity: "2kg" },
    { id: 3, name: "Bread", quantity: "3 loaves" },
  ]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-6">
      {/* Heading */}
      <h1 className="text-2xl font-bold">Compost Retailers Dashboard</h1>
      <p className="text-gray-600">Find expired food items suitable for composting</p>

      {/* Tabs */}
      <div className="flex space-x-4 mt-4">
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "available" ? "bg-gray-200 font-semibold" : "bg-gray-100"
          }`}
          onClick={() => handleTabChange("available")}
        >
          Available Items
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "collected" ? "bg-gray-200 font-semibold" : "bg-gray-100"
          }`}
          onClick={() => handleTabChange("collected")}
        >
          Collected Items
        </button>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center space-x-4">
        <button className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700">
          + Register As Composter
        </button>
        <button className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100">
          Filter
        </button>
      </div>

      {/* Expired Food List */}
      {activeTab === "available" && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold flex items-center">
            Expired Food for Composting{" "}
            <span className="ml-2 bg-gray-300 px-2 py-1 rounded-full text-sm">
              {expiredFoodItems.length} items
            </span>
          </h3>
          <ul className="mt-2 space-y-2">
            {expiredFoodItems.map((item) => (
              <li key={item.id} className="p-2 bg-gray-100 rounded-md">
                {item.name} - {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Collected Items Section */}
      {activeTab === "collected" && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Collected Items</h3>
          <p className="text-gray-500">No items collected yet.</p>
        </div>
      )}
    </div>
  );
};

export default CompostRetailersDashboard;
export default CompostRetailersDashboard;
