import Board from '../components/Kanban/Board';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ManagementPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <div className="topbar">
        <span>Welcome, {user?.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <Board />
    </div>
  );
}

export default ManagementPage;