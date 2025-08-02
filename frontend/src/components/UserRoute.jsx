import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserRoute = () => {
    const { isAuthenticated } = useAuth();

    // If the user is authenticated, render the nested component (e.g., the dashboard).
    // Otherwise, redirect them to the login page.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default UserRoute;
