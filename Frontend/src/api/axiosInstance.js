import axios from 'axios';

// Helper to determine the backend base URL (Local vs Render)
export const getBaseURL = () => {
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

let isTokenRefreshing = false;

const refreshAccessTokens = async () => {
  if (isTokenRefreshing) return;
  isTokenRefreshing = true;
  const refreshResponse = await axios.post(`${baseURL}/auth/refresh-token`, {

  }, { withCredentials: true });

  const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
  isTokenRefreshing = false;
  return { accessToken, newRefreshToken };
}


// Response interceptor for global errors and token refresh
axiosInstance.interceptors.response.use( //I have should keep it but remove localStorage access
  (response) => {
    // If a response contains fresh tokens, update them in localStorage
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
    
      try {
        // Attempt to refresh the token
        await refreshAccessTokens();

        // Retry the original request with the new token
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Fall through to logout logic below
      }

      // If we reach here, refresh failed or was not possible
      // Clear authentication data
      localStorage.removeItem('isAuthenticated');
   

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
