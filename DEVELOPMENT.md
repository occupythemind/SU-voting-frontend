# Development Guide

## Project Architecture

### Clean Separation of Concerns
```
HTML (Structure) → CSS (Presentation) → JavaScript (Behavior)
```

Each page has:
- `pages/section/page.html` - Structure and markup
- `css/section.css` - Styling specific to section
- `js/section-page.js` - Page-specific logic

### Shared Resources
- `config.js` - Global configuration
- `js/api.js` - API client for backend communication
- `js/utils.js` - Utility functions and session management
- `js/header.js` - Reusable header component
- `css/global.css` - Design system and global styles
- `css/header.css` - Header component styles

## How to Add a New Page

### 1. Create HTML File
```html
<!-- pages/student/new-page.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Page - UNIDEL Voting System</title>
  <link rel="stylesheet" href="/css/global.css">
  <link rel="stylesheet" href="/css/header.css">
  <link rel="stylesheet" href="/css/new-page.css">
</head>
<body>
  <script src="/config.js"></script>
  <script src="/js/utils.js"></script>
  <script src="/js/api.js"></script>
  <script src="/js/header.js"></script>

  <main class="container">
    <div id="content">
      <!-- Your page content here -->
    </div>
  </main>

  <script src="/js/student-new-page.js"></script>
</body>
</html>
```

### 2. Create CSS File
```css
/* css/new-page.css */
/* Styles specific to this page */
```

### 3. Create JavaScript Logic
```javascript
// js/student-new-page.js
document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication if needed
  if (!requireAuth()) return;

  // Mount header
  const header = new Header();
  header.mount();

  // Your page logic here
});
```

## How to Add an API Endpoint

### 1. Add Method to ApiClient (js/api.js)
```javascript
async getNewData(param) {
  return this.request('/new-endpoint', {
    method: 'GET',
    // OR
    method: 'POST',
    body: { param },
  });
}
```

### 2. Use in Your Page
```javascript
try {
  const { data } = await api.getNewData('value');
  // Handle response
} catch (error) {
  Utils.showNotification(error.message, 'error');
}
```

## How to Add a Reusable Component

### Example: Modal Component
```javascript
// js/components/modal.js
class Modal {
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }

  show() {
    const html = `
      <div class="modal-overlay" id="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>${this.title}</h2>
            <button class="modal-close" id="closeModal">×</button>
          </div>
          <div class="modal-body">
            ${this.content}
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
    document.getElementById('closeModal').addEventListener('click', () => this.close());
    document.getElementById('modal').addEventListener('click', (e) => {
      if (e.target.id === 'modal') this.close();
    });
  }

  close() {
    document.getElementById('modal')?.remove();
  }
}

// Usage
const modal = new Modal('Confirm', 'Are you sure?');
modal.show();
```

## Testing

### Manual Testing Checklist

**Authentication Flow:**
- [ ] Register new account
- [ ] Login with correct credentials
- [ ] Login with wrong credentials (should fail)
- [ ] Access protected page without login (should redirect)
- [ ] Logout and verify session cleared

**Student Voting Flow:**
- [ ] Load categories list
- [ ] View contestants in category
- [ ] Vote for contestant
- [ ] Verify vote recorded
- [ ] Change vote (should fail with "already voted")
- [ ] Remove vote
- [ ] Vote again after removing

**Admin Flow:**
- [ ] Login as admin
- [ ] Create new category
- [ ] Edit category
- [ ] Delete category
- [ ] Add contestant
- [ ] Remove contestant
- [ ] View results
- [ ] View audit logs

**Error Handling:**
- [ ] Test with offline backend (should show error)
- [ ] Test with invalid API_ORIGIN
- [ ] Test form validation (empty fields, etc.)
- [ ] Test session expiry (manual cookie deletion)

## Code Style Guide

### Naming Conventions
```javascript
// Class names: PascalCase
class ApiClient {}
class SessionManager {}

// Function/method names: camelCase
function renderCategories() {}
async loadData() {}

// Constants: UPPER_SNAKE_CASE
const SESSION_TIMEOUT = 30 * 60 * 1000;
const API_KEY = 'xyz';

// Variable names: camelCase
let userData = null;
const categoryTitle = 'Physics';
```

### Comments
```javascript
// Single-line comment for brief explanation
const timeout = 1000; // Brief explanation

/**
 * Multi-line comment for functions
 * @param {type} param - Parameter description
 * @returns {type} Description of return value
 */
function doSomething(param) {
  // Implementation
}
```

### Error Handling
```javascript
// Good
try {
  const response = await api.getData();
  handleSuccess(response);
} catch (error) {
  Utils.showNotification(error.message, 'error');
  console.error('Failed to load data:', error);
}

// Bad
try {
  await api.getData();
} catch (error) {
  // Silently fail
}
```

## Performance Tips

### 1. Lazy Load Data
```javascript
// Don't load everything on page load
async function loadMoreResults() {
  // Load next page only when user requests
  const nextPage = await api.getResults({ page: currentPage + 1 });
  appendResults(nextPage.data);
}
```

### 2. Debounce Search Input
```javascript
let debounceTimer;
searchInput.addEventListener('input', (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    performSearch(e.target.value);
  }, 300);
});
```

### 3. Cache API Responses
```javascript
let categoriesCache = null;

async function getCategories() {
  if (categoriesCache) return categoriesCache;
  
  const { data } = await api.getCategories();
  categoriesCache = data;
  return data;
}
```

## Security Considerations

### Never Store Sensitive Data
```javascript
// Bad: Storing password in localStorage
localStorage.setItem('password', userPassword);

// Good: Only store session reference, rely on cookies
SessionManager.setUser(user);
```

### Validate Input
```javascript
// Bad: Direct API call with user input
await api.vote(userInput.categoryId, userInput.contestId);

// Good: Validate first
if (!userInput.categoryId || typeof userInput.categoryId !== 'string') {
  throw new Error('Invalid category ID');
}
await api.vote(userInput.categoryId, userInput.contestId);
```

### Use HTTPS in Production
```javascript
// Development
API_ORIGIN: 'http://localhost:5000',

// Production
API_ORIGIN: 'https://api.example.com',
```

## Debugging

### Browser DevTools

**Console Tab:**
```javascript
// Check stored user
SessionManager.getUser()

// Check API config
CONFIG

// Make manual API calls
api.getCategories()
```

**Network Tab:**
- Inspect API request/response
- Check for CORS errors
- Verify authentication headers

**Storage Tab:**
- View localStorage data
- View cookies
- Check for session storage

### Adding Debug Logs
```javascript
const DEBUG = true;

function log(message, data) {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data);
  }
}

// Use it
log('Loading categories', { categoryCount: 5 });
```

## Extending Features

### Add Real-time Updates (WebSocket)
```javascript
class VotingSocket {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.setupListeners();
  }

  setupListeners() {
    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    });
  }

  handleMessage(data) {
    if (data.type === 'vote') {
      // Update vote count in real-time
      updateVoteCount(data.contestId, data.newCount);
    }
  }
}

// Usage
const socket = new VotingSocket('wss://api.example.com/socket');
```

### Add Export Feature
```javascript
function exportToCSV(data, filename) {
  const csv = data.map(row => Object.values(row).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Usage
exportToCSV(auditLogs, 'voting-audit-logs.csv');
```

## Browser Support

- Chrome/Edge: Latest
- Firefox: Latest
- Safari: Latest
- Mobile browsers: Chrome, Safari

## Accessibility

### Keyboard Navigation
- All interactive elements focusable with Tab
- Forms submittable with Enter
- Modals closable with Escape

### Screen Readers
- Use semantic HTML (section, nav, main, article)
- Add alt text to images
- Include aria-labels where needed
- Use aria-busy for loading states

### Color Contrast
- Primary text on white: WCAG AAA compliant
- All interactive elements: Clear visual states
- Status indicators: Not color-only (add icons/text)

## Resources

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/)
- [Web.dev](https://web.dev/)
- [Fetch API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### Tools
- [Visual Studio Code](https://code.visualstudio.com/) - Code editor
- [Postman](https://www.postman.com/) - API testing
- [DevTools](https://developer.chrome.com/docs/devtools/) - Browser debugging

### Design
- [CSS Tricks](https://css-tricks.com/)
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [Color Palettes](https://coolors.co/) - Color inspiration

---

**Happy coding!**
