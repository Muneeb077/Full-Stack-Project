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
    <div style = {heroContainer}>
      <svg viewBox="0 0 1440 320" style={curveStyle}>
          <path fill="#ffffff" fillOpacity="1" d="M0,224L1440,96L1440,320L0,320"></path>
        </svg>
      <div style={overlayStyle}></div>
  
      <header style={headerStyle}>
        <div style={logoContainerStyle} onClick={() => navigate('/')}>
          <img src="/Main_logo.png" alt="Logo" style={logoImageStyle} />
          <span style={logoTextStyle}>EventArena</span>
        </div>
      </header>

      <div style={containerStyle}>
        <form style={formStyle} onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="/Logo.png" alt="Logo" style={{ height: '80px', width: '90px' }} />
        </div>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Welcome to EventArena</h2>

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

          <div style={{textAlign: 'left'}}>
            <span onClick={() => navigate('/forgotpass')}
              style={{
                color:'#315d83',
                cursor: 'pointer',
                fontWeight: 'Bold',
              }}>
                Forgot Password ?
            </span>
          </div>
          <button type="submit" style={loginButtonStyle}>
            Login
          </button>
          <div style={{ textAlign: 'center'}}>
            <p style={{ fontSize: '16px', color:'grey'}}>
              Don't have an account?{' '}
              <span
                onClick={() => navigate('/register')}
                style={{
                  color: '#315d83',
                  cursor: 'pointer',
                  fontWeight: 'Bold',
                }}
              >
                Register
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
    
  );
}

const headerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '1rem 2rem',
  fontSize: '2rem',
  color: 'White',
  fontWeight: 'bold',
  backgroundColor: 'transparent',
  zIndex: 2,
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
};

const logoImageStyle = {
  height: '40px',
  marginRight: '10px',
};

const logoTextStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: 'White',
};

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 0,
};

const heroContainer = {
  position: 'relative',
  height: '100vh',
  width: '100%',
  backgroundImage: 'url("/Main_Page.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const curveStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
};

const containerStyle = {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '3rem',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  width: '350px',
};

const inputStyle = {
  marginBottom: '0.7rem',
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
  backgroundColor: '#315d83',
  color: '#fff',
};

export default Login;
