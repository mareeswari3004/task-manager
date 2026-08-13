import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useToast } from '../../context/ToastContext';
import { useUsers } from '../../context/UserContext';
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';
import CommentSection from './CommentSection';
import { useNotifications } from '../../context/NotificationContext';
import AttachmentSection from './AttachmentSection';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

function TaskModal({ task, onClose }) {
  const { updateTask, deleteTask } = useTasks();
  const { showToast } = useToast();
  const { users } = useUsers();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [assignee, setAssignee] = useState(task.assignee || '');

  const { logActivity } = useActivity();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const handleSave = () => {
    updateTask(task.id, { title, description, status, dueDate, assignee });
    logActivity(user?.name || 'Someone', `updated task "${title}"`);
    showToast('Task updated', 'success');
  };

  const handleDelete = () => {
    deleteTask(task.id);
    logActivity(user?.name || 'Someone', `deleted task "${task.title}"`);
    showToast('Task deleted', 'error');
    onClose();
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    updateTask(task.id, { status: newStatus });
    logActivity(
      user?.name || 'Someone',
      `changed status of "${task.title}" to ${newStatus}`
    );
    showToast('Status updated', 'success');
  };

  const handleAssigneeChange = (newAssignee) => {
    setAssignee(newAssignee);
    updateTask(task.id, { assignee: newAssignee });
    logActivity(
      user?.name || 'Someone',
      `assigned "${task.title}" to ${newAssignee || 'Unassigned'}`
    );

    if (newAssignee) {
      addNotification(
        `"${task.title}" has been assigned to ${newAssignee}`,
        'info'
      );
    }

    showToast('Assignee updated', 'success');
  };

  return (
    <div className="fullpage-overlay">
      <div className="fullpage-modal">

        {/* TOP BAR */}
        <div className="fullpage-topbar">
          <div className="fullpage-topbar-left">
            <span className="modal-task-id">
              TASK-{task.id.toString().slice(-4)}
            </span>
          </div>

          <div className="fullpage-topbar-right">
            <button
              className="modal-delete-btn"
              onClick={handleDelete}
            >
              Delete
            </button>

            <button
              className="modal-close-x"
              onClick={onClose}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* TWO COLUMN BODY */}
        <div className="fullpage-body">

          {/* LEFT SIDE - MAIN CONTENT */}
          <div className="fullpage-left">

            <input
              className="modal-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />

            <div className="modal-field">
              <div className="modal-desc-header">
                <label>Description</label>
              </div>

              <textarea
                rows={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
              />
            </div>

            <button
              className="modal-save-btn"
              onClick={handleSave}
            >
              Save Changes
            </button>

            <AttachmentSection
              taskId={task.id}
              taskTitle={task.title}
            />

            <CommentSection
              taskId={task.id}
              taskTitle={task.title}
            />
          </div>

          {/* RIGHT SIDE - PINNED FIELDS SIDEBAR */}
          <div className="fullpage-right">
            <h4 className="sidebar-heading">Details</h4>

            <div className="sidebar-field">
              <label>Status</label>

              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sidebar-field">
              <label>Due Date</label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="sidebar-field">
              <label>Assignee</label>

              <select
                value={assignee}
                onChange={(e) => handleAssigneeChange(e.target.value)}
              >
                <option value="">Unassigned</option>

                {users.map((u) => (
                  <option
                    key={u.id}
                    value={u.name}
                  >
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sidebar-field">
              <label>Task ID</label>

              <div className="sidebar-readonly">
                TASK-{task.id.toString().slice(-4)}
              </div>
            </div>

            <hr className="sidebar-divider" />

            <div className="sidebar-field">
              <label>Created</label>

              <div className="sidebar-readonly">
                {new Date(
                  parseInt(task.id) || Date.now()
                ).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default TaskModal;