import React from "react";

function PropertyGrid() {
  const properties = [
    { location: "Bengaluru, Indiranagar", price: "₹45,00,000", img: "src/images/bg-hero-estateease.jpg" },
    { location: "Kochi, Kakkanad", price: "₹55,00,000", img: "src/images/bg-hero-estateease.jpg" },
    { location: "Chennai, OMR", price: "₹65,00,000", img: "src/images/bg-hero-estateease.jpg" },
    { location: "Mumbai, Bandra", price: "₹85,00,000", img: "src/images/bg-hero-estateease.jpg" },
    { location: "Delhi, Dwarka", price: "₹75,00,000", img: "src/images/bg-hero-estateease.jpg" },
    { location: "Hyderabad, Gachibowli", price: "₹60,00,000", img: "src/images/bg-hero-estateease.jpg" },
  
  ];

  return (
    <div className="mb-12 mt-8 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property, idx) => (
        <div
          key={idx}
          className="relative border rounded-xl shadow-lg overflow-hidden group transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <div className="h-52 w-full overflow-hidden">
            <img
              src={property.img}
              alt="Property"
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="p-4 bg-white relative z-10">
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
            <div className="flex justify-between mb-3 font-medium text-gray-800">
              <p>{property.location}</p>
              <p className="font-semibold text-blue-600">{property.price}</p>
            </div>
            <button className="w-full py-2 mt-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold hover:from-indigo-500 hover:to-blue-500 transition">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PropertyGrid;
