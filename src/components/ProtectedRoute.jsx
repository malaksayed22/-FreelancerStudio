// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const auth = (() => {
    try {
      return JSON.parse(localStorage.getItem("fs_auth") || "{}");
    } catch {
      return {};
    }
  })();

  if (!auth.loggedIn) return <Navigate to="/login" replace />;
  return children;
}
