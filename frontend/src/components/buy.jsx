import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import PropertyGrid from "./property_grid";

export default function Buy({ wishlist, onToggleWishlist }) {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialCity = query.get("city") || "";
  const initialType = query.get("type") || "";

  const [cityFilter, setCityFilter] = useState(initialCity);
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dropdownData, setDropdownData] = useState({ cities: [], propertyTypes: [] });
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [typeSuggestions, setTypeSuggestions] = useState([]);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const cityRef = useRef(null);
  const typeRef = useRef(null);

  // Fetch properties & dropdown data
  useEffect(() => {
    fetch("/data/properties.json")
      .then(res => res.json())
      .then(data => { setProperties(data.properties); setLoading(false); })
      .catch(err => console.error(err));

    fetch("/data/dropdownData.json")
      .then(res => res.json())
      .then(data => setDropdownData(data))
      .catch(err => console.error(err));
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (cityRef.current && !cityRef.current.contains(e.target)) setIsCityOpen(false);
      if (typeRef.current && !typeRef.current.contains(e.target)) setIsTypeOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = properties;

    if (cityFilter) filtered = filtered.filter(p => p.location.toLowerCase().includes(cityFilter.toLowerCase()));
    if (typeFilter) filtered = filtered.filter(p => p.type.toLowerCase().includes(typeFilter.toLowerCase()));
    filtered = filtered.filter(p => {
      const price = parseInt(p.price.replace(/₹|,|\s/g, ""));
      return price >= minPrice && price <= maxPrice;
    });

    setFilteredProperties(filtered);
  }, [cityFilter, typeFilter, minPrice, maxPrice, properties]);

  if (loading) return <p className="text-center py-8">Loading properties...</p>;

  const renderFilters = () => (
    <div className="space-y-6">
      {/* City Dropdown */}
      <div ref={cityRef} className="relative">
        <label className="block text-sm font-medium mb-1">City</label>
        <input
          type="text"
          value={cityFilter}
          onChange={(e) => {
            setCityFilter(e.target.value);
            if(e.target.value){
              setCitySuggestions(dropdownData.cities.filter(c=>c.label.toLowerCase().includes(e.target.value.toLowerCase())));
            } else setCitySuggestions([{ value: "", label: "" }, ...dropdownData.cities]);
            setIsCityOpen(true);
          }}
          onFocus={()=>{setCitySuggestions([{ value: "", label: "" }, ...dropdownData.cities]); setIsCityOpen(true)}}
          placeholder="Select city"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isCityOpen && (
          <ul className="absolute z-20 w-full bg-white border rounded-md max-h-40 overflow-y-auto shadow-lg mt-1 scrollbar-hide">
            {citySuggestions.map(city=>(
              <li
                key={city.value || "empty"}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={()=>{setCityFilter(city.label); setIsCityOpen(false)}}
              >
                {city.label || "None"}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Property Type Dropdown */}
      <div ref={typeRef} className="relative">
        <label className="block text-sm font-medium mb-1">Property Type</label>
        <input
          type="text"
          value={typeFilter}
          onChange={(e)=>{
            setTypeFilter(e.target.value); 
            if(e.target.value){
              setTypeSuggestions(dropdownData.propertyTypes.filter(t=>t.label.toLowerCase().includes(e.target.value.toLowerCase())))
            } else setTypeSuggestions([{ value: "", label: "" }, ...dropdownData.propertyTypes]);
            setIsTypeOpen(true)
          }}
          onFocus={()=>{setTypeSuggestions([{ value: "", label: "" }, ...dropdownData.propertyTypes]); setIsTypeOpen(true)}}
          placeholder="Select type"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isTypeOpen && (
          <ul className="absolute z-20 w-full bg-white border rounded-md max-h-40 overflow-y-auto shadow-lg mt-1 scrollbar-hide">
            {typeSuggestions.map(type=>(
              <li
                key={type.value || "empty"}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={()=>{setTypeFilter(type.label); setIsTypeOpen(false)}}
              >
                {type.label || "None"}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Price Slider */}
      <div>
        <label className="block text-sm font-medium mb-2">Price Range (₹)</label>
        <div className="flex justify-between mb-2 text-sm font-medium">
          <span>{minPrice.toLocaleString()}</span>
          <span>{maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="0"
          max="50000000"
          step="500000"
          value={minPrice}
          onChange={(e)=>setMinPrice(Number(e.target.value))}
          className="w-full mb-1 accent-blue-500"
        />
        <input
          type="range"
          min="0"
          max="50000000"
          step="500000"
          value={maxPrice}
          onChange={(e)=>setMaxPrice(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => {setCityFilter(""); setTypeFilter(""); setMinPrice(0); setMaxPrice(50000000)}}
        className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="px-4 pt-20 py-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* Desktop Sidebar */}
      <aside className="hidden mt-10 lg:block w-64 bg-white p-5 rounded-lg shadow-md sticky top-20 h-[calc(100vh-5rem)]">
        {renderFilters()}
      </aside>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Filter Properties
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-start pt-20 px-4">
          <div className="bg-white w-full max-w-md rounded-lg p-6 overflow-y-auto max-h-[80vh] relative">
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            {renderFilters()}
          </div>
        </div>
      )}

      {/* Property Grid */}
      <section className="flex-1 ">
        <PropertyGrid
          properties={filteredProperties}
          wishlist={wishlist}
          onToggleWishlist={onToggleWishlist}
        />
      </section>
    </div>
  );
}
