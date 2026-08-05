import { useTasks } from '../../context/TaskContext';

function TaskOverview() {
  const { tasks } = useTasks();

  return (
    <div className="task-overview">
      <h3>All Tasks</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{t.description}</td>
              <td>
                <span className={`status-badge status-${t.status}`}>{t.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskOverview;