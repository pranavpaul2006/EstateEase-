import React, { useState, useEffect } from "react";
import PropertyGrid from "../components/property_grid";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

// This component is now self-sufficient and fetches its own data.
export default function Cart() {
  const { user } = useAuth();

  // State for the full property objects and just their IDs
  const [wishlistedProperties, setWishlistedProperties] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistDetails = async () => {
      if (!user) {
        setLoading(false);
        setWishlistedProperties([]); // Clear list if user logs out
        return;
      }

      setLoading(true);

      // 1. Get the list of property IDs from the user's wishlist
      const { data: idsData, error: idsError } = await supabase
        .from("wishlists")
        .select("property_id")
        .eq("user_id", user.id);

      if (idsError || !idsData || idsData.length === 0) {
        setWishlistedProperties([]);
        setWishlistIds(new Set());
        setLoading(false);
        return;
      }

      const propertyIds = idsData.map((item) => item.property_id);
      setWishlistIds(new Set(propertyIds));

      // 2. Fetch the full details for those properties using our new function
      const { data: propertiesData, error: propertiesError } =
        await supabase.rpc("get_properties_by_ids", {
          property_ids_array: propertyIds,
        });

      if (propertiesError) {
        console.error("Error fetching wishlist properties:", propertiesError);
      } else {
        setWishlistedProperties(propertiesData || []);
      }

      setLoading(false);
    };

    fetchWishlistDetails();
  }, [user]); // Refetch whenever the user changes

  // This function now removes the item from the view instantly
  const handleToggleWishlist = async (propertyId) => {
    if (!user) return;

    // The item is guaranteed to be in the wishlist on this page
    const { error } = await supabase
      .from("wishlists")
      .delete()
      .match({ user_id: user.id, property_id: propertyId });

    if (error) {
      console.error("Error removing from wishlist:", error);
    } else {
      // For a great user experience, remove the item from the UI immediately
      setWishlistIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });
      setWishlistedProperties((prev) =>
        prev.filter((p) => p.property_id !== propertyId)
      );
    }
  };

  if (loading) {
    return <div className="text-center pt-32">Loading your wishlist...</div>;
  }

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>

        {wishlistedProperties.length > 0 ? (
          <PropertyGrid
            properties={wishlistedProperties}
            wishlist={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : (
          <div className="text-center text-gray-600 mt-20 p-8 border-2 border-dashed rounded-lg">
            <p className="mb-4">
              You haven't added any properties to your wishlist yet.
            </p>
            <Link
              to="/buy"
              className="text-blue-600 hover:underline font-semibold"
            >
              Explore Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
