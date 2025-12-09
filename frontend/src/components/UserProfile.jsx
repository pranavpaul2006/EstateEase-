import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiEdit,
  FiLogOut,
  FiMail,
  FiPhone,
  FiMapPin,
  FiTrash2,
} from "react-icons/fi";
import EditProfileModal from "./EditProfileModal";
import ConfirmationModal from "./logout_box";
import Notification from "./Notification";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

function UserProfile({
  bookings,
  onDeleteBooking,
}) {
  const { user, signOut } = useAuth();

  const [profile, setProfile] = useState(null);
  const [listedProperties, setListedProperties] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [bookingToDelete, setBookingToDelete] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 1. Fetch User Profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') throw profileError;
        
        let currentProfile = profileData;
        if (!profileData) {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([{ id: user.id, email: user.email, full_name: user.email?.split('@')[0] || 'User' }])
            .select().single();
          if (createError) throw createError;
          currentProfile = newProfile;
        }
        setProfile(currentProfile);

        // 2. Fetch Listed Properties with their related images
        const { data: propertiesData, error: propertiesError } = await supabase
          .from("properties")
          .select(`
            *,
            property_images (
              image_url,
              is_primary
            )
          `)
          .eq("owner_id", user.id);

        if (propertiesError) throw propertiesError;
        setListedProperties(propertiesData || []);

      } catch (err) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };
  
  const handleConfirmLogout = async () => {
    try {
      console.log('🔄 Starting logout process...');
      await signOut();
      console.log('✅ Signed out from Supabase');
      localStorage.clear();
      console.log('✅ Cleared local storage');
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Logout error:', error);
      window.location.href = '/';
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const handleSaveProfile = async (updatedData) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: updatedData.name,
          phone_number: updatedData.phone,
          address: updatedData.address,
          profile_image_url: updatedData.profileImageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev) => ({ ...prev, ...updatedData, full_name: updatedData.name, phone_number: updatedData.phone }));
      setIsEditModalOpen(false);
      setNotification({ show: true, message: "Profile updated successfully!" });
    } catch (error) {
      setNotification({ show: true, message: `Error: ${error.message}` });
    }
  };

  const handleConfirmDelete = async () => {
    if (!bookingToDelete || !user) {
      setBookingToDelete(null);
      return;
    }

    try {
      // 1. Delete from Supabase using the correct ID
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('appointment_id', bookingToDelete.id) // Use the ID passed to the modal
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // 2. Update the state in App.js by calling the prop
      console.log("Deleted. Updating UI...");
      onDeleteBooking(bookingToDelete.id); 

      // 3. Close the modal
      setBookingToDelete(null);

    } catch (error) {
      console.error("Error deleting appointment:", error);
      setNotification({ show: true, message: `Error: ${error.message}` });
      setBookingToDelete(null); // Close modal even on error
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-center py-40 text-red-500">Error: {error}</div>;
  if (!profile) return <div className="text-center py-40">No profile found.</div>;

  return (
    <>
      <div className="bg-gray-50 min-h-screen pt-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <img
                src={profile.profile_image_url || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 p-1 object-cover"
              />
              <h2 className="text-2xl font-bold text-gray-800">{profile.full_name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Member since{" "}
                {new Date(profile.created_at).toLocaleDateString("en-US", {
                  month: "long", year: "numeric",
                })}
              </p>
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  <FiEdit /> <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  <FiLogOut /> <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Account Details Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">Account Details</h3>
              <ul className="space-y-5 text-gray-700">
                <li className="flex items-center text-lg">
                  <FiMail className="mr-4 text-gray-400 text-xl" />
                  <span className="font-medium">{profile.email}</span>
                </li>
                <li className="flex items-center text-lg">
                  <FiPhone className="mr-4 text-gray-400 text-xl" />
                  <span className="font-medium">{profile.phone_number || "Not provided"}</span>
                </li>
                <li className="flex items-center text-lg">
                  <FiMapPin className="mr-4 text-gray-400 text-xl" />
                  <span className="font-medium">{profile.address || "Not provided"}</span>
                </li>
              </ul>
            </div>

            {/* ========== MODIFIED BLOCK START ========== */}
            {/* Booking History Card (uses `bookings` prop) */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">Booking History</h3>
              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    // --- Start of robust data handling ---
                    
                    // 1. Get the nested property object, with a fallback
                    const property = booking.properties || {};

                    // 2. Get image URL, checking for nested arrays
                    const primaryImage = property.property_images?.find(img => img.is_primary);
                    const displayImageUrl = primaryImage?.image_url || property.property_images?.[0]?.image_url || booking.img || "https://via.placeholder.com/150";

                    // 3. Format the date, with a fallback
                    let formattedDate = "Invalid Date"; // Default
                    if (booking.appointment_date) {
                      try {
                        formattedDate = new Date(booking.appointment_date).toLocaleDateString("en-US", {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        });
                      } catch (e) {
                        console.error("Could not parse date:", booking.appointment_date);
                        // formattedDate remains "Invalid Date"
                      }
                    } else if (booking.bookingDate) {
                      // Fallback to original prop data if it exists
                      formattedDate = booking.bookingDate;
                    } else {
                      formattedDate = "No date provided";
                    }

                    // 4. Get title and location, with fallbacks
                    const displayTitle = property.title || booking.location || "Property Title Not Found";
                    const displayLocation = property.location || booking.type || "Property Location Not Found";
                    
                    // 5. Use the correct ID for deletion
                    const bookingId = booking.appointment_id || booking.id;

                    // --- End of robust data handling ---

                    return (
                      <div key={bookingId} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                        <img 
                          src={displayImageUrl} 
                          alt={displayTitle} 
                          className="w-24 h-20 object-cover rounded-md" 
                        />
                        <div className="flex-grow">
                          <p className="font-bold text-gray-800">{displayTitle}</p>
                          <p className="text-sm text-gray-600">{displayLocation}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-700">Booked for:</p>
                          <p className="text-sm text-blue-600">{formattedDate}</p>
                        </div>
                        <button 
                          onClick={() => setBookingToDelete({ 
                            id: bookingId, // Use the correct ID
                            location: displayTitle // Use for the confirmation message
                          })} 
                          className="p-2 text-gray-400 hover:text-red-500 rounded-full transition"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8"><p>You have no booking history yet.</p></div>
              )}
            </div>
            {/* ========== MODIFIED BLOCK END ========== */}


            {/* My Listed Properties Card (uses local `listedProperties` state) */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">My Listed Properties</h3>
              {listedProperties && listedProperties.length > 0 ? (
                <div className="space-y-4">
                  {listedProperties.map((property) => {
                    const primaryImage = property.property_images.find(img => img.is_primary);
                    const displayImageUrl = primaryImage ? primaryImage.image_url : property.property_images?.[0]?.image_url;

                    return (
                      <div key={property.property_id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                        <img 
                          src={displayImageUrl || "https://via.placeholder.com/150"} 
                          alt={property.location} 
                          className="w-24 h-20 object-cover rounded-md" 
                        />
                        <div className="flex-grow">
                          <p className="font-bold text-gray-800">{property.title}</p>
                          <p className="text-sm text-gray-600">{property.location}</p>
                          <p className="text-sm font-semibold text-green-600">₹{parseInt(property.price).toLocaleString()}</p>
                        </div>
                        <Link to={`/property/${property.property_id}`}>
                          <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-blue-600">View Details</button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>You have not listed any properties yet.</p>
                  <Link to="/sell">
                    <button className="mt-4 bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600">List a Property</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RENDER MODALS AND NOTIFICATIONS */}
      
      {isEditModalOpen && (
        <EditProfileModal
          user={{
            name: profile.full_name,
            email: profile.email,
            phone: profile.phone_number,
            address: profile.address,
            profileImageUrl: profile.profile_image_url,
          }}
          onSave={handleSaveProfile}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      {showLogoutConfirm && (
        <ConfirmationModal
          message="Are you sure you want to log out?"
          onConfirm={handleConfirmLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
      {bookingToDelete && (
        <ConfirmationModal
          message={`Are you sure you want to delete the booking for ${bookingToDelete.location}?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setBookingToDelete(null)}
        />
      )}
      {notification.show && (
        <Notification
          message={notification.message}
          onClose={() => setNotification({ show: false, message: "" })}
        />
      )}
    </>
  );
}

export default UserProfile;