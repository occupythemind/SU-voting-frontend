/**
 * Global Configuration
 * Change the API_ORIGIN to match your backend server
 */

const CONFIG = {
  // API Configuration
  API_ORIGIN: 'http://localhost:3000',
  API_VERSION: 'v1',
  
  // Get full API URL
  getApiUrl() {
    return `${this.API_ORIGIN}/api/${this.API_VERSION}`;
  },
  
  getAdminApiUrl() {
    return `${this.API_ORIGIN}/api/admin`;
  },

  // App Settings
  APP_NAME: 'UNIDEL Voting System',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  
  // Colors (for reference in JS if needed)
  COLORS: {
    primary: '#10b981', // Green
    secondary: '#ffffff', // White
    dark: '#1f2937', // Dark gray/black
    danger: '#ef4444', // Red
    warning: '#f59e0b', // Amber
    success: '#10b981', // Green
  },
};

// Ensure config is accessible globally
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
