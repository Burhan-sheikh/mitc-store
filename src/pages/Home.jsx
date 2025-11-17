// FILE PURPOSE:
// - Homepage with hero section, featured products, and store highlights
// - Display promotional banners and store information
// - Showcase popular categories and recent products

import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, HeadphonesIcon, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '../contexts/ProductsContext';
import ProductCard from '../components/common/ProductCard';

const Home = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 4);

  const features = [
    { icon: Shield, title: 'Quality Assured', description: 'Verified and tested products' },
    { icon: Truck, title: 'Fast Delivery', description: 'Quick and secure shipping' },
    { icon: HeadphonesIcon, title: '24/7 Support', description: 'Always here to help' },
    { icon: Award, title: 'Best Prices', description: 'Competitive pricing guaranteed' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMTZjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] animate-gradient"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Premium Commercial &<br />Business-Class Laptops
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover high-quality import and commercial laptops for your business needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn bg-white text-primary-700 hover:bg-primary-50 px-8 py-3 text-lg">
                Browse Products <ArrowRight className="inline ml-2" size={20} />
              </Link>
              <Link to="/bulk-order" className="btn btn-outline border-white text-white hover:bg-white/10 px-8 py-3 text-lg">
                Bulk Orders
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                  <feature.icon className="text-primary-600 dark:text-primary-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
              View All <ArrowRight className="inline ml-1" size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Bulk Orders?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get special pricing and dedicated support for your business laptop requirements.
          </p>
          <Link to="/bulk-order" className="btn bg-white text-primary-700 hover:bg-primary-50 px-8 py-3 text-lg">
            Request Quote
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;