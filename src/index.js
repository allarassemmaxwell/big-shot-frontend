
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";

// Function to check if user is authenticated
const isAuthenticated = () => !!localStorage.getItem("access_token");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
        <Routes>
        {/* Admin routes protected by authentication */}
        <Route
            path="/admin/*"
            element={
            isAuthenticated() ? <AdminLayout /> : <Navigate to="/" />
            }
        />
        
        {/* Auth routes (login, etc.) */}
        <Route path="/*" element={<AuthLayout />} />

        {/* Redirect to admin dashboard if no matching route */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>


        {/* <Routes>
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/auth/*" element={<AuthLayout />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes> */}
    </BrowserRouter>
);
