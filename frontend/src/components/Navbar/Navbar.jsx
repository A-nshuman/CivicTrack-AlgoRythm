import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.scss'; // Import SCSS file

const Navbar = () => {
    const { currentUser, logout, isAuthenticated } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    
    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };
    
    const handleConfirmLogout = () => {
        logout();
        setShowLogoutConfirm(false);
    };
    
    const handleCancelLogout = () => {
        setShowLogoutConfirm(false);
    };
    
    return (
        <nav className="navbar">
            <div className="navbar__content">
                <Link to="/" className="navbar__logo">
                    <svg className="logo-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                    <span className="logo-text">CivicTrack</span>
                </Link>
                <div className="navbar__actions">
                    {isAuthenticated ? (
                        <>
                            <Link to="/my-issues" className="navbar__button navbar__button--login">
                                My Issues
                            </Link>
                            <Link to="/report-issue" className="navbar__button navbar__button--login">
                                Report Issue
                            </Link>
                            <button onClick={handleLogoutClick} className="navbar__button navbar__button--login">
                                Logout
                            </button>
                            
                            {showLogoutConfirm && (
                                <div className="logout-confirm-overlay">
                                    <div className="logout-confirm-modal">
                                        <h3>Are you sure you want to logout?</h3>
                                        <div className="logout-confirm-actions">
                                            <button 
                                                onClick={handleConfirmLogout} 
                                                className="navbar__button navbar__button--register"
                                            >
                                                Logout
                                            </button>
                                            <button 
                                                onClick={handleCancelLogout} 
                                                className="navbar__button navbar__button--login"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar__button navbar__button--login">
                                Login
                            </Link>
                            <Link to="/register" className="navbar__button navbar__button--register">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
