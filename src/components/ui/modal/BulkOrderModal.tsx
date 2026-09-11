'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '@/components/ui/AppIcon';
import { useBulkOrder } from './BulkOrderContext';
import { submitBulkOrder, resetBulkOrder } from '@/store/slices/bulkOrder';
import { AppDispatch, RootState } from '@/store/store';

const BulkOrderModal = () => {
  const { isOpen, productName, closeModal } = useBulkOrder();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, error } = useSelector((state: RootState) => state.bulkOrder);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(submitBulkOrder({ ...formData, productName })).unwrap();
      setFormData({ name: '', email: '', number: '', message: '' });
      setTimeout(() => {
        closeModal();
        dispatch(resetBulkOrder());
      }, 2000);
    } catch (error) {
      console.error('Failed to submit bulk order:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Bulk Order Request</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>
        
        <div className="mb-4 rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-600">Product:</p>
          <p className="font-medium">{productName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-amber-700 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-amber-700 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-amber-700 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <textarea
              placeholder="Message (quantity, requirements, etc.)"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-amber-700 focus:outline-none"
              rows={3}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-700 py-2 font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
          
          {success && (
            <div className="mt-2 text-center text-sm text-green-600">
              Request submitted successfully!
            </div>
          )}
          
          {error && (
            <div className="mt-2 text-center text-sm text-red-600">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BulkOrderModal;