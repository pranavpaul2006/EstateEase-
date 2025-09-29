import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Property = () => {
  const { id } = useParams(); // Get the property id from URL
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/properties.json")
      .then((res) => res.json())
      .then((data) => {
        const foundProperty = data.properties.find(
          (p) => p.id === parseInt(id)
        );
        setProperty(foundProperty || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load property:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <div className="text-center mt-20">Loading property details...</div>;

  if (!property)
    return <div className="text-center mt-20">Property not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-10">
      <div className="w-full max-w-6xl mx-auto flex flex-col p-4 sm:p-6 lg:p-8">
        {/* TOP SECTION: Image + Core Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          <div className="flex items-center justify-center">
            <img
              src={property.img}
              alt={property.title}
              className="w-full h-64 sm:h-80 md:h-[450px] lg:h-full object-cover rounded-xl shadow-lg"
            />
          </div>

          <div className="flex flex-col justify-center space-y-5">
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full w-max ${
                property.status === "Available"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {property.status}
            </span>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center text-gray-600 text-base sm:text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{property.location}</span>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4 text-gray-800">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Price</span>
                <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {property.price}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Area</span>
                <span className="text-2xl sm:text-3xl font-semibold">
                  {property.area}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Description + Appointment */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-300">
          {/* Description */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
              About this property
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {property.description}
            </p>
          </div>

          {/* Appointment Section */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-300">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              Schedule a Visit
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-indigo-600 hover:to-blue-500 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;
