import { DndContext } from '@dnd-kit/core';
import { useState } from 'react';
import Column from './Column';
import { useTasks } from '../../context/TaskContext';
import { prioritizeTasks, generateDescription } from '../../api/claudeApi';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

function Board() {
  const { tasks, moveTask, addTask } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [priorityResult, setPriorityResult] = useState(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      moveTask(active.id, over.id);
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title, description, status: 'todo' });
    setTitle('');
    setDescription('');
    setShowForm(false);
  };

  const handleGenerateDescription = async () => {
    if (!title.trim()) {
      alert('முதல்ல title போடுங்க!');
      return;
    }
    setLoading(true);
    const desc = await generateDescription(title);
    setDescription(desc);
    setLoading(false);
  };

  const handlePrioritize = async () => {
    setLoading(true);
    const result = await prioritizeTasks(tasks);
    setPriorityResult(result);
    setLoading(false);
  };

  return (
    <div className="board-container">
      <div className="board-header">
        <h2>Task Board</h2>
        <div>
          <button onClick={() => setShowForm(!showForm)}>+ Add Task</button>
          <button onClick={handlePrioritize} disabled={loading}>
            {loading ? 'Thinking...' : '🤖 AI Prioritize'}
          </button>
        </div>
      </div>

      {priorityResult && (
        <div className="priority-result">
          <h4>AI Suggested Priority Order:</h4>
          <ol>
            {priorityResult.map((title, i) => (
              <li key={i}>{title}</li>
            ))}
          </ol>
          <button onClick={() => setPriorityResult(null)}>Close</button>
        </div>
      )}

      {showForm && (
        <form className="add-task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="button" onClick={handleGenerateDescription} disabled={loading}>
            {loading ? '...' : '🤖 AI Generate'}
          </button>
          <button type="submit">Add</button>
        </form>
      )}

      <DndContext onDragEnd={handleDragEnd}>
        <div className="board">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasks.filter((t) => t.status === col.id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default Board;