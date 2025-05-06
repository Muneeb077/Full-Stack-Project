import { useNavigate } from 'react-router-dom';

function Main_page() {
  const navigate = useNavigate();  // React Router navigation hook

  return (
    <div>
      {/* Header */}
      <header style={headerStyle}>
        <h1 style={{ margin: 0 }}>EventArena</h1>
        <div>
          <button style={buttonStyle} onClick={() => navigate('/login')}>Login</button>
          <button style={buttonStyle} onClick={() => navigate('/register')}>Sign Up</button>
        </div>
      </header>

      {/* Main Body */}
      <main style={mainStyle}>
        <h2>Effortless Event Planning, Memorable Experiences</h2>
        <p>Plan, manage, and elevate your events with ease - from intimate gathering to grand conferences, all in one powerful platform</p>
        <button style={buttonview} onClick={()=> navigate('/EventPage')}>Explore Events</button>
      </main>
    </div>
  );
}

// Simple Inline Styles
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  backgroundColor: '#282c34',
  color: 'white'
};

const buttonStyle = {
  marginLeft: '10px',
  padding: '8px 16px',
  backgroundColor: 'white',
  color: '#282c34',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const buttonview = {
  backgroundColor: '#282c34',
  fontWeight: 'bold',
  color: 'white'
}

const mainStyle = {
  textAlign: 'center',
  marginTop: '50px'
};

export default Main_page;
