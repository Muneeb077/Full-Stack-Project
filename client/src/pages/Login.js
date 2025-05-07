// src/pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/EventPage');
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Login</h2>
        <input
          style={inputStyle}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={loginButtonStyle}>
          Login
        </button>
        <button
          type="button"
          style={signupButtonStyle}
          onClick={() => navigate('/register')}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f0f2f5',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  width: '300px',
};

const inputStyle = {
  marginBottom: '1rem',
  padding: '0.75rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const buttonStyle = {
  padding: '0.75rem',
  marginTop: '0.5rem',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const loginButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#007bff',
  color: '#fff',
};

const signupButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#6c757d',
  color: '#fff',
};

export default Login;
