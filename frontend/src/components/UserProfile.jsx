import React from "react";
// For icons, you can install react-icons by running: npm install react-icons
import { FiEdit, FiLogOut, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

// This is mock data. In your real application, you would pass the
// logged-in user's data as a prop to this component.
const mockUser = {
  name: "Alex Doe",
  email: "alex.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Dream Lane, Reality City, RC 12345",
  profileImageUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d", // A random user avatar
  memberSince: "September 2025",
};

function UserProfile({ user = mockUser }) {
  const handleLogout = () => {
    // Implement your logout logic here
    alert("Logout button clicked!");
  };

  return (
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
              <button className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition">
                <FiEdit />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
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

          <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
              My Properties
            </h3>
            <div className="text-center text-gray-500 py-8">
              <p>You have not listed any properties yet.</p>
              <button className="mt-4 bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition">
                List a Property
              </button>
            </div>
            {/* When the user has properties, you can map over them here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;