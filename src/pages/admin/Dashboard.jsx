// FILE PURPOSE:
// - Admin dashboard with overview statistics
// - Display key metrics (products, orders, customers)
// - Quick access to admin functions

import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, MessageCircle, TrendingUp, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { icon: Package, label: 'Total Products', value: '0', color: 'blue', link: '/admin/products' },
    { icon: ShoppingCart, label: 'Total Orders', value: '0', color: 'green', link: '/admin/orders' },
    { icon: Users, label: 'Total Customers', value: '0', color: 'purple', link: '/admin/customers' },
    { icon: MessageCircle, label: 'Active Chats', value: '0', color: 'orange', link: '/admin/chats' },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link key={index} to={stat.link}>
              <div className="card card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                    <stat.icon className={`text-${stat.color}-600 dark:text-${stat.color}-400`} size={32} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/admin/products" className="btn btn-primary w-full">Add New Product</Link>
              <Link to="/admin/orders" className="btn btn-secondary w-full">View Orders</Link>
              <Link to="/admin/store" className="btn btn-secondary w-full">Store Settings</Link>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;