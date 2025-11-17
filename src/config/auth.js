// FILE PURPOSE:
// - Configure Firebase Authentication
// - Export auth instance and common auth functions
// - Handle user authentication state changes

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import app from './firebase.config';

// Initialize Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Auth helper functions
export const authHelpers = {
  // Sign up with email and password
  signUpWithEmail: async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential.user;
  },

  // Sign in with email and password
  signInWithEmail: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  },

  // Sign out
  logout: async () => {
    await signOut(auth);
  },

  // Send password reset email
  resetPassword: async (email) => {
    await sendPasswordResetEmail(auth, email);
  },

  // Update user profile
  updateUserProfile: async (updates) => {
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, updates);
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  },
};

export { auth, GoogleAuthProvider, signInWithPopup };
export default auth;