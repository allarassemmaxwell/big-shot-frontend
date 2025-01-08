// api.js or axios.js
import axios from "axios";

// Function to get the token from localStorage
const getToken = () => localStorage.getItem("access_token");

// Axios Interceptor to attach token to every request
axios.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            // Attach the token to Authorization header for each request
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axios;
