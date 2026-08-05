import { createContext, useState, useContext, useEffect } from 'react';

const TaskContext = createContext();

const initialTasks = [
  { id: '1', title: 'Design homepage', description: 'Create wireframe for homepage', status: 'todo' },
  { id: '2', title: 'Setup database', description: 'Configure MongoDB schema', status: 'inprogress' },
  { id: '3', title: 'Write tests', description: 'Unit tests for auth module', status: 'done' },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    setTasks((prev) => [...prev, { ...task, id: Date.now().toString() }]);
  };

  const updateTask = (id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const moveTask = (id, newStatus) => {
    updateTask(id, { status: newStatus });
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}