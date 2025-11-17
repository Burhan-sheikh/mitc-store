// FILE PURPOSE:
// - Clean WhatsApp/Instagram-style real-time chat UI
// - Fullscreen chat without sidebars or extra cards
// - Simple message bubbles for clear conversations

import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, User, Shield, CheckCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const { currentUser } = useAuth();
  const { messages, sendMessage, getOrCreateChat, markAsRead } = useChat();
  const [message, setMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Initialize chat
  useEffect(() => {
    if (!currentUser) return;

    const initChat = async () => {
      const id = await getOrCreateChat(currentUser.uid);
      setChatId(id);
      if (id) markAsRead(id);
    };

    initChat();
  }, [currentUser]);

  // Auto scroll
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
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600">Please login to start chat.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">

      {/* Top Header like Instagram DM */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
            <Shield size={20} />
          </div>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Admin Support</p>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {messages.length === 0 && (
          <div className="text-center mt-20">
            <p className="text-gray-500">Start a conversation…</p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, index) => {
            const isOwnMessage = msg.senderId === currentUser.uid;
            const isAdmin = msg.senderId === 'admin';

            return (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm 
                  ${isOwnMessage
                    ? 'bg-green-500 text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <div className="text-[10px] text-gray-200 dark:text-gray-400 mt-1 flex items-center gap-1">
                    {formatTime(msg.createdAt)}
                    {isOwnMessage && <CheckCheck size={12} />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area like WhatsApp */}
      <div className="p-3 bg-white dark:bg-gray-800 flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 px-4 py-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
        />

        <button
          onClick={handleSend}
          disabled={!message.trim() || sending}
          className="p-3 bg-green-500 text-white rounded-full disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
