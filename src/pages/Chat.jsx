// FILE PURPOSE:
// - Real-time chat interface between user and admin with professional UI
// - Display message history with sender differentiation
// - Send and receive messages instantly with Firestore real-time sync
// - Futuristic glassmorphism design with animations

import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, User, Shield, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const Chat = () => {
  const { currentUser } = useAuth();
  const { messages, sendMessage, getOrCreateChat, markAsRead } = useChat();
  const [message, setMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize chat
  useEffect(() => {
    const initChat = async () => {
      if (currentUser) {
        const id = await getOrCreateChat(currentUser.uid);
        setChatId(id);
        if (id) {
          markAsRead(id);
        }
      }
    };
    initChat();
  }, [currentUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !chatId || sending) return;

    setSending(true);
    try {
      await sendMessage(chatId, message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    return format(date, 'HH:mm');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <MessageCircle size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Please Login
          </h2>
          <p className="text-gray-600 dark:text-gray-400">You need to be logged in to chat with admin</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Chat with Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Online • Instant Support
          </p>
        </motion.div>
        
        {/* Chat Container - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, scale: 0.15 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
          style={{ height: 'calc(100vh - 250px)', minHeight: '500px' }}
        >
          <div className="h-full flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mb-6"
                  >
                    <MessageCircle size={48} className="text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Send your first message to get instant support
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {messages.map((msg, index) => {
                    const isOwnMessage = msg.senderId === currentUser.uid;
                    const isAdmin = msg.senderId === 'admin';
                    
                    return (
                      <motion.div
                        key={msg.id || index}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-end gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isAdmin 
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                            : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                        }`}>
                          {isAdmin ? (
                            <Shield size={20} className="text-white" />
                          ) : (
                            <User size={20} className="text-white" />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                          <div className={`px-5 py-3 rounded-2xl shadow-lg ${
                            isOwnMessage
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
                              : isAdmin
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-bl-sm'
                              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-sm'
                          }`}>
                            <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1 px-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(msg.createdAt)}
                            </span>
                            {isOwnMessage && (
                              <CheckCheck size={14} className="text-blue-500" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Futuristic Design */}
            <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-4 bg-gradient-to-r from-white/50 via-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:via-blue-900/20 dark:to-purple-900/20 backdrop-blur-xl">
              <form onSubmit={handleSend} className="flex gap-3 items-center">
                <div className="flex-1 relative group">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-6 py-4 rounded-2xl bg-white/80 dark:bg-gray-700/80 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 shadow-lg group-hover:shadow-xl"
                    disabled={sending}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
                <motion.button
                  type="submit"
                  disabled={!message.trim() || sending}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 hidden sm:inline">{sending ? 'Sending...' : 'Send'}</span>
                  <Send size={20} className="relative z-10" />
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
        >
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Instant Replies</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Usually within minutes</p>
              </div>
            </div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Shield className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Secure Chat</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">End-to-end encrypted</p>
              </div>
            </div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <MessageCircle className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">24/7 Support</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Always here to help</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;