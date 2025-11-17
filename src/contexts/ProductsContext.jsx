// FILE PURPOSE:
// - Manage products state and provide to all components
// - Handle product CRUD operations
// - Provide filtering and sorting functionality
// - Cache products data to reduce Firestore reads

import { createContext, useContext, useState, useEffect } from 'react';
import { firestoreHelpers, collections, query, where, orderBy } from '../config/firestore';

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

  // Fetch all published products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await firestoreHelpers.getCollection(
        collections.products,
        [where('isPublished', '==', true), orderBy('createdAt', 'desc')]
      );
      setProducts(productsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all products (including unpublished) - for admin
  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const productsData = await firestoreHelpers.getCollection(
        collections.products,
        [orderBy('createdAt', 'desc')]
      );
      setProducts(productsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching all products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get product by ID
  const getProductById = async (id) => {
    try {
      return await firestoreHelpers.getDocument(collections.products, id);
    } catch (err) {
      console.error('Error fetching product:', err);
      throw err;
    }
  };

  // Create new product
  const createProduct = async (productData) => {
    try {
      const id = await firestoreHelpers.createDocument(collections.products, productData);
      await fetchProducts();
      return id;
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  };

  // Update product
  const updateProduct = async (id, updates) => {
    try {
      await firestoreHelpers.updateDocument(collections.products, id, updates);
      await fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await firestoreHelpers.deleteDocument(collections.products, id);
      await fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  // Duplicate product
  const duplicateProduct = async (id) => {
    try {
      const original = await getProductById(id);
      const { id: _, createdAt, updatedAt, ...productData } = original;
      const duplicated = {
        ...productData,
        title: `${productData.title} (Copy)`,
        isPublished: false,
      };
      const newId = await createProduct(duplicated);
      return newId;
    } catch (err) {
      console.error('Error duplicating product:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    fetchAllProducts,
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