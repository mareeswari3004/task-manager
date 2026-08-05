import { useState } from 'react';

const initialUsers = [
  { id: 1, name: 'Arun', role: 'Member' },
  { id: 2, name: 'Priya', role: 'Member' },
  { id: 3, name: 'Karthik', role: 'Manager' },
];

function UserList() {
  const [users, setUsers] = useState(initialUsers);
  const [newName, setNewName] = useState('');

  const addUser = () => {
    if (!newName.trim()) return;
    setUsers([...users, { id: Date.now(), name: newName, role: 'Member' }]);
    setNewName('');
  };

  const removeUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="user-list-container">
      <h3>Users</h3>
      <div className="add-user-row">
        <input
          type="text"
          placeholder="New user name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={addUser}>Add User</button>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>
                <button className="remove-btn" onClick={() => removeUser(u.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;