// FILE PURPOSE:
// - Manage user authentication state across the application
// - Provide login, logout, and user data to all components
// - Handle user role determination (guest, user, admin)
// - Sync auth state with Firestore user document

import { createContext, useContext, useState, useEffect } from 'react';
import { authHelpers } from '../config/auth';
import { firestoreHelpers, collections, serverTimestamp } from '../config/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const profile = await firestoreHelpers.getDocument(collections.users, uid);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Create or update user document in Firestore
  const syncUserDocument = async (user) => {
    try {
      const existingProfile = await fetchUserProfile(user.uid);
      
      if (!existingProfile) {
        // Create new user document
        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || '',
          phone: '',
          photoURL: '',
          role: user.email === import.meta.env.VITE_ADMIN_EMAIL ? 'admin' : 'user',
          isFavorite: false,
          lastSeen: serverTimestamp(),
        };
        await firestoreHelpers.createDocument(collections.users, userData, user.uid);
        return userData;
      } else {
        // Update last seen
        await firestoreHelpers.updateDocument(collections.users, user.uid, {
          lastSeen: serverTimestamp(),
        });
        return existingProfile;
      }
    } catch (error) {
      console.error('Error syncing user document:', error);
      return null;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = authHelpers.onAuthChange(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const profile = await syncUserDocument(user);
        setUserProfile(profile);
        setIsAdmin(profile?.role === 'admin');
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email
  const signUp = async (email, password, displayName) => {
    try {
      const user = await authHelpers.signUpWithEmail(email, password, displayName);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Sign in with email
  const signIn = async (email, password) => {
    try {
      const user = await authHelpers.signInWithEmail(email, password);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const user = await authHelpers.signInWithGoogle();
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authHelpers.logout();
    } catch (error) {
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (currentUser) {
        await firestoreHelpers.updateDocument(collections.users, currentUser.uid, updates);
        setUserProfile(prev => ({ ...prev, ...updates }));
      }
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    isAdmin,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};