import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useState, useMemo, useEffect } from 'react';
import Column from './Column';
import { useTasks } from '../../context/TaskContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useProjects } from '../../context/ProjectContext';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

function Board() {
  const { tasks, moveTask, addTask } = useTasks();
  const { showToast } = useToast();
  const { darkMode, toggleDarkMode } = useTheme();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [openTaskId, setOpenTaskId] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { logActivity } = useActivity();
  const { user } = useAuth();
  const { addNotification, focusTaskId, setFocusTaskId } = useNotifications();
  const { selectedProjectId, selectedProject, setSelectedProjectId } = useProjects();

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesProject = t.projectId === selectedProjectId;
      const matchesSearch = t.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || t.status === statusFilter;

      return matchesProject && matchesSearch && matchesStatus;
    });
  }, [tasks, searchText, statusFilter, selectedProjectId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const movedTask = tasks.find((t) => t.id === active.id);

      moveTask(active.id, over.id);

      showToast('Task moved successfully', 'success');

      logActivity(
        user?.name || 'Someone',
        `moved "${movedTask?.title}" to ${over.id}`
      );
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (!selectedProjectId) {
      showToast('Please select or create a project first', 'error');
      return;
    }

    addTask({
      title,
      description,
      status: 'todo',
      dueDate,
      projectId: selectedProjectId,
      assignee: '',
    });

    logActivity(
      user?.name || 'Someone',
      `created task "${title}" in ${selectedProject?.name}`
    );

    setTitle('');
    setDescription('');
    setDueDate('');
    setShowForm(false);

    showToast('Task added successfully', 'success');
  };

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const notifiedKey = 'overdueNotified';
    const alreadyNotified = JSON.parse(
      localStorage.getItem(notifiedKey) || '[]'
    );

    const newlyNotified = [...alreadyNotified];

    tasks
      .filter((t) => t.projectId === selectedProjectId)
      .forEach((t) => {
        if (
          t.dueDate &&
          t.status !== 'done' &&
          new Date(t.dueDate) < today
        ) {
          if (!alreadyNotified.includes(t.id)) {
            addNotification(
              `Task "${t.title}" is overdue!`,
              'warning',
              t.id
            );

            newlyNotified.push(t.id);
          }
        }
      });

    if (newlyNotified.length !== alreadyNotified.length) {
      localStorage.setItem(
        notifiedKey,
        JSON.stringify(newlyNotified)
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (focusTaskId) {
      const targetTask = tasks.find(
        (t) => t.id === focusTaskId
      );

      if (targetTask) {
        if (targetTask.projectId !== selectedProjectId) {
          setSelectedProjectId(targetTask.projectId);
        }

        setOpenTaskId(focusTaskId);
        setFocusTaskId(null);
      }
    }
  }, [
    focusTaskId,
    tasks,
    selectedProjectId,
    setSelectedProjectId,
    setFocusTaskId,
  ]);

  return (
    <div className="board-container">
      <div className="board-header">
        <h2>
          {selectedProject
            ? `${selectedProject.name} — Board`
            : 'Select a Project'}
        </h2>

        <div>
          <button
            className="theme-toggle-btn"
            onClick={toggleDarkMode}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          <button onClick={() => setShowForm(!showForm)}>
            + Add Task
          </button>
        </div>
      </div>

      {!selectedProjectId ? (
        <p className="chart-empty">
          Create or select a project from the sidebar to get started.
        </p>
      ) : (
        <>
          <div className="search-filter-bar">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search tasks by title..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <select
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {showForm && (
            <form
              className="add-task-form"
              onSubmit={handleAddTask}
            >
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

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />

              <button type="submit">
                Add
              </button>
            </form>
          )}

          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
          >
            <div className="board">
              {COLUMNS.map((col) => (
                <Column
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  tasks={filteredTasks.filter(
                    (t) => t.status === col.id
                  )}
                  openTaskId={openTaskId}
                  setOpenTaskId={setOpenTaskId}
                />
              ))}
            </div>
          </DndContext>
        </>
      )}
    </div>
  );
}

export default Board;