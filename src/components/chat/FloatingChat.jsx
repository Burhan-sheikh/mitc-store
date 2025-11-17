// FILE PURPOSE:
// - Floating chat popup for guests and logged-in users
// - WhatsApp-style interface with auto-scroll
// - Guest support with temporary ID generation
// - Real-time message sync with admin
// - Online/offline admin status indicator

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

const FloatingChat = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [guestId, setGuestId] = useState(null);
  const [adminOnline, setAdminOnline] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Generate or retrieve guest ID
  useEffect(() => {
    if (!currentUser) {
      let storedGuestId = localStorage.getItem('guestChatId');
      if (!storedGuestId) {
        storedGuestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('guestChatId', storedGuestId);
      }
      setGuestId(storedGuestId);
    }
  }, [currentUser]);

  // Get or create chat
  useEffect(() => {
    const initChat = async () => {
      const userId = currentUser?.uid || guestId;
      if (!userId) return;

      try {
        // Check for existing chat
        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('users', 'array-contains', userId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          setChatId(snapshot.docs[0].id);
        } else {
          // Create new chat
          const newChat = await addDoc(chatsRef, {
            users: [userId, 'admin'],
            type: currentUser ? 'user' : 'guest',
            lastMessage: '',
            lastTimestamp: serverTimestamp(),
            status: 'open',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userName: currentUser?.displayName || 'Guest User',
            userEmail: currentUser?.email || null
          });
          setChatId(newChat.id);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    if (isOpen) {
      initChat();
    }
  }, [isOpen, currentUser, guestId]);

  // Subscribe to messages
  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mock admin online status (you can implement real presence)
  useEffect(() => {
    setAdminOnline(true); // Set based on real admin presence logic
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !chatId || sending) return;

    setSending(true);
    const userId = currentUser?.uid || guestId;

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        senderId: userId,
        text: message.trim(),
        createdAt: serverTimestamp(),
        readBy: [userId]
      });

      // Update chat's last message
      const chatRef = collection(db, 'chats');
      const chatDoc = await getDocs(query(chatRef, where('__name__', '==', chatId)));
      if (!chatDoc.empty) {
        await addDoc(chatRef, {
          lastMessage: message.trim(),
          lastTimestamp: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    return format(date, 'HH:mm');
  };

  const userId = currentUser?.uid || guestId;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-green-500/50 transition-all"
          >
            <MessageCircle size={28} />
            {adminOnline && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
            style={{ height: isMinimized ? 'auto' : '600px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">MITC Support</h3>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${adminOnline ? 'bg-green-300' : 'bg-gray-300'}`}></span>
                    {adminOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  {isMinimized ? <Maximize2 size={18} className="text-white" /> : <Minimize2 size={18} className="text-white" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="h-[450px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-3">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Start a conversation...</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwn = msg.senderId === userId;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[75%] ${
                            isOwn
                              ? 'bg-green-500 text-white rounded-2xl rounded-br-sm'
                              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl rounded-bl-sm border border-gray-200 dark:border-gray-600'
                          } px-4 py-2 shadow-sm`}>
                            <p className="text-sm break-words">{msg.text}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'}`}>
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <form onSubmit={handleSend} className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white text-sm"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={!message.trim() || sending}
                      className="p-2 bg-green-500 hover:bg-green-600 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                  {!currentUser && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Chatting as Guest • <button className="text-green-600 hover:underline">Login</button> to save history
                    </p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat;