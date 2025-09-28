// src/components/login_box.jsx

import React from "react";

function LoginBox() {
  // REMOVED: The outer full-screen div. The component now only returns the form box.
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Login to Your Account
      </h2>
      <form className="space-y-6">
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
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
        Don&apos;t have an account?{" "}
        <a href="#" className="text-blue-500 hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
}

export default LoginBox;
