# Quick Start Guide

## 1. Configure Backend API

Edit `config.js` and set your backend API URL:

```javascript
API_ORIGIN: 'http://localhost:5000',  // Change this to your backend URL
```

## 2. Start a Local Server

### Option A: Python 3
```bash
python -m http.server 8080
```

### Option B: Node.js
```bash
npx http-server -p 8080
```

### Option C: PHP
```bash
php -S localhost:8080
```

## 3. Open in Browser

```
http://localhost:8080
```

## 4. Test the Application

### As a Student:
1. Click "Create Account" or "Register"
2. Fill in your details (full name, matric number, password)
3. Click "Create Account"
4. You'll be redirected to the voting categories page
5. Click on any category to see contestants
6. Vote for your preferred contestant

### As an Admin:
1. Register with an admin account (backend must set `is_admin: true`)
2. You'll be redirected to the admin dashboard
3. Manage categories, contestants, view results, and audit logs

## 5. Customize Branding

### Add Your Logo
1. Create or export an SVG logo (48x48 pixels recommended)
2. Save it as `assets/images/logo.svg`
3. The logo will appear in the header

### Change Colors
1. Open `css/global.css`
2. Find the `:root` selector
3. Change color values:
   ```css
   --color-primary: #10b981;        /* Green - change this */
   --color-primary-light: #d1fae5;
   --color-primary-dark: #047857;
   ```

### Change App Name
1. Open `config.js`
2. Change `APP_NAME: 'UNIDEL Voting System'`

## 6. Replace Emoji Icons

The app uses emoji as placeholders. Replace them with SVG icons:

Search files for these comments:
```
// TODO: Replace emoji with SVG
```

Suggested resources:
- [Heroicons](https://heroicons.com) - Beautiful hand-crafted SVG icons
- [Feather Icons](https://feathericons.com) - Minimal and clean
- [Material Icons](https://fonts.google.com/icons) - Comprehensive set

Example replacement:
```html
<!-- Before -->
<span class="empty-icon">📭</span>

<!-- After -->
<svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="..." />
</svg>
```

## 7. Deploy to Production

### Option 1: Static Hosting (Netlify, Vercel, GitHub Pages)
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# Connect to Netlify or Vercel
# Select repository
# Set build command: (none needed for static site)
# Set publish directory: /
```

### Option 2: Web Server (Apache, Nginx)
```bash
# Copy files to web server
cp -r unidel-voting-frontend/* /var/www/voting/

# Configure virtual host
# For Apache: Create .htaccess with URL rewriting for SPA
# For Nginx: Configure location blocks
```

### Option 3: Docker
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY config.js /usr/share/nginx/html/

# Update config.js with production API URL
RUN sed -i "s|http://localhost:5000|https://api.example.com|g" /usr/share/nginx/html/config.js

EXPOSE 80
```

## 8. Common Issues & Solutions

### "Failed to authenticate" or "Invalid credentials"
- Ensure backend is running and accessible
- Check `config.js` API_ORIGIN is correct
- Check backend logs for issues
- Clear browser cookies and try again

### Styling looks broken
- Clear browser cache (Ctrl+Shift+Del)
- Check that all CSS files are loading (DevTools → Network)
- Verify file paths in HTML are correct

### Logo not showing
- Make sure `assets/images/logo.svg` exists
- Check file permissions
- Try a simple PNG instead of SVG

### Can't add contestants
- Ensure students exist in backend
- Verify you have admin permissions
- Check API response in DevTools Network tab

## 9. Next Steps

- [ ] Add student search autocomplete
- [ ] Implement export to PDF/CSV
- [ ] Setup real-time result updates
- [ ] Add two-factor authentication
- [ ] Setup email notifications
- [ ] Create mobile native app
- [ ] Implement vote confirmation modal

## 📞 Support

Check the main README.md for full documentation and API reference.

Happy voting! 🇳🇬
