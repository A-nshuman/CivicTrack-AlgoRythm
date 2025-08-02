import React, { useState, useEffect, useMemo } from 'react';
import { Shield, UserX, Flag, Map as MapIcon } from 'lucide-react';
import TicketsService from '../../endpoints/ticket'; // Keep this for fetching tickets
import AdminService from '../../endpoints/admin'; // Correctly import banUser from admin endpoint
import MapComponent from '../../MapComponent';
import './AdminDashboard.scss';

const AdminDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState(''); // To show feedback after an action

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const ticketsResponse = await TicketsService.getTickets();
                // Assuming the backend populates the 'reporter' field with user details
                setTickets(ticketsResponse.data || []);
            } catch (err) {
                setError('Failed to fetch admin data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Memoized calculation to sort tickets by the number of flags
    const sortedTickets = useMemo(() => {
        if (!tickets.length) return [];
        // Filter out tickets with no flags and then sort
        return tickets
            .filter(ticket => ticket.flags && ticket.flags.length > 0)
            .sort((a, b) => b.flags.length - a.flags.length);
    }, [tickets]);

    // Handle the ban user action
    const handleBanUser = async (userId, userName) => {
        // A simple browser confirmation before banning
        if (window.confirm(`Are you sure you want to ban the user "${userName}"? This action cannot be undone.`)) {
            try {
                await AdminService.banUser(userId);
                setFeedback(`User ${userName} has been successfully banned.`);
            // You might want to refresh the data or update the UI to show the user is banned
            } catch (err) {
                setFeedback(`Failed to ban user ${userName}.`);
                console.error('Ban user error:', err);
            }
            // Clear the feedback message after 5 seconds
            setTimeout(() => setFeedback(''), 5000);
        }
    };

    if (loading) {
        return <div className="loading-state">Loading Admin Dashboard...</div>;
    }

    if (error) {
        return <div className="error-state">{error}</div>;
    }

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <Shield size={40} />
                <h1>Admin Dashboard</h1>
                <p>Oversee and moderate community activity.</p>
            </header>

            {feedback && <div className="feedback-message">{feedback}</div>}

            <div className="admin-grid">
                <div className="admin-widget tickets-widget full-width">
                    <div className="widget-header">
                        <Flag size={20} />
                        <h3>Most Flagged Issues</h3>
                    </div>
                    <div className="widget-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>Issue Title</th>
                                    <th>Reporter</th>
                                    <th>Flags</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTickets.length > 0 ? sortedTickets.map(ticket => (
                                    <tr key={ticket._id}>
                                        <td>{ticket.title}</td>
                                        {/* Assumes reporter is an object with name */}
                                        <td>{ticket.reporter?.name || 'N/A'}</td>
                                        <td className="flags-count">{ticket.flags.length}</td>
                                        <td>
                                            {/* Ensure we have a reporter with an ID before showing the button */}
                                            {ticket.reporter?._id ? (
                                                <button 
                                                    className="ban-btn" 
                                                    onClick={() => handleBanUser(ticket.reporter._id, ticket.reporter.name)}
                                                >
                                                    <UserX size={16} />
                                                    Ban User
                                                </button>
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center' }}>No flagged issues found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="admin-widget map-widget">
                     <div className="widget-header">
                        <MapIcon size={20} />
                        <h3>All Issues Map</h3>
                    </div>
                    <div className="widget-content map-container">
                        <MapComponent tickets={tickets} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
