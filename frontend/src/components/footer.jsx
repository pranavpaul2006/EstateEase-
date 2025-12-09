// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2b6777] text-gray-100 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand + CTA */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/estateease-logo.png"
              alt="EstateEase"
              className="h-12 w-12 object-contain"
            />
            <span className="text-white font-bold text-xl select-none">EstateEase</span>
          </Link>

          <p className="text-gray-200 text-sm max-w-xs leading-relaxed">
            Curated listings, trusted agents, and secure transactions — your easy path
            to property ownership.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/buy" className="hover:underline hover:text-gray-100">
                Buy
              </Link>
            </li>
            <li>
              <Link to="/sell" className="hover:underline hover:text-gray-100">
                Sell
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:underline hover:text-gray-100">
                Wish
              </Link>
            </li>
            <li>
              <a href="/aboutus" className="hover:underline hover:text-gray-100">
                About Us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-gray-200">
            <div className="flex items-start gap-3">
              <FiMapPin className="mt-1" />
              <div>
                <p className="font-medium text-gray-100">Head Office</p>
                <p className="text-xs">Kakkanad, Kochi, Kerala</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiPhone />
              <a href="tel:+911234567890" className="hover:underline">
                +91 12345 67890
              </a>
            </div>

            <div className="flex items-center gap-3">
              <FiMail />
              <a href="mailto:hello@estateease.com" className="hover:underline">
                hello@estateease.com
              </a>
            </div>

            <p className="text-sm text-gray-300 mt-2 max-w-xs">
              Office hours: Mon — Sat, 9:30 AM — 6:30 PM
            </p>
          </div>
        </div>

        {/* Trust features (compact, visual) */}
        <div>
          <h4 className="text-white font-semibold mb-3">Why choose us</h4>

          <ul className="space-y-3 text-sm text-gray-200">
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/10">🏷️</span>
              <div>
                <p className="font-medium">Verified listings</p>
                <p className="text-xs text-gray-300">Curated and verified by our team</p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/10">🔒</span>
              <div>
                <p className="font-medium">Secure transactions</p>
                <p className="text-xs text-gray-300">Trusted payment and legal support</p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/10">⚡</span>
              <div>
                <p className="font-medium">Fast support</p>
                <p className="text-xs text-gray-300">Quick help when you need it</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 text-center py-4 text-sm text-gray-200">
        © {currentYear} EstateEase. All rights reserved.
      </div>
    </footer>
  );
}
