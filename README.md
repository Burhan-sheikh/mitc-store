# MITC Store - Commercial & Business-Class Laptops

₹**18,00,000 Worth Professional UI Quality**

A production-ready, Firebase-powered e-commerce platform for commercial-import and business-class laptops with admin dashboard, real-time chat, and comprehensive order management system.

![Tech Stack](https://img.shields.io/badge/React-18.3-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.13-orange)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-cyan)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)

## 🌟 Features

### Customer Features
- 🛒 Browse commercial and business-class laptops
- 🔍 Advanced search and filtering (category, price, condition)
- ⭐ Product ratings and reviews
- ❤️ Wishlist functionality
- 💬 Real-time chat with admin
- 📦 Bulk order requests for businesses
- 📄 Order tracking with detailed status pipeline
- 🔐 Secure authentication (Email/Password + Google)

### Admin Features
- 📋 Comprehensive dashboard with analytics
- 📦 Product management (Add/Edit/Duplicate/Delete)
- 💸 Order management with status pipeline
- 👥 Customer management
- 💬 Chat panel for customer support
- 🎨 Store customization (Logo, Banners, Theme)
- 🖼️ Image compression (max 700KB per image)
- 📊 Store settings and configuration

### Technical Highlights
- ⚡ Lightning-fast performance with Vite
- 🎨 Beautiful UI with Tailwind CSS + Framer Motion
- 🔥 Firebase Firestore (NO Firebase Storage)
- 📱 Fully responsive design
- 🌙 Dark mode support
- 🗜️ Optimized image compression (<700KB)
- 🔒 Role-based access control (Guest/User/Admin)

## 🛠️ Tech Stack

- **Frontend:** React 18.3, React Router v6
- **Styling:** Tailwind CSS 3.4, Framer Motion
- **Backend:** Firebase 10.13 (Auth + Firestore)
- **Build Tool:** Vite 5.4
- **Icons:** Lucide React
- **Image Processing:** browser-image-compression
- **Date Handling:** date-fns

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore and Authentication enabled

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Burhan-sheikh/mitc-store.git
cd mitc-store
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_EMAIL=admin@mitc.com
```

4. **Setup Firebase**

- Go to [Firebase Console](https://console.firebase.google.com/)
- Enable **Email/Password** and **Google** authentication
- Create Firestore database in production mode
- Apply Firestore security rules (see below)

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

6. **Build for production**
```bash
npm run build
```

## 🔥 Firebase Configuration

### Firestore Collections Structure

```
users/{uid}
  - uid, email, name, phone, photoURL (base64)
  - role: 'guest' | 'user' | 'admin'
  - createdAt, lastSeen

products/{productId}
  - title, brand, model, price, category, condition
  - images: [max 5 base64 strings, <700KB each]
  - specs: {}, shortDescription
  - isPublished, starRatings, reviewCount
  - createdAt, updatedAt

orders/{orderId}
  - userId, userName, userEmail
  - productType, quantity, budget, purpose
  - status, paid, paidAt
  - logs: [{ status, timestamp, note }]
  - createdAt, updatedAt

chats/{chatId}
  - participants: [userId, 'admin']
  - lastMessage, unreadCounts{}
  - lastActiveAt
  /messages/{messageId}
    - message, senderId, createdAt

storeSettings/{settingId}
  - storeName, storeEmail, storePhone
  - logo, heroTitle, heroSubtitle
  - banners: [base64], themeColor
```

### Firestore Security Rules

Add these rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true; // Public read
      allow create, update, delete: if isAdmin();
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }
    
    // Chats collection
    match /chats/{chatId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn();
      
      match /messages/{messageId} {
        allow read: if isSignedIn();
        allow create: if isSignedIn();
      }
    }
    
    // Store settings
    match /storeSettings/{settingId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Reviews
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update, delete: if isOwner(resource.data.userId) || isAdmin();
    }
  }
}
```

### ⚠️ Common Firestore Index Errors

When you first run the app, you may encounter Firestore index errors. This is normal!

**Error Example:**
```
FAILED_PRECONDITION: The query requires an index.
```

**Solution:**
Firebase will provide a direct link in the error message. Click it to auto-generate the required index.

**Common Indexes Needed:**

1. **Products by category and price:**
   - Collection: `products`
   - Fields: `category` (Ascending), `price` (Descending)
   
2. **Orders by user and status:**
   - Collection: `orders`
   - Fields: `userId` (Ascending), `status` (Ascending)
   
3. **Products published filter:**
   - Collection: `products`
   - Fields: `isPublished` (Ascending), `createdAt` (Descending)

4. **Chat messages by timestamp:**
   - Collection: `chats/{chatId}/messages`
   - Fields: `createdAt` (Ascending)

Alternatively, create indexes manually in Firebase Console:
`Firestore Database > Indexes > Create Index`

## 📝 Order Status Pipeline

The system follows this exact order flow (DO NOT CHANGE):

1. **Pending** - Order submitted
2. **Verification in Progress** - Checking details
3. **Awaiting Supplier Confirmation** - Confirming with supplier
4. **Received at Store** - Products received
5. **Under Testing** - Quality testing
6. **Preparing Order** - Packaging preparation
7. **Packed & Ready** - Ready for dispatch
8. **Out for Delivery** - In transit
9. **Delivered** - Order completed

+ **Mark Paid** - Separate payment flag

## 🔐 User Roles

### Guest (Not Logged In)
- Browse products
- View product details
- View store ratings
- Access static pages (About, Contact, Terms, Privacy)

### Logged-in User
All guest features plus:
- Wishlist
- Bulk order requests
- Order tracking
- Real-time chat with admin
- Profile management

### Admin
All user features plus:
- Admin dashboard
- Product management (CRUD)
- Order management
- Customer management
- Chat support panel
- Store customization

## 🖼️ Image Handling

**IMPORTANT: No Firebase Storage Used**

All images are:
- Compressed to **maximum 700KB**
- Converted to **Base64 strings**
- Stored directly in **Firestore documents**
- Limited to **5 images per product**

The app uses `browser-image-compression` library to ensure all images meet size requirements before upload.

## 📦 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌐 Deployment

### Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

## 📂 Project Structure

```
mitc-store/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   └── layout/          # Header, Footer, LoginModal
│   ├── config/
│   │   ├── firebase.config.js
│   │   ├── firestore.js
│   │   └── auth.js
│   ├── contexts/         # React Context providers
│   ├── pages/
│   │   ├── admin/        # Admin pages
│   │   └── ...           # Public & user pages
│   ├── utils/
│   │   ├── constants.js
│   │   └── imageCompression.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## ❓ FAQ

**Q: Why no Firebase Storage?**
A: To reduce costs and complexity. All images are compressed (<700KB) and stored as Base64 in Firestore.

**Q: How do I make the first admin user?**
A: Set `VITE_ADMIN_EMAIL` in `.env` to your email. When you sign up with that email, you'll automatically be admin.

**Q: Can I use external image hosting?**
A: Yes! You can modify the code to use imgbb or Cloudinary free tier instead of Base64.

**Q: How many products can I have?**
A: Firestore free tier allows 1GB storage. With 700KB images (5 per product), you can store thousands of products.

## 🐛 Known Issues & Solutions

1. **Firestore Index Errors:** Click the auto-generated link in console
2. **Image Too Large:** Reduce image dimensions before upload
3. **Build Errors:** Clear `node_modules` and reinstall

## 📝 License

MIT License - feel free to use for commercial projects!

## 👥 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@mitc.com

## 🎉 Acknowledgments

- Built with React, Firebase, and Tailwind CSS
- Icons by Lucide React
- UI animations by Framer Motion

---

**Made with ❤️ for commercial laptop businesses**

₩ Repository value: ₹18,00,000 UI Quality