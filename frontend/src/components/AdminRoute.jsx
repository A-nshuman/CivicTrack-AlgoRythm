import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { currentUser, isAuthenticated } = useAuth();

    // --- DEBUGGING STEP ---
    // The logs below will appear in your browser's developer console (F12).
    // They will show you exactly what the frontend sees after you log in.
    console.log('--- Admin Route Check ---');
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Current User Object:', currentUser);
    // --- END DEBUGGING STEP ---

    // Check if user is authenticated and if their role is 'admin'.
    // We use .toLowerCase() to prevent issues with capitalization (e.g., 'Admin').
    const isAdmin = isAuthenticated && currentUser?.role?.toLowerCase() === 'admin';

    if (isAuthenticated) {
        console.log('User Role:', currentUser?.role);
        console.log('Is Admin?:', isAdmin);
    }
    
    console.log('Redirecting to:', isAdmin ? 'Admin Dashboard' : 'Home Page');
    console.log('-------------------------');


    // If they are an admin, render the child component (the AdminDashboard).
    // Otherwise, redirect them to the home page.
    return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
