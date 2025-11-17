// FILE PURPOSE:
// - Bulk order request form for business customers
// - Collect product requirements and quantity
// - Submit order request to admin for processing

import { useState } from 'react';
import { Package, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { firestoreHelpers, collections } from '../config/firestore';

const BulkOrder = () => {
  const { currentUser, userProfile } = useAuth();
  const [formData, setFormData] = useState({
    productType: '',
    quantity: '',
    budget: '',
    purpose: '',
    specifications: '',
    deadline: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please login to submit bulk order request');
      return;
    }

    setSubmitting(true);
    try {
      await firestoreHelpers.createDocument(collections.orders, {
        userId: currentUser.uid,
        userName: userProfile?.name || currentUser.displayName,
        userEmail: currentUser.email,
        ...formData,
        status: 'pending',
        paid: false,
        logs: [{ status: 'pending', timestamp: new Date(), note: 'Bulk order request submitted' }],
      });
      setSuccess(true);
      setFormData({
        productType: '',
        quantity: '',
        budget: '',
        purpose: '',
        specifications: '',
        deadline: '',
      });
    } catch (error) {
      console.error('Error submitting bulk order:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Bulk Order Request</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill out the form below to request a quote for bulk laptop purchases. Our team will get back to you within 24 hours.
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
            <p className="font-medium">Request submitted successfully!</p>
            <p className="text-sm">We'll contact you within 24 hours with a quote.</p>
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Type *
              </label>
              <input
                type="text"
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                className="input"
                placeholder="e.g., Business Laptops, Workstations"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="input"
                  placeholder="Number of units"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget per Unit (₹) *
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="input"
                  placeholder="Budget per laptop"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Purpose *
              </label>
              <input
                type="text"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="input"
                placeholder="e.g., Office work, Development, Design"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specifications & Requirements
              </label>
              <textarea
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                className="input"
                rows="4"
                placeholder="Any specific requirements (processor, RAM, storage, etc.)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expected Delivery Date
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full flex items-center justify-center"
            >
              {submitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send size={20} className="mr-2" />
                  Submit Request
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkOrder;