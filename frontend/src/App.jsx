import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Add this import
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
  const [bookings, setBookings] = useState([]);
  const [listedProperties, setListedProperties] = useState([]);

  // Use user from context to determine login status
  const isLoggedIn = !!user;

  // --- Data Fetching ---
  useEffect(() => {
    // Fetch all property data once on app load
    fetch("/data/properties.json")
      .then((res) => res.json())
      .then((data) => setProperties(data.properties));
  }, []);

  // This effect loads/clears user-specific data based on REAL user login status
  useEffect(() => {
    if (user) {
      // Use the actual user ID from context, not mock user
      const bookingStorageKey = `estateBookings_${user.id}`;
      const storedBookings = JSON.parse(localStorage.getItem(bookingStorageKey) || "[]");
      setBookings(storedBookings);

      const listingStorageKey = `estateListings_${user.id}`;
      const storedListings = JSON.parse(localStorage.getItem(listingStorageKey) || "[]");
      setListedProperties(storedListings);
    } else {
      setBookings([]);
      setListedProperties([]);
    }
  }, [user]); // Depend on user from context

  // --- Handlers ---
  const handleLoginClick = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);
  const handleLoginSuccess = () => {
    // No need to set isLoggedIn - auth context will handle this
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
  
  const refreshBookings = () => {
    if (user) {
      const storageKey = `estateBookings_${user.id}`;
      setBookings(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    }
  };

  const handleDeleteBooking = (propertyId, bookingDate) => {
    if (!user) return;
    const storageKey = `estateBookings_${user.id}`;
    const storedBookings = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const updatedBookings = storedBookings.filter(
      b => !(b.propertyId === propertyId && b.date === bookingDate)
    );
    localStorage.setItem(storageKey, JSON.stringify(updatedBookings));
    refreshBookings();
  };
  
  const refreshListedProperties = () => {
    if (user) {
      const storageKey = `estateListings_${user.id}`;
      setListedProperties(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    }
  };

  const handleAddProperty = (formData) => {
    if (!user) return;
    const storageKey = `estateListings_${user.id}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const newProperty = { 
      id: Date.now(), // Use timestamp for a unique ID
      ...formData 
    };
    localStorage.setItem(storageKey, JSON.stringify([...existing, newProperty]));
    refreshListedProperties();
  };

  // Debug logging
  useEffect(() => {
    console.log('👤 App - User state:', user);
    console.log('⏳ App - Loading state:', loading);
    console.log('🔐 App - Is logged in:', isLoggedIn);
  }, [user, loading, isLoggedIn]);

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
      {/* Pass isLoggedIn from context to Navbar */}
      <Navbar onLoginClick={handleLoginClick} isLoggedIn={isLoggedIn} />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={ <Home properties={properties} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} /> } />
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
          {/* Pass actual user to Sell component */}
          <Route path="/sell" element={<Sell onAddProperty={handleAddProperty} currentUser={user} />} />

          {/* New About route */}
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
              <Property
                properties={properties}
                onBookProperty={refreshBookings}
                currentUser={user} // Use actual user from context
              />
            }
          />

          {/* Protected Route - use user from context */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <UserProfile
                  bookings={bookings.map(booking => {
                    const property = properties.find(p => p.id === booking.propertyId);
                    return { ...property, bookingDate: booking.date };
                  }).filter(Boolean)}
                  onDeleteBooking={handleDeleteBooking}
                  listedProperties={listedProperties}
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
            <button onClick={handleCloseLogin} className="absolute -top-2 -right-2 z-10 bg-white rounded-full p-1 text-gray-700 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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