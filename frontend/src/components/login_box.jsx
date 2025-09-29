// src/components/login_box.jsx

import React from "react";

// 1. Accept the onLoginSuccess prop
function LoginBox({ onLoginSuccess }) {
  // 2. Create a submit handler
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page refresh
    // Here you would normally check the email and password
    // For now, we'll just assume the login is successful
    console.log("Login form submitted, calling onLoginSuccess...");
    onLoginSuccess(); // 3. Call the function passed from App.jsx
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Login to Your Account
      </h2>
      {/* 4. Attach the handler to the form's onSubmit event */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="user mail"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginBox;