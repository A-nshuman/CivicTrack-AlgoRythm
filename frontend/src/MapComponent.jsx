import React, { useState, useEffect } from 'react';
// 1. Import react-leaflet components and leaflet CSS - added Popup and Tooltip
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Your existing Lucide icons
import { MapPin, X, AlertCircle, Clock, User, Tag } from 'lucide-react';

// Your existing sample data
const sampleComplaints = [
  { id: 1, title: "Street Light Not Working", description: "The street light on Main Street has been out for 3 days", location: { lat: 40.7128, lng: -74.0060, address: "123 Main St, New York, NY" }, tags: ["infrastructure", "lighting", "urgent"], status: "pending", reportedBy: "John Doe", reportedAt: "2024-01-15T10:30:00Z", category: "infrastructure" },
  { id: 2, title: "Pothole on Highway", description: "Large pothole causing traffic issues and potential vehicle damage", location: { lat: 40.7614, lng: -73.9776, address: "456 Highway Ave, New York, NY" }, tags: ["road", "safety", "high-priority"], status: "in-progress", reportedBy: "Jane Smith", reportedAt: "2024-01-14T14:22:00Z", category: "road" },
  { id: 3, title: "Noise Complaint", description: "Loud construction work outside permitted hours", location: { lat: 40.7505, lng: -73.9934, address: "789 Construction Blvd, New York, NY" }, tags: ["noise", "construction", "residential"], status: "resolved", reportedBy: "Mike Johnson", reportedAt: "2024-01-13T09:15:00Z", category: "noise" },
  { id: 4, title: "Broken Water Main", description: "Water flooding the street due to broken main", location: { lat: 40.7282, lng: -73.9942, address: "321 Water St, New York, NY" }, tags: ["water", "emergency", "infrastructure"], status: "pending", reportedBy: "Sarah Wilson", reportedAt: "2024-01-16T08:45:00Z", category: "infrastructure" },
  { id: 5, title: "Illegal Parking", description: "Cars blocking fire hydrant access", location: { lat: 40.7589, lng: -73.9851, address: "654 Park Ave, New York, NY" }, tags: ["parking", "safety", "violation"], status: "in-progress", reportedBy: "Tom Brown", reportedAt: "2024-01-15T16:20:00Z", category: "parking" }
];

const ComplaintsMap = () => {
  const [complaints, setComplaints] = useState(sampleComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filter, setFilter] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ef4444'; // red
      case 'in-progress': return '#f59e0b'; // yellow
      case 'resolved': return '#10b981'; // green
      default: return '#6b7280'; // gray
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return 'Unknown';
    }
  };
  
  // Create a function to generate custom icons using your colors
  const createCustomIcon = (status) => {
    const color = getStatusColor(status);
    const iconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    `;

    return L.divIcon({
      html: iconHtml,
      className: '', // important to remove default styling
      iconSize: [32, 32],
      iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -32]
    });
  };

  const filteredComplaints = complaints.filter(complaint =>
    filter === 'all' || complaint.status === filter
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header & Filters */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4"></h1>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({complaints.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'pending' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending ({complaints.filter(c => c.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('in-progress')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'in-progress' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                In Progress ({complaints.filter(c => c.status === 'in-progress').length})
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'resolved' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Resolved ({complaints.filter(c => c.status === 'resolved').length})
              </button>
            </div>
          </div>

          {/* Map with Interactive Popups */}
          <div className="p-6">
            <MapContainer 
              center={[40.7128, -74.0060]} 
              zoom={12} 
              style={{ height: '500px', width: '100%', borderRadius: '0.5rem' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Map over filtered complaints to create Markers with Popups and Tooltips */}
              {filteredComplaints.map((complaint) => (
                <Marker
                  key={complaint.id}
                  position={[complaint.location.lat, complaint.location.lng]}
                  icon={createCustomIcon(complaint.status)}
                  eventHandlers={{
                    click: () => {
                      setSelectedComplaint(complaint);
                    },
                  }}
                >
                  {/* Tooltip shows on hover */}
                  <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                    <div className="text-center">
                      <div className="font-semibold text-sm">{complaint.title}</div>
                      <div className="text-xs text-gray-600">
                        Status: <span className={`font-medium ${
                          complaint.status === 'pending' ? 'text-red-600' :
                          complaint.status === 'in-progress' ? 'text-yellow-600' :
                          complaint.status === 'resolved' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {getStatusText(complaint.status)}
                        </span>
                      </div>
                    </div>
                  </Tooltip>

                  {/* Popup shows on click */}
                  <Popup maxWidth={300} className="custom-popup">
                    <div className="p-2">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg text-gray-900 pr-2">{complaint.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          complaint.status === 'pending' ? 'bg-red-100 text-red-800' :
                          complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusText(complaint.status)}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3">{complaint.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{complaint.location.address}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          <span>Reported by {complaint.reportedBy}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{formatDate(complaint.reportedAt)}</span>
                        </div>
                        
                        {complaint.tags && complaint.tags.length > 0 && (
                          <div className="flex items-start text-gray-600">
                            <Tag className="w-4 h-4 mr-2 mt-0.5" />
                            <div className="flex flex-wrap gap-1">
                              {complaint.tags.map((tag, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="w-full mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Detailed Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1001]">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedComplaint.title}</h2>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      selectedComplaint.status === 'pending' ? 'bg-red-100 text-red-800' :
                      selectedComplaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      selectedComplaint.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusText(selectedComplaint.status)}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{selectedComplaint.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Location
                      </h3>
                      <p className="text-gray-700">{selectedComplaint.location.address}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Reported By
                      </h3>
                      <p className="text-gray-700">{selectedComplaint.reportedBy}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Reported At
                      </h3>
                      <p className="text-gray-700">{formatDate(selectedComplaint.reportedAt)}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Tag className="w-5 h-5 mr-2" />
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedComplaint.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Update Status
                      </button>
                      <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                        Add Comment
                      </button>
                      <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
                        Mark as Resolved
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsMap;