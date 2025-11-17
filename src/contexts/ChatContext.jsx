// FILE PURPOSE:
// - Manage real-time chat functionality with proper message persistence
// - Handle chat creation and message sending with Firestore real-time updates
// - Provide unread message counts and chat state management
// - Fixed: Messages now properly save to Firestore

import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../config/firestore';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Get or create chat for user
  const getOrCreateChat = async (userId) => {
    try {
      setLoading(true);
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('participants', 'array-contains', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingChat = querySnapshot.docs[0];
        return existingChat.id;
      }

      // Create new chat
      const newChatRef = await addDoc(chatsRef, {
        participants: [userId, 'admin'],
        lastMessage: '',
        unreadCounts: {
          [userId]: 0,
          admin: 0
        },
        lastActiveAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      return newChatRef.id;
    } catch (error) {
      console.error('Error getting or creating chat:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Send message - FIXED: Now properly saves to Firestore
  const sendMessage = async (chatId, messageText) => {
    if (!messageText.trim()) return;

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      
      // Add message to subcollection
      await addDoc(messagesRef, {
        message: messageText.trim(),
        senderId: currentUser?.uid || 'admin',
        senderName: currentUser?.displayName || 'Admin',
        createdAt: serverTimestamp(),
        read: false
      });

      // Update chat document
      const chatRef = doc(db, 'chats', chatId);
      const otherParticipant = isAdmin ? (activeChat?.participants || []).find(p => p !== 'admin') : 'admin';
      
      await updateDoc(chatRef, {
        lastMessage: messageText.substring(0, 100),
        lastActiveAt: serverTimestamp(),
        [`unreadCounts.${otherParticipant}`]: (activeChat?.unreadCounts?.[otherParticipant] || 0) + 1
      });

      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Subscribe to messages in active chat
  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(db, 'chats', activeChat.id, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setMessages(loadedMessages);
    }, (error) => {
      console.error('Error loading messages:', error);
    });

    return () => unsubscribe();
  }, [activeChat]);

  // Subscribe to user's chats (for admin: all chats)
  useEffect(() => {
    if (!currentUser && !isAdmin) return;

    const chatsRef = collection(db, 'chats');
    let q;

    if (isAdmin) {
      // Admin sees all chats
      q = query(chatsRef, orderBy('lastActiveAt', 'desc'));
    } else {
      // User sees only their chats
      q = query(chatsRef, where('participants', 'array-contains', currentUser.uid));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedChats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastActiveAt: doc.data().lastActiveAt?.toDate()
      }));
      setChats(loadedChats);

      // Calculate unread count
      const userId = currentUser?.uid || 'admin';
      const total = loadedChats.reduce((sum, chat) => sum + (chat.unreadCounts?.[userId] || 0), 0);
      setUnreadCount(total);
    });

    return () => unsubscribe();
  }, [currentUser, isAdmin]);

  // Mark chat as read
  const markAsRead = async (chatId) => {
    try {
      const chatRef = doc(db, 'chats', chatId);
      const userId = currentUser?.uid || 'admin';
      await updateDoc(chatRef, {
        [`unreadCounts.${userId}`]: 0
      });
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  };

  const value = {
    chats,
    activeChat,
    messages,
    unreadCount,
    loading,
    setActiveChat,
    getOrCreateChat,
    sendMessage,
    markAsRead,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};