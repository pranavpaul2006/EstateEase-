import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiLogOut } from "react-icons/fi";

function Navbar({ onLoginClick, isLoggedIn, onLogout }) {
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

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/buy"
            className="text-white hover:text-gray-200 font-semibold"
          >
            BUY
          </Link>
          <Link
            to="/rent"
            className="text-white hover:text-gray-200 font-semibold"
          >
            RENT
          </Link>
          <Link
            to="/sell"
            className="text-white hover:text-gray-200 font-semibold"
          >
            SELL
          </Link>
          <Link to="/cart">
            <button className="bg-white text-[#52ab98] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 cursor-pointer">
              WISH
            </button>
          </Link>

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <>
              <Link to="/profile">
                <button className="flex items-center gap-2 bg-white text-[#52ab98] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 cursor-pointer">
                  <FiUser />
                  <span>MY ACCOUNT</span>
                </button>
              </Link>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 bg-white text-[#52ab98] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 cursor-pointer"
            >
              <span>LOGIN</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white text-3xl"
          >
            &#9776;
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden bg-[#52ab98] overflow-hidden transition-[max-height] duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-4 pb-6 flex flex-col gap-4">
          <Link
            to="/buy"
            onClick={() => setIsOpen(false)}
            className="text-white font-semibold text-center py-2"
          >
            BUY
          </Link>
          <Link
            to="/rent"
            onClick={() => setIsOpen(false)}
            className="text-white font-semibold text-center py-2"
          >
            RENT
          </Link>
          <Link
            to="/sell"
            onClick={() => setIsOpen(false)}
            className="text-white font-semibold text-center py-2"
          >
            SELL
          </Link>
          <Link to="/cart" onClick={() => setIsOpen(false)}>
            <button className="w-full bg-white text-[#52ab98] py-2 rounded-md font-semibold hover:bg-gray-100">
              WISH
            </button>
          </Link>

          {/* Auth Buttons for Mobile */}
          {isLoggedIn ? (
            <>
              <Link to="/profile" onClick={() => setIsOpen(false)}>
                <button className="w-full flex items-center justify-center gap-2 bg-white text-[#52ab98] py-2 rounded-md font-semibold hover:bg-gray-100">
                  <FiUser />
                  <span>MY ACCOUNT</span>
                </button>
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                onLoginClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-white text-[#52ab98] py-2 rounded-md font-semibold hover:bg-gray-100"
            >
              <span>LOGIN</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
