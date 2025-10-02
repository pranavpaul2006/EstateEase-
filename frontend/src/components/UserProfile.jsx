import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit, FiLogOut, FiMail, FiPhone, FiMapPin, FiTrash2 } from "react-icons/fi";
import EditProfileModal from "./EditProfileModal";
import ConfirmationModal from "./logout_box";
import Notification from "./Notification";

const mockUser = {
  name: "Lalu Alex",
  email: "lalualex69@gmail.com",
  phone: "+91 999 666 9996",
  address: "69 Karimbara, Kochi",
  profileImageUrl:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGfC9PJo1bEymgxVSsY9cdvyme3gfUxyVXlw&s",
  memberSince: "September 2025",
};

// Component now accepts all necessary props from App.jsx
function UserProfile({ onLogout, bookings, onDeleteBooking, listedProperties }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(mockUser);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });
  
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    onLogout();
    navigate("/");
    setShowLogoutConfirm(false);
  };

  const handleSaveProfile = (updatedData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedData }));
    setIsEditModalOpen(false);
    setNotification({ show: true, message: "Profile updated successfully!" });
  };
  
  const handleConfirmDelete = () => {
    if (bookingToDelete) {
      onDeleteBooking(bookingToDelete.id, bookingToDelete.bookingDate);
      setBookingToDelete(null);
    }
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen pt-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 p-1"
              />
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Member since {user.memberSince}
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
                  <span className="font-medium">{user.email}</span>
                </li>
                <li className="flex items-center text-lg">
                  <FiPhone className="mr-4 text-gray-400 text-xl" />
                  <span className="font-medium">{user.phone}</span>
                </li>
                <li className="flex items-center text-lg">
                  <FiMapPin className="mr-4 text-gray-400 text-xl" />
                  <span className="font-medium">{user.address}</span>
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
                    <div key={`${booking.id}-${booking.bookingDate}`} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                      <img src={booking.img} alt={booking.location} className="w-24 h-20 object-cover rounded-md" />
                      <div className="flex-grow">
                        <p className="font-bold text-gray-800">{booking.location}</p>
                        <p className="text-sm text-gray-600">{booking.type}</p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-semibold text-gray-700">Booked for:</p>
                        <p className="text-sm text-blue-600">{booking.bookingDate}</p>
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
                    <div key={property.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                      <img src={property.images[0]?.preview || 'https://via.placeholder.com/150'} alt={property.location} className="w-24 h-20 object-cover rounded-md" />
                      <div className="flex-grow">
                        <p className="font-bold text-gray-800">{property.location}</p>
                        <p className="text-sm text-gray-600">{property.propertyType}</p>
                        <p className="text-sm font-semibold text-green-600">₹{parseInt(property.price).toLocaleString()}</p>
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
      {isEditModalOpen && (
        <EditProfileModal
          user={user}
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