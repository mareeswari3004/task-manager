import { useTasks } from '../../context/TaskContext';
import { useProjects } from '../../context/ProjectContext';

function TaskOverview() {
  const { tasks } = useTasks();
  const { projects } = useProjects();

  const getProjectName = (projectId) => {
    return projects.find((p) => p.id === projectId)?.name || 'Unknown';
  };

  return (
    <div className="task-overview">
      <h3>All Tasks</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Project</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{getProjectName(t.projectId)}</td>
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