import { createContext, useState, useContext, useEffect } from 'react';

const CommentContext = createContext();

export function CommentProvider({ children }) {
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem('comments');
    return saved ? JSON.parse(saved) : {};
    // structure: { taskId: [ {id, userName, text, timestamp}, ... ] }
  });

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const addComment = (taskId, userName, text) => {
    const newComment = {
      id: Date.now() + Math.random(),
      userName,
      text,
      timestamp: new Date().toISOString(),
    };
    setComments((prev) => ({
      ...prev,
      [taskId]: [...(prev[taskId] || []), newComment],
    }));
  };

  const deleteComment = (taskId, commentId) => {
    setComments((prev) => ({
      ...prev,
      [taskId]: (prev[taskId] || []).filter((c) => c.id !== commentId),
    }));
  };

  const getComments = (taskId) => comments[taskId] || [];

  return (
    <CommentContext.Provider value={{ addComment, deleteComment, getComments }}>
      {children}
    </CommentContext.Provider>
  );
}

export function useComments() {
  return useContext(CommentContext);
}