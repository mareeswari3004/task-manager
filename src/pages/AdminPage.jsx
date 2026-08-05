import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Stats from '../components/Admin/Stats';
import UserList from '../components/Admin/UserList';
import TaskOverview from '../components/Admin/TaskOverview';

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
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="admin-container">
        <h2>Admin Dashboard</h2>
        <Stats />

        <div className="admin-grid">
          <TaskOverview />
          <UserList />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;