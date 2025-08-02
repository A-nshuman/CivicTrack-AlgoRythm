import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth().
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in from localStorage
        const user = localStorage.getItem('user');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
        setLoading(false);
    }, []);

    // Login function
    const login = (userData) => {
        // In a real app, you would validate credentials with your backend
        // For now, we'll just store the user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        return true;
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        navigate('/');
    };

    // Register function
    const register = (userData) => {
        // In a real app, you would send the registration data to your backend
        // For now, we'll just store the user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        return true;
    };

    const value = {
        currentUser,
        login,
        logout,
        register,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};