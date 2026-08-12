import { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useTasks } from '../../context/TaskContext';
import { useToast } from '../../context/ToastContext';
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';
import TaskModal from './TaskModal';

function isOverdue(dueDate, status) {
  if (!dueDate || status === 'done') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function TaskCard({ task, forceOpen, onModalClose }) {
  const { deleteTask } = useTasks();
  const { showToast } = useToast();
  const { logActivity } = useActivity();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  useEffect(() => {
    if (forceOpen) {
      setShowModal(true);
    }
  }, [forceOpen]);

  const handleClose = () => {
    setShowModal(false);
    if (onModalClose) onModalClose();
  };

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="task-card"
        onClick={() => setShowModal(true)}
      >
        <div className="task-header">
          <h4>{task.title}</h4>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
              logActivity(user?.name || 'Someone', `deleted task "${task.title}"`);
              showToast('Task deleted', 'error');
            }}
          >
            ✕
          </button>
        </div>
        <p>{task.description}</p>

        {task.assignee && (
          <div className="assignee-badge">👤 {task.assignee}</div>
        )}

        {task.dueDate && (
          <div className={`due-date-badge ${overdue ? 'overdue' : ''}`}>
            {overdue ? '⚠️ Overdue: ' : '📅 '}
            {formatDate(task.dueDate)}
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal task={task} onClose={handleClose} />
      )}
    </>
  );
}

export default TaskCard;