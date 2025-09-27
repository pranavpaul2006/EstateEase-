import { Link } from "react-router-dom";
import React, { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#52ab98] fixed w-full z-20 shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img
            src="/src/images/estateease-logo.png"
            alt="Logo"
            className="h-16 w-16 object-contain"
          />
          <Link to="/">
            <p className="font-bold text-2xl text-white">EstateEase</p>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
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
          <Link to="/contact">
            <button className="bg-white text-[#52ab98] px-4 py-2 rounded-md font-semibold hover:bg-gray-100">
              LOGIN
            </button>
          </Link>
        </div>

        {/* Hamburger Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none text-white"
          >
            <div className="space-y-1">
              <span
                className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${
                  isOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-[#52ab98] px-6 pb-4 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <a
          href="#"
          className="block py-2 text-white font-semibold hover:text-gray-200"
        >
          BUY
        </a>
        <a
          href="#"
          className="block py-2 text-white font-semibold hover:text-gray-200"
        >
          RENT
        </a>
        <a
          href="#"
          className="block py-2 text-white font-semibold hover:text-gray-200"
        >
          SELL
        </a>
        <Link to="/cart">
          <button className="w-full bg-white text-[#52ab98] mt-2 py-2 rounded-md font-semibold hover:bg-gray-100">
            WISH
          </button>
        </Link>
        <Link to="/contact">
          <button className="w-full bg-white text-[#52ab98] mt-2 py-2 rounded-md font-semibold hover:bg-gray-100">
            LOGIN
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
