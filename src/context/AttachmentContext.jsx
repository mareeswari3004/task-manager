import { createContext, useState, useContext, useEffect } from 'react';

const AttachmentContext = createContext();

export function AttachmentProvider({ children }) {
  const [attachments, setAttachments] = useState(() => {
    const saved = localStorage.getItem('attachments');
    return saved ? JSON.parse(saved) : {};
    // structure: { taskId: [ {id, name, type, size, dataUrl}, ... ] }
  });

  useEffect(() => {
    try {
      localStorage.setItem('attachments', JSON.stringify(attachments));
    } catch (e) {
      console.error('Storage full - cannot save attachment', e);
    }
  }, [attachments]);

  const addAttachment = (taskId, file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result,
        };
        setAttachments((prev) => ({
          ...prev,
          [taskId]: [...(prev[taskId] || []), newFile],
        }));
        resolve(newFile);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const deleteAttachment = (taskId, fileId) => {
    setAttachments((prev) => ({
      ...prev,
      [taskId]: (prev[taskId] || []).filter((f) => f.id !== fileId),
    }));
  };

  const getAttachments = (taskId) => attachments[taskId] || [];

  return (
    <AttachmentContext.Provider value={{ addAttachment, deleteAttachment, getAttachments }}>
      {children}
    </AttachmentContext.Provider>
  );
}

export function useAttachments() {
  return useContext(AttachmentContext);
}