// FILE PURPOSE:
// - Admin orders management page
// - View all orders with filtering
// - Update order status through defined pipeline
// - Mark orders as paid
// - Track order history and logs

import { useState } from 'react';
import { Package, Check } from 'lucide-react';
import { ORDER_STATUSES } from '../../utils/constants';

const Orders = () => {
  const [filter, setFilter] = useState('all');

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Orders Management</h1>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'} whitespace-nowrap`}
            >
              All Orders
            </button>
            {ORDER_STATUSES.map((status) => (
              <button
                key={status.value}
                onClick={() => setFilter(status.value)}
                className={`btn ${filter === status.value ? 'btn-primary' : 'btn-secondary'} whitespace-nowrap`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="card text-center py-12">
          <Package size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
        </div>
      </div>
    </div>
  );
};

export default Orders;