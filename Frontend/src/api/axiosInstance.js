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
  withCredentials: true, // Always send cookies (works for local and cross-domain if configured correctly)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token for production
axiosInstance.interceptors.request.use(
  (config) => {
    // We always try to attach the token if it exists in localStorage 
    // This serves as a secondary auth mechanism if cookies are blocked
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // If a response contains fresh tokens, update them in localStorage
    if (response.data?.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    if (response.data?.data?.refreshToken) {
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          // Attempt to refresh the token
          console.log('🔄 Attempting to refresh access token...');
          const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {
            refreshToken
          }, { withCredentials: true });

          const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

          // Update tokens
          localStorage.setItem('accessToken', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          console.log('✅ Token refreshed! Retrying original request.');
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Refresh token expired or invalid:', refreshError);
        // Fall through to logout logic below
      }
      
      // If we reach here, refresh failed or was not possible
      // Clear authentication data
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Prevent loop - only redirect if not already on login page
      const isLoginPage = window.location.pathname === '/' || window.location.pathname === '/login';
      const isLoginRequest = originalRequest.url?.includes('/auth/login');
      
      if (!isLoginPage && !isLoginRequest) {
        window.location.href = '/'; 
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
