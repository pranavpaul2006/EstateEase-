import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { session } = useAuth();

  if (!session) {
    // If there is no active session, redirect the user to the login page
    return <Navigate to="/login" replace />;
  }

  // If there is a session, render the children components
  return children;
}
