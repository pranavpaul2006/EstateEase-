import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import Notification from "../components/Notification"; // It's good practice to have a notification

const Property = ({ properties, onBookProperty, currentUser }) => {
  const { id } = useParams();
  
  // Find the specific property from the list passed down from App.jsx
  const property = properties.find((p) => p.id === parseInt(id));

  // Appointment-related state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showModal, setShowModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("idle");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "" });

  // No longer need to fetch data here, as it comes from props

  if (!properties || properties.length === 0) {
    return <div className="text-center mt-20">Loading property details...</div>;
  }
  
  if (!property) {
    return <div className="text-center mt-20">Property not found.</div>;
  }

  const handleBookClick = () => {
    setError("");
    if (!currentUser) {
      setError("Please log in to book an appointment.");
      return;
    }
    if (!selectedDate) {
      setError("Please select a date before booking.");
      return;
    }
    setBookingStatus("idle");
    setShowModal(true);
  };

  const handleConfirmBooking = () => {
    setBookingStatus("booked");
    
    try {
      // Create a unique storage key based on the current user's ID
      const storageKey = `estateBookings_${currentUser.id}`;

      const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
      existing.push({
        propertyId: property.id,
        title: property.title,
        date: selectedDate,
        bookedAt: new Date().toISOString(),
      });
      localStorage.setItem(storageKey, JSON.stringify(existing));

      if (onBookProperty) {
        onBookProperty();
      }
    } catch (e) {
      // ignore localStorage errors silently
    }
  };

  const closeModal = () => {
    setShowModal(false);
    // Reset status only if it wasn't a successful booking
    if (bookingStatus !== "booked") {
      setBookingStatus("idle");
    }
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen pt-20 pb-10">
        <div className="w-full mx-auto flex flex-col px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-32">
          {/* TOP SECTION: Image + Core Details */}
          <div className="grid grid-cols-1 pt-12 lg:grid-cols-2 gap-8  lg:gap-12 xl:gap-16">
            <div className="flex items-center justify-center">
              <img src={property.img} alt={property.title} className="w-full h-64 sm:h-60 md:h-[450px] lg:h-[500px] xl:h-[400px] object-cover rounded-xl shadow-lg" />
            </div>

            <div className="flex flex-col justify-center space-y-6 lg:space-y-8 ">
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full w-max ${property.status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {property.status}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-600 text-base sm:text-lg lg:text-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{property.location}</span>
              </div>
              <div className="flex flex-wrap gap-x-10 gap-y-6 pt-4 text-gray-800">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Price</span>
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
                    {property.price}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Area</span>
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
                    {property.area}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: Description + Appointment */}
          <div className="mt-10 pt-8 border-t border-gray-300">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mb-4">
              About this property
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg max-w-5xl">
              {property.description}
            </p>
            <div className="mt-10 pt-8 border-t border-gray-300">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mb-4">
                Schedule a Visit
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setError(""); }}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <button
                  onClick={handleBookClick}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-indigo-600 hover:to-blue-500 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Book Appointment
                </button>
              </div>
              {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
            </div>
          </div>
        </div>
        <ConfirmModal
          show={showModal}
          onClose={closeModal}
          onConfirm={handleConfirmBooking}
          bookingStatus={bookingStatus}
          propertyTitle={property.title}
          selectedDate={selectedDate}
        />
      </div>

      {notification.show && (
        <Notification
          message={notification.message}
          onClose={() => setNotification({ show: false, message: "" })}
        />
      )}
    </>
  );
};

export default Property;