import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import './Auth.scss';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        // Enhanced password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else {
            // Check length (8-16 characters)
            if (formData.password.length < 8 || formData.password.length > 16) {
                newErrors.password = 'Password must be between 8 and 16 characters';
            }
            // Check for at least one number
            else if (!/\d/.test(formData.password)) {
                newErrors.password = 'Password must contain at least one number';
            }
            // Check for at least one letter
            else if (!/[a-zA-Z]/.test(formData.password)) {
                newErrors.password = 'Password must contain at least one letter';
            }
            // Check for spaces
            else if (/\s/.test(formData.password)) {
                newErrors.password = 'Password cannot contain spaces';
            }
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            // This would be replaced with actual API call to your backend
            console.log('Registration form submitted:', formData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Redirect to login page after successful registration
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({ form: 'Registration failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Navbar />
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <Link to="/" className="back-link">
                            <ArrowLeft size={20} />
                            <span>Back to Home</span>
                        </Link>
                        <h1>Create an Account</h1>
                        <p>Join CivicTrack to report and track issues in your community.</p>
                    </div>
                    
                    {errors.form && (
                        <div className="error-message form-error">
                            {errors.form}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <div className="error-message">{errors.name}</div>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <div className="error-message">{errors.email}</div>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                className={errors.password ? 'error' : ''}
                            />
                            {errors.password && <div className="error-message">{errors.password}</div>}
                            <div className="password-requirements">
                                Password must be 8-16 characters, contain at least one letter and one number, and no spaces.
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className={errors.confirmPassword ? 'error' : ''}
                            />
                            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                        </div>
                        
                        <div className="terms-agreement">
                            <input type="checkbox" id="terms" required />
                            <label htmlFor="terms">
                                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                            </label>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="submit-button" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                    
                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;