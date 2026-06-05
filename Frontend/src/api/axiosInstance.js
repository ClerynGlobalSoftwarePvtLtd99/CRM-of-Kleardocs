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

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Always send cookies (httpOnly refreshToken cookie)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------------------------------------------------------------------
// In-memory access token store — NEVER written to localStorage / sessionStorage
// The refresh token lives exclusively in the httpOnly cookie set by the backend.
// ---------------------------------------------------------------------------
let _accessToken = null;

export const setInMemoryToken = (token) => { _accessToken = token; };
export const clearInMemoryToken = () => { _accessToken = null; };
export const getInMemoryToken = () => _accessToken;

let isTokenRefreshing = false;

const refreshAccessTokens = async () => {
  if (isTokenRefreshing) return;
  isTokenRefreshing = true;

  // The httpOnly refreshToken cookie is sent automatically via withCredentials.
  // We do NOT read from localStorage or send it in the request body.
  const refreshResponse = await axios.post(
    `${baseURL}/auth/refresh-token`,
    {},
    { withCredentials: true }
  );

  const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
  isTokenRefreshing = false;

  // Keep the new accessToken only in memory
  if (accessToken) setInMemoryToken(accessToken);
  // newRefreshToken arrives as a new httpOnly cookie — nothing to persist here

  return { accessToken, newRefreshToken };
};

// Request interceptor — attach in-memory accessToken as Authorization header
axiosInstance.interceptors.request.use((config) => {
  const token = getInMemoryToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for global errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
    
      try {
        // Attempt to refresh the token via the httpOnly cookie
        const result = await refreshAccessTokens();

        // Update the Authorization header with the fresh token
        if (result?.accessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${result.accessToken}`;
        }

        // Retry the original request with the new token
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Fall through to logout logic below
      }

      // If we reach here, refresh failed — clear in-memory auth state
      clearInMemoryToken();
      localStorage.removeItem('isAuthenticated');

      // Redirect to the correct login page based on the path
      const path = window.location.pathname;
      const isClientPath = path.startsWith('/clients');
      const isLoginPage = path === '/' || path === '/login' || path === '/clients/login';
      const isLoginRequest = originalRequest.url?.includes('/auth/login');

      if (!isLoginPage && !isLoginRequest) {
        window.location.href = isClientPath ? '/clients/login' : '/login';
      }
    }

    return Promise.reject(error);
  }
);



export default axiosInstance;
