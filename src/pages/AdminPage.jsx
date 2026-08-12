import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Stats from '../components/Admin/Stats';
import UserList from '../components/Admin/UserList';
import TaskOverview from '../components/Admin/TaskOverview';
import ActivityLog from '../components/Admin/ActivityLog';
import Charts from '../components/Admin/Charts';
import NotificationBell from '../components/NotificationBell';

function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <div className="topbar">
        <span>Admin: {user?.name}</span>
        <div className="topbar-right">
          <NotificationBell />
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="admin-container">
        <h2>Admin Dashboard</h2>
        <Stats />
        <Charts />

        <div className="admin-grid">
          <TaskOverview />
          <UserList />
        </div>

        <div className="admin-grid-full">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;