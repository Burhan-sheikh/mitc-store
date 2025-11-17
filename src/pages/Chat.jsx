// FILE PURPOSE:
// - Real-time chat interface between user and admin
// - Display message history
// - Send and receive messages

import { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';

const Chat = () => {
  const { currentUser } = useAuth();
  const { sendMessage, getOrCreateChat } = useChat();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;

    try {
      const chatId = await getOrCreateChat(currentUser.uid);
      await sendMessage(chatId, message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MessageCircle size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Please Login</h2>
          <p className="text-gray-600 dark:text-gray-400">You need to be logged in to chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Chat with Admin</h1>
        
        <div className="card h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                <MessageCircle size={48} className="mx-auto mb-4" />
                <p>No messages yet. Start a conversation!</p>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="input flex-1"
            />
            <button type="submit" className="btn btn-primary">
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;