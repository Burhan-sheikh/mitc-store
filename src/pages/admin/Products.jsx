// FILE PURPOSE:
// - Admin product management page
// - Add, edit, duplicate, and delete products
// - Upload and compress product images (max 5, 700KB each)
// - Manage product visibility and details

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';
import { processMultipleImages } from '../../utils/imageCompression';
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '../../utils/constants';

const Products = () => {
  const { products, fetchAllProducts, createProduct, updateProduct, deleteProduct, duplicateProduct } = useProducts();
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

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const base64Images = await processMultipleImages(files, 5);
      setFormData({ ...formData, images: base64Images });
    } catch (error) {
      alert('Image upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      resetForm();
    } catch (error) {
      alert('Failed to save product');
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
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  const handleDuplicate = async (id) => {
    await duplicateProduct(id);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Products Management</h1>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus size={20} className="mr-2" />
            Add Product
          </button>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="card mb-8">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  required
                />
                <input
                  type="text"
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="input"
                />
                <input
                  type="number"
                  placeholder="Price *"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input"
                  required
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input"
                >
                  {PRODUCT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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

              <textarea
                placeholder="Short Description"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="input"
                rows="3"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Images (Max 5, 700KB each)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="input"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-gray-500 mt-2">Compressing images...</p>}
                {formData.images.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">{formData.images.length} images uploaded</p>
                )}
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-gray-700 dark:text-gray-300">Published</span>
              </label>

              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary flex-1">Save Product</button>
                <button type="button" onClick={resetForm} className="btn btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt="" className="w-12 h-12 rounded object-cover mr-3" />
                      )}
                      <span className="font-medium">{product.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">₹{product.price?.toLocaleString()}</td>
                  <td className="py-3 px-4">{product.category}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${product.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {product.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(product)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDuplicate(product.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <Copy size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;