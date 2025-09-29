import React, { useState, useEffect } from "react";
import PropertyGrid from "./property_grid";

export default function Hero() {
  const [properties, setProperties] = useState([]);
  const [dropdownData, setDropdownData] = useState({ cities: [], propertyTypes: [] });
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetch("/data/properties.json")
      .then((res) => res.json())
      .then((data) => setProperties(data.properties));

    fetch("/data/dropdownData.json")
      .then((res) => res.json())
      .then((data) => setDropdownData(data));
  }, []);

  const handleSearch = () => {
    const filtered = properties.filter((prop) => {
      const cityMatch = selectedCity ? prop.location.includes(selectedCity) : true;
      const typeMatch = selectedType ? prop.type === selectedType : true;
      return cityMatch && typeMatch;
    });

    setFilteredProperties(filtered);
    setHasSearched(true);
  };

  const propertiesToShow = filteredProperties.length > 0 ? filteredProperties : properties;

  return (
    <div className="w-full">
      <div className="relative w-full h-[20rem] flex items-center justify-center bg-[#f2f2f2]">
        <div className="flex flex-col items-center justify-center px-4 w-full max-w-6xl text-center">
          <h1 className="text-black text-4xl md:text-5xl font-bold mb-6">
            Find Your Dream Property
          </h1>
          <p className="text-black/80 mb-6 max-w-2xl">
            Search from thousands of properties across your favorite cities
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-4xl">
            <div className="relative flex items-center bg-white rounded-lg shadow-md overflow-hidden w-60 md:w-80">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 w-full focus:outline-none text-gray-700 appearance-none"
              >
                <option value="">Enter location or city</option>
                {dropdownData.cities.map((city) => (
                  <option key={city.value} value={city.label}>
                    {city.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                ▼
              </span>
            </div>

            <div className="relative flex items-center bg-white rounded-lg shadow-md overflow-hidden w-40 md:w-60">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 w-full focus:outline-none text-gray-700 appearance-none"
              >
                <option value="">Property type</option>
                {dropdownData.propertyTypes.map((type) => (
                  <option key={type.value} value={type.label}>
                    {type.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                ▼
              </span>
            </div>

            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="px-4">
        {hasSearched && filteredProperties.length === 0 ? (
          <p className="text-center mt-12 text-gray-600">
            No properties found.
          </p>
        ) : (
          <PropertyGrid properties={propertiesToShow} />
        )}
      </div>
    </div>
  );
}
