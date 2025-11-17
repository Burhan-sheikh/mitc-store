// FILE PURPOSE:
// - Display user's order history
// - Show order status and details
// - Track order progress with timeline

import { Package, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ORDER_STATUSES } from '../utils/constants';

const Orders = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Please Login</h2>
          <p className="text-gray-600 dark:text-gray-400">You need to be logged in to view your orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>
        <div className="card text-center py-12">
          <Package size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
        </div>
      </div>
    </div>
  );
};

export default Orders;