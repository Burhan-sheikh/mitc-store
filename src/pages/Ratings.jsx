// FILE PURPOSE:
// - Display all store and product ratings
// - Show overall store rating and individual product reviews
// - Allow logged-in users to submit ratings

import { Star } from 'lucide-react';

const Ratings = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Store Ratings</h1>
        <div className="card text-center">
          <div className="mb-4">
            <div className="flex items-center justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={32} className="fill-yellow-400 text-yellow-400 mx-1" />
              ))}
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">4.8 out of 5</p>
            <p className="text-gray-600 dark:text-gray-400">Based on 256 reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ratings;