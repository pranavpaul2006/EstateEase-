import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../images/estateease-logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#52ab98] fixed w-full z-20 shadow-md">
      <div className="px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="EstateEase"
              className="h-24 w-24 object-contain flex-shrink-0"
            />
            <span className="ml-2 font-bold text-2xl text-white select-none">
              EstateEase
            </span>
          </Link>
        </div>

        <div className="flex items-center">
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-white hover:text-gray-200 font-semibold"
            >
              BUY
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-200 font-semibold"
            >
              RENT
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-200 font-semibold"
            >
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

          <div className="md:hidden flex items-center ml-4">
            <button
              onClick={() => setIsOpen((s) => !s)}
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
              className="focus:outline-none text-white p-2"
            >
              <div className="space-y-1">
                <span
                  className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${
                    isOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${
                    isOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden absolute left-0 right-0 top-full bg-[#52ab98] overflow-hidden transition-[max-height] duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
        style={{ zIndex: 19 }}
      >
        <div className="px-4 pb-4 pt-3">
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
          <div className="mt-3 space-y-2">
            <Link to="/cart">
              <button className="w-full bg-white text-[#52ab98] py-2 rounded-md font-semibold hover:bg-gray-100">
                WISH
              </button>
            </Link>
            <Link to="/contact">
              <button className="w-full bg-white text-[#52ab98] py-2 rounded-md font-semibold hover:bg-gray-100">
                LOGIN
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
