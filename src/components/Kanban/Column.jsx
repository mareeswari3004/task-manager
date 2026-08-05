import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

function Column({ id, title, tasks }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="column"
      style={{ background: isOver ? '#e8eaff' : '#f4f5f7' }}
    >
      <h3>{title} ({tasks.length})</h3>
      <div className="column-tasks">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default Column;