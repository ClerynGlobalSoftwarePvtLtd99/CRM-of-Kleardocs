import axios from 'axios';

// Helper to determine the backend base URL (Local vs Render)
const getBaseURL = () => {
    // Priority 1: User-specified manual override in local storage
    const manualBase = localStorage.getItem('API_URL_OVERRIDE');
    if (manualBase) return manualBase;

    // Priority 2: Check if running on localhost vs production using window.location
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       window.location.hostname.includes('localhost');
    
    // Priority 3: Use ternary operator for local vs production
    return isLocalhost 
        ? 'http://localhost:5000/api/v1' 
        : 'https://crm-of-kleardocs-backend.onrender.com/api/v1';
};

const baseURL = getBaseURL();

// Debug logging (remove in production)
console.log('🔗 API Base URL:', baseURL);
console.log('🌐 Current hostname:', window.location.hostname);

// Check if running on localhost (for cookie-based auth) vs production (for token-based auth)
const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' || 
                   window.location.hostname.includes('localhost');

const axiosInstance = axios.create({
  baseURL,
  withCredentials: isLocalhost, // Only use cookies on localhost
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token for production
axiosInstance.interceptors.request.use(
  (config) => {
    // For production (cross-domain), use token from localStorage
    if (!isLocalhost) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global errors
axiosInstance.interceptors.response.use(
  (response) => {
    // For production, store tokens from response
    if (!isLocalhost && response.data?.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      if (response.data.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear authentication data
      localStorage.removeItem('isAuthenticated');
      if (!isLocalhost) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      
      // Prevent loop - only redirect if not already on login page and not in the middle of login
      const isLoginPage = window.location.pathname === '/' || window.location.pathname === '/login';
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      
      if (!isLoginPage && !isLoginRequest) {
        window.location.href = '/'; 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
