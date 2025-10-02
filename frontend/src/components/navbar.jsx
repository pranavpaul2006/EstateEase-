import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMenu, FiX } from "react-icons/fi";

function Navbar({ onLoginClick, isLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  // This function navigates to the homepage without a full page reload
  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <nav className="bg-[#52ab98] fixed w-full z-50 shadow-md">
      <div className="px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center"
          >
            <img
              src="/images/estateease-logo.png"
              alt="EstateEase"
              className="h-16 w-16 object-contain flex-shrink-0"
            />
            <span className="ml-2 font-bold text-2xl text-white select-none">
              EstateEase
            </span>
          </a>
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
            <button className="bg-white text-[#52ab98] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 cursor-pointer">
              WISH
            </button>
          </Link>

          {/* Account / Login */}
          {isLoggedIn ? (
            <Link to="/profile">
              <button className="flex items-center gap-2 bg-white text-[#52ab98] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 cursor-pointer">
                <FiUser />
                <span>MY ACCOUNT</span>
              </button>
            </Link>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-white text-[#52ab98] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 cursor-pointer"
            >
              LOGIN
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white text-3xl focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX /> : <FiMenu />}
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
          <Link to="/buy" onClick={() => setIsOpen(false)} className="text-white py-2 font-semibold hover:text-gray-200">
            BUY
          </Link>
          <Link to="/rent" onClick={() => setIsOpen(false)} className="text-white py-2 font-semibold hover:text-gray-200">
            RENT
          </Link>
          <Link to="/sell" onClick={() => setIsOpen(false)} className="text-white py-2 font-semibold hover:text-gray-200">
            SELL
          </Link>
          <hr className="border-white/20"/>
          <Link to="/cart" onClick={() => setIsOpen(false)}>
            <button className="w-full bg-white text-[#52ab98] py-2 rounded-md font-semibold hover:bg-gray-100">
              WISH
            </button>
          </Link>

          {isLoggedIn ? (
            <Link to="/profile" onClick={() => setIsOpen(false)}>
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