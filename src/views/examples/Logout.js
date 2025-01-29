import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "constant";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                // Retrieve refresh token from local storage
                const refreshToken = localStorage.getItem("refresh_token");

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Call the logout API with the refresh token
                await axios.post(
                    `${BASE_URL}/logout/`,
                    { refresh: refreshToken },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                    }
                );
            } catch (error) {
                console.error("Logout failed:", error.response?.data || error.message);
            } finally {
                // Clear local storage
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("email");
                localStorage.removeItem("first_name");
                localStorage.removeItem("last_name");

                // Redirect to login
                navigate("/auth/login");
            }
        };

        handleLogout();
    }, [navigate]);

    return (
        <div className="text-center mt-5">
            <h3>Logging you out...</h3>
        </div>
    );
};

export default Logout;
