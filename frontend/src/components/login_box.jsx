import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function LoginBox({ onAuthSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isLoginView) {
        // --- Login ---
        // The signIn function from your context is all you need.
        await signIn({ email, password });

        // The onAuthSuccess callback and navigation are correct.
        if (onAuthSuccess) onAuthSuccess();
        navigate("/");
      } else {
        // --- Signup ---
        // Your signUp function from the context correctly passes the metadata.
        // The database trigger will handle creating the profile.
        await signUp({ email, password, fullName, phone });

        setMessage(
          "Signup successful! Please check your email to verify your account."
        );

        // Clear form (this is good UX)
        setFullName("");
        setPhone("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setError("");
    setMessage("");
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        {isLoginView ? "Login to Your Account" : "Create a New Account"}
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {!isLoginView && (
          <>
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123-456-7890"
              />
            </div>
          </>
        )}

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
        >
          {loading
            ? isLoginView
              ? "Logging in..."
              : "Signing up..."
            : isLoginView
            ? "Login"
            : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        {isLoginView ? "Don't have an account?" : "Already have an account?"}
        <button
          onClick={toggleView}
          className="font-medium text-blue-500 hover:text-blue-700 ml-1 focus:outline-none"
        >
          {isLoginView ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}

export default LoginBox;
