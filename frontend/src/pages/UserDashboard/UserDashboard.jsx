import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, Map, Flag } from 'lucide-react';
import TicketCard from '../../components/TicketCard/TicketCard.jsx';
import MapComponent from '../../MapComponent.jsx';
import { getTickets, flagTicket } from '../../endpoints/ticket.jsx';
import './UserDashboard.scss';

// This component is the main view for a logged-in user.
export default function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'All', category: 'All', distance: 'All' });
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await getTickets();
        setTickets(response.data || []);
      } catch (err) {
        setError('Failed to fetch tickets. Please try again.');
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
    if (!selectedTicket) return;
    const checked = e.target.checked;
    setIsFlagged(checked);
    try {
      await flagTicket(selectedTicket._id, checked);
      // Optionally show a success message
    } catch (err) {
      console.error("Failed to flag ticket", err);
      // Revert checkbox on error
      setIsFlagged(!checked);
    }
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
    <main className="main-content">
      <header className="page-header">
        <div className="left">
          <h1>Community Dashboard</h1>
          <p>Browse and track civic issues reported by your neighbors.</p>
        </div>
        <button className='mapBtn' onClick={() => setIsMapOpen(true)}><Map /> View Map</button>
      </header>

      {/* Filters, Grid, and Popups are identical to your previous App.jsx */}
      <div className="filters-panel">
        {/* ... filter panel JSX ... */}
      </div>

      {loading && <p>Loading issues...</p>}
      {error && <p className="error-state">{error}</p>}
      
      {!loading && !error && (
        filteredTickets.length > 0 ? (
          <div className="tickets-grid">
            {filteredTickets.map(ticket => <TicketCard key={ticket._id} ticket={ticket} onClick={() => handleTicketClick(ticket)} />)}
          </div>
        ) : (
          <div className="no-results">
            <Search className="icon" />
            <h3>No Issues Found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )
      )}

      {showPopup && selectedTicket && (
        <div className="issue-popup-overlay" onClick={closePopup}>
          <div className="issue-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closePopup}>×</button>
            <div className="issue-popup-content">
                {/* ... all popup details from previous step ... */}
                <div className="issue-popup-actions">
                  <label className="flag-issue-label">
                    <input type="checkbox" checked={isFlagged} onChange={handleFlagChange} />
                    <Flag size={16} />
                    Flag this issue
                  </label>
                </div>
            </div>
          </div>
        </div>
      )}

      {isMapOpen && (
        <div className="map-modal-overlay" onClick={() => setIsMapOpen(false)}>
          <div className="map-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="map-modal-close-btn" onClick={() => setIsMapOpen(false)}><X size={20} /></button>
            <MapComponent tickets={tickets} />
          </div>
        </div>
      )}
    </main>
  );
}
