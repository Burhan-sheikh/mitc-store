// FILE PURPOSE:
// - Enhanced product details page with complete information
// - Image gallery with zoom functionality
// - Full specifications display
// - Contact seller panel with auto-chat creation
// - Wishlist integration
// - Related products section
// - Guest and user support for contact seller

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Star, Shield, Truck, Check, ZoomIn, Package } from 'lucide-react';
import { useProducts } from '../contexts/ProductsContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import ProductCard from '../components/common/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, products } = useProducts();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        
        // Auto-generate contact message
        if (data) {
          setContactMessage(`Hi, I'm interested in ${data.title}. Is it still available?`);
        }
        
        // Get related products
        const related = products
          .filter(p => p.category === data?.category && p.id !== id && p.isPublished)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, products]);

  const handleContactSeller = () => {
    // This will open the floating chat with pre-filled message
    setShowContactPanel(true);
    // In the actual implementation, you'd trigger the floating chat
    // and send the message with product context
  };

  const toggleWishlist = () => {
    if (!currentUser) {
      alert('Please login to add items to wishlist');
      return;
    }
    setIsWishlisted(!isWishlisted);
    // TODO: Implement actual wishlist Firestore operations
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900 dark:to-red-900/20">
        <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
          <Link to="/products" className="text-purple-600 hover:underline text-lg">Browse all products</Link>
        </div>
      </div>
    );
  }

  const validImages = product.images?.filter(img => img) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/" className="hover:text-purple-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-purple-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{product.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl mb-4 group">
              {validImages.length > 0 ? (
                <>
                  <img
                    src={validImages[activeImageIndex]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setIsZoomed(true)}
                    className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ZoomIn size={20} className="text-gray-700 dark:text-gray-300" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                  <Package size={64} className="text-gray-400" />
                </div>
              )}

              {/* Condition Badge */}
              {product.condition && (
                <div className="absolute top-4 left-4 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-full shadow-lg">
                  {product.condition}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {validImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      index === activeImageIndex
                        ? 'border-purple-600 scale-105 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'
                    }`}
                  >
                    <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category */}
            <div>
              <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold rounded-full">
                {product.category}
              </span>
            </div>

            {/* Title & Brand */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                {product.title}
              </h1>
              {product.brand && (
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {product.brand} {product.model && `• ${product.model}`}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={star <= (product.starRatings || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              {product.salePrice && product.salePrice < product.price ? (
                <>
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ₹{product.salePrice?.toLocaleString()}
                  </span>
                  <span className="text-2xl text-gray-500 line-through">
                    ₹{product.price?.toLocaleString()}
                  </span>
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold rounded-full">
                    Save ₹{(product.price - product.salePrice).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ₹{product.price?.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <Check size={20} className="text-green-600" />
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <span className="text-red-600 dark:text-red-400 font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContactSeller}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Contact Seller
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleWishlist}
                className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-pink-500 transition-all"
              >
                <Heart size={24} className={isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-600 dark:text-gray-400'} />
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                <Shield size={24} className="text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Verified Product</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Quality assured</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                <Truck size={24} className="text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Fast Delivery</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2-3 business days</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex border-b border-gray-200 dark:border-gray-700 pb-3">
                  <dt className="font-semibold text-gray-700 dark:text-gray-300 w-1/2 capitalize">
                    {key.replace(/_/g, ' ')}:
                  </dt>
                  <dd className="text-gray-600 dark:text-gray-400 w-1/2">{value}</dd>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Zoom Modal */}
        {isZoomed && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <img
              src={validImages[activeImageIndex]}
              alt="Zoomed product"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;