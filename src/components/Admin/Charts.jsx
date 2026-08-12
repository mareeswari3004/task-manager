import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useTasks } from '../../context/TaskContext';

const STATUS_COLORS = {
  todo: '#ff9800',
  inprogress: '#2196f3',
  done: '#4caf50',
};

const STATUS_LABELS = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

function Charts() {
  const { tasks } = useTasks();

  const statusData = useMemo(() => {
    const counts = { todo: 0, inprogress: 0, done: 0 };
    tasks.forEach((t) => { counts[t.status] = (counts[t.status] || 0) + 1; });
    return Object.keys(counts).map((key) => ({
      name: STATUS_LABELS[key],
      value: counts[key],
      color: STATUS_COLORS[key],
    }));
  }, [tasks]);

  const assigneeData = useMemo(() => {
    const counts = {};
    tasks.forEach((t) => {
      const name = t.assignee || 'Unassigned';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.keys(counts).map((name) => ({ name, tasks: counts[name] }));
  }, [tasks]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="charts-grid">
      {/* Status Distribution Pie Chart */}
      <div className="chart-card">
        <h3>Task Status Distribution</h3>
        {totalTasks === 0 ? (
          <p className="chart-empty">No tasks to display.</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            <div className="completion-rate">
              <span className="completion-value">{completionRate}%</span>
              <span className="completion-label">Completion Rate</span>
            </div>
          </>
        )}
      </div>

      {/* Tasks per Assignee Bar Chart */}
      <div className="chart-card">
        <h3>Tasks per Assignee</h3>
        {assigneeData.length === 0 ? (
          <p className="chart-empty">No tasks to display.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={assigneeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="tasks" fill="#5b6eff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Charts;