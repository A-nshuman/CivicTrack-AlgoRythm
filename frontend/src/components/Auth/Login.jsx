import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import './Auth.scss';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
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
            console.log('Login form submitted:', formData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Redirect to home page after successful login
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            setErrors({ form: 'Invalid email or password' });
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
                        <h1>Login to CivicTrack</h1>
                        <p>Welcome back! Please enter your details to access your account.</p>
                    </div>
                    
                    {errors.form && (
                        <div className="error-message form-error">
                            {errors.form}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="auth-form">
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
                                placeholder="Enter your password"
                                className={errors.password ? 'error' : ''}
                            />
                            {errors.password && <div className="error-message">{errors.password}</div>}
                        </div>
                        
                        <div className="form-options">
                            <div className="remember-me">
                                <input type="checkbox" id="remember" />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="submit-button" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    
                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/register">Register</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;