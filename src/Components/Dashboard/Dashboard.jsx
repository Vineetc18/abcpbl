import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaUserCheck } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import { IoSyncOutline } from "react-icons/io5";
import { GiDeadHead } from "react-icons/gi";
import { FiLogOut, FiPlus, FiFilter, FiUserPlus, FiAlertTriangle } from "react-icons/fi";
import Footer from "../../Pages/Homepage/Footer";
import Foodcard from "./Foodcard"; 

// Helper function to get CSRF token (important for DELETE)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [compostData, setCompostData] = useState([]);
  const [userDonations, setUserDonations] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isVolunteer, setIsVolunteer] = useState(false);

  const navigate = useNavigate();

  // Consolidated useEffect for initial load and auth
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First check auth
        await checkAuthStatus();
        
        // Then fetch data
        await fetchCompostData();
        
      } catch (err) {
        console.error("Dashboard initialization error:", err);
        setError("Failed to initialize dashboard. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  // Separate useEffect for handling refresh flag
  useEffect(() => {
    const handleRefresh = async () => {
      const needsRefresh = localStorage.getItem("refreshDashboard");
      console.log("Checking refresh flag:", needsRefresh);
      
      if (needsRefresh === "true") {
        try {
          setIsLoading(true);
          console.log("Refreshing dashboard data...");
          
          // Remove the flag first to prevent multiple refreshes
          localStorage.removeItem("refreshDashboard");
          
          // Fetch fresh data
          await fetchCompostData();
          
          // Check for last added donation
          const lastItemId = localStorage.getItem("lastAddedDonationId");
          console.log("Last added donation ID:", lastItemId);
          
          if (lastItemId && isAuthenticated) {
            console.log("Switching to donations tab for new item");
            setActiveTab("donations");
          }
        } catch (err) {
          console.error("Refresh error:", err);
          setError("Failed to refresh data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleRefresh();
  }, [isAuthenticated]);

  // Improved checkAuthStatus
  const checkAuthStatus = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/users/check_auth/", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Auth check failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.is_authenticated && data.user) {
        setIsAuthenticated(true);
        setUserData(data.user);
        setIsVolunteer(data.user.is_volunteer || false);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userData", JSON.stringify(data.user));
      } else {
        setIsAuthenticated(false);
        setUserData(null);
        setIsVolunteer(false);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userData");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setUserData(null);
      setIsVolunteer(false);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userData");
      throw error; // Re-throw to be caught by caller
    }
  };

  // Improved fetchCompostData
  const fetchCompostData = async () => {
    try {
      console.log("Fetching compost data...");
      const response = await fetch("http://localhost:8000/api/compost/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Authorization": `Bearer ${localStorage.getItem("token")}` // Add token if you have it
        }
      });

      console.log("API Response Status:", response.status);
      console.log("API Response Headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API response data:", JSON.stringify(data, null, 2));
      
      if (!Array.isArray(data)) {
        console.error("API returned non-array data:", data);
        throw new Error("API returned invalid data format");
      }

      // Log each item in the response
      data.forEach((item, index) => {
        console.log(`Item ${index}:`, JSON.stringify(item, null, 2));
      });

      processAndSetData(data);
    } catch (error) {
      console.error("Error fetching compost data:", error);
      setError("Failed to load donations. Please try again later.");
      throw error;
    }
  };

  // Improved processAndSetData
  const processAndSetData = (data) => {
    if (!Array.isArray(data)) {
      console.error("[processAndSetData] Invalid data format:", data);
      return;
    }

    console.log("[processAndSetData] Starting to process", data.length, "items");
    const now = new Date();
    const availableItems = [];
    const expiredItems = [];
    const userDonationsItems = [];

    // Get user ID once at the start
    let currentUserId = null;
    try {
      const storedUserData = JSON.parse(localStorage.getItem("userData") || "null");
      currentUserId = storedUserData?.id || null;
      console.log("[processAndSetData] Current user ID:", currentUserId);
      console.log("[processAndSetData] Stored user data:", storedUserData);
    } catch (e) {
      console.error("[processAndSetData] Error parsing userData:", e);
    }

    const lastAddedDonationId = localStorage.getItem("lastAddedDonationId");
    console.log("[processAndSetData] Last added donation ID:", lastAddedDonationId);

    data.forEach((item, index) => {
      if (!item.id) {
        console.warn(`[processAndSetData] Item ${index} missing ID:`, item);
        return;
      }

      console.log(`[processAndSetData] Processing item ${index}:`, item);

      // Check if the item belongs to the current user
      const isUserDonation = currentUserId && item.user && String(item.user.id) === String(currentUserId);
      const isRecentDonation = lastAddedDonationId === String(item.id);
      
      // Handle expiry date
      let expiryDate = null;
      if (item.expiresIn) {
        try {
          expiryDate = new Date(item.expiresIn);
          if (isNaN(expiryDate.getTime())) {
            expiryDate = null;
          }
        } catch (e) {
          console.error(`[processAndSetData] Error parsing expiry date for item ${item.id}:`, e);
        }
      }
      
      const isExpired = expiryDate && expiryDate < now;

      console.log(`[processAndSetData] Item ${index} flags:`, {
        isUserDonation,
        isRecentDonation,
        hasExpiryDate: !!expiryDate,
        isExpired,
        itemId: item.id
      });

      // Process the item with fallback values
      const processedItem = {
        ...item,
        id: String(item.id),
        title: item.title || "Food Donation",
        description: item.description || "No description provided",
        location: item.location || "No location specified",
        servings: parseInt(item.servings) || 1,
        foodType: item.foodType || "Others",
        expiresIn: item.expiresIn || null,
        phone: item.phone || "",
        email: item.email || "",
        image: item.image || null,
        status: item.status || "pending",
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString(),
        is_user_donation: isUserDonation,
        is_recent_donation: isRecentDonation,
        is_expired: isExpired,
        user: item.user || null
      };

      console.log(`[processAndSetData] Processed item ${index}:`, processedItem);

      // Sort into appropriate arrays
      if (isExpired) {
        expiredItems.push(processedItem);
      } else {
        availableItems.push(processedItem);
        if (isUserDonation) {
          userDonationsItems.push(processedItem);
        }
      }
    });

    console.log("[processAndSetData] Final counts:", {
      available: availableItems.length,
      userDonations: userDonationsItems.length,
      expired: expiredItems.length
    });

    // Sort items by creation date (newest first)
    const sortByDate = (a, b) => new Date(b.created_at) - new Date(a.created_at);
    
    availableItems.sort(sortByDate);
    userDonationsItems.sort(sortByDate);
    expiredItems.sort(sortByDate);

    console.log("[processAndSetData] Available items:", availableItems);
    console.log("[processAndSetData] User donations:", userDonationsItems);
    console.log("[processAndSetData] Expired items:", expiredItems);

    // Update all states in a single batch
    setCompostData(availableItems);
    setUserDonations(userDonationsItems);
    setExpiredItems(expiredItems);

    // Clear the lastAddedDonationId from localStorage
    if (lastAddedDonationId) {
      localStorage.removeItem("lastAddedDonationId");
    }
  };

  // Define tabs here, possibly dependent on volunteer status
  const tabs = [
    { id: "available", label: "Available Donations", icon: <FaBoxOpen /> },
    { id: "donations", label: "My Donations", icon: <MdFastfood /> },
    // Conditionally add volunteer tab if needed (example)
    ...(isVolunteer ? [{ id: "pickups", label: "My Pickups", icon: <IoSyncOutline /> }] : []),
    { id: "expired", label: "Expired", icon: <GiDeadHead /> },
  ];

  // Handle Logout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/users/logout_user/", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Remove login status from localStorage
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Navigate to Report Food page
  const handleReportFood = () => {
    navigate("/update"); // Navigate to the create/update form
  };

  // Function to delete a food donation
  const handleDeleteDonation = async (id) => {
    if (!id) {
      console.error("No donation ID provided for deletion");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this donation? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    console.log(`Attempting to delete donation with ID: ${id}`);

    try {
      const csrfToken = getCookie('csrftoken'); // Get CSRF token
      if (!csrfToken) {
          throw new Error("CSRF token not found. Cannot delete.");
      }
      
      const response = await fetch(`http://localhost:8000/api/compost/${id}/`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken, // Include CSRF token
          "X-Requested-With": "XMLHttpRequest"
        }
      });

      if (response.ok || response.status === 204) { // 204 No Content is success for DELETE
        console.log(`Successfully deleted donation ${id} from the API`);
        
        // --- Optimistic UI Update --- 
        // Remove directly from state for immediate feedback
        setUserDonations(prev => prev.filter(item => String(item.id) !== String(id)));
        setCompostData(prev => prev.filter(item => String(item.id) !== String(id)));
        setExpiredItems(prev => prev.filter(item => String(item.id) !== String(id)));
        // --- End Optimistic UI Update --- 

        // Optionally show a success message (alert or a state-based message)
        // setMessage({ type: 'success', text: 'Donation deleted successfully!' }); 
        alert("Donation successfully deleted!"); 

        // Alternatively, refetch data to confirm, but optimistic is faster UI:
        // await fetchCompostData(); 
        
      } else {
        // Handle failed deletion
        console.error(`Failed to delete donation ${id} from API: ${response.status} ${response.statusText}`);
        const errorData = await response.text(); // Try to get error details
        setError(`Failed to delete: ${response.statusText} - ${errorData}`);
        alert(`Failed to delete donation. Server responded with status ${response.status}.`);
      }
      
    } catch (error) {
      console.error("Error during delete request:", error);
      setError(`An error occurred while trying to delete: ${error.message}`);
      alert("An error occurred while trying to delete the donation. Please check the console.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGGING STATE BEFORE RENDER ---
  console.log("[Dashboard RENDER] State before return:", { 
    isLoading, 
    error, 
    activeTab, 
    compostDataCount: compostData.length, 
    userDonationsCount: userDonations.length,
    // Log first item if exists for quick check
    firstCompostItem: compostData[0] || null,
    firstUserDonation: userDonations[0] || null,
    isAuthenticated,
    userData
  });
  // --- END LOGGING STATE BEFORE RENDER ---

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Debug Info */}
        <div className="bg-gray-100 p-4 mb-4 rounded-lg text-sm">
          <p>Debug Info:</p>
          <ul className="list-disc pl-4">
            <li>Active Tab: {activeTab}</li>
            <li>Available Items: {compostData.length}</li>
            <li>User Donations: {userDonations.length}</li>
            <li>Expired Items: {expiredItems.length}</li>
            <li>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</li>
            <li>User ID: {userData?.id || 'Not logged in'}</li>
          </ul>
        </div>

        {/* Reverted Header Buttons */}
        <div className="flex justify-between items-center mb-6 w-full">
           <h1 className="text-2xl font-bold pr-180">Dashboard</h1>
           <div className="flex items-center gap-3">
             {/* Re-add refresh button if needed, or keep simplified */} 
             {/* Example re-add refresh:
             <button 
               onClick={async () => { 
                 setIsLoading(true); 
                 await fetchCompostData(); 
                 setIsLoading(false); 
               }}
               className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-blue-700 transition cursor-pointer"
             >
               <FaSync /> Refresh
             </button> 
             */} 
             {isAuthenticated && (
                <button
                  onClick={handleReportFood}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-green-700 transition cursor-pointer"
                >
                  <FiPlus /> Report Food
                </button>
             )}
             <button
                onClick={handleLogout}
                className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 hover:text-white active:bg-orange-600 transition cursor-pointer"
             >
               <FiLogOut /> Logout
             </button>
           </div>
         </div>

        {/* Optional Welcome Banner */}
         {/* <div className="bg-gray-100 p-4 rounded-lg shadow">
           <p className="font-semibold">Welcome, {userData ? userData.username : 'User'}!</p>
           <p className="text-gray-600 text-sm">
             Thank you for being part of our food-sharing community.
           </p>
         </div> */}

        {/* Reverted Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-100 rounded-lg p-3 mt-6">
          {tabs.map((tab) => (
            // Only render 'My Donations' tab if authenticated
            (tab.id !== 'donations' || isAuthenticated) && (tab.id !== 'pickups' || (isAuthenticated && isVolunteer)) && (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} // Tab change triggers useEffect
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer
                  ${activeTab === tab.id ? "bg-white shadow-md text-green-600 border border-green-500" : "text-gray-600 hover:bg-green-500 hover:text-white active:bg-white-600"}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            )
          ))}
        </div>

        {/* Reverted Content Header */}
        <div className="flex justify-between items-center mt-6">
           <h2 className="font-semibold text-lg">
             {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
           </h2>
           {/* Optional extra info/buttons here if needed */} 
           <div className="flex items-center gap-2 pr-160">
              {/* Example: Filter button */} 
              {/* <button className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 hover:text-white active:bg-orange-600 transition cursor-pointer">
                 <FiFilter /> Filter
               </button> */}
              
              {/* Volunteer button logic - Reverted */}
              {isAuthenticated && ( // Only show if logged in
                 isVolunteer ? (
                   <button
                     onClick={() => navigate("/volunteer-profile")}
                     className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-medium hover:bg-green-500 hover:text-white active:bg-green-600 transition cursor-pointer"
                   >
                     <FaUserCheck /> Volunteer Profile
                   </button>
                 ) : (
                   <button 
                     onClick={() => navigate("/volunteer")}
                     className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 hover:text-white active:bg-orange-600 transition cursor-pointer"
                   >
                     <FiUserPlus /> Become a Volunteer
                   </button>
                 )
               )}
           </div>
         </div>

        {/* Loading and Error States (remain the same) */} 
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mx-auto max-w-3xl text-center">
            {error}
          </div>
        ) : (
          /* Content Area - Rendering logic remains mostly the same */
          <div className="flex flex-wrap gap-8 mt-6 p-6">
            {/* Available Donations Tab */}
            {activeTab === "available" && (
              <>
                {compostData.length > 0 ? (
                  compostData.map((item) => (
                    <Foodcard 
                      key={item.id} 
                      item={item} 
                      onDelete={item.is_user_donation ? handleDeleteDonation : undefined}
                      onEdit={item.is_user_donation ? () => {
                        localStorage.setItem("editDonationId", item.id);
                        navigate("/update?edit=true");
                      } : undefined}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center w-full">
                    <h2 className="text-lg font-semibold">No Available Donations</h2>
                    <p className="text-gray-500 mt-2">There are currently no available food donations listed.</p>
                  </div>
                )}
              </>
            )}

            {/* My Donations Tab */}
            {activeTab === "donations" && isAuthenticated && (
              <>
                {userDonations.length > 0 ? (
                  userDonations.map((item) => (
                    <Foodcard 
                      key={item.id} 
                      item={item} 
                      onDelete={handleDeleteDonation}
                      onEdit={() => {
                        localStorage.setItem("editDonationId", item.id);
                        navigate("/update?edit=true");
                      }}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center w-full">
                    <h2 className="text-lg font-semibold">No Donations Found</h2>
                    <p className="text-gray-500 mt-2">You haven't reported any food donations yet.</p>
                    <button 
                      onClick={handleReportFood}
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Report Your First Donation
                    </button>
                  </div>
                )}
              </>
            )}

            {/* My Pickups Tab Example (if volunteer logic is used) */}
            {activeTab === "pickups" && isAuthenticated && isVolunteer && (
                 <div className="bg-white shadow-md rounded-lg p-6 text-center w-full">
                   <h2 className="text-lg font-semibold">My Pickups</h2>
                   <p className="text-gray-600">Pickup functionality to be implemented.</p>
                 </div>
            )}

            {/* Expired Food Items Tab */}
            {activeTab === "expired" && (
              <>
                {expiredItems.length > 0 ? (
                  <>
                    <div className="w-full bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            These items have passed their expiration date. Handle appropriately.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex flex-wrap gap-8">
                      {expiredItems.map((item) => (
                        <Foodcard 
                          key={item.id} 
                          item={item} 
                          onDelete={item.is_user_donation ? handleDeleteDonation : undefined}
                          showDeleteOption={item.is_user_donation} 
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center w-full">
                    <h2 className="text-lg font-semibold">No Expired Items</h2>
                    <p className="text-gray-500 mt-2">There are no expired donations recorded.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
