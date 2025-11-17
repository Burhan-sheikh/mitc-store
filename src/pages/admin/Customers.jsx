// FILE PURPOSE:
// - Admin customers management page
// - View all registered users
// - Mark users as favorite
// - View customer details and order history

import { Users, Star } from 'lucide-react';

const Customers = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Customers Management</h1>

        <div className="card text-center py-12">
          <Users size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">No customers yet</p>
        </div>
      </div>
    </div>
  );
};

export default Customers;