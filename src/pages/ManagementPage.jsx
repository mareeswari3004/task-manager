import Board from '../components/Kanban/Board';
import ProjectSidebar from '../components/Project/ProjectSidebar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';

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
        <div className="topbar-right">
          <NotificationBell />
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="management-layout">
        <ProjectSidebar />
        <Board />
      </div>
    </div>
  );
}

export default ManagementPage;