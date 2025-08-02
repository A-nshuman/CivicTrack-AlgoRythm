import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import MapComponent from '../../MapComponent';
import './MyIssues.scss';

const MyIssues = () => {
    const { currentUser } = useAuth();
    
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const handleIssueClick = (issue) => {
        setSelectedIssue(issue);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    // This would be replaced with actual API call to fetch user's issues
    const mockUserIssues = [
        { 
            id: 1, 
            title: 'Large Pothole on Main St', 
            description: 'A very large and dangerous pothole that poses risk to vehicles and pedestrians. The pothole is approximately 2 feet wide and 8 inches deep.', 
            category: 'Roads', 
            status: 'Pending', 
            timestamp: '2024-08-01T10:00:00Z',
            location: 'Main Street & 5th Avenue',
            reportedBy: 'John Doe',
            image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop'
        },
        { 
            id: 2, 
            title: 'Streetlight Out at Oak & 3rd', 
            description: 'The streetlight on the corner has been out for 3 days, creating a safety hazard for pedestrians at night. The entire intersection is very dark.', 
            category: 'Lighting', 
            status: 'In Progress', 
            timestamp: '2024-07-30T22:15:00Z',
            location: 'Oak Street & 3rd Avenue',
            reportedBy: 'Jane Smith',
            image: 'https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?q=80&w=2070&auto=format&fit=crop'
        },
    ];

    return (
        <div className="my-issues-page">
            <Navbar />
            <main className="main-content">
                <header className="page-header">
                    <h1>My Issues</h1>
                    <p>Track the status of issues you've reported.</p>
                </header>

                {mockUserIssues.length > 0 ? (
                    <div className="issues-list">
                        {mockUserIssues.map(issue => (
                            <div key={issue.id} className="issue-card" onClick={() => handleIssueClick(issue)}>
                                <div className="issue-header">
                                    <h3>{issue.title}</h3>
                                    <span className={`status-badge status-${issue.status.toLowerCase().replace(' ', '-')}`}>
                                        {issue.status}
                                    </span>
                                </div>
                                <p className="issue-description">{issue.description}</p>
                                <div className="issue-meta">
                                    <span className="category">{issue.category}</span>
                                    <span className="date">
                                        {new Date(issue.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-issues">
                        <h3>You haven't reported any issues yet</h3>
                        <p>When you report issues, they will appear here.</p>
                    </div>
                )}

                {showPopup && selectedIssue && (
                    <div className="issue-popup-overlay" onClick={closePopup}>
                        <div className="issue-popup" onClick={(e) => e.stopPropagation()}>
                            <button className="close-button" onClick={closePopup}>×</button>
                            
                            <div className="issue-popup-content">
                                <div className="issue-popup-header">
                                    <h2>{selectedIssue.title}</h2>
                                    <span className={`status-badge status-${selectedIssue.status.toLowerCase().replace(' ', '-')}`}>
                                        {selectedIssue.status}
                                    </span>
                                </div>
                                
                                <div className="issue-popup-image">
                                    <img src={selectedIssue.image} alt={selectedIssue.title} />
                                </div>
                                
                                <div className="issue-popup-description">
                                    <h3>Description</h3>
                                    <p>{selectedIssue.description}</p>
                                </div>

                                <div className="issue-popup-map">
                                    <h3>Location</h3>
                                    <MapComponent />
                                </div>
                                
                                <div className="issue-popup-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Status:</span>
                                        <span className="detail-value">{selectedIssue.status}</span>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-label">Reported By:</span>
                                        <span className="detail-value">{selectedIssue.reportedBy}</span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Location:</span>
                                        <span className="detail-value">{selectedIssue.location}</span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Category:</span>
                                        <span className="detail-value">{selectedIssue.category}</span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Date Reported:</span>
                                        <span className="detail-value">
                                            {new Date(selectedIssue.timestamp).toLocaleDateString()} at {new Date(selectedIssue.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                                

                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyIssues;