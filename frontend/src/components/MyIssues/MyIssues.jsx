import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import './MyIssues.scss';

const MyIssues = () => {
    const { currentUser } = useAuth();
    
    // This would be replaced with actual API call to fetch user's issues
    const mockUserIssues = [
        { id: 1, title: 'Large Pothole on Main St', description: 'A very large and dangerous pothole...', category: 'Roads', status: 'Pending', timestamp: '2024-08-01T10:00:00Z' },
        { id: 2, title: 'Streetlight Out at Oak & 3rd', description: 'The streetlight on the corner has been out for 3 days...', category: 'Lighting', status: 'In Progress', timestamp: '2024-07-30T22:15:00Z' },
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
                            <div key={issue.id} className="issue-card">
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
            </main>
        </div>
    );
};

export default MyIssues;