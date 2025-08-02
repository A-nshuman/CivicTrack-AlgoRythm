// adminService.js
const API_BASE_URL = 'http://localhost:3000'; // Replace with your backend URL

class AdminService {
  // Get reported tickets
  async getReportedTickets() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reported-tickets`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch reported tickets');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Clear reports for a ticket
  async clearReports(ticketId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/clear-reports/${ticketId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to clear reports');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Ban user
  async banUser(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/ban-user/${encodeURIComponent(email)}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to ban user');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Unban user
  async unbanUser(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/unban-user/${encodeURIComponent(email)}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to unban user');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Get dashboard statistics
  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch statistics');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Get banned users list
  async getBannedUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/banned-users`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch banned users');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export default new AdminService();