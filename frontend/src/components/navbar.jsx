import React, { useState } from "react";
import { Link } from "react-router-dom";
// Recommended: npm install react-icons
import { FiUser } from "react-icons/fi";

// The Navbar now accepts an `isLoggedIn` prop
function Navbar({ onLoginClick, isLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#52ab98] fixed w-full z-50 shadow-md">
      <div className="px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center">
            <img
              src="/images/estateease-logo.png"
              alt="EstateEase"
              className="h-16 w-16 object-contain flex-shrink-0"
            />
            <span className="ml-2 font-bold text-2xl text-white select-none">
              EstateEase
            </span>
          </Link>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/buy" className="text-white hover:text-gray-200 font-semibold">
            BUY
          </Link>
          <Link to="/rent" className="text-white hover:text-gray-200 font-semibold">
            RENT
          </Link>
          <Link to="/sell" className="text-white hover:text-gray-200 font-semibold">
            SELL
          </Link>
          <Link to="/cart">
            <button className="bg-white text-[#52ab98] px-4 py-2 rounded-md font-semibold hover:bg-gray-100">
              WISH
            </button>
          </Link>

          {/* === CONDITIONAL LOGIC FOR DESKTOP === */}
          {isLoggedIn ? (
            <Link to="/profile">
              <button className="flex items-center gap-2 bg-white text-[#52ab98] px-4 py-2 rounded-md font-semibold hover:bg-gray-100">
                <FiUser />
                <span>MY ACCOUNT</span>
              </button>
            </Link>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-white text-[#52ab98] px-4 py-2 rounded-md font-semibold hover:bg-gray-100"
            >
              LOGIN
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">{/* ...hamburger button is unchanged... */}</div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden bg-[#52ab98] overflow-hidden transition-[max-height] duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-4 pb-6 flex flex-col gap-2">
          {/* ...other mobile links... */}
          <Link to="/cart">
            <button className="w-full bg-white text-[#52ab98] py-2 rounded-md font-semibold hover:bg-gray-100">
              WISH
            </button>
          </Link>
          
          {/* === CONDITIONAL LOGIC FOR MOBILE === */}
          {isLoggedIn ? (
            <Link to="/profile">
              <button className="w-full flex items-center justify-center gap-2 bg-white text-[#52ab98] py-2 rounded-md font-semibold hover:bg-gray-100">
                <FiUser />
                <span>MY ACCOUNT</span>
              </button>
            </Link>
          ) : (
             <button
              onClick={() => {
                onLoginClick();
                setIsOpen(false);
              }}
              className="w-full bg-white text-[#52ab98] py-2 rounded-md font-semibold hover:bg-gray-100"
            >
              LOGIN
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;