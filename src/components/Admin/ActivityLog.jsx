import { useActivity } from '../../context/ActivityContext';

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

function ActivityLog() {
  const { activities } = useActivity();

  return (
    <div className="activity-log-container">
      <h3>Recent Activity</h3>
      {activities.length === 0 ? (
        <p className="activity-empty">No activity yet.</p>
      ) : (
        <ul className="activity-list">
          {activities.slice(0, 20).map((a) => (
            <li key={a.id} className="activity-item">
              <div className="activity-avatar">
                {a.userName?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="activity-content">
                <span className="activity-text">
                  <strong>{a.userName}</strong> {a.message}
                </span>
                <span className="activity-time">{timeAgo(a.timestamp)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityLog;