// ADDED: Import useEffect and hooks/clients
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiLogOut, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import EditProfileModal from "./EditProfileModal";
import ConfirmationModal from "./ConfirmationModal";
import Notification from "./Notification";
import { useAuth } from "../context/AuthContext"; // ADDED
import { supabase } from "../lib/supabaseClient"; // ADDED

// REMOVED: mockUser object is no longer needed

function UserProfile() {
  // REMOVED: onLogout prop is no longer needed
  const navigate = useNavigate();

  // ADDED: Get user and signOut from our context
  const { user, signOut } = useAuth();

  // CHANGED: State is now for 'profile', loading, and errors
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  // ADDED: useEffect to fetch profile data when the component mounts
  // In UserProfile.jsx

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id) // ✅ Correct: Use user.id from the auth context
          .maybeSingle();

        console.log("Supabase fetch result:", {
          data,
          error,
          userId: user.id, // ✅ Correct
        });

        if (error) throw error;

        if (!data) {
          // This is a good place to consider creating a default profile
          // if one doesn't exist, but for now, an error is fine.
          setError("No profile found for this user.");
          return;
        }

        setProfile(data);
      } catch (err) {
        setError(err.message || "Failed to fetch profile.");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]); // Re-run this effect if the user object changes

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  // CHANGED: Use signOut from our context
  const handleConfirmLogout = async () => {
    await signOut();
    navigate("/");
    setShowLogoutConfirm(false);
  };

  // CHANGED: This function now updates the database
  // In UserProfile.jsx

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
        })
        .eq("id", user.id); // ✅ Correct: Use user.id here as well

      if (error) {
        throw error;
      }

      // Update local state to reflect changes immediately
      setProfile((prevProfile) => ({
        ...prevProfile,
        full_name: updatedData.name,
        phone_number: updatedData.phone,
        address: updatedData.address,
        profile_image_url: updatedData.profileImageUrl,
      }));

      setIsEditModalOpen(false);
      setNotification({ show: true, message: "Profile updated successfully!" });
    } catch (error) {
      setNotification({ show: true, message: `Error: ${error.message}` });
      console.error("Error updating profile:", error);
    }
  };

  // ADDED: Loading and error handling UI
  if (loading) {
    return <div className="text-center pt-48">Loading profile...</div>;
  }
  if (error) {
    return <div className="text-center pt-48 text-red-500">Error: {error}</div>;
  }
  if (!profile) {
    return (
      <div className="text-center pt-48">
        No profile found. Please log in again.
      </div>
    );
  }

  // NOTE: The entire return block below is the same, just with `user.` replaced by `profile.`
  // and database column names used (e.g., `profile.full_name`)
  return (
    <>
      <div className="bg-gray-50 min-h-screen pt-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <img
                src={profile.profile_image_url} // CHANGED
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 p-1"
              />
              <h2 className="text-2xl font-bold text-gray-800">
                {profile.full_name}
              </h2>{" "}
              {/* CHANGED */}
              <p className="text-sm text-gray-500 mt-1">
                Member since{" "}
                {new Date(profile.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}{" "}
                {/* CHANGED */}
              </p>
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition cursor-pointer"
                >
                  <FiEdit />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition cursor-pointer"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: User Details */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
                Account Details
              </h3>
              <ul className="space-y-5 text-gray-700">
                <li className="flex items-center text-lg">
                  <FiMail className="mr-4 text-gray-400 text-xl" />
                  <span className="font-medium">{profile.email}</span>{" "}
                  {/* CHANGED */}
                </li>
                <li className="flex items-center text-lg">
                  <FiPhone className="mr-4 text-gray-400 text-xl" />
                  <span className="font-medium">
                    {profile.phone_number || "Not provided"}
                  </span>{" "}
                  {/* CHANGED */}
                </li>
                <li className="flex items-center text-lg">
                  <FiMapPin className="mr-4 text-gray-400 text-xl" />
                  <span className="font-medium">
                    {profile.address || "Not provided"}
                  </span>{" "}
                  {/* CHANGED */}
                </li>
              </ul>
            </div>

            {/* My Properties section remains the same */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
                My Properties
              </h3>
              <div className="text-center text-gray-500 py-8">
                <p>You have not listed any properties yet.</p>
                <button className="mt-4 bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition cursor-pointer">
                  List a Property
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RENDER MODALS AND NOTIFICATIONS */}
      {isEditModalOpen && (
        <EditProfileModal
          // Pass the profile data in the shape the modal expects
          user={{
            name: profile.full_name,
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
