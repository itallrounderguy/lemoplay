//ProtectedRoute.jsx

// src/components/route/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  const location = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
