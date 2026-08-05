import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Name போடுங்க!');
      return;
    }
    login(name, role);
    // Role பொறுத்து page redirect
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/management');
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Task Manager Login</h2>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="role-select">
          <label>
            <input
              type="radio"
              value="user"
              checked={role === 'user'}
              onChange={(e) => setRole(e.target.value)}
            />
            User (Management)
          </label>
          <label>
            <input
              type="radio"
              value="admin"
              checked={role === 'admin'}
              onChange={(e) => setRole(e.target.value)}
            />
            Admin
          </label>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;