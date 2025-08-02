import React from 'react';
import './Navbar.scss'; // Import SCSS file

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar__content">
                <a href="/" className="navbar__logo">
                    <svg className="logo-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                    <span className="logo-text">CivicTrack</span>
                </a>
                <div className="navbar__actions">
                    <button className="navbar__button navbar__button--login">
                        Login
                    </button>
                    <button className="navbar__button navbar__button--register">
                        Register
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
