import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import {
  FiEdit,
  FiLogOut,
  FiMail,
  FiPhone,
  FiMapPin,
  FiTrash2,
} from "react-icons/fi";
import EditProfileModal from "./EditProfileModal";
import ConfirmationModal from "./logout_box"; // Assuming this is your logout confirm modal
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import Notification from "./Notification"; // Assuming you have this component

// This component is now self-sufficient and fetches all its own data.
// The props 'bookings', 'onDeleteBooking', and 'listedProperties' have been removed.
function UserProfile() {
  const { user, signOut } = useAuth();

  const [profile, setProfile] = useState(null);
  const [listedProperties, setListedProperties] = useState([]);
  const [bookings, setBookings] = useState([]); // ✅ Manages its own bookings state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modals and notifications
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });
  const [itemToDelete, setItemToDelete] = useState(null); // Generic state for deleting bookings or properties

  useEffect(() => {
    const fetchAllUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 1. Fetch User Profile (with create-if-not-exists logic)
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (profileError && profileError.code !== "PGRST116")
          throw profileError;

        let currentProfile = profileData;
        if (!profileData) {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([{ id: user.id, email: user.email }])
            .select()
            .single();
          if (createError) throw createError;
          currentProfile = newProfile;
        }
        setProfile(currentProfile);

        // 2. Fetch User's Listed Properties
        const { data: propertiesData, error: propertiesError } = await supabase
          .from("properties")
          .select(`*, property_images (image_url, is_primary)`)
          .eq("owner_id", user.id);
        if (propertiesError) throw propertiesError;
        setListedProperties(propertiesData || []);

        // 3. Fetch User's Booking History
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("appointments")
          .select(
            `appointment_id, meeting_time, properties!inner (property_id, title, location, property_images (image_url, is_primary))`
          )
          .eq("user_id", user.id);
        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllUserData();
  }, [user]);

  // --- Single, Correct Handler Functions ---

  const handleSaveProfile = async (updatedData) => {
    /* ... (Your existing logic is good) ... */
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
      setProfile((prev) => ({
        ...prev,
        full_name: updatedData.name,
        phone_number: updatedData.phone,
        address: updatedData.address,
        profile_image_url: updatedData.profileImageUrl,
      }));
      setIsEditModalOpen(false);
      setNotification({ show: true, message: "Profile updated successfully!" });
    } catch (error) {
      setNotification({ show: true, message: `Error: ${error.message}` });
    }
  };

  const handleLogoutClick = () => setShowLogoutConfirm(true);

  const handleConfirmLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      // This function can now be used for deleting bookings or properties in the future
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("appointment_id", itemToDelete.appointment_id);
      if (error) throw error;

      // Update the local state to instantly remove the item from the UI
      setBookings((prev) =>
        prev.filter((b) => b.appointment_id !== itemToDelete.appointment_id)
      );
      setNotification({
        show: true,
        message: "Booking cancelled successfully.",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      setNotification({ show: true, message: `Error: ${error.message}` });
    } finally {
      setItemToDelete(null); // Close the confirmation modal
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return <div className="text-center py-40 text-red-500">Error: {error}</div>;
  if (!user || !profile)
    return (
      <div className="text-center py-40">
        <p>Please log in to view your profile.</p>
        <Link to="/login">
          <button className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg">
            Login
          </button>
        </Link>
      </div>
    );

  return (
    <>
      <div className="bg-gray-50 min-h-screen pt-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            {/* ... (Your profile card JSX is good) ... */}
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center sticky top-28">
              <img
                src={
                  profile.profile_image_url ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${profile.email}`
                }
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 p-1 object-cover"
              />
              <h2 className="text-2xl font-bold text-gray-800">
                {profile.full_name || profile.email}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Member since{" "}
                {new Date(profile.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
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
              {/* ... (Your account details JSX is good) ... */}
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
                Account Details
              </h3>
              <ul className="space-y-5 text-gray-700">
                <li className="flex items-center text-lg">
                  <FiMail className="mr-4 text-gray-400 text-xl" />
                  <span className="font-medium">{profile.email}</span>
                </li>
                <li className="flex items-center text-lg">
                  <FiPhone className="mr-4 text-gray-400 text-xl" />
                  <span className="font-medium">
                    {profile.phone_number || "Not provided"}
                  </span>
                </li>
                <li className="flex items-center text-lg">
                  <FiMapPin className="mr-4 text-gray-400 text-xl" />
                  <span className="font-medium">
                    {profile.address || "Not provided"}
                  </span>
                </li>
              </ul>
            </div>

            {/* ✅ Booking History Card (Updated JSX) */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
                My Appointments
              </h3>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const property = booking.properties; // easier access to nested property
                    const image =
                      property.property_images?.find((img) => img.is_primary)
                        ?.image_url ||
                      property.property_images?.[0]?.image_url ||
                      "https://via.placeholder.com/150";
                    return (
                      <div
                        key={booking.appointment_id}
                        className="flex items-center gap-4"
                      >
                        <img
                          src={image}
                          alt={property.title}
                          className="w-24 h-20 object-cover rounded-md"
                        />
                        <div className="flex-grow">
                          <p className="font-bold text-gray-800">
                            {property.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {property.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-700">
                            Appointment for:
                          </p>
                          <p className="text-sm text-blue-600">
                            {new Date(
                              booking.meeting_time
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => setItemToDelete(booking)}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-full transition"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>You have no upcoming appointments.</p>
                </div>
              )}
            </div>

            {/* My Listed Properties Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
              {/* ... (Your listed properties JSX is good) ... */}
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
                My Listed Properties
              </h3>
              {listedProperties.length > 0 ? (
                <div className="space-y-4">
                  {listedProperties.map((property) => {
                    const image =
                      property.property_images?.find((img) => img.is_primary)
                        ?.image_url ||
                      property.property_images?.[0]?.image_url ||
                      "https://via.placeholder.com/150";
                    return (
                      <div
                        key={property.property_id}
                        className="flex items-center gap-4"
                      >
                        <img
                          src={image}
                          alt={property.title}
                          className="w-24 h-20 object-cover rounded-md"
                        />
                        <div className="flex-grow">
                          <p className="font-bold text-gray-800">
                            {property.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {property.location}
                          </p>
                        </div>
                        <Link to={`/property/${property.property_id}`}>
                          <button className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">
                            View Details
                          </button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>You have not listed any properties yet.</p>
                  <Link to="/sell">
                    <button className="mt-4 bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600">
                      List a Property
                    </button>
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
      {itemToDelete && (
        <ConfirmationModal
          message={`Are you sure you want to cancel this appointment?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setItemToDelete(null)}
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
