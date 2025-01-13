import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://127.0.0.1:8000/'; // Set the base URL for API requests

// Define a custom hook for handling token refresh and navigation
const useTokenRefresh = () => {
  const navigate = useNavigate();

  // Function to refresh tokens
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post('/token/refresh/', { refresh: refreshToken });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      return response.data.access;  // Return new access token

    } catch (error) {
      console.error("Token refresh failed:", error.response?.data || error.message);
      return null;  // Indicate token refresh failure
    }
  };

  return { navigate, refreshToken };
};

// Axios request interceptor to handle token refresh
axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { navigate, refreshToken } = useTokenRefresh();

    // Check if error status is 401 (Unauthorized) and if refresh token exists
    if (error.response.status === 401 && originalRequest.url === '/token/refresh/') {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/auth/login");
      return Promise.reject(error);
    }

    if (error.response.status === 401 && originalRequest.url !== '/token/refresh/') {
      const newAccessToken = await refreshToken();

      if (newAccessToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } else {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
