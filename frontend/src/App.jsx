import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Map, Flag } from 'lucide-react';
import Navbar from './components/Navbar/Navbar.jsx';
import TicketCard from './components/TicketCard/TicketCard.jsx';
import MapComponent from './MapComponent.jsx';
import './App.scss';

const mockTickets = [
  { id: 1, title: 'Large Pothole on Main St', description: 'A very large and dangerous pothole near the central library. Multiple cars have been damaged over the past week, and it poses a significant risk to cyclists and motorcyclists, especially at night.', category: 'Roads', status: 'Pending', distance: 1.2, imageUrl: 'https://placehold.co/600x400/f87171/ffffff?text=Pothole', reporter: 'John D.', timestamp: '2024-08-01T10:00:00Z', location: 'Main St & 5th Ave', isFlagged: false },
  { id: 2, title: 'Streetlight Out at Oak & 3rd', description: 'The streetlight on the corner has been out for 3 days, making the intersection very dark and unsafe for pedestrians at night.', category: 'Lighting', status: 'In Progress', distance: 0.8, imageUrl: 'https://placehold.co/600x400/facc15/ffffff?text=Streetlight', reporter: 'Jane S.', timestamp: '2024-07-30T22:15:00Z', location: 'Oak & 3rd', isFlagged: true },
  { id: 3, title: 'Overflowing Dumpster', description: 'The public dumpster behind the park is overflowing with trash, attracting pests and creating an unsanitary environment for children playing nearby.', category: 'Cleanliness', status: 'Completed', distance: 2.5, imageUrl: 'https://placehold.co/600x400/4ade80/ffffff?text=Trash', reporter: 'Anonymous', timestamp: '2024-07-29T14:30:00Z', location: 'Central Park', isFlagged: false },
  { id: 4, title: 'Water Leak on Park Ave', description: 'There is a constant stream of clean water coming from a crack in the pavement. It has been going on for over a week, wasting a significant amount of water.', category: 'Water Supply', status: 'Pending', distance: 3.1, imageUrl: 'https://placehold.co/600x400/60a5fa/ffffff?text=Water+Leak', reporter: 'Mike P.', timestamp: '2024-08-02T08:00:00Z', location: 'Park Avenue', isFlagged: false },
];
const CATEGORIES = ["Roads", "Lighting", "Water Supply", "Cleanliness", "Public Safety", "Obstructions"];
const STATUSES = ["Pending", "In Progress", "Completed"];
const DISTANCES = [1, 3, 5, 10];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'All', category: 'All', distance: 'All' });
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: 'All', category: 'All', distance: 'All' });
    setSearchTerm('');
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsFlagged(ticket.isFlagged || false);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedTicket(null);
  };

  const handleFlagChange = async (e) => {
    const checked = e.target.checked;
    setIsFlagged(checked);
    console.log(`Ticket ${selectedTicket.id} flagged status set to: ${checked}`);
    // In a real app, you would call your backend API here
    // await flagTicketApi(selectedTicket.id, checked);
  };

  const filteredTickets = useMemo(() => {
    return mockTickets.filter(ticket => {
      const searchMatch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = filters.status === 'All' || ticket.status === filters.status;
      const categoryMatch = filters.category === 'All' || ticket.category === filters.category;
      const distanceMatch = filters.distance === 'All' || ticket.distance <= Number(filters.distance);
      return searchMatch && statusMatch && categoryMatch && distanceMatch;
    });
  }, [searchTerm, filters]);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <header className="page-header">
          <div className="left">
            <h1>Community Issues</h1>
            <p>Browse and track civic issues reported by your neighbors.</p>
          </div>
          <button className='mapBtn' onClick={() => setIsMapOpen(true)}><Map /> View Map</button>
        </header>

        <div className="filters-panel">
          {/* ... filters content from previous steps ... */}
        </div>

        {filteredTickets.length > 0 ? (
          <div className="tickets-grid">
            {filteredTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} onClick={() => handleTicketClick(ticket)} />)}
          </div>
        ) : (
          <div className="no-results">
            {/* ... no results content ... */}
          </div>
        )}

        {/* Ticket Detail Popup */}
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
                <div className="issue-popup-description">
                  <h3>Description</h3>
                  <p>{selectedTicket.description}</p>
                </div>
                <div className="issue-popup-map">
                  <h3>Location on Map</h3>
                  <MapComponent />
                </div>
                <div className="issue-popup-details">
                  <div className="detail-item">
                    <span className="detail-label">Reported By:</span>
                    <span className="detail-value">{selectedTicket.reporter}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{selectedTicket.category}</span>
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
                <div className="issue-popup-actions">
                  <label className="flag-issue-label">
                    <input
                      type="checkbox"
                      checked={isFlagged}
                      onChange={handleFlagChange}
                    />
                    <Flag size={16} />
                    Flag this issue as inappropriate or spam
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Popup */}
        {isMapOpen && (
          <div className="map-modal-overlay" onClick={() => setIsMapOpen(false)}>
            <div className="map-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="map-modal-close-btn" onClick={() => setIsMapOpen(false)}>
                <X size={20} />
              </button>
              <MapComponent />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
