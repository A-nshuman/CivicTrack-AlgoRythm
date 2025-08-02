import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Provider component that wraps the app and makes the auth object 
// available to any child component that calls useAuth().
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in from localStorage
        try {
            const user = localStorage.getItem('user');
            // Ensure the user string is not null or the literal string "undefined"
            if (user && user !== 'undefined') {
                setCurrentUser(JSON.parse(user));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            // If parsing fails, it's best to remove the corrupted item
            localStorage.removeItem('user');
        } finally {
            // Set loading to false once we've tried to get the user
            setLoading(false);
        }
    }, []);

    // Login function
    const login = (userData) => {
        // In a real app, you would validate credentials with your backend
        // For now, we'll just store the user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        return true; // Indicate success
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        navigate('/'); // Navigate to home page after logout
    };

    // Register function
    const register = (userData) => {
        // In a real app, you would send the registration data to your backend
        // For now, we'll just store the user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        return true; // Indicate success
    };

    // The value that will be supplied to any descendants of this provider
    const value = {
        currentUser,
        login,
        logout,
        register,
        isAuthenticated: !!currentUser // A boolean flag for easy checking
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Don't render children until the loading state is false */}
            {!loading && children}
        </AuthContext.Provider>
    );
};
