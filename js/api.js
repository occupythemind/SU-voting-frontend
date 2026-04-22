/**
 * API Client
 * Handles all API calls with proper error handling and session management
 */

class ApiClient {
  constructor() {
    this.baseUrl = CONFIG.getApiUrl();
    this.adminUrl = CONFIG.getAdminApiUrl();
  }

  /**
   * Make an API request
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      isAdmin = false,
    } = options;

    const url = isAdmin
      ? `${this.adminUrl}${endpoint}`
      : `${this.baseUrl}${endpoint}`;

    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: send cookies for session auth
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, fetchOptions);
      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.error || 'An error occurred',
          data,
        };
      }

      return { status: response.status, data };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw {
        status: 0,
        message: error.message || 'Network error',
        error,
      };
    }
  }

  // Auth Endpoints
  async register(full_name, matric_number, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: { full_name, matric_number, password },
    });
  }

  async login(matric_number, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { matric_number, password },
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(updates) {
    return this.request('/auth/me', {
      method: 'PUT',
      body: updates,
    });
  }

  // Voting Endpoints
  async getCategories() {
    return this.request('/categories');
  }

  async getContestants(categoryId) {
    return this.request(`/categories/${categoryId}/contestants`);
  }

  async vote(categoryId, contestId) {
    return this.request(`/categories/${categoryId}/vote`, {
      method: 'POST',
      body: { contest_id: contestId },
    });
  }

  async unvote(categoryId) {
    return this.request(`/categories/${categoryId}/unvote`, {
      method: 'POST',
    });
  }

  // Admin Endpoints
  async createCategory(title, description = '') {
    return this.request('/categories', {
      method: 'POST',
      body: { title, description },
      isAdmin: true,
    });
  }

  async updateCategory(categoryId, title, description = '') {
    return this.request('/categories', {
      method: 'PUT',
      body: { id: categoryId, title, description },
      isAdmin: true,
    });
  }

  async deleteCategory(categoryId) {
    return this.request('/categories', {
      method: 'DELETE',
      body: { id: categoryId },
      isAdmin: true,
    });
  }

  async addContestant(userId, categoryId) {
    return this.request('/categories/addContestant', {
      method: 'POST',
      body: { user_id: userId, category_id: categoryId },
      isAdmin: true,
    });
  }

  async removeContestant(contestId) {
    return this.request('/categories/removeContestant', {
      method: 'POST',
      body: { contest_id: contestId },
      isAdmin: true,
    });
  }

  async getResults() {
    return this.request('/categories/results', { isAdmin: true });
  }

  async getCategoryResults(categoryId) {
    return this.request(`/categories/${categoryId}/results`, {
      isAdmin: true,
    });
  }

  async getAuditLogs() {
    return this.request('/categories/audit-logs', { isAdmin: true });
  }

  // User Management Endpoints
  async getUsers() {
    return this.request('/auth', { isAdmin: true });
  }

  async searchUserByMatric(matricNumber) {
    return this.request(`/auth/${matricNumber}`, { isAdmin: true });
  }
}

// Export for use in pages
const api = new ApiClient();
