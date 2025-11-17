// FILE PURPOSE:
// - Admin chat management interface with all customer chats
// - View and respond to multiple customer conversations
// - Real-time message sync with unread indicators
// - Professional futuristic glassmorphism design

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, Shield, Search, Check } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const Chats = () => {
  const { chats, activeChat, messages, setActiveChat, sendMessage, markAsRead } = useChat();
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatUsers, setChatUsers] = useState({});
  const messagesEndRef = useRef(null);

  // Fetch user info for each chat
  useEffect(() => {
    const fetchUserInfo = async () => {
      const usersData = {};
      for (const chat of chats) {
        const userId = chat.participants.find(p => p !== 'admin');
        if (userId && !chatUsers[userId]) {
          try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
              usersData[userId] = userDoc.data();
            }
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        }
      }
      setChatUsers(prev => ({ ...prev, ...usersData }));
    };

    if (chats.length > 0) {
      fetchUserInfo();
    }
  }, [chats]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat || sending) return;

    setSending(true);
    try {
      await sendMessage(activeChat.id, message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    markAsRead(chat.id);
  };

  const filteredChats = chats.filter(chat => {
    const userId = chat.participants.find(p => p !== 'admin');
    const user = chatUsers[userId];
    return user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (date) => {
    if (!date) return '';
    return format(date, 'HH:mm');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
            Customer Chats
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {chats.length} {chats.length === 1 ? 'conversation' : 'conversations'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            style={{ height: 'calc(100vh - 200px)' }}
          >
            {/* Search */}
            <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white/50 via-purple-50/50 to-pink-50/50 dark:from-gray-800/50 dark:via-purple-900/20 dark:to-pink-900/20">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="overflow-y-auto h-full">
              {filteredChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                  <MessageCircle size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No chats found</p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredChats.map((chat) => {
                    const userId = chat.participants.find(p => p !== 'admin');
                    const user = chatUsers[userId];
                    const unread = chat.unreadCounts?.admin || 0;
                    const isActive = activeChat?.id === chat.id;

                    return (
                      <motion.button
                        key={chat.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChatSelect(chat)}
                        className={`w-full p-4 mb-2 rounded-2xl text-left transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl'
                            : 'bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-700/80 border border-gray-200/50 dark:border-gray-600/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isActive
                              ? 'bg-white/20'
                              : 'bg-gradient-to-br from-purple-500 to-pink-500'
                          }`}>
                            <User size={24} className={isActive ? 'text-white' : 'text-white'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className={`font-semibold truncate ${
                                isActive ? 'text-white' : 'text-gray-900 dark:text-white'
                              }`}>
                                {user?.name || 'Unknown User'}
                              </h3>
                              {unread > 0 && (
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  isActive ? 'bg-white/30 text-white' : 'bg-purple-500 text-white'
                                }`}>
                                  {unread}
                                </span>
                              )}
                            </div>
                            <p className={`text-sm truncate ${
                              isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {chat.lastMessage || 'No messages yet'}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            style={{ height: 'calc(100vh - 200px)' }}
          >
            {activeChat ? (
              <div className="h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User size={28} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {chatUsers[activeChat.participants.find(p => p !== 'admin')]?.name || 'Customer'}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {chatUsers[activeChat.participants.find(p => p !== 'admin')]?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {messages.map((msg, index) => {
                        const isAdmin = msg.senderId === 'admin';
                        
                        return (
                          <motion.div
                            key={msg.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-end gap-3 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isAdmin
                                ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                            }`}>
                              {isAdmin ? <Shield size={20} className="text-white" /> : <User size={20} className="text-white" />}
                            </div>
                            <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} max-w-[70%]`}>
                              <div className={`px-5 py-3 rounded-2xl shadow-lg ${
                                isAdmin
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-sm'
                                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-sm'
                              }`}>
                                <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                                {formatTime(msg.createdAt)}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-4 bg-gradient-to-r from-white/50 via-purple-50/50 to-pink-50/50 dark:from-gray-800/50 dark:via-purple-900/20 dark:to-pink-900/20">
                  <form onSubmit={handleSend} className="flex gap-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-6 py-4 rounded-2xl bg-white/80 dark:bg-gray-700/80 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:outline-none transition-all text-gray-900 dark:text-white shadow-lg"
                      disabled={sending}
                    />
                    <motion.button
                      type="submit"
                      disabled={!message.trim() || sending}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      className="px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold shadow-2xl disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      <span className="hidden sm:inline">{sending ? 'Sending...' : 'Send'}</span>
                      <Send size={20} />
                    </motion.button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Select a chat</p>
                  <p className="text-gray-500 dark:text-gray-400">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Chats;