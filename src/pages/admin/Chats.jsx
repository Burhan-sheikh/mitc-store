// FILE PURPOSE:
// - Admin chat management interface
// - View all customer chats
// - Respond to customer messages
// - Mark chats as resolved

import { MessageCircle } from 'lucide-react';

const Chats = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Customer Chats</h1>

        <div className="card text-center py-12">
          <MessageCircle size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">No active chats</p>
        </div>
      </div>
    </div>
  );
};

export default Chats;