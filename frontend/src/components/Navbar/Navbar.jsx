import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield } from 'lucide-react';
import './Navbar.scss';

const Navbar = () => {
    const { isAuthenticated, currentUser, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar__content">
                <Link to="/" className="navbar__logo">
                    <span className="logo-text">CivicTrack</span>
                </Link>
                <div className="navbar__actions">
                    {isAuthenticated ? (
                        <>
                            {/* Show Admin link only if user role is 'admin' */}
                            {currentUser?.role === 'admin' && (
                                <NavLink to="/admin" className="navbar__link navbar__link--admin">
                                    <Shield size={16} />
                                    Admin
                                </NavLink>
                            )}
                            <NavLink to="/report-issue" className="navbar__link">Report Issue</NavLink>
                            <NavLink to="/my-issues" className="navbar__link">My Issues</NavLink>
                            <button onClick={logout} className="navbar__button navbar__button--logout">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar__button navbar__button--login">Login</Link>
                            <Link to="/register" className="navbar__button navbar__button--register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
