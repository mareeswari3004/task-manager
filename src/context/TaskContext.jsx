import { createContext, useState, useContext, useEffect } from 'react';

const TaskContext = createContext();

const initialTasks = [
  { id: '1', title: 'Design homepage', description: 'Create wireframe for homepage', status: 'todo', dueDate: '', projectId: 'p1', assignee: '' },
  { id: '2', title: 'Setup database', description: 'Configure MongoDB schema', status: 'inprogress', dueDate: '', projectId: 'p1', assignee: '' },
  { id: '3', title: 'Write tests', description: 'Unit tests for auth module', status: 'done', dueDate: '', projectId: 'p1', assignee: '' },
  { id: '4', title: 'Design app icon', description: 'Create app icon variations', status: 'todo', dueDate: '', projectId: 'p2', assignee: '' },
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

  const getTasksByProject = (projectId) => tasks.filter((t) => t.projectId === projectId);

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask, getTasksByProject }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}