import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import TicketCard from './components/TicketCard.jsx';
import './App.scss'; // Import SCSS file

const mockTickets = [
  { id: 1, title: 'Large Pothole on Main St', description: 'A very large and dangerous pothole...', category: 'Roads', status: 'Pending', distance: 1.2, imageUrl: 'https://placehold.co/600x400/f87171/ffffff?text=Pothole', reporter: 'John D.', timestamp: '2024-08-01T10:00:00Z' },
  { id: 2, title: 'Streetlight Out at Oak & 3rd', description: 'The streetlight on the corner has been out for 3 days...', category: 'Lighting', status: 'In Progress', distance: 0.8, imageUrl: 'https://placehold.co/600x400/facc15/ffffff?text=Streetlight', reporter: 'Jane S.', timestamp: '2024-07-30T22:15:00Z' },
  { id: 3, title: 'Overflowing Dumpster', description: 'The public dumpster behind the park is overflowing...', category: 'Cleanliness', status: 'Completed', distance: 2.5, imageUrl: 'https://placehold.co/600x400/4ade80/ffffff?text=Trash', reporter: 'Anonymous', timestamp: '2024-07-29T14:30:00Z' },
  { id: 4, title: 'Water Leak on Park Ave', description: 'Constant stream of water coming from a crack...', category: 'Water Supply', status: 'Pending', distance: 3.1, imageUrl: 'https://placehold.co/600x400/60a5fa/ffffff?text=Water+Leak', reporter: 'Mike P.', timestamp: '2024-08-02T08:00:00Z' },
];
const CATEGORIES = ["Roads", "Lighting", "Water Supply", "Cleanliness", "Public Safety", "Obstructions"];
const STATUSES = ["Pending", "In Progress", "Completed"];
const DISTANCES = [1, 3, 5, 10];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'All', category: 'All', distance: 'All' });
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: 'All', category: 'All', distance: 'All' });
    setSearchTerm('');
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
          <h1>Community Issues</h1>
          <p>Browse and track civic issues reported by your neighbors.</p>
        </header>

        <div className="filters-panel">
          <div className="filters-panel__container">
            <div className="filters-panel__search">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search by issue title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="filters-panel__toggle" onClick={() => setIsFiltersVisible(!isFiltersVisible)}>
              <Filter size={16} /> Filters
            </button>
            <div className={`filters-panel__dropdowns ${isFiltersVisible ? 'visible' : ''}`}>
              <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                <option value="All">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filters.distance} onChange={(e) => handleFilterChange('distance', e.target.value)}>
                <option value="All">Any Distance</option>
                {DISTANCES.map(d => <option key={d} value={d}>Within {d} km</option>)}
              </select>
              <button onClick={clearFilters} className="filters-panel__clear-btn">
                <X size={16} /> Clear
              </button>
            </div>
          </div>
        </div>

        {filteredTickets.length > 0 ? (
          <div className="tickets-grid">
            {filteredTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
          </div>
        ) : (
          <div className="no-results">
            <Search className="icon" />
            <h3>No Issues Found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}
