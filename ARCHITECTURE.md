# Architecture Overview

## Project Structure Visualization

```
UNIDEL Voting Frontend
├── 📄 index.html                          Landing page
├── 📄 config.js                           Global configuration
├── 📄 .gitignore                          Git ignore rules
│
├── 📁 pages/                              All pages
│   ├── auth/
│   │   ├── login.html                     Login page
│   │   ├── register.html                  Registration page
│   │   └── profile.html                   User profile page
│   ├── student/
│   │   ├── categories.html                Browse voting categories
│   │   └── vote.html                      Vote for contestants
│   └── admin/
│       ├── dashboard.html                 Admin dashboard
│       ├── categories.html                Manage categories
│       ├── contestants.html               Manage contestants
│       ├── results.html                   View results
│       └── audit-logs.html                View audit logs
│
├── 📁 js/                                 JavaScript modules
│   ├── api.js                             API client (150+ lines)
│   ├── utils.js                           Utilities & session (200+ lines)
│   ├── header.js                          Header component
│   ├── auth-login.js                      Login page logic
│   ├── auth-register.js                   Register page logic
│   ├── auth-profile.js                    Profile page logic
│   ├── student-categories.js              Categories page logic
│   ├── student-vote.js                    Voting page logic
│   ├── admin-dashboard.js                 Admin dashboard logic
│   ├── admin-categories.js                Category management logic
│   ├── admin-contestants.js               Contestant management logic
│   ├── admin-results.js                   Results page logic
│   └── admin-audit-logs.js                Audit logs page logic
│
├── 📁 css/                                Stylesheets
│   ├── global.css                         Design system & base styles (700+ lines)
│   ├── header.css                         Header component styles
│   ├── auth.css                           Auth pages styles
│   ├── voting.css                         Voting pages styles
│   ├── profile.css                        Profile page styles
│   └── admin.css                          Admin pages styles
│
├── 📁 assets/
│   └── images/
│       └── logo.svg                       Brand logo (customizable)
│
└── 📁 docs/
    ├── README.md                          Complete documentation
    ├── QUICKSTART.md                      Setup & usage guide
    ├── DEVELOPMENT.md                     Developer guide
    └── BUILD_SUMMARY.md                   What's been built
```

## Data Flow

```
┌─────────────────────────────────────────────────────┐
│          User's Web Browser                          │
│  (HTML + CSS + JavaScript)                          │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ HTTP/HTTPS
                   │ (JSON API)
                   │
┌──────────────────▼──────────────────────────────────┐
│      Backend API (Express.js)                       │
│  - Authentication                                   │
│  - Category Management                              │
│  - Vote Recording                                   │
│  - Session Management                              │
└─────────────────────────────────────────────────────┘
                   │
                   │ SQL Queries
                   │
┌──────────────────▼──────────────────────────────────┐
│        Database (PostgreSQL/MySQL)                   │
│  - Users                                            │
│  - Categories                                       │
│  - Votes                                            │
│  - Audit Logs                                       │
└─────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── Header (Reusable Component)
│   ├── Logo Section
│   ├── Navigation Menu
│   │   ├── Links (dynamic based on auth)
│   │   └── User Menu (dropdown)
│   └── Auth Status Indicator
│
├── Main Content Area
│   ├── Auth Pages (Login, Register)
│   │   └── Forms with validation
│   │
│   ├── Student Pages
│   │   ├── Categories List
│   │   │   └── Category Cards (grid)
│   │   └── Voting Page
│   │       └── Contestant Cards
│   │           ├── Vote Button
│   │           ├── Vote Count Display
│   │           └── Vote Status Indicator
│   │
│   └── Admin Pages
│       ├── Dashboard
│       │   └── Statistics Cards
│       ├── Category Manager
│       │   ├── Form (create/edit)
│       │   └── Table (list)
│       ├── Contestant Manager
│       │   ├── Search Box
│       │   └── Table (list)
│       ├── Results Page
│       │   └── Results Table
│       │       ├── Rank
│       │       ├── Vote Count
│       │       ├── Percentage Bar
│       │       └── Voters List
│       └── Audit Logs
│           ├── Filter/Search
│           └── Logs Table
│
└── Notifications (Toast Messages)
    ├── Success
    ├── Error
    ├── Warning
    └── Info
```

## Page Authorization Flow

```
User Visits Page
        │
        ▼
    Is Page Public?
    ├─ YES → Load Page ✓
    └─ NO → requireAuth()?
            ├─ NOT LOGGED IN → Redirect to /login
            └─ LOGGED IN → requireAdmin()?
                          ├─ NOT ADMIN → Redirect to /student
                          └─ IS ADMIN → Load Page ✓
```

## Session Management Flow

```
Browser                           API                         Database
  │                               │                              │
  ├─────── Register ────────────►┤                              │
  │                               ├─── Create User ────────────►│
  │                               │                              │
  │                               │◄──── User Created ──────────┤
  │                               │                              │
  │◄─── Set Session Cookie ───────┤                              │
  │     (connect.sid)             │                              │
  │                               │                              │
  ├─ Store in localStorage ──────►│ (User Object)               │
  │                               │                              │
  ├─── Next Request + Cookie ────►┤                              │
  │                               ├─── Verify Session ────────►│
  │                               │                              │
  │                               │◄─── Session Valid ─────────┤
  │                               │                              │
  │◄──── Response + Data ─────────┤                              │
  │                               │                              │
  └─ Logout                       │                              │
     (Clear localStorage,         │                              │
      Redirect to login)          │                              │
```

## API Request/Response Cycle

```
Frontend                           Backend
   │                                 │
   ├─ GET /api/v1/categories ──────►│
   │  + credentials (include)       │
   │  + Content-Type: application/json
   │                                 ├─ Verify Session
   │                                 ├─ Check Auth
   │                                 ├─ Query Database
   │                                 │
   │◄─── 200 OK ───────────────────┤
   │     {                           │
   │       "categories": [...]       │
   │     }                           │
   │                                 │
   └─ Parse Response                │
      Update DOM                     │
      Show Success Message           │
                                     │
   ├─ POST /api/v1/auth/login ────►│
   │  Body: {matric, password}      │
   │                                 ├─ Verify Credentials
   │                                 ├─ Create Session
   │                                 │
   │◄─── 200 OK ───────────────────┤
   │     Set-Cookie: connect.sid    │
   │     {                           │
   │       "user": {                 │
   │         "id": "...",            │
   │         "is_admin": false       │
   │       }                          │
   │     }                           │
   │                                 │
   └─ Store User + Redirect         │
```

## File Dependencies

```
index.html
├── config.js ◄─ (All pages need this first)
├── css/global.css ◄─ (Base styles)
├── css/header.css
├── js/utils.js ◄─ (Utilities)
├── js/api.js ◄─ (Uses config.js)
└── js/header.js ◄─ (Uses utils.js)

pages/auth/login.html
├── config.js
├── css/global.css
├── css/auth.css
├── js/utils.js
├── js/api.js
└── js/auth-login.js ◄─ (Depends on above)

pages/student/vote.html
├── config.js
├── css/global.css
├── css/header.css
├── css/voting.css
├── js/utils.js
├── js/api.js ◄─ (API calls)
├── js/header.js ◄─ (Navigation)
└── js/student-vote.js ◄─ (Page logic)

pages/admin/results.html
├── config.js
├── css/global.css
├── css/header.css
├── css/admin.css
├── js/utils.js
├── js/api.js ◄─ (API calls)
├── js/header.js
└── js/admin-results.js
```

## CSS Architecture

```
css/global.css (700+ lines)
├── CSS Variables (colors, spacing, fonts)
├── Reset & Base Styles
├── Typography
├── Forms
├── Buttons
├── Cards & Containers
├── Notifications
├── Layout Utilities
├── Text Utilities
├── Responsive Design
└── Accessibility

css/header.css
├── Header Container
├── Logo Section
├── Navigation
├── User Menu
└── Responsive Adjustments

css/auth.css
├── Auth Container
├── Auth Card
├── Form Styles
└── Success/Error Messages

css/voting.css
├── Page Container
├── Categories Grid
├── Category Cards
├── Contestants List
├── Contestant Cards
├── Empty States
└── Loading States

css/admin.css
├── Tables
├── Forms
├── Cards (Dashboard, Stats)
├── Results Display
├── Voters Section
├── Audit Logs Table
└── Responsive Table Layout

css/profile.css
├── Profile Container
├── Profile Fields
├── Edit Form
└── Badges
```

## State Management

```
LocalStorage
├── voting_user (User Object)
│   ├── id
│   ├── matric_number
│   ├── full_name
│   ├── is_admin
│   ├── is_active
│   └── created_at

Session (Server-side)
├── connect.sid (Session ID in Cookie)
└── User data maintained on server

In-Memory (JavaScript)
├── Page-specific data
├── Form state
├── API responses
└── UI state (dropdowns, modals, etc)
```

## Error Handling Strategy

```
API Error
    ↓
┌──────────────────┐
│ Check Status     │
└────────┬─────────┘
    │
    ├─ 401 (Unauthorized)
    │   └─ SessionManager.logout()
    │       └─ Redirect to login
    │
    ├─ 403 (Forbidden)
    │   └─ requireAdmin() check fails
    │       └─ Redirect to student page
    │
    ├─ 400 (Bad Request)
    │   └─ Show validation error
    │       └─ Display error message
    │
    ├─ 404 (Not Found)
    │   └─ Show "Not found" message
    │
    └─ Network Error
        └─ Show "Connection failed" message
        
All errors:
├─ Logged to console (development)
├─ Shown in UI notification
└─ Handled gracefully (no crash)
```

## Mobile Responsiveness Breakpoints

```
Mobile First Approach:
- Default: Mobile (< 768px)
- Tablet: 768px+
- Desktop: 1024px+

Key Changes:
@media (max-width: 768px):
├─ Grid → Single Column
├─ Flex Wrap
├─ Font Sizes Reduced (slightly)
├─ Padding/Margin Adjusted
├─ Forms Stack Vertically
├─ Buttons Fullwidth
└─ Hide Secondary Elements
```

## Performance Considerations

```
Load Time Optimization:
├─ Zero external dependencies ✓
├─ Single CSS per page ✓
├─ Minimal JavaScript ✓
├─ No heavy libraries ✓
├─ Async/await for API calls ✓
└─ Efficient DOM updates ✓

Caching Strategy:
├─ Browser cache (CSS/JS)
├─ API responses (in memory)
└─ LocalStorage (user session)
```

---

**This architecture ensures:**
- ✅ Clean separation of concerns
- ✅ Easy maintenance and updates
- ✅ Scalability for new features
- ✅ Clear data flow
- ✅ Proper error handling
- ✅ Mobile responsiveness
- ✅ Security best practices
