// FILE PURPOSE:
// - Manage products state with real-time Firestore sync
// - Handle product CRUD operations with proper error handling
// - Fixed: Products now properly save to Firestore
// - Provide filtering and sorting functionality

import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../config/firestore';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time subscription to products
  useEffect(() => {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const loadedProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        }));
        setProducts(loadedProducts);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Get product by ID
  const getProductById = async (id) => {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (err) {
      console.error('Error fetching product:', err);
      throw err;
    }
  };

  // Create new product - FIXED: Now properly saves to Firestore
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      const productsRef = collection(db, 'products');
      
      const newProduct = {
        ...productData,
        starRatings: 0,
        reviewCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(productsRef, newProduct);
      console.log('Product created successfully with ID:', docRef.id);
      return docRef.id;
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (id, updates) => {
    try {
      setLoading(true);
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('Product updated successfully');
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
      console.log('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Duplicate product
  const duplicateProduct = async (id) => {
    try {
      const original = await getProductById(id);
      if (!original) throw new Error('Product not found');

      const { id: _, createdAt, updatedAt, ...productData } = original;
      const duplicated = {
        ...productData,
        title: `${productData.title} (Copy)`,
        isPublished: false,
      };
      
      const newId = await createProduct(duplicated);
      console.log('Product duplicated successfully');
      return newId;
    } catch (err) {
      console.error('Error duplicating product:', err);
      throw err;
    }
  };

  const value = {
    products,
    loading,
    error,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};