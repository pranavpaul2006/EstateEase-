import React, { useState, useEffect, useRef } from "react";
import PropertyGrid from "./property_grid";

export default function Hero({ properties, wishlist, onToggleWishlist }) {
  // --- State for dropdown data and search filters ---
  const [dropdownData, setDropdownData] = useState({ cities: [], propertyTypes: [] });
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");
  
  // --- State for autocomplete suggestions ---
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [typeSuggestions, setTypeSuggestions] = useState([]);
  const [isCitySuggestionsOpen, setIsCitySuggestionsOpen] = useState(false);
  const [isTypeSuggestionsOpen, setIsTypeSuggestionsOpen] = useState(false);

  // --- State for final search ---
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Ref for closing dropdowns when clicking outside
  const citySearchRef = useRef(null);
  const typeSearchRef = useRef(null);

  useEffect(() => {
    fetch("/data/dropdownData.json")
      .then((res) => res.json())
      .then((data) => setDropdownData(data));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (citySearchRef.current && !citySearchRef.current.contains(event.target)) {
        setIsCitySuggestionsOpen(false);
      }
      if (typeSearchRef.current && !typeSearchRef.current.contains(event.target)) {
        setIsTypeSuggestionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Handlers for City Autocomplete ---
  const handleCityChange = (e) => {
    const value = e.target.value;
    setSelectedCity(value);
    if (value) {
      const filtered = dropdownData.cities.filter(city => 
        city.label.toLowerCase().includes(value.toLowerCase())
      );
      setCitySuggestions(filtered);
    } else {
      setCitySuggestions(dropdownData.cities); // Show all if input is empty but focused
    }
    setIsCitySuggestionsOpen(true);
  };

  const handleCitySuggestionClick = (city) => {
    setSelectedCity(city.label);
    setIsCitySuggestionsOpen(false);
  };

  const handleCityArrowClick = () => {
    if (!isCitySuggestionsOpen) {
      setCitySuggestions(dropdownData.cities);
    }
    setIsCitySuggestionsOpen(!isCitySuggestionsOpen);
  };

  // --- Handlers for Property Type Autocomplete ---
  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    if (value) {
      const filtered = dropdownData.propertyTypes.filter(type => 
        type.label.toLowerCase().includes(value.toLowerCase())
      );
      setTypeSuggestions(filtered);
    } else {
      setTypeSuggestions(dropdownData.propertyTypes);
    }
    setIsTypeSuggestionsOpen(true);
  };

  const handleTypeSuggestionClick = (type) => {
    setSelectedType(type.label);
    setIsTypeSuggestionsOpen(false);
  };

  const handleTypeArrowClick = () => {
    if (!isTypeSuggestionsOpen) {
      setTypeSuggestions(dropdownData.propertyTypes);
    }
    setIsTypeSuggestionsOpen(!isTypeSuggestionsOpen);
  };

  const handleSearch = () => {
    const filtered = properties.filter((prop) => {
      const cityMatch = selectedCity ? prop.location.includes(selectedCity) : true;
      const typeMatch = selectedType ? prop.type === selectedType : true;
      return cityMatch && typeMatch;
    });
    setFilteredProperties(filtered);
    setHasSearched(true);
  };

  const propertiesToShow = hasSearched ? filteredProperties : properties;

  return (
    <div className="w-full">
      <div className="relative w-full h-[20rem] flex items-center justify-center bg-[#f2f2f2] z-30">
        <div className="flex flex-col items-center justify-center px-4 w-full max-w-6xl text-center">
          <h1 className="text-black text-4xl md:text-5xl font-bold mb-6">Find Your Dream Property</h1>
          <p className="text-black/80 mb-6 max-w-2xl">Search from thousands of properties across your favorite cities</p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-4xl">
            
            {/* --- LOCATION COMBOBOX (INPUT + DROPDOWN) --- */}
            <div ref={citySearchRef} className="relative w-60 md:w-80">
              <div className="flex items-center justify-between bg-white rounded-lg shadow-md px-4 py-2 w-full">
                <input
                  type="text"
                  value={selectedCity}
                  onChange={handleCityChange}
                  onFocus={() => { setCitySuggestions(dropdownData.cities); setIsCitySuggestionsOpen(true); }}
                  placeholder="Enter location or city"
                  className="w-full bg-transparent focus:outline-none placeholder-gray-400"
                />
                <div onClick={handleCityArrowClick} className="cursor-pointer">
                  <span className="text-gray-500">▼</span>
                </div>
              </div>
              {isCitySuggestionsOpen && (                
                <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg text-left">
                  {citySuggestions.map((city) => (
                    <li key={city.value} onClick={() => handleCitySuggestionClick(city)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      {city.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* --- PROPERTY TYPE COMBOBOX (INPUT + DROPDOWN) --- */}
            <div ref={typeSearchRef} className="relative w-40 md:w-60">
              <div className="flex items-center justify-between bg-white rounded-lg shadow-md px-4 py-2 w-full">
                <input
                  type="text"
                  value={selectedType}
                  onChange={handleTypeChange}
                  onFocus={() => { setTypeSuggestions(dropdownData.propertyTypes); setIsTypeSuggestionsOpen(true); }}
                  placeholder="Property type"
                  className="w-full bg-transparent focus:outline-none placeholder-gray-400"
                />
                <div onClick={handleTypeArrowClick} className="cursor-pointer">
                  <span className="text-gray-500">▼</span>
                </div>
              </div>
              {isTypeSuggestionsOpen && (                
                <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg text-left">
                  {typeSuggestions.map((type) => (
                    <li key={type.value} onClick={() => handleTypeSuggestionClick(type)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      {type.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="px-4">
        {hasSearched && filteredProperties.length === 0 ? (
          <p className="text-center mt-12 text-gray-600">No properties found.</p>
        ) : (
          <PropertyGrid
            properties={propertiesToShow}
            wishlist={wishlist}
            onToggleWishlist={onToggleWishlist}
          />
        )}
      </div>
    </div>
  );
}