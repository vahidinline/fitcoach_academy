// api.js
import axios from 'axios';

const apiBaseUrl = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:8080')
  : (import.meta.env.VITE_API_URL || 'https://server.azishafiei.com');

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 120000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the token returned by Academy OTP verification.
api.interceptors.request.use(
  (config) => {
    const token = config.authKey || localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes('academyAuth')
    ) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      if (window.location.pathname !== '/login')
        window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export default api;
