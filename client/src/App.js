// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import Register from './pages/register';
import Forgotpass from './pages/Forgotpass';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgotpass' element={<Forgotpass/>} />
      </Routes>
    </Router>
  );
}

export default App;
