import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000
});

// Response interceptor for graceful error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error or backend unavailable
      error.userMessage = 'Unable to connect to the server. Please check your connection or try again later.';
    } else if (error.response.status === 503) {
      error.userMessage = 'Service temporarily unavailable. Please try again in a few moments.';
    } else if (error.response.status === 504) {
      error.userMessage = 'Request timed out. The server is taking too long to respond.';
    }
    return Promise.reject(error);
  }
);

export default api;
