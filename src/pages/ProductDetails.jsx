// FILE PURPOSE:
// - Product details page with full information
// - Display product images, specifications, and pricing
// - Add to wishlist and contact seller functionality
// - Show related products

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, MessageCircle, ShoppingCart, Star, Shield, Truck } from 'lucide-react';
import { useProducts } from '../contexts/ProductsContext';
import { useAuth } from '../contexts/AuthContext';
import ProductGallery from '../components/common/ProductGallery';
import ProductCard from '../components/common/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const { getProductById, products } = useProducts();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        
        // Get related products
        const related = products
          .filter(p => p.category === data.category && p.id !== id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
          <Link to="/products" className="text-primary-600 hover:underline">Browse all products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Gallery */}
          <div>
            <ProductGallery images={product.images || []} />
          </div>

          {/* Details */}
          <div>
            <div className="mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{product.category}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {product.title}
            </h1>
            <div className="flex items-center mb-6">
              <div className="flex items-center mr-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={star <= (product.starRatings || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                ₹{product.price?.toLocaleString()}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {product.shortDescription || 'No description available'}
            </p>

            <div className="flex gap-4 mb-8">
              <button className="btn btn-primary flex-1">
                <MessageCircle size={20} className="mr-2" />
                Contact Seller
              </button>
              <button className="btn btn-outline">
                <Heart size={20} />
              </button>
            </div>

            {/* Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Specifications</h3>
                <dl className="space-y-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex">
                      <dt className="font-medium text-gray-700 dark:text-gray-300 w-1/3">{key}:</dt>
                      <dd className="text-gray-600 dark:text-gray-400 w-2/3">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;