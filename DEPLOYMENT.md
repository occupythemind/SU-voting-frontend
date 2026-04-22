# Deployment & Testing Checklist

## Pre-Deployment Checklist

### Configuration ✓ 
- [ ] Review `config.js` and verify all settings
- [ ] Update API_ORIGIN to production backend URL
- [ ] Verify API_VERSION matches backend
- [ ] Check SESSION_TIMEOUT is appropriate
- [ ] Review COLORS if customized

### Files & Assets ✓
- [ ] Logo file added at `assets/images/logo.svg` (or will use default)
- [ ] All HTML files reference correct CSS/JS paths
- [ ] Verify all relative paths use `/` (root-relative)
- [ ] Check no absolute file paths in code
- [ ] Remove any `.env` files or secrets

### Code Quality ✓
- [ ] No console.log() or TODO comments left
- [ ] No commented-out code blocks
- [ ] All error messages are user-friendly
- [ ] Input validation is present
- [ ] API error handling is implemented
- [ ] CORS headers are set on backend

### Security ✓
- [ ] No sensitive data stored in localStorage (except user session)
- [ ] No passwords logged to console
- [ ] HTTPS in production (update API_ORIGIN)
- [ ] Session timeout configured appropriately
- [ ] CORS is properly configured on backend
- [ ] No XSS vulnerabilities in dynamic content

### Documentation ✓
- [ ] README.md reviewed and accurate
- [ ] QUICKSTART.md has correct setup instructions
- [ ] API documentation matches backend
- [ ] Known limitations documented
- [ ] Support contact information included

---

## Testing Checklist

### Authentication Flow ✓
- [ ] Register new account
  - [ ] Non-existent matric accepted
  - [ ] Passwords match validation works
  - [ ] User created successfully
  - [ ] Session started automatically
  
- [ ] Login with valid credentials
  - [ ] Redirects to correct page (student/admin)
  - [ ] User data stored correctly
  - [ ] Header shows correct user name
  
- [ ] Login with invalid credentials
  - [ ] Shows error message
  - [ ] Does not create session
  - [ ] Stays on login page
  
- [ ] Logout
  - [ ] Session cleared
  - [ ] Redirects to login
  - [ ] Cannot access protected pages
  
- [ ] Session persistence
  - [ ] Refresh page - still logged in
  - [ ] Close browser - can log in again
  - [ ] Session expires after timeout
  
- [ ] Protected routes
  - [ ] Cannot access student pages without login
  - [ ] Cannot access admin pages without admin role
  - [ ] Redirects properly on 401

### Student Voting Flow ✓
- [ ] Categories page
  - [ ] Lists all categories
  - [ ] Shows descriptions
  - [ ] Each category is clickable
  
- [ ] Voting page
  - [ ] Loads correct category
  - [ ] Shows all contestants
  - [ ] Displays vote counts
  - [ ] Shows current user vote (if any)
  
- [ ] Voting
  - [ ] Can vote for contestant
  - [ ] Vote count increases
  - [ ] Button changes to "Remove Vote"
  - [ ] Cannot vote twice in same category
  
- [ ] Changing vote
  - [ ] Can remove vote
  - [ ] Vote count decreases
  - [ ] Can vote again after removing
  
- [ ] Vote confirmation
  - [ ] Success message shown
  - [ ] Vote badge appears
  - [ ] Vote added to audit log

### Student Profile ✓
- [ ] View profile
  - [ ] Correct user info displayed
  - [ ] Status badge shown
  - [ ] Admin badge shown (if applicable)
  - [ ] Member since date correct
  
- [ ] Edit profile
  - [ ] Form appears on edit click
  - [ ] Current values populated
  - [ ] Can change name
  - [ ] Can change password (optional)
  
- [ ] Save changes
  - [ ] Updates successfully
  - [ ] Success message shown
  - [ ] Header updated if name changed
  - [ ] Password changes work

### Admin Dashboard ✓
- [ ] Dashboard loads
  - [ ] Statistics displayed
  - [ ] Category count correct
  - [ ] Total votes calculated
  - [ ] Quick stats shown
  
- [ ] Navigation
  - [ ] All admin links present
  - [ ] Links go to correct pages
  - [ ] Can navigate between admin pages

### Admin Category Management ✓
- [ ] List categories
  - [ ] All categories shown
  - [ ] Table layout correct
  - [ ] Action buttons visible
  
- [ ] Create category
  - [ ] Form appears
  - [ ] Required fields validated
  - [ ] Category created successfully
  - [ ] Appears in list immediately
  
- [ ] Edit category
  - [ ] Form pre-filled with data
  - [ ] Changes save correctly
  - [ ] Updates reflect in list
  
- [ ] Delete category
  - [ ] Confirmation modal shown
  - [ ] Category removed from list
  - [ ] Verify with backend

### Admin Contestant Management ✓
- [ ] List contestants
  - [ ] All contestants shown
  - [ ] Matric numbers displayed
  - [ ] Vote counts accurate
  
- [ ] Add contestant
  - [ ] Student search works
  - [ ] Can select student
  - [ ] Contestant added successfully
  - [ ] Appears in list
  
- [ ] Remove contestant
  - [ ] Confirmation shown
  - [ ] Removed from category
  - [ ] Votes handled correctly (backend)

### Admin Results ✓
- [ ] Load results
  - [ ] All categories shown
  - [ ] All contestants listed
  - [ ] Vote counts accurate
  
- [ ] Vote percentages
  - [ ] Calculated correctly
  - [ ] Bar visualization works
  - [ ] Adds up to 100%
  
- [ ] Voter details
  - [ ] Voter list expandable
  - [ ] Shows name, matric, timestamp
  - [ ] Timestamps correct

### Admin Audit Logs ✓
- [ ] Load logs
  - [ ] All activities shown
  - [ ] Chronological order
  - [ ] Timestamps accurate
  
- [ ] Filter logs
  - [ ] Search by name works
  - [ ] Search by matric works
  - [ ] Search by action works
  - [ ] Multiple results shown

### Error Handling ✓
- [ ] Network errors
  - [ ] Offline backend → error message
  - [ ] Invalid API_ORIGIN → error message
  - [ ] Malformed response → graceful handling
  
- [ ] Validation errors
  - [ ] Empty fields → validation messages
  - [ ] Invalid inputs → error shown
  - [ ] Form not submitted
  
- [ ] API errors
  - [ ] 400 → clear error message
  - [ ] 401 → logout, redirect to login
  - [ ] 403 → "not authorized" message
  - [ ] 404 → "not found" message
  - [ ] 500 → "server error" message

### UI/UX ✓
- [ ] Loading states
  - [ ] Buttons show loading animation
  - [ ] Page shows spinner when loading
  - [ ] Multiple clicks don't cause duplicates
  
- [ ] Notifications
  - [ ] Success messages appear
  - [ ] Error messages appear
  - [ ] Auto-dismiss after 4 seconds
  - [ ] Position and styling correct
  
- [ ] Forms
  - [ ] Labels visible and associated
  - [ ] Error messages clear
  - [ ] Focus visible
  - [ ] Tab order logical
  
- [ ] Mobile responsive
  - [ ] Works on iPhone/Android
  - [ ] Touch targets large enough
  - [ ] Landscape/portrait both work
  - [ ] No horizontal scrolling

### Accessibility ✓
- [ ] Keyboard navigation
  - [ ] Tab through form fields
  - [ ] Enter submits forms
  - [ ] Escape closes modals
  - [ ] Focus visible on all elements
  
- [ ] Screen readers
  - [ ] Form labels announced
  - [ ] Buttons have text
  - [ ] Links descriptive
  - [ ] Images have alt text (if any)
  
- [ ] Color contrast
  - [ ] Text readable on background
  - [ ] Status not color-only
  - [ ] Icons have labels

### Browser Compatibility ✓
- [ ] Chrome - All features work
- [ ] Firefox - All features work
- [ ] Safari - All features work
- [ ] Edge - All features work
- [ ] Mobile Safari (iOS) - All features work
- [ ] Chrome Mobile (Android) - All features work

### Performance ✓
- [ ] Page load time < 2 seconds
- [ ] API calls complete quickly
- [ ] No memory leaks (DevTools)
- [ ] No console errors
- [ ] Render time acceptable

---

## Deployment Steps

### 1. Prepare Files
```bash
# Remove test/debug files
rm -f .env .env.local *.log

# Verify config.js is production-ready
cat config.js

# Check all paths are root-relative (start with /)
grep -r "href='[^/]" pages/
grep -r "src='[^/]" pages/
```

### 2. Optimize (Optional)
```bash
# Minify CSS (if using tool)
# Minify JS (if using tool)
# Optimize images (if any)

# But for this project, serve as-is (vanilla HTML/CSS/JS)
```

### 3. Deploy
```bash
# Option A: Copy to web server
scp -r ./* user@server:/var/www/voting/

# Option B: Deploy to Netlify/Vercel
# Push to GitHub and connect service

# Option C: Docker
docker build -t voting-frontend .
docker run -p 80:80 voting-frontend
```

### 4. Verify Deployment
```bash
# Check files are accessible
curl https://your-domain.com/index.html
curl https://your-domain.com/config.js
curl https://your-domain.com/css/global.css
curl https://your-domain.com/js/api.js

# Test in browser
# https://your-domain.com
```

### 5. Monitor
```bash
# Check browser console for errors
# Monitor API logs on backend
# Check access logs on web server
# Verify SSL certificate (if HTTPS)
```

---

## Post-Deployment Checklist

### Smoke Tests ✓
- [ ] Homepage loads
- [ ] Can navigate to login
- [ ] Can register new account
- [ ] Can login
- [ ] Can see voting categories
- [ ] Can vote
- [ ] Can view profile

### Database Verification ✓
- [ ] Users created correctly
- [ ] Sessions stored
- [ ] Votes recorded
- [ ] Audit logs captured

### Monitoring ✓
- [ ] Error logs clean
- [ ] No 404 errors
- [ ] API response times normal
- [ ] Database responsive
- [ ] Uptime monitoring active

### User Communication ✓
- [ ] Users notified of launch
- [ ] Help documentation available
- [ ] Support email configured
- [ ] FAQ updated
- [ ] Status page updated

---

## Rollback Plan

If something goes wrong:

### Option 1: Quick Rollback
```bash
# Have backup of previous version
git revert [commit-hash]
git push production main
```

### Option 2: Database Rollback
```bash
# Restore from database backup
pg_restore -d voting_db backup.sql
```

### Option 3: Maintenance Mode
```bash
# Serve maintenance page while fixing
cp maintenance.html index.html
```

---

## Performance Optimization (Optional)

### Caching Headers (Nginx)
```nginx
location ~* \.(css|js)$ {
  expires 30d;
}

location /index.html {
  expires 0;
}
```

### Gzip Compression
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### CDN (Optional)
- Serve CSS/JS from CDN
- Serve images from CDN
- But keep HTML on origin

---

## Ongoing Maintenance

### Weekly ✓
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Respond to user issues

### Monthly ✓
- [ ] Review analytics
- [ ] Check for abandoned sessions
- [ ] Backup database
- [ ] Update dependencies (if any added)

### Quarterly ✓
- [ ] Security audit
- [ ] Performance review
- [ ] Feature planning
- [ ] User feedback analysis

---

## Support Contacts

### Frontend Issues
- Check browser console
- Review DEVELOPMENT.md
- Check network tab in DevTools

### Backend Issues
- Check backend logs
- Verify API_ORIGIN in config.js
- Test with Postman

### Database Issues
- Check database logs
- Verify connections
- Check disk space

---

**Ready to deploy? Follow these steps and you'll be live in minutes!** 🚀
