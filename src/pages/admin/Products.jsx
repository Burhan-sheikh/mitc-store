// FILE PURPOSE:
// - Admin product management with proper Firestore saving
// - Add, edit, duplicate, and delete products with real-time updates
// - Upload and compress product images (max 5, 700KB each)
// - Professional futuristic glassmorphism UI design
// - FIXED: Products now properly save to Firestore

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Copy, Eye, EyeOff, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';
import { processMultipleImages, formatFileSize } from '../../utils/imageCompression';
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '../../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
  const { products, createProduct, updateProduct, deleteProduct, duplicateProduct, loading } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    price: '',
    category: PRODUCT_CATEGORIES[0],
    condition: PRODUCT_CONDITIONS[0].value,
    shortDescription: '',
    specs: {},
    images: [],
    isPublished: true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 5) {
      alert('Maximum 5 images allowed per product');
      return;
    }

    setUploading(true);
    setUploadProgress('Compressing images...');
    
    try {
      const base64Images = await processMultipleImages(files, 5);
      setFormData({ ...formData, images: base64Images });
      setUploadProgress(`${base64Images.length} images uploaded successfully`);
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Image upload failed: ' + error.message);
      setUploadProgress('');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(''), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        specs: formData.specs || {},
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        alert('Product updated successfully!');
      } else {
        await createProduct(productData);
        alert('Product created successfully!');
      }
      resetForm();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save product: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      brand: '',
      model: '',
      price: '',
      category: PRODUCT_CATEGORIES[0],
      condition: PRODUCT_CONDITIONS[0].value,
      shortDescription: '',
      specs: {},
      images: [],
      isPublished: true,
    });
    setEditingProduct(null);
    setShowForm(false);
    setUploadProgress('');
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      brand: product.brand || '',
      model: product.model || '',
      price: product.price || '',
      category: product.category || PRODUCT_CATEGORIES[0],
      condition: product.condition || PRODUCT_CONDITIONS[0].value,
      shortDescription: product.shortDescription || '',
      specs: product.specs || {},
      images: product.images || [],
      isPublished: product.isPublished !== false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id, title) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteProduct(id);
        alert('Product deleted successfully!');
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateProduct(id);
      alert('Product duplicated successfully!');
    } catch (error) {
      alert('Failed to duplicate product');
    }
  };

  const togglePublish = async (product) => {
    try {
      await updateProduct(product.id, { isPublished: !product.isPublished });
    } catch (error) {
      alert('Failed to update product status');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
              Products Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{products.length} products in database</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-2xl shadow-2xl flex items-center gap-2 hover:shadow-purple-500/50 transition-all"
          >
            <Plus size={20} />
            Add Product
          </motion.button>
        </motion.div>

        {/* Product Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={(e) => e.target === e.currentTarget && resetForm()}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 backdrop-blur-xl p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center z-10">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button onClick={resetForm} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-700/80 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:outline-none transition-all text-gray-900 dark:text-white"
                        placeholder="Dell Latitude 7490"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="input"
                        placeholder="Dell"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Model
                      </label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        className="input"
                        placeholder="Latitude 7490"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="input"
                        placeholder="45000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input"
                      >
                        {PRODUCT_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Condition
                      </label>
                      <select
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        className="input"
                      >
                        {PRODUCT_CONDITIONS.map(cond => (
                          <option key={cond.value} value={cond.value}>{cond.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Short Description
                    </label>
                    <textarea
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="input"
                      rows="3"
                      placeholder="Brief description of the product..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Product Images (Max 5, 700KB each)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all"
                      >
                        <Upload size={24} className="text-purple-600 dark:text-purple-400" />
                        <span className="text-purple-600 dark:text-purple-400 font-medium">
                          {uploading ? 'Uploading...' : 'Click to upload images'}
                        </span>
                      </label>
                    </div>
                    {uploadProgress && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2">{uploadProgress}</p>
                    )}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-5 gap-2 mt-4">
                        {formData.images.map((img, i) => (
                          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border-2 border-purple-200 dark:border-purple-700">
                            <img src={img} alt={`Product ${i+1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Published Toggle */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-purple-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="published" className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
                      Publish product immediately
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <motion.button
                      type="submit"
                      disabled={saving || uploading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-xl shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Save size={20} />
                      {saving ? 'Saving...' : 'Save Product'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={resetForm}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading && products.length === 0 ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ImageIcon size={64} className="mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-600 dark:text-gray-400">No products yet</p>
            </div>
          ) : (
            products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={48} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    {product.isPublished ? (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <Eye size={14} /> Published
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <EyeOff size={14} /> Draft
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {product.category}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDuplicate(product.id)}
                      className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={() => togglePublish(product)}
                      className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg transition-colors"
                      title="Toggle Publish"
                    >
                      {product.isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.title)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Products;