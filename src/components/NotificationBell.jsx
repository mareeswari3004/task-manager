import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

function timeAgo(timestamp) {
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NotificationBell() {
  const { notifications, markAsRead, markAllAsRead, unreadCount, setFocusTaskId } = useNotifications();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (n) => {
    markAsRead(n.id);
    setOpen(false);

    if (!n.taskId) return; // task link இல்லாத notification (simple info) ஆனா, ஒண்ணும் நடக்காது

    // Admin page-ல இருந்தா, Management page-க்கு போக முடியாது (role restriction)
    // அதனால Admin-க்கு role மாத்தி காட்ட முடியாது - user role மட்டும் Management-க்கு போகும்
    if (user?.role === 'admin') {
      // Admin-க்கு, task overview table-ல highlight பண்ணலாம் (future scope) - இப்போதைக்கு admin page-லேயே இருக்கும்
      return;
    }

    setFocusTaskId(n.taskId);

    if (location.pathname !== '/management') {
      navigate('/management');
    }
  };

  return (
    <div className="notif-bell-wrapper" ref={ref}>
      <button className="notif-bell-btn" onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button className="notif-mark-all" onClick={markAllAsRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <p className="notif-empty">No notifications yet.</p>
            ) : (
              notifications.slice(0, 15).map((n) => (
                <div
                  key={n.id}
                  className={`notif-item ${!n.read ? 'notif-unread' : ''} notif-${n.type} ${n.taskId ? 'notif-clickable' : ''}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <span className="notif-icon">
                    {n.type === 'warning' ? '⚠️' : n.type === 'success' ? '✅' : 'ℹ️'}
                  </span>
                  <div>
                    <p className="notif-message">{n.message}</p>
                    <span className="notif-time">{timeAgo(n.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;