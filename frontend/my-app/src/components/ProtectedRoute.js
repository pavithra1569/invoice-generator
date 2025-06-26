import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.authState);
  return isAuthenticated ? children : <Navigate to="/login" />;
}
