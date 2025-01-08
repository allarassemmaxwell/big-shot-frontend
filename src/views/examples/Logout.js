/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

*/

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                // Call the logout API
                await axios.post(
                    "http://127.0.0.1:8000/logout/",
                    {},
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
