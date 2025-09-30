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

function App() {
  // --- State Management ---
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [properties, setProperties] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // --- Data Fetching ---
  useEffect(() => {
    fetch("/data/properties.json")
      .then((res) => res.json())
      .then((data) => setProperties(data.properties));
  }, []);

  // --- Handlers ---
  const handleLoginClick = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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
            path="/cart"
            element={
              <Cart
                wishlistItems={properties.filter((p) => wishlist.includes(p.id))}
                onToggleWishlist={handleToggleWishlist}
              />
            }
          />
          <Route path="/property/:id" element={<Property />} />

          {/* Protected Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <UserProfile onLogout={handleLogout} />
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
            <LoginBox onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;