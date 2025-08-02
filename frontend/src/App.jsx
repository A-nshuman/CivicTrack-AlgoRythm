import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, Map as MapIcon } from 'lucide-react';
import Navbar from './components/Navbar/Navbar.jsx';
import TicketCard from './components/TicketCard/TicketCard.jsx';
import MapComponent from './MapComponent.jsx';
import TicketsService from './endpoints/ticket.jsx';
import './App.scss';

// This component serves as the public-facing home page for non-logged-in users.
export default function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'All', category: 'All' });
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await TicketsService.getTickets();
        setTickets(response.data || []);
      } catch (err) {
        setError('Failed to fetch tickets. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: 'All', category: 'All' });
    setSearchTerm('');
  };

  // When a ticket card is clicked, set the selected ticket and show the popup
  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowPopup(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedTicket(null);
  };

  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    return tickets.filter(ticket => {
      const searchMatch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = filters.status === 'All' || ticket.status === filters.status;
      const categoryMatch = filters.category === 'All' || ticket.category === filters.category;
      return searchMatch && statusMatch && categoryMatch;
    });
  }, [searchTerm, filters, tickets]);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <header className="page-header">
          <div className="left">
            <h1>Community Issues</h1>
            <p>Browse and track civic issues reported by your neighbors.</p>
          </div>
          <button className='mapBtn' onClick={() => setIsMapOpen(true)}><MapIcon /> View Map</button>
        </header>

        <div className="filters-panel">
          {/* Filters can be added here if needed for the public page */}
        </div>

        {loading && <p>Loading issues...</p>}
        {error && <p className="error-state">{error}</p>}
        
        {!loading && !error && (
          filteredTickets.length > 0 ? (
            <div className="tickets-grid">
              {filteredTickets.map(ticket => (
                <TicketCard 
                  key={ticket._id} 
                  ticket={ticket} 
                  onClick={() => handleTicketClick(ticket)} // Pass the click handler
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <Search className="icon" />
              <h3>No Issues Found</h3>
              <p>There are currently no issues reported in this area.</p>
            </div>
          )
        )}

        {/* --- TICKET DETAIL POPUP --- */}
        {showPopup && selectedTicket && (
          <div className="issue-popup-overlay" onClick={closePopup}>
            <div className="issue-popup" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={closePopup}>×</button>
              <div className="issue-popup-content">
                <div className="issue-popup-header">
                  <h2>{selectedTicket.title}</h2>
                  <span className={`status-badge status-${selectedTicket.status.toLowerCase().replace(' ', '-')}`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <div className="issue-popup-image">
                  <img src={selectedTicket.imageUrl} alt={selectedTicket.title} />
                </div>
                <div className="issue-popup-map">
                  <h3>Location on Map</h3>
                  <MapComponent />
                </div>
                <div className="issue-popup-details">
                  <div className="detail-item">
                    <span className="detail-label">Reported By:</span>
                    <span className="detail-value">{selectedTicket.reporter?.name || 'Anonymous'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{selectedTicket.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date Reported:</span>
                    <span className="detail-value">
                      {new Date(selectedTicket.timestamp).toLocaleDateString()} at {new Date(selectedTicket.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Modal */}
        {isMapOpen && (
          <div className="map-modal-overlay" onClick={() => setIsMapOpen(false)}>
            <div className="map-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="map-modal-close-btn" onClick={() => setIsMapOpen(false)}><X size={20} /></button>
              <MapComponent tickets={tickets} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
