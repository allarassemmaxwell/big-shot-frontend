import axios from 'axios';
import { BASE_URL } from 'constant';
// import { getDecryptedItem, removeItem } from './utils/localStorageUtils'; // import the utility

// Create a custom axios instance
const instance = axios.create({
    baseURL: BASE_URL,  // Replace with your actual API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the access token with every request
instance.interceptors.request.use(
    (config) => {
        // const accessToken = getDecryptedItem("access_token");
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token refreshing
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

            // Handle 401 error - token expired
            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                const refreshToken = localStorage.getItem('refresh_token');
                
                if (refreshToken) {
                    try {
                        const response = await axios.post(`${BASE_URL}/token/refresh/`, { refresh: refreshToken });
                        const newAccessToken = response.data.access;
                        const newRefreshToken = response.data.refresh;
                        
                        // Store new tokens
                        localStorage.setItem('access_token', newAccessToken);
                        localStorage.setItem('refresh_token', newRefreshToken);

                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                        // Retry the original request
                        return instance(originalRequest);
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError.response?.data || refreshError.message);
                        // removeItem("access_token");
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem("email");
                        localStorage.removeItem("first_name");
                        localStorage.removeItem("last_name");
                        window.location.href = '/auth/login';  // You can use `navigate` here instead (see below for that solution)
                    }
                }
            }
        return Promise.reject(error);
    }
);

export default instance;
