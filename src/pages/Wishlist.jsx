// FILE PURPOSE:
// - Display user's saved/wishlisted products
// - Allow removing items from wishlist
// - Show product cards with quick actions

import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Wishlist = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Please Login</h2>
          <p className="text-gray-600 dark:text-gray-400">You need to be logged in to view your wishlist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">My Wishlist</h1>
        <div className="card text-center py-12">
          <Heart size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">Your wishlist is empty</p>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;