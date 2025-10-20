import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const DEFAULT_IMAGE_URL =
  "https://via.placeholder.com/400x300.png?text=No+Image";

function PropertyGrid({ properties = [], wishlist = [], onToggleWishlist }) {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        No properties found matching your criteria.
      </div>
    );
  }

  return (
    // This grid and card styling should match your original version
    <div className="mb-12 mt-8 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property) => {
        const isWishlisted = new Set(wishlist).has(property.property_id);

        return (
          <div
            key={property.property_id}
            className="relative border rounded-xl shadow-lg overflow-hidden group transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <button
              onClick={() => onToggleWishlist(property.property_id)}
              className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition cursor-pointer"
              aria-label="Add to wishlist"
            >
              <FaHeart
                className={`text-xl transition ${
                  isWishlisted ? "text-red-500" : "text-gray-400"
                }`}
              />
            </button>
            <div className="h-52 w-full overflow-hidden">
              <img
                src={property.image_url || DEFAULT_IMAGE_URL}
                alt={property.title || "Property"}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-white relative z-10">
              <p className="text-xs text-indigo-600 font-semibold mb-1 uppercase tracking-wide">
                {property.type_name || "N/A"}
              </p>
              <div className="flex justify-between items-start mb-2 font-medium text-gray-800">
                <p className="text-gray-700 truncate pr-2">
                  {property.location}
                </p>
                <p className="font-bold text-green-600 whitespace-nowrap">{`₹ ${Number(
                  property.price
                ).toLocaleString("en-IN")}`}</p>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {property.property_description}
              </p>
              <Link to={`/property/${property.property_id}`}>
                <button className="w-full py-2 mt-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold hover:from-indigo-500 hover:to-blue-500 transition cursor-pointer">
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
