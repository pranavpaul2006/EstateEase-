import React from 'react';

function Hero() {
  return (
    <div className="relative w-full h-[20rem]">
      <div className="absolute inset-0 bg-[#f2f2f2]"></div>

      <div className="relative flex flex-col items-center justify-center h-full px-4">
        <h1 className="text-black text-4xl md:text-5xl font-bold mb-8 text-center">
          Find Your Dream Property
        </h1>
        <p className="text-black/80 mb-6 text-center max-w-2xl">
          Search from thousands of properties across your favorite cities
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full max-w-4xl">
          {/* Location Input */}
          <div className="relative flex items-center bg-white rounded-lg shadow-md overflow-hidden">
            <input
              type="text"
              placeholder="Enter location or city"
              className="px-4 py-2 w-60 md:w-80 focus:outline-none text-gray-700 placeholder-gray-400 pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              ▼
            </span>
          </div>

          {/* Property Type Input */}
          <div className="relative flex items-center bg-white rounded-lg shadow-md overflow-hidden">
            <input
              type="text"
              placeholder="Property type"
              className="px-4 py-2 w-40 md:w-60 focus:outline-none text-gray-700 placeholder-gray-400 pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              ▼
            </span>
          </div>

          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
