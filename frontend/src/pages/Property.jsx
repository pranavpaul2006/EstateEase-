import React from "react";

const Property = () => {
  const property = {
    title: "Spacious Modern Villa with Garden View",
    imageSrc: "src/images/bg-hero-estateease.jpg", // Replace with your actual image path
    description:
      "Discover the perfect blend of modern architecture and serene living in this beautiful 4-bedroom villa. Located in the heart of Kakkanad, this property boasts spacious interiors, a state-of-the-art kitchen, and large windows that offer a stunning view of the private garden. Ideal for families looking for comfort and luxury in a prime location. The community offers amenities like a swimming pool, clubhouse, and 24/7 security.",
    price: "₹55,00,000",
    area: "2200 sqft",
    location: "Kochi, Kakkanad",
    status: "Available",
  };

  return (
    <div className="bg-gray-50 h-screen pt-20">
      <div className="bg-gray-50 w-full h-full flex flex-col p-4 sm:p-6 lg:p-10">
        {/* --- TOP SECTION: Image and Core Details --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Image Column */}
          <div className="flex items-center justify-center">
            <img
              src={property.imageSrc}
              alt={property.title}
              className="w-full h-64 sm:h-80 md:h-[450px] lg:h-full object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Details Column */}
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

        {/* --- BOTTOM SECTION: Description and Appointment --- */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
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
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-100">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              Schedule a Visit
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]} // Prevent past dates
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
