import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  onLogout,
  bookings,
  setBookings, // 1. We will use this prop
  onDeleteBooking, // 2. This prop will now be ignored
  listedProperties,
}) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });
  const [bookingToDelete, setBookingToDelete] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
    if (!user || !user.id) { // This check is correct
      setLoading(false);
      return;
    }

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        console.log("Supabase fetch result:", { data, error, userId: user.id });

        if (error) throw error;

        if (!data) {
          // Create a new profile if one doesn't exist
          console.log("Creating new profile for user:", user.id);
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([
              {
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                phone_number: '',
                address: '',
                profile_image_url: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error("Error creating profile:", createError);
            throw createError;
          }
          
          console.log("New profile created:", newProfile);
          setProfile(newProfile);
        } else {
          console.log("Existing profile found:", data);
          setProfile(data);
        }
      } catch (err) {
        console.error("Error in fetchProfile:", err);
        setError(err.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // This useEffect fetches appointments and populates the parent state
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user || !user.id) return; // This check is correct

      console.log("--- STARTING TEST FETCH ---");
      console.log("Fetching appointments for user.id:", user.id);

      try {
        // This is a SIMPLE query with NO JOINS
        const { data, error } = await supabase
          .from("appointments")
          .select(`*`) // Select only from appointments
          .eq("user_id", user.id)
          .order("meeting_time", { ascending: false });

        console.log("TEST FETCH DATA:", data);
        console.log("TEST FETCH ERROR:", error);

        if (error) throw error;

        // Convert appointments to booking history format
        const bookingHistory = (data || []).map(appointment => ({
          //
          // ***** THIS IS THE ONLY LINE I CHANGED *****
          id: appointment.appointment_id,
          //
          //
          location: "Test Location (ID: " + appointment.property_id.slice(0, 8) + "...",
          type: "Test Appointment",
          img: "https://via.placeholder.com/150",
          bookingDate: new Date(appointment.meeting_time).toLocaleDateString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }));

        console.log("MAPPED TEST HISTORY:", bookingHistory);
        
        // This updates the state in the parent component
        setBookings(bookingHistory); 

      } catch (err) {
        console.error("Error in test fetch:", err);
      }
    };

    fetchAppointments();
  }, [user?.id, setBookings]); // This is correct for your structure

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };
  
  const handleConfirmLogout = async () => {
    try {
      console.log('🔄 Starting logout process...');
      
      // Sign out from Supabase
      await signOut();
      console.log('✅ Signed out from Supabase');
      
      // Clear any local storage
      localStorage.clear();
      console.log('✅ Cleared local storage');
      
      // Force redirect to home page
      window.location.href = '/';
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still redirect even if there's an error
      window.location.href = '/';
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  // SINGLE handleSaveProfile function
  const handleSaveProfile = async (updatedData) => {
    if (!user) return;

    try {
      console.log("Updating profile with data:", updatedData);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: updatedData.name,
          email: updatedData.email,
          phone_number: updatedData.phone,
          address: updatedData.address,
          profile_image_url: updatedData.profileImageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }

      // Update local state to reflect changes immediately
      setProfile((prevProfile) => ({
        ...prevProfile,
        full_name: updatedData.name,
        email: updatedData.email,
        phone_number: updatedData.phone,
        address: updatedData.address,
        profile_image_url: updatedData.profileImageUrl,
      }));

      setIsEditModalOpen(false);
      setNotification({ show: true, message: "Profile updated successfully!" });
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({ show: true, message: `Error: ${error.message}` });
    }
  };

  // This function is correct.
  const handleConfirmDelete = async () => {
    if (!bookingToDelete || !user) {
      setBookingToDelete(null);
      return;
    }

    try {
      // 1. Delete from Supabase (logic is now here)
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('appointment_id', bookingToDelete.id) // This will now work
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // 2. Update the state in App.js by calling setBookings
      console.log("Deleted. Updating UI...");
      setBookings(prevBookings => 
        prevBookings.filter(b => b.id !== bookingToDelete.id)
      );

      // 3. Close the modal
      setBookingToDelete(null);

    } catch (error) {
      console.error("Error deleting appointment:", error);
      setNotification({ show: true, message: `Error: ${error.message}` });
      setBookingToDelete(null); // Close modal even on error
    }
  };

  // Loading and error handling UI
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold">Error loading profile</p>
          <p className="mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="bg-gray-50 min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">No profile found.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

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
              <h2 className="text-2xl font-bold text-gray-800">
                {profile.full_name}
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

            {/* Booking History */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
                Booking History
              </h3>
              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={`${booking.id}-${booking.bookingDate}`}
                      className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <img
                        src={booking.img}
                        alt={booking.location}
                        className="w-24 h-20 object-cover rounded-md"
                      />
                      <div className="flex-grow">
                        <p className="font-bold text-gray-800">
                          {booking.location}
                        </p>
                        <p className="text-sm text-gray-600">{booking.type}</p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-semibold text-gray-700">
                          Booked for:
                        </p>
                        <p className="text-sm text-blue-600">
                          {booking.bookingDate}
                        </p>
                      </div>
                      <button
                        onClick={() => setBookingToDelete(booking)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition cursor-pointer"
                        aria-label="Delete booking"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>You have no booking history yet.</p>
                </div>
              )}
            </div>

            {/* My Listed Properties */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mt-8 mb-10">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
                My Listed Properties
              </h3>
              {listedProperties && listedProperties.length > 0 ? (
                <div className="space-y-4">
                  {listedProperties.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <img
                        src={
                          property.images[0]?.preview ||
                          "https://via.placeholder.com/150"
                        }
                        alt={property.location}
                        className="w-24 h-20 object-cover rounded-md"
                      />
                      <div className="flex-grow">
                        <p className="font-bold text-gray-800">
                          {property.location}
                        </p>
                        <p className="text-sm text-gray-600">
                          {property.propertyType}
                        </p>
                        <p className="text-sm font-semibold text-green-600">
                          ₹{parseInt(property.price).toLocaleString()}
                        </p>
                      </div>
                      <Link to={`/property/${property.id}`}>
                        <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition cursor-pointer">
                          View Details
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>You have not listed any properties yet.</p>
                  <Link to="/sell">
                    <button className="mt-4 bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition cursor-pointer">
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

      {/* 3. REMOVED DUPLICATE BOOKING HISTORY BLOCK FROM HERE */}

      {isEditModalOpen && (
        <EditProfileModal
          user={{
            name: profile.full_name,
            email: profile.email, // Make sure email is passed
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