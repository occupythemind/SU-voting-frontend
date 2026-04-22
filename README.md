# UNIDEL Voting System - Frontend

A clean, user-friendly voting platform built with vanilla HTML, CSS, and JavaScript. Designed for the UNIDEL student community with a focus on simplicity and accessibility.

## 🚀 Features

### For Students
- **User Registration & Login** - Secure account creation and authentication
- **Browse Categories** - View all voting categories at a glance
- **Vote for Contestants** - Cast votes in different categories
- **Vote Management** - Change or remove votes before final submission
- **Profile Management** - View and edit personal profile information

### For Administrators
- **Category Management** - Create, edit, and delete voting categories
- **Contestant Management** - Add and remove contestants from categories
- **Real-time Results** - View live voting results with detailed breakdown
- **Audit Logs** - Complete voting activity history with timestamps
- **Dashboard** - Quick statistics and overview of voting system

## 📁 Project Structure

```
unidel-voting-frontend/
├── config.js                    # Global configuration (API origin, colors, etc)
├── index.html                   # Landing page
│
├── css/
│   ├── global.css              # Global styles, design tokens, utilities
│   ├── header.css              # Header and navigation styles
│   ├── auth.css                # Authentication pages styles
│   ├── voting.css              # Voting pages styles
│   ├── profile.css             # Profile page styles
│   └── admin.css               # Admin pages styles
│
├── js/
│   ├── api.js                  # API client for backend communication
│   ├── utils.js                # Utility functions and session management
│   ├── header.js               # Reusable header component
│   ├── auth-login.js           # Login page logic
│   ├── auth-register.js        # Registration page logic
│   ├── auth-profile.js         # Profile page logic
│   ├── student-categories.js   # Categories list page logic
│   ├── student-vote.js         # Voting page logic
│   ├── admin-dashboard.js      # Admin dashboard logic
│   ├── admin-categories.js     # Category management logic
│   ├── admin-contestants.js    # Contestant management logic
│   ├── admin-results.js        # Results view logic
│   └── admin-audit-logs.js     # Audit logs logic
│
├── pages/
│   ├── auth/
│   │   ├── login.html          # Login page
│   │   ├── register.html       # Registration page
│   │   └── profile.html        # User profile page
│   ├── student/
│   │   ├── categories.html     # Voting categories list
│   │   └── vote.html           # Voting/contestant page
│   └── admin/
│       ├── dashboard.html      # Admin dashboard
│       ├── categories.html     # Category management
│       ├── contestants.html    # Contestant management
│       ├── results.html        # Contest results
│       └── audit-logs.html     # Voting audit logs
│
└── assets/
    ├── images/
    │   └── logo.svg            # Brand logo (create this)
    └── icons/                  # SVG icons (if needed)
```

## ⚙️ Configuration

Edit `config.js` to customize the application:

```javascript
const CONFIG = {
  API_ORIGIN: 'http://localhost:5000',  // Your backend API URL
  APP_NAME: 'UNIDEL Voting System',
  SESSION_TIMEOUT: 30 * 60 * 1000,
  COLORS: {
    primary: '#10b981',        // Green
    secondary: '#ffffff',      // White
    dark: '#1f2937',           // Black/Dark
  },
};
```

## 🎨 Design System

The application uses a **green, white, and black** color scheme optimized for student users:

### Colors
- **Primary (Green)**: `#10b981` - Call-to-action, highlights, emphasis
- **White**: `#ffffff` - Clean backgrounds and text
- **Dark**: `#1f2937` - Text and dark elements
- **Success**: `#10b981` - Positive actions
- **Danger**: `#ef4444` - Destructive actions
- **Warning**: `#f59e0b` - Alerts and status

### Typography
- **Font Family**: System fonts (San Francisco, Segoe UI, etc.)
- **Base Size**: 16px (1rem)
- **Scales**: XS (12px) → 4XL (36px)

### Spacing
- Uses `spacing-xs` (0.25rem) through `spacing-2xl` (3rem)
- Consistent 8px/16px/24px rhythm for better visual harmony

## 🔐 Authentication & Security

### Session Management
- Uses browser cookies for session authentication (`connect.sid`)
- Session data stored in localStorage for offline availability
- Automatic logout on 401 Unauthorized responses
- Session timeout configurable in `config.js`

### Protected Routes
- All authenticated pages check `requireAuth()` before rendering
- Admin pages additionally check `requireAdmin()`
- Failed auth redirects users to login page

## 📡 API Integration

### API Client
The `api.js` file provides a `ApiClient` class with methods for all endpoints:

```javascript
// Auth
api.register(fullName, matricNumber, password)
api.login(matricNumber, password)
api.getMe()
api.updateProfile(updates)

// Voting
api.getCategories()
api.getContestants(categoryId)
api.vote(categoryId, contestId)
api.unvote(categoryId)

// Admin
api.createCategory(title, description)
api.updateCategory(categoryId, title, description)
api.deleteCategory(categoryId)
api.addContestant(userId, categoryId)
api.removeContestant(contestId)
api.getResults()
api.getCategoryResults(categoryId)
api.getAuditLogs()
```

## 🎯 Page Overview

### Public Pages
1. **Landing** (`index.html`) - Entry point with hero section
2. **Login** (`pages/auth/login.html`) - Student login
3. **Register** (`pages/auth/register.html`) - Account creation

### Student Pages (Protected)
1. **Categories** (`pages/student/categories.html`) - Browse voting categories
2. **Vote** (`pages/student/vote.html`) - View contestants and vote
3. **Profile** (`pages/auth/profile.html`) - View and edit profile

### Admin Pages (Protected + Admin Only)
1. **Dashboard** (`pages/admin/dashboard.html`) - Overview and statistics
2. **Categories** (`pages/admin/categories.html`) - Manage voting categories
3. **Contestants** (`pages/admin/contestants.html`) - Add/remove contestants
4. **Results** (`pages/admin/results.html`) - View voting results with voters
5. **Audit Logs** (`pages/admin/audit-logs.html`) - Complete activity log

## 🚀 Getting Started

### Prerequisites
- Web server (Apache, Nginx, or Node.js http-server)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API running on configured origin

### Setup Steps

1. **Copy Files**
   ```bash
   # Copy all frontend files to your web server directory
   cp -r unidel-voting-frontend/* /var/www/voting
   ```

2. **Configure API Origin**
   ```javascript
   // Edit config.js
   const CONFIG = {
     API_ORIGIN: 'http://your-backend-url:5000',
     // ... other config
   };
   ```

3. **Add Logo** (Optional)
   - Replace or add your brand logo at `/assets/images/logo.svg`
   - The logo will appear in the header if present

4. **Start Web Server**
   ```bash
   # Using Python
   python -m http.server 8080

   # Using Node.js
   npx http-server -p 8080

   # Using Apache/Nginx
   # Configure virtual host to serve the directory
   ```

5. **Access Application**
   - Open `http://localhost:8080` in your browser

## 🎨 Customization

### Branding
- **Logo**: Add your logo to `/assets/images/logo.svg`
- **Colors**: Modify CSS variables in `css/global.css` `:root` selector
- **App Name**: Update `CONFIG.APP_NAME` in `config.js`

### Icons
- Replace emoji placeholders with SVG icons from:
  - [Heroicons](https://heroicons.com)
  - [Feather Icons](https://feathericons.com)
  - [Material Icons](https://fonts.google.com/icons)
  
  Note: Look for comments in code marked with `// TODO: Replace emoji with SVG`

### Styling
- Global styles in `css/global.css`
- Page-specific styles in their respective CSS files
- Responsive design using mobile-first approach
- Breakpoint at 768px for tablet/mobile

## ✨ Best Practices

### User Experience
- ✅ Clean, minimal interface - no unnecessary elements
- ✅ Clear feedback for all actions (success, error, loading states)
- ✅ Accessible forms with proper labels and error messages
- ✅ Loading states on buttons during API calls
- ✅ Responsive design works on all device sizes

### Code Quality
- ✅ Vanilla JS - no external dependencies
- ✅ Modular structure - easy to maintain and extend
- ✅ Consistent naming conventions
- ✅ Comprehensive comments for complex logic
- ✅ Error handling for all API calls

### Security
- ✅ Session-based authentication
- ✅ Protected admin routes
- ✅ CORS credentials included in API calls
- ✅ Validation on client and server side
- ✅ No sensitive data stored in localStorage

## 🐛 Troubleshooting

### "Not Authenticated" / Login Issues
- Check if your backend is running on the configured `API_ORIGIN`
- Verify CORS is enabled on backend
- Look at browser console for API errors

### Pages Not Loading
- Check that all file paths are correct (relative to root `/`)
- Ensure CSS and JS files are in correct directories
- Check browser console for 404 errors

### Styling Issues
- Clear browser cache (Ctrl+Shift+Del)
- Check that `css/global.css` is loaded
- Verify CSS variables are defined in `:root`

### API Errors
- Check backend logs for server errors
- Verify request body matches API schema
- Use browser DevTools Network tab to inspect requests

## 📝 Notes

### Known Limitations
1. Student search in contestant management is a placeholder
   - In production, connect to a real student lookup endpoint
   - Add student autocomplete with API response
   
2. Logo visibility
   - Currently hidden if file not found
   - Add error handling or default SVG icon

3. Mobile responsiveness
   - Form inputs may need larger touch targets on mobile
   - Consider adding viewport meta-tag for better mobile rendering

### Future Enhancements
- [ ] Dark mode support
- [ ] Export results to PDF/CSV
- [ ] Real-time result updates (WebSocket)
- [ ] Student search autocomplete
- [ ] Vote confirmation modal
- [ ] Accessibility improvements (ARIA labels)
- [ ] Offline functionality (Service Worker)
- [ ] Multi-language support

## 📞 Support

For issues or questions:
1. Check the API documentation from your backend
2. Review browser console for error messages
3. Test API endpoints with Postman/curl
4. Check backend logs for server-side errors

---

**Built with ❤️ for UNIDEL**

Clean, simple, and effective. Just the way students like it.
