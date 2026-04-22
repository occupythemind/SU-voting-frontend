/**
 * Utilities & Helper Functions
 */

class Utils {
  /**
   * Show notification/toast message
   */
  static showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto remove after 4 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  /**
   * Show loading state
   */
  static setLoading(element, isLoading = true) {
    if (isLoading) {
      element.disabled = true;
      element.classList.add('loading');
      element.setAttribute('aria-busy', 'true');
    } else {
      element.disabled = false;
      element.classList.remove('loading');
      element.setAttribute('aria-busy', 'false');
    }
  }

  /**
   * Format date
   */
  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Format time
   */
  static formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Format date and time
   */
  static formatDateTime(dateString) {
    return `${this.formatDate(dateString)} ${this.formatTime(dateString)}`;
  }

  /**
   * Validate matric number format (basic)
   */
  static isValidMatricNumber(matricNumber) {
    return matricNumber && matricNumber.trim().length > 0;
  }

  /**
   * Validate password strength
   */
  static isValidPassword(password) {
    return password && password.length >= 6;
  }

  /**
   * Clear form
   */
  static clearForm(formElement) {
    formElement.reset();
  }

  /**
   * Get query parameter from URL
   */
  static getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }

  /**
   * Redirect to page
   */
  static goTo(path) {
    window.location.href = path;
  }

  /**
   * Check if user is on mobile
   */
  static isMobile() {
    return window.innerWidth < 768;
  }
}

/**
 * Session Manager
 */
class SessionManager {
  static STORAGE_KEY = 'voting_user';

  /**
   * Save user session
   */
  static setUser(user) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  /**
   * Get stored user
   */
  static getUser() {
    const user = localStorage.getItem(this.STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if user is logged in
   */
  static isLoggedIn() {
    return this.getUser() !== null;
  }

  /**
   * Check if user is admin
   */
  static isAdmin() {
    const user = this.getUser();
    return user && user.is_admin;
  }

  /**
   * Logout user
   */
  static logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    window.location.href = '/pages/auth/login.html';
  }

  /**
   * Refresh user data from server
   */
  static async refreshUser() {
    try {
      const { data } = await api.getMe();
      this.setUser(data.user);
      return data.user;
    } catch (error) {
      // If 401, user is not authenticated
      if (error.status === 401) {
        this.logout();
      }
      throw error;
    }
  }
}

/**
 * Protected route middleware
 */
function requireAuth() {
  if (!SessionManager.isLoggedIn()) {
    Utils.showNotification('Please log in first', 'error');
    Utils.goTo('/pages/auth/login.html');
    return false;
  }
  return true;
}

function requireAdmin() {
  if (!SessionManager.isAdmin()) {
    Utils.showNotification('You do not have admin access', 'error');
    Utils.goTo('/pages/student/categories.html');
    return false;
  }
  return true;
}
