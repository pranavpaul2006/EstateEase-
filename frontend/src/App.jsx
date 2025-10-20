import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { supabase } from "./lib/supabaseClient";
import Navbar from "./components/navbar";
import Home from "./components/home";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Property from "./pages/Property";
import LoginBox from "./components/login_box";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Buy from "./components/buy";
import Sell from "./components/Sell";
import AboutUs from "./components/aboutus";

function App() {
  // --- Use Auth Context ---
  const { user, loading } = useAuth();

  // --- State Management ---
  const [showLogin, setShowLogin] = useState(false);
  const [properties, setProperties] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [bookings, setBookings] = useState([]); // Owned by App.js
  const [listedProperties, setListedProperties] = useState([]);

  const isLoggedIn = !!user;

  // --- Data Fetching ---
  useEffect(() => {
    // Fetch static properties
    fetch("/data/properties.json")
      .then((res) => res.json())
      .then((data) => setProperties(data.properties));
  }, []);

  // Fetch listed properties from local storage (or clear on logout)
  useEffect(() => {
    if (user) {
      const listingStorageKey = `estateListings_${user.id}`;
      const storedListings = JSON.parse(
        localStorage.getItem(listingStorageKey) || "[]"
      );
      setListedProperties(storedListings);
    } else {
      setListedProperties([]); // Clear on logout
    }
  }, [user]);

  // THIS EFFECT NOW FETCHES BOOKINGS AND CLEARS THEM ON LOGOUT
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) {
        setBookings([]); // Clear bookings on logout
        return;
      }

      try {
        const { data, error } = await supabase
          .from("appointments")
          .select(`*`) // Select only from appointments
          .eq("user_id", user.id)
          .order("meeting_time", { ascending: false });

        if (error) throw error;

        // Convert appointments to booking history format
        // NOTE: You will need to JOIN with your 'properties' table
        // to get real location, type, and img data.
        const bookingHistory = (data || []).map((appointment) => ({
          id: appointment.id,
          location:
            "Test Location (ID: " +
            appointment.property_id.slice(0, 8) +
            "...",
          type: "Test Appointment",
          img: "https://via.placeholder.com/150",
          bookingDate: new Date(appointment.meeting_time).toLocaleDateString(
            "en-US",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          ),
        }));

        setBookings(bookingHistory); // Set the state here in App.js
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments(); // Run the fetch
  }, [user]); // Dependency is 'user'. Re-runs on login/logout.

  // --- Handlers ---
  const handleLoginClick = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);
  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  const handleToggleWishlist = (propertyId) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(propertyId)) {
        return prevWishlist.filter((id) => id !== propertyId);
      } else {
        return [...prevWishlist, propertyId];
      }
    });
  };

  // This function is now in the same component that fetches the data,
  // so it will work perfectly.
  const handleDeleteBooking = async (appointmentId) => {
    if (!user) return;

    // 1. Delete from Supabase
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", appointmentId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting appointment:", error);
    } else {
      // 2. Update local state to refresh the UI
      console.log("Deleted. Updating UI...");
      setBookings((prevBookings) =>
        prevBookings.filter((b) => b.id !== appointmentId)
      );
    }
  };

  // --- Listed Properties Handlers ---
  const refreshListedProperties = () => {
    if (user) {
      const storageKey = `estateListings_${user.id}`;
      setListedProperties(
        JSON.parse(localStorage.getItem(storageKey) || "[]")
      );
    }
  };

  const handleAddProperty = (formData) => {
    if (!user) return;
    const storageKey = `estateListings_${user.id}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const newProperty = {
      id: Date.now(),
      ...formData,
    };
    localStorage.setItem(storageKey, JSON.stringify([...existing, newProperty]));
    refreshListedProperties();
  };

  // Show loading while auth is initializing
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar onLoginClick={handleLoginClick} isLoggedIn={isLoggedIn} />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <Home
                properties={properties}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/buy"
            element={
              <Buy
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
          <Route
            path="/sell"
            element={
              <Sell onAddProperty={handleAddProperty} currentUser={user} />
            }
          />
          <Route path="/about" element={<AboutUs />} />
          <Route
            path="/cart"
            element={
              <Cart
                wishlistItems={properties.filter((p) =>
                  wishlist.includes(p.id)
                )}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
          <Route
            path="/property/:id"
            element={
              <Property properties={properties} currentUser={user} />
            }
          />

          {/* Protected Route - use user from context */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                {/* UPDATED PROPS FOR UserProfile */}
                <UserProfile
                  bookings={bookings} // Pass the state DOWN
                  // setBookings is NO LONGER needed
                  onDeleteBooking={handleDeleteBooking} // Pass the handler DOWN
                  listedProperties={listedProperties}
                  // onLogout prop is missing, UserProfile.jsx expects it.
                  // You should pass the `signOut` function from useAuth
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
          <div className="relative">
            <button
              onClick={handleCloseLogin}
              className="absolute -top-2 -right-2 z-10 bg-white rounded-full p-1 text-gray-700 hover:text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <LoginBox onAuthSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;