import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import MapComponent from '../../MapComponent.jsx';
import './ReportIssue.scss';

const CATEGORIES = ["Roads", "Lighting", "Water Supply", "Cleanliness", "Public Safety", "Obstructions"];

const ReportIssue = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        image: null
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    
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
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
            
            // Clear error
            if (errors.image) {
                setErrors(prev => ({
                    ...prev,
                    image: ''
                }));
            }
        }
    };
    
    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null
        }));
        setPreviewImage(null);
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        
        if (!formData.category) {
            newErrors.category = 'Category is required';
        }
        
        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
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
            console.log('Issue report submitted:', formData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message and redirect
            alert('Issue reported successfully!');
            navigate('/my-issues');
        } catch (error) {
            console.error('Report submission error:', error);
            setErrors({ form: 'Failed to submit report. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="report-issue-page">
            <Navbar />
            <main className="main-content">
                <header className="page-header">
                    <h1>Report an Issue</h1>
                    <p>Help improve your community by reporting issues you notice.</p>
                </header>
                
                {errors.form && (
                    <div className="error-message form-error">
                        {errors.form}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="report-form">
                    <div className="form-group">
                        <label htmlFor="title">Issue Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="E.g., Pothole on Main Street"
                            className={errors.title ? 'error' : ''}
                        />
                        {errors.title && <div className="error-message">{errors.title}</div>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the issue in detail..."
                            rows="4"
                            className={errors.description ? 'error' : ''}
                        ></textarea>
                        {errors.description && <div className="error-message">{errors.description}</div>}
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={errors.category ? 'error' : ''}
                            >
                                <option value="">Select a category</option>
                                {CATEGORIES.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            {errors.category && <div className="error-message">{errors.category}</div>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <div className="location-input">
                                <MapPin size={16} className="location-icon" />
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Enter address or description"
                                    className={errors.location ? 'error' : ''}
                                />
                            </div>
                            {errors.location && <div className="error-message">{errors.location}</div>}
                            <div className="location-map">
                                <MapComponent />
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Photo (Optional)</label>
                        {!previewImage ? (
                            <div className="image-upload">
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="file-input"
                                />
                                <label htmlFor="image" className="upload-label">
                                    <Upload size={24} />
                                    <span>Click to upload an image</span>
                                </label>
                            </div>
                        ) : (
                            <div className="image-preview">
                                <img src={previewImage} alt="Preview" />
                                <button 
                                    type="button" 
                                    className="remove-image" 
                                    onClick={removeImage}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        className="submit-button" 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            </main>
        </div>
    );
};

export default ReportIssue;