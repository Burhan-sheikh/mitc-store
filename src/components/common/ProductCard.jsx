// FILE PURPOSE:
// - Display product information in card format
// - Show product image, title, price, and rating
// - Handle click to navigate to product details
// - Wishlist toggle button for logged-in users

import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { currentUser } = useAuth();

  const toggleWishlist = (e) => {
    e.preventDefault();
    if (!currentUser) {
      // Show login modal
      return;
    }
    setIsWishlisted(!isWishlisted);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card card-hover relative overflow-hidden group"
    >
      <Link to={`/product/${product.id}`}>
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart
              size={20}
              className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}
            />
          </button>

          {/* Condition Badge */}
          {product.condition && (
            <div className="absolute top-2 left-2 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
              {product.condition}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 line-clamp-2">
            {product.title}
          </h3>
          
          {product.brand && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {product.brand} {product.model && `• ${product.model}`}
            </p>
          )}

          {/* Rating */}
          {product.starRatings > 0 && (
            <div className="flex items-center mb-2">
              <Star size={16} className="fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.starRatings.toFixed(1)} ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(product.price)}
            </span>
            {product.category && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {product.category}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;