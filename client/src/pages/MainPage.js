import { useNavigate } from 'react-router-dom';

function Main_page() {
  const navigate = useNavigate();

  return (
    <div>
      
      <header style={headerStyle}>
        <h1 style={logoStyle}>EventArena</h1>
        <div style={navButtonsContainer}>
          <button style={buttonStyle} onClick={() => navigate('/login')}>Login</button>
          <button style={buttonStyle} onClick={() => navigate('/register')}>Sign Up</button>
        </div>
      </header>

      
      <div style={heroContainer}>
        <div style={overlayStyle}>
          <h2 style={titleStyle}>Effortless Event Planning</h2>
          <p style={subtitleStyle}>Plan, manage, and elevate your events with ease</p>
          <button style={transparentButton} onClick={() => navigate('/EventPage')}>Explore Events</button>
        </div>
        <svg viewBox="0 0 1440 320" style={curveStyle}>
          <path fill="#ffffff" fillOpacity="1" d="M0,224L1440,96L1440,320L0,320"></path>
        </svg>
      </div>
    </div>
  );
}


const headerStyle = {
  position: 'absolute',
  top: 0,
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 1vw',
  color: 'white',
  backgroundColor: 'transparent',
  zIndex: 10,
};

const logoStyle = {
  margin: 0,
  fontSize: '2rem',
};

const navButtonsContainer = {
  display: 'flex',
  gap: '10px',
  marginRight: '3vw',
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

const heroContainer = {
  position: 'relative',
  height: '95vh',
  backgroundImage: 'url("/Main_Page.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  color: 'white',
  textAlign: 'center',
};

const overlayStyle = {
  zIndex: 2,
};

const titleStyle = {
  fontSize: '3rem',
  margin: 0,
};

const subtitleStyle = {
  fontSize: '1.25rem',
  margin: '2rem 0',
};

const transparentButton = {
  padding: '10px 20px',
  backgroundColor: 'transparent',
  border: '2px solid white',
  color: 'white',
  borderRadius: '4px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const curveStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
};


export default Main_page;
