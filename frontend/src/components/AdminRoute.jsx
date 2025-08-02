import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { currentUser, isAuthenticated } = useAuth();

    // Check if user is authenticated and if their role is 'admin'
    const isAdmin = isAuthenticated && currentUser?.role === 'admin';

    // If they are an admin, render the child component (the AdminDashboard).
    // Otherwise, redirect them to the home page.
    return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
