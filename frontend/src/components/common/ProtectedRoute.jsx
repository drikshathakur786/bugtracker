import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// This component wraps any page that requires login
// If user is not logged in, redirect to /login automatically
function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;