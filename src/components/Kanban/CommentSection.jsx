import { useState } from 'react';
import { useComments } from '../../context/CommentContext';
import { useAuth } from '../../context/AuthContext';
import { useActivity } from '../../context/ActivityContext';
import { useNotifications } from '../../context/NotificationContext';

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

function CommentSection({ taskId, taskTitle }) {
  const { addComment, deleteComment, getComments } = useComments();
  const { user } = useAuth();
  const { logActivity } = useActivity();
  const { addNotification } = useNotifications();
  const [text, setText] = useState('');

  const comments = getComments(taskId);

  const handleAdd = () => {
    if (!text.trim()) return;
    addComment(taskId, user?.name || 'Anonymous', text);
    logActivity(user?.name || 'Someone', `commented on "${taskTitle}"`);
    addNotification(`${user?.name || 'Someone'} commented on "${taskTitle}"`, 'info', taskId);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="comment-section">
      <label>Comments ({comments.length})</label>

      <div className="comment-list">
        {comments.length === 0 ? (
          <p className="comment-empty">No comments yet. Start the discussion.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-avatar">
                {c.userName?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="comment-body">
                <div className="comment-meta">
                  <strong>{c.userName}</strong>
                  <span className="comment-time">{timeAgo(c.timestamp)}</span>
                </div>
                <p className="comment-text">{c.text}</p>
              </div>
              <button
                className="comment-delete"
                onClick={() => deleteComment(taskId, c.id)}
                title="Delete comment"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div className="comment-input-row">
        <textarea
          rows={2}
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleAdd}>Comment</button>
      </div>
    </div>
  );
}

export default CommentSection;