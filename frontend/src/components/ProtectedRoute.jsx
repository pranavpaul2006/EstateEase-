// src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    // If the user is not logged in, redirect them to the home page
    return <Navigate to="/" replace />;
  }

  // If the user is logged in, show the page content
  return children;
}

export default ProtectedRoute;