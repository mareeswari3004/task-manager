import { createContext, useState, useContext, useEffect } from 'react';

const ActivityContext = createContext();

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('activities');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  const logActivity = (userName, message) => {
    const entry = {
      id: Date.now() + Math.random(),
      userName,
      message,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [entry, ...prev].slice(0, 100)); // last 100 மட்டும் store பண்ணும்
  };

  return (
    <ActivityContext.Provider value={{ activities, logActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  return useContext(ActivityContext);
}