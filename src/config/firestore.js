// FILE PURPOSE:
// - Configure Firestore database instance
// - Export common Firestore functions for CRUD operations
// - Provide utility functions for querying and writing data

import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, addDoc, serverTimestamp, writeBatch, onSnapshot } from 'firebase/firestore';
import app from './firebase.config';

// Initialize Firestore
const db = getFirestore(app);

// Collection references
export const collections = {
  users: 'users',
  products: 'products',
  orders: 'orders',
  chats: 'chats',
  storeSettings: 'storeSettings',
  reviews: 'reviews',
};

// Firestore helper functions
export const firestoreHelpers = {
  // Get a single document
  getDocument: async (collectionName, docId) => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  // Get all documents in a collection
  getCollection: async (collectionName, queryConstraints = []) => {
    const collectionRef = collection(db, collectionName);
    const q = queryConstraints.length > 0 ? query(collectionRef, ...queryConstraints) : collectionRef;
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Create a new document
  createDocument: async (collectionName, data, customId = null) => {
    if (customId) {
      const docRef = doc(db, collectionName, customId);
      await setDoc(docRef, { ...data, createdAt: serverTimestamp() });
      return customId;
    } else {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, { ...data, createdAt: serverTimestamp() });
      return docRef.id;
    }
  },

  // Update an existing document
  updateDocument: async (collectionName, docId, data) => {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  },

  // Delete a document
  deleteDocument: async (collectionName, docId) => {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  },

  // Batch write operations
  batchWrite: async (operations) => {
    const batch = writeBatch(db);
    operations.forEach(({ type, collectionName, docId, data }) => {
      const docRef = doc(db, collectionName, docId);
      if (type === 'set') {
        batch.set(docRef, data);
      } else if (type === 'update') {
        batch.update(docRef, data);
      } else if (type === 'delete') {
        batch.delete(docRef);
      }
    });
    await batch.commit();
  },
};

export { db, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, addDoc, serverTimestamp, writeBatch, onSnapshot };
export default db;