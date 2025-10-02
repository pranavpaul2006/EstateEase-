import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropertyGrid from "./property_grid";

export default function Hero({ properties, wishlist, onToggleWishlist }) {
  const navigate = useNavigate();
  const [dropdownData, setDropdownData] = useState({ cities: [], propertyTypes: [] });
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [citySuggestions, setCitySuggestions] = useState([]);
  const [typeSuggestions, setTypeSuggestions] = useState([]);
  const [isCitySuggestionsOpen, setIsCitySuggestionsOpen] = useState(false);
  const [isTypeSuggestionsOpen, setIsTypeSuggestionsOpen] = useState(false);

  const [randomProperties, setRandomProperties] = useState([]);
  const citySearchRef = useRef(null);
  const typeSearchRef = useRef(null);

  useEffect(() => {
    fetch("/data/dropdownData.json")
      .then((res) => res.json())
      .then((data) => setDropdownData(data));
  }, []);

  useEffect(() => {
    const shuffled = [...properties].sort(() => 0.5 - Math.random());
    setRandomProperties(shuffled.slice(0, 6));
  }, [properties]);

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

  // --- Handlers for City & Type (unchanged) ---
  const handleCityChange = (e) => {
    const value = e.target.value;
    setSelectedCity(value);
    if (value) {
      const filtered = dropdownData.cities.filter(city =>
        city.label.toLowerCase().includes(value.toLowerCase())
      );
      setCitySuggestions(filtered);
    } else {
      setCitySuggestions(dropdownData.cities);
    }
    setIsCitySuggestionsOpen(true);
  };

  const handleCitySuggestionClick = (city) => {
    setSelectedCity(city.label);
    setIsCitySuggestionsOpen(false);
  };

  const handleCityArrowClick = () => {
    if (!isCitySuggestionsOpen) setCitySuggestions(dropdownData.cities);
    setIsCitySuggestionsOpen(!isCitySuggestionsOpen);
  };

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
    if (!isTypeSuggestionsOpen) setTypeSuggestions(dropdownData.propertyTypes);
    setIsTypeSuggestionsOpen(!isTypeSuggestionsOpen);
  };

  // --- Only change: Search button navigates to /buy ---
  const handleSearch = () => {
    const query = new URLSearchParams();
    if (selectedCity) query.append("city", selectedCity);
    if (selectedType) query.append("type", selectedType);
    navigate(`/buy?${query.toString()}`);
  };

  return (
    <div className="w-full">
      <div className="relative w-full h-[20rem] flex items-center justify-center bg-[#f2f2f2] z-30">
        <div className="flex flex-col items-center justify-center px-4 w-full max-w-6xl text-center">
          <h1 className="text-black text-4xl md:text-5xl font-bold mb-6">Find Your Dream Property</h1>
          <p className="text-black/80 mb-6 max-w-2xl">Search from thousands of properties across your favorite cities</p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-4xl">
            {/* City ComboBox */}
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
                <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg text-left scrollbar-none">
                  {citySuggestions.length > 0 ? (
                    citySuggestions.map((city) => (
                      <li key={city.value} onClick={() => handleCitySuggestionClick(city)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        {city.label}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-400 cursor-default">Not available</li>
                  )}
                </ul>
              )}
            </div>

            {/* Property Type ComboBox */}
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
                <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg text-left scrollbar-none">
                  {typeSuggestions.length > 0 ? (
                    typeSuggestions.map((type) => (
                      <li key={type.value} onClick={() => handleTypeSuggestionClick(type)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        {type.label}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-400 cursor-default">Not available</li>
                  )}
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
        <PropertyGrid
          properties={randomProperties}
          wishlist={wishlist}
          onToggleWishlist={onToggleWishlist}
        />
      </div>
    </div>
  );
}
