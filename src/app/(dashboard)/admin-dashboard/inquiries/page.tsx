'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '@/components/common/Breadcrumb';
import { fetchBulkOrders, updateBulkOrderStatus } from '@/store/slices/bulkOrder';
import { AppDispatch, RootState } from '@/store/store';

export default function InquiriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { inquiries, fetchLoading, error } = useSelector((state: RootState) => state.bulkOrder);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchBulkOrders());
  }, [dispatch]);

  const handleStatusChange = (id: number, newStatus: string) => {
    dispatch(updateBulkOrderStatus({ id, status: newStatus }));
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex-1 min-w-0 p-6">
      <Breadcrumb />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-espresso">Bulk Order Inquiries</h1>

        {fetchLoading ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
            <p className="text-mocha-grey">Loading inquiries...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
            <p className="text-mocha-grey">No inquiries found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-border ">
            <div className="block sm:block overflow-x-auto lg3:overflow-visible">
              <table className="min-w-[900px] md:min-w-0 w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {inquiry.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{inquiry.email}</div>
                        <div>{inquiry.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {inquiry.product_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {inquiry.message || 'No message'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={inquiry.status}
                          onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                          className="text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="quoted">Quoted</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{new Date(inquiry.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit'
                        })}</div>
                        <div className="text-xs">{new Date(inquiry.created_at).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}