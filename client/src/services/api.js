import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:2800',
});

// Example API endpoints:
export const login = (credentials) => API.post('/login', credentials);
export const registerUser = (userData) => API.post('/register', userData);
export const getEvents = () => API.get('/events');
export const createEvent = (eventData) => API.put('/event/create-event', eventData);
