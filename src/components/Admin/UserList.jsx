import { useState } from 'react';
import { useUsers } from '../../context/UserContext';

function UserList() {
  const { users, addUser, removeUser } = useUsers();
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    addUser(newName);
    setNewName('');
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
        <button onClick={handleAdd}>Add User</button>
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