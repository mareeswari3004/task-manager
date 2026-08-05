import { useTasks } from '../../context/TaskContext';

function Stats() {
  const { tasks } = useTasks();

  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const inprogress = tasks.filter((t) => t.status === 'inprogress').length;
  const done = tasks.filter((t) => t.status === 'done').length;

  const cards = [
    { label: 'Total Tasks', value: total, color: '#4a5eff' },
    { label: 'To Do', value: todo, color: '#ff9800' },
    { label: 'In Progress', value: inprogress, color: '#2196f3' },
    { label: 'Done', value: done, color: '#4caf50' },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div key={card.label} className="stat-card" style={{ borderTop: `4px solid ${card.color}` }}>
          <h3>{card.value}</h3>
          <p>{card.label}</p>
        </div>
      ))}
    </div>
  );
}

export default Stats;