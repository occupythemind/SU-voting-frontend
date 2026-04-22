/**
 * Header & Navigation Component
 */

class Header {
  constructor() {
    this.user = SessionManager.getUser();
  }

  /**
   * Render the header HTML
   */
  render() {
    const isLoggedIn = SessionManager.isLoggedIn();
    const isAdmin = SessionManager.isAdmin();
    const userName = this.user?.full_name || 'Guest';

    return `
      <header class="header">
        <div class="container">
          <div class="header-content">
            <!-- Logo Section -->
            <div class="logo-section">
              <img src="/assets/images/logo.svg" alt="Student Union (SU) Logo" class="logo" onerror="this.style.display='none'">
              <div class="brand-title">
                <h1 class="brand-name">Student Union (SU) Voting</h1>
                <p class="brand-subtitle">Election System</p>
              </div>
            </div>

            <!-- Navigation -->
            <nav class="nav-menu">
              ${isLoggedIn ? `
                <div class="nav-right">
                  ${isAdmin ? `
                    <a href="/pages/admin/dashboard.html" class="nav-link">Dashboard</a>
                    <a href="/pages/admin/categories.html" class="nav-link">Categories</a>
                    <a href="/pages/admin/results.html" class="nav-link">Results</a>
                    <a href="/pages/admin/audit-logs.html" class="nav-link">Audit Logs</a>
                  ` : `
                    <a href="/pages/student/categories.html" class="nav-link">Vote</a>
                  `}
                  <div class="user-menu">
                    <button class="user-button" id="userMenuBtn">${userName}</button>
                    <div class="dropdown-menu" id="userDropdown">
                      <a href="/pages/auth/profile.html" class="dropdown-item">Profile</a>
                      <button class="dropdown-item logout-btn" id="logoutBtn">Logout</button>
                    </div>
                  </div>
                </div>
              ` : `
                <div class="nav-right">
                  <a href="/pages/auth/login.html" class="nav-link">Login</a>
                  <a href="/pages/auth/register.html" class="btn btn-primary">Register</a>
                </div>
              `}
            </nav>
          </div>
        </div>
      </header>
    `;
  }

  /**
   * Mount the header to DOM and attach event listeners
   */
  mount(parentSelector = 'body') {
    const parent = document.querySelector(parentSelector);
    parent.insertAdjacentHTML('afterbegin', this.render());
    this.attachEventListeners();
  }

  attachEventListeners() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');

    if (userMenuBtn) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown?.classList.toggle('show');
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        SessionManager.logout();
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-menu')) {
        userDropdown?.classList.remove('show');
      }
    });
  }
}
