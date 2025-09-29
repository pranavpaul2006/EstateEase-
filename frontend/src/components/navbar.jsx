import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ onLoginClick }) {
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
          <a href="#" className="text-white hover:text-gray-200 font-semibold">
            BUY
          </a>
          <a href="#" className="text-white hover:text-gray-200 font-semibold">
            RENT
          </a>
          <a href="#" className="text-white hover:text-gray-200 font-semibold">
            SELL
          </a>
          <Link to="/cart">
            <button className="bg-white text-[#52ab98] px-4 py-2 rounded-md font-semibold hover:bg-gray-100">
              WISH
            </button>
          </Link>
          <button
            onClick={onLoginClick}
            className="bg-white text-[#52ab98] px-4 py-2 rounded-md font-semibold hover:bg-gray-100"
          >
            LOGIN
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            className="flex flex-col justify-center items-center w-10 h-10 focus:outline-none gap-1"
          >
            <span
              className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${
                isOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${
                isOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden bg-[#52ab98] overflow-hidden transition-[max-height] duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-4 pb-6 flex flex-col gap-2">
          <a href="#" className="block py-2 text-white font-semibold hover:text-gray-200">
            BUY
          </a>
          <a href="#" className="block py-2 text-white font-semibold hover:text-gray-200">
            RENT
          </a>
          <a href="#" className="block py-2 text-white font-semibold hover:text-gray-200">
            SELL
          </a>
          <Link to="/cart">
            <button className="w-full bg-white text-[#52ab98] py-2 rounded-md font-semibold hover:bg-gray-100">
              WISH
            </button>
          </Link>
          <button
            onClick={() => {
              onLoginClick();
              setIsOpen(false);
            }}
            className="w-full bg-white text-[#52ab98] py-2 rounded-md font-semibold hover:bg-gray-100"
          >
            LOGIN
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
