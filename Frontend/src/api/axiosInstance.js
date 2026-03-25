import axios from 'axios';

// Helper to determine the backend base URL (Local vs Render)
const getBaseURL = () => {
    // Priority 1: User-specified manual override in local storage
    const manualBase = localStorage.getItem('API_URL_OVERRIDE');
    if (manualBase) return manualBase;

    // Priority 2: VITE_API_BASE_URL (used in both Local Dev and Build Env)
    if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;

    // Priority 3: Automatic fallback based on build mode
    return import.meta.env.MODE === 'production' 
        ? 'https://crm-of-kleardocs-backend.onrender.com/api/v1' 
        : 'http://localhost:5000/api/v1';
};

const baseURL = getBaseURL();

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor 
axiosInstance.interceptors.request.use(
  (config) => {
    // Relying strictly on HttpOnly cookies sent automatically via withCredentials: true
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
      localStorage.removeItem('isAuthenticated');
      
      // Prevent loop if already on login page
      if (window.location.pathname !== '/') {
        window.location.href = '/'; 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
