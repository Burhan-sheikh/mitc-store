// FILE PURPOSE:
// - Main application component with routing configuration
// - Define all application routes and protected routes
// - Include FloatingChat globally for guests and users
// - Handle route-based authentication
// - Layout structure with Header, Footer, and FloatingChat

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FloatingChat from './components/chat/FloatingChat';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Ratings from './pages/Ratings';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

// User Pages
import BulkOrder from './pages/BulkOrder';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Chat from './pages/Chat';
import UserDashboard from './pages/UserDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminChats from './pages/admin/Chats';
import AdminCustomers from './pages/admin/Customers';
import AdminStore from './pages/admin/Store';
import AdminReviews from './pages/admin/Reviews';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { currentUser, isAdmin } = useAuth();

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900 dark:to-red-900/20">
        <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You do not have admin permissions.</p>
        </div>
      </div>
    );
  }

  if (userOnly && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Login Required</h1>
          <p className="text-gray-600 dark:text-gray-400">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

function App() {
  const { isAdmin } = useAuth();

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/ratings" element={<Ratings />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* User Routes */}
            <Route path="/bulk-order" element={<BulkOrder />} />
            <Route path="/wishlist" element={<ProtectedRoute userOnly><Wishlist /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute userOnly><Profile /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute userOnly><Orders /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute userOnly><Chat /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute userOnly><UserDashboard /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/chats" element={<ProtectedRoute adminOnly><AdminChats /></ProtectedRoute>} />
            <Route path="/admin/customers" element={<ProtectedRoute adminOnly><AdminCustomers /></ProtectedRoute>} />
            <Route path="/admin/store" element={<ProtectedRoute adminOnly><AdminStore /></ProtectedRoute>} />
            <Route path="/admin/reviews" element={<ProtectedRoute adminOnly><AdminReviews /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
        
        {/* Floating Chat - Available to everyone (guests, users, admin) */}
        {!isAdmin && <FloatingChat />}
      </div>
    </Router>
  );
}

export default App;