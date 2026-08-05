import { useDraggable } from '@dnd-kit/core';
import { useTasks } from '../../context/TaskContext';

function TaskCard({ task }) {
  const { deleteTask } = useTasks();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="task-card"
    >
      <div className="task-header">
        <h4>{task.title}</h4>
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
        >
          ✕
        </button>
      </div>
      <p>{task.description}</p>
    </div>
  );
}

export default TaskCard;