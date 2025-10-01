import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

function PropertyGrid({ properties = [], wishlist, onToggleWishlist }) {
  return (
    <div className="mb-12 mt-8 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property) => {
        const isWishlisted = wishlist.includes(property.id);

        return (
          <div
            key={property.id}
            className="relative border rounded-xl shadow-lg overflow-hidden group transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {/* --- WISHLIST ICON BUTTON --- */}
            <button
              onClick={() => onToggleWishlist(property.id)}
              className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition cursor-pointer"
              aria-label="Add to wishlist"
            >
              <FaHeart
                className={`text-xl transition ${
                  isWishlisted ? "text-red-500" : "text-gray-400"
                }`}
              />
            </button>
            {/* --- END ICON --- */}

            {/* Image */}
            <div className="h-52 w-full overflow-hidden">
              <img src={property.img} alt="Property" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>

            {/* Info */}
            <div className="p-4 bg-white relative z-10">
              <p className="text-xs text-indigo-600 font-semibold mb-1 uppercase tracking-wide line-clamp-2">
                {property.type}
              </p>
              <div className="flex justify-between mb-2 font-medium text-gray-800">
                <p className="text-gray-700">{property.location}</p>
                <p className="font-bold text-green-600">{property.price}</p>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {property.description}
              </p>
              <Link to={`/property/${property.id}`}>
                <button className="w-full py-2 mt-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold hover:from-indigo-500 hover:to-blue-500 transition">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PropertyGrid;