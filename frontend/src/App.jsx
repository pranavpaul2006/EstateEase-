// src/App.jsx

import React, { useState } from "react";
// REMOVE "Router" from this import. We only need the other components.
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./components/home";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Property from "./pages/Property";
import LoginBox from "./components/login_box";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  // REMOVED the <Router> and </Router> tags from here
  return (
    <div>
      <Navbar onLoginClick={handleLoginClick} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/property" element={<Property />} />
        </Routes>
      </main>

      {/* MODAL LOGIC STARTS HERE */}
      {showLogin && (
        // THIS IS THE LINE TO CHANGE
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
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
            <LoginBox />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
