import { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';

function ProjectSidebar() {
  const { projects, addProject, deleteProject, selectedProjectId, setSelectedProjectId } = useProjects();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addProject(name, description);
    showToast('Project created', 'success');
    setName('');
    setDescription('');
    setShowForm(false);
  };

  const handleDelete = (e, id, projectName) => {
    e.stopPropagation();
    if (window.confirm(`Delete project "${projectName}"? Tasks inside will remain but be inaccessible.`)) {
      deleteProject(id);
      showToast('Project deleted', 'error');
    }
  };

  return (
    <div className="project-sidebar">
      <div className="project-sidebar-header">
        <h3>Projects</h3>
        <button className="project-add-btn" onClick={() => setShowForm(!showForm)}>+</button>
      </div>

      {showForm && (
        <form className="project-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Create</button>
        </form>
      )}

      <div className="project-list">
        {projects.map((p) => (
          <div
            key={p.id}
            className={`project-item ${selectedProjectId === p.id ? 'project-active' : ''}`}
            onClick={() => setSelectedProjectId(p.id)}
          >
            <span className="project-dot" style={{ background: p.color }}></span>
            <div className="project-item-text">
              <span className="project-name">{p.name}</span>
              <span className="project-desc">{p.description}</span>
            </div>
            <button
              className="project-delete-btn"
              onClick={(e) => handleDelete(e, p.id, p.name)}
              title="Delete project"
            >
              ✕
            </button>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="project-empty">No projects yet. Create one!</p>
        )}
      </div>
    </div>
  );
}

export default ProjectSidebar;