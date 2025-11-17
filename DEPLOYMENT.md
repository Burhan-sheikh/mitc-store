# Deployment Guide for MITC Store

This guide covers deploying MITC Store to various platforms.

## Prerequisites

- Firebase project configured
- Environment variables ready
- Repository pushed to GitHub

## Deploy to Netlify

### Method 1: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod
```

### Method 2: Using Netlify Dashboard

1. Go to [Netlify](https://www.netlify.com/)
2. Click "Add new site" > "Import an existing project"
3. Connect your GitHub account
4. Select `mitc-store` repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Add environment variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_ADMIN_EMAIL`
7. Click "Deploy site"

### Netlify Redirects

Create `public/_redirects` file:

```
/*    /index.html   200
```

## Deploy to Vercel

### Method 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts and configure environment variables
```

### Method 2: Using Vercel Dashboard

1. Go to [Vercel](https://vercel.com/)
2. Click "Add New" > "Project"
3. Import `mitc-store` from GitHub
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variables
6. Click "Deploy"

## Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Select options:
# - Public directory: dist
# - Configure as SPA: Yes
# - Set up automatic builds: No

# Build the project
npm run build

# Deploy
firebase deploy --only hosting
```

### Firebase Hosting Configuration

Edit `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Deploy to GitHub Pages

1. Install `gh-pages`:

```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://Burhan-sheikh.github.io/mitc-store"
}
```

3. Update `vite.config.js`:

```javascript
export default defineConfig({
  base: '/mitc-store/',
  // ... rest of config
})
```

4. Deploy:

```bash
npm run deploy
```

## Environment Variables

Ensure these are set in your deployment platform:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_EMAIL=admin@mitc.com
```

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test authentication (Email + Google)
- [ ] Check product listing and details
- [ ] Test admin dashboard access
- [ ] Verify image upload and compression
- [ ] Test order creation and status updates
- [ ] Check chat functionality
- [ ] Test dark mode toggle
- [ ] Verify mobile responsiveness
- [ ] Test all forms and validation
- [ ] Check Firestore security rules
- [ ] Monitor Firebase usage

## Custom Domain Setup

### Netlify

1. Go to Site settings > Domain management
2. Add custom domain
3. Follow DNS configuration instructions

### Vercel

1. Go to Project Settings > Domains
2. Add domain
3. Configure DNS records

### Firebase Hosting

```bash
firebase hosting:channel:deploy production --domain your-domain.com
```

## SSL/HTTPS

All platforms provide automatic HTTPS. No additional configuration needed.

## Monitoring

### Firebase Console
- Monitor Firestore usage
- Check authentication metrics
- Review security rules

### Analytics
Add Google Analytics or other analytics tools in `index.html`

## Troubleshooting

**Build fails:**
- Check Node version (18+)
- Verify all environment variables
- Clear cache: `npm clean-install`

**Images not loading:**
- Check image compression settings
- Verify Base64 encoding

**Authentication issues:**
- Verify Firebase config
- Check authorized domains in Firebase Console

**404 errors:**
- Ensure SPA redirect rules are configured
- Check routing configuration

## Performance Optimization

1. **Enable compression** (Netlify/Vercel do this automatically)
2. **Set cache headers**
3. **Monitor bundle size**
4. **Use CDN** (automatic with most platforms)

## Scaling Considerations

- Monitor Firestore reads/writes
- Implement pagination for large datasets
- Use Firestore indexes efficiently
- Consider upgrading Firebase plan if needed

---

For more help, see the [main README](README.md)