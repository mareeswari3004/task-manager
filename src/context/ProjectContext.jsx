import { createContext, useState, useContext, useEffect } from 'react';

const ProjectContext = createContext();

const initialProjects = [
  { id: 'p1', name: 'Website Redesign', description: 'Company website UI/UX overhaul', color: '#5b6eff' },
  { id: 'p2', name: 'Mobile App', description: 'iOS & Android app development', color: '#7c3aed' },
];

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    return localStorage.getItem('selectedProjectId') || (projects[0]?.id || null);
  });

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem('selectedProjectId', selectedProjectId);
    }
  }, [selectedProjectId]);

  const addProject = (name, description) => {
    const colors = ['#5b6eff', '#7c3aed', '#00b894', '#e17055', '#0984e3', '#e84393'];
    const newProject = {
      id: 'p' + Date.now(),
      name,
      description,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setProjects((prev) => [...prev, newProject]);
    setSelectedProjectId(newProject.id);
    return newProject;
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProjectId === id) {
      const remaining = projects.filter((p) => p.id !== id);
      setSelectedProjectId(remaining[0]?.id || null);
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || null;

  return (
    <ProjectContext.Provider
      value={{ projects, addProject, deleteProject, selectedProjectId, setSelectedProjectId, selectedProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectContext);
}