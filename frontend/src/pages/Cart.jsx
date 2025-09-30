// src/pages/Cart.jsx

import React from "react";
import PropertyGrid from "../components/property_grid"; // Reuse the grid component

function Cart({ wishlistItems, onToggleWishlist }) {
  return (
    <div className="pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>
        
        {/* Check if there are any items in the wishlist */}
        {wishlistItems.length > 0 ? (
          // If yes, display them using the PropertyGrid
          <PropertyGrid
            properties={wishlistItems}
            wishlist={wishlistItems.map(item => item.id)} // Pass the IDs so hearts are red
            onToggleWishlist={onToggleWishlist}
          />
        ) : (
          // If no, display a message
          <p className="text-center text-gray-600 mt-12">
            You haven't added any properties to your wishlist yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Cart;