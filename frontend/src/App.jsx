import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
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
import AboutUs from "./components/aboutus"; // <-- NEW

// Define a mock user to represent the person who is logged in.
const MOCK_CURRENT_USER = { id: "user123", name: "Alex Doe" };

function App() {
  // --- State Management ---
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [properties, setProperties] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [listedProperties, setListedProperties] = useState([]);

  // --- Data Fetching ---
  useEffect(() => {
    // Fetch all property data once on app load
    fetch("/data/properties.json")
      .then((res) => res.json())
      .then((data) => setProperties(data.properties));
  }, []);

  // This effect loads/clears user-specific data based on login status
  useEffect(() => {
    if (isLoggedIn) {
      const bookingStorageKey = `estateBookings_${MOCK_CURRENT_USER.id}`;
      const storedBookings = JSON.parse(localStorage.getItem(bookingStorageKey) || "[]");
      setBookings(storedBookings);

      const listingStorageKey = `estateListings_${MOCK_CURRENT_USER.id}`;
      const storedListings = JSON.parse(localStorage.getItem(listingStorageKey) || "[]");
      setListedProperties(storedListings);
    } else {
      setBookings([]);
      setListedProperties([]);
    }
  }, [isLoggedIn]);

  // --- Handlers ---
  const handleLoginClick = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };
  const handleLogout = () => setIsLoggedIn(false);

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
    if (isLoggedIn) {
      const storageKey = `estateBookings_${MOCK_CURRENT_USER.id}`;
      setBookings(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    }
  };

  const handleDeleteBooking = (propertyId, bookingDate) => {
    if (!isLoggedIn) return;
    const storageKey = `estateBookings_${MOCK_CURRENT_USER.id}`;
    const storedBookings = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const updatedBookings = storedBookings.filter(
      b => !(b.propertyId === propertyId && b.date === bookingDate)
    );
    localStorage.setItem(storageKey, JSON.stringify(updatedBookings));
    refreshBookings();
  };
  
  const refreshListedProperties = () => {
    if (isLoggedIn) {
      const storageKey = `estateListings_${MOCK_CURRENT_USER.id}`;
      setListedProperties(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    }
  };

  const handleAddProperty = (formData) => {
    if (!isLoggedIn) return;
    const storageKey = `estateListings_${MOCK_CURRENT_USER.id}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const newProperty = { 
      id: Date.now(), // Use timestamp for a unique ID
      ...formData 
    };
    localStorage.setItem(storageKey, JSON.stringify([...existing, newProperty]));
    refreshListedProperties();
  };

  return (
    <div>
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
          <Route path="/sell" element={<Sell />} />

          {/* **About route** */}
          <Route path="/about" element={<AboutUs />} />

          <Route
            path="/cart"
            element={
              <Cart
                wishlistItems={properties.filter((p) => wishlist.includes(p.id))}
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
                currentUser={isLoggedIn ? MOCK_CURRENT_USER : null}
              />
            }
          />

          {/* Protected Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <UserProfile
                  onLogout={handleLogout}
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
            <LoginBox onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
