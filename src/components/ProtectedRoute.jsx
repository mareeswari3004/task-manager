import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();

  // Login ஆகலைன்னா, login page-க்கு redirect
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // allowedRole கொடுத்திருந்தா, role match ஆகுதான்னு check பண்ணு
  if (allowedRole && user.role !== allowedRole) {
    // Wrong role - தன் own page-க்கு redirect பண்ணு
    const redirectPath = user.role === 'admin' ? '/admin' : '/management';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;