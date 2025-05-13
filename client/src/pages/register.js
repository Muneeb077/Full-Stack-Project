// src/pages/Register.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, username, email, password } = formData;
    if (!name || !username || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const res = await registerUser(formData);
      if (res.data.success) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div style={heroContainer}>
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
          <h2 style={{ textAlign: 'center', marginBottom: '-1rem' }}>Welcome to EventArena</h2>
          <h4 style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 'normal'}}>Plan events with ease</h4>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
          />
          <button type="submit" style={registerButtonStyle}>Submit</button>
          <div style={{ textAlign: 'center'}}>
            <p style={{ fontSize: '16px', color:'grey'}}>
              Already have an account?{' '}
              <span
                onClick={() => navigate('/login')}
                style={{
                  color: '#315d83',
                  cursor: 'pointer',
                  fontWeight: 'Bold',
                }}
              >
                Login
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

const registerButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#315d83',
  color: '#fff',
};

export default Register;
