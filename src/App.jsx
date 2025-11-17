import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Ratings from "./pages/Ratings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

import BulkOrder from "./pages/BulkOrder";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Chat from "./pages/Chat";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminChats from "./pages/admin/Chats";
import AdminCustomers from "./pages/admin/Customers";
import AdminStore from "./pages/admin/Store";

import FloatingChat from "./components/chat/FloatingChat";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, isAdmin } = useAuth();

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl text-red-600">Access Denied</h1>
      </div>
    );
  }

  if (!currentUser && adminOnly) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl text-red-600">Unauthorized</h1>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/ratings" element={<Ratings />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            <Route path="/bulk-order" element={<BulkOrder />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/chat" element={<Chat />} />

            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/chats" element={<ProtectedRoute adminOnly><AdminChats /></ProtectedRoute>} />
            <Route path="/admin/customers" element={<ProtectedRoute adminOnly><AdminCustomers /></ProtectedRoute>} />
            <Route path="/admin/store" element={<ProtectedRoute adminOnly><AdminStore /></ProtectedRoute>} />
          </Routes>
        </main>

        <Footer />

        {/* Floating Chat Button */}
        <FloatingChat />
      </div>
    </Router>
  );
}

export default App;
