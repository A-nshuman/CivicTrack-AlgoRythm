// ticketsService.js
const API_BASE_URL = 'http://localhost:3000'; // Replace with your backend URL

class TicketsService {
  // Get tickets with optional filters
  async getTickets(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.lat) params.append('lat', filters.lat);
      if (filters.long) params.append('long', filters.long);
      if (filters.dist) params.append('dist', filters.dist);
      if (filters.category) params.append('category', filters.category);
      if (filters.title) params.append('title', filters.title);

      const response = await fetch(`${API_BASE_URL}/tickets?${params}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Get single ticket by ID
  async getTicket(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Ticket not found');
        }
        throw new Error('Failed to fetch ticket');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Create new ticket
  async createTicket(ticketData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(ticketData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create ticket');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Update ticket
  async updateTicket(id, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update ticket');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Delete ticket
  async deleteTicket(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete ticket');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Set ticket status (admin only)
  async setTicketStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/set-status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Set ticket location
  async setTicketLocation(id, coordinates) {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/set-location/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ coordinates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update location');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Report ticket
  async reportTicket(id, comment) {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ comment }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to report ticket');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new TicketsService();