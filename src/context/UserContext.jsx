import { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

const initialUsers = [
  { id: 1, name: 'Arun', role: 'Member' },
  { id: 2, name: 'Priya', role: 'Member' },
  { id: 3, name: 'Karthik', role: 'Manager' },
];

export function UserProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const addUser = (name) => {
    setUsers((prev) => [...prev, { id: Date.now(), name, role: 'Member' }]);
  };

  const removeUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <UserContext.Provider value={{ users, addUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  return useContext(UserContext);
}