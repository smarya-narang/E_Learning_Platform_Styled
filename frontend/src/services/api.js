import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor to provide friendly error messages
api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      // network error (server unreachable or CORS)
      return Promise.reject({ message: 'Network Error: Unable to reach the backend. Is the server running on http://localhost:5001?' });
    }
    return Promise.reject(error);
  }
);

export default api;
