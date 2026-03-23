import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://crm-of-kleardocs-backend.onrender.com/api/v1' : 'http://localhost:5000/api/v1');

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Logging for debugging (will show in browser console)
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.url.includes('/settings/general')) {
      console.log('API Response data:', response.data);
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      // Redirect to login if needed, or handle via Redux
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
