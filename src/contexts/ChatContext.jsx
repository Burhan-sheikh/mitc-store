// FILE PURPOSE:
// - Manage real-time chat functionality
// - Handle chat creation and message sending
// - Provide unread message counts
// - Sync chat state with Firestore

import { createContext, useContext, useState, useEffect } from 'react';
import { firestoreHelpers, collections, query, where, orderBy, collection, onSnapshot } from '../config/firestore';
import { useAuth } from './AuthContext';
import { db } from '../config/firestore';

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
      // Find existing chat
      const existingChats = await firestoreHelpers.getCollection(
        collections.chats,
        [where('participants', 'array-contains', userId)]
      );

      if (existingChats.length > 0) {
        return existingChats[0].id;
      }

      // Create new chat
      const chatData = {
        participants: [userId, 'admin'],
        lastMessage: '',
        unreadCounts: { [userId]: 0, admin: 0 },
        lastActiveAt: new Date(),
      };
      const chatId = await firestoreHelpers.createDocument(collections.chats, chatData);
      return chatId;
    } catch (error) {
      console.error('Error getting or creating chat:', error);
      throw error;
    }
  };

  // Send message
  const sendMessage = async (chatId, message) => {
    try {
      const messageData = {
        message,
        senderId: currentUser?.uid || 'admin',
        createdAt: new Date(),
      };

      // Add message to subcollection
      await firestoreHelpers.createDocument(
        `${collections.chats}/${chatId}/messages`,
        messageData
      );

      // Update chat document
      const otherParticipant = isAdmin ? currentUser?.uid : 'admin';
      await firestoreHelpers.updateDocument(collections.chats, chatId, {
        lastMessage: message.substring(0, 100),
        lastActiveAt: new Date(),
        [`unreadCounts.${otherParticipant}`]: unreadCount + 1,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Mark chat as read
  const markAsRead = async (chatId) => {
    try {
      const userId = currentUser?.uid || 'admin';
      await firestoreHelpers.updateDocument(collections.chats, chatId, {
        [`unreadCounts.${userId}`]: 0,
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