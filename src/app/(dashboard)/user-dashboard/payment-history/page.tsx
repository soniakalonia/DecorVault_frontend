'use client';
import Link from 'next/link';
import { useGetPaymentHistoryQuery } from '@/store/api/paymentApi';
import Icon from '@/components/ui/AppIcon';


export default function PaymentHistoryPage() {
  const { data, isLoading, error } = useGetPaymentHistoryQuery();

  const payments = data?.payments || [];

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { color: string; label: string }> = {
      paid: { color: 'bg-green-100 text-green-600', label: 'Paid' },
      pending: { color: 'bg-yellow-100 text-yellow-600', label: 'Pending' },
      failed: { color: 'bg-red-100 text-red-600', label: 'Failed' },
      refunded: { color: 'bg-orange-100 text-orange-600', label: 'Refunded' },
      cancelled: { color: 'bg-gray-100 text-gray-600', label: 'Cancelled' },
      expired: { color: 'bg-gray-100 text-gray-600', label: 'Expired' },
    };
    return configs[status] || { color: 'bg-gray-100 text-gray-600', label: status };
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A2A3A]">Payment History</h1>
        <p className="text-[#6B7280]">View all your past payments</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Icon name="ArrowPathIcon" size={32} className="animate-spin text-[#FF6B8A]" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          Failed to load payment history
        </div>
      ) : payments.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <Icon name="CreditCardIcon" size={48} className="mx-auto text-[#6B7280]" />
          <h3 className="mt-4 text-lg font-medium text-[#1A2A3A]">No payments yet</h3>
          <p className="mt-2 text-sm text-[#6B7280]">Your payment history will appear here</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-lg bg-[#FF6B8A] px-6 py-2 text-white transition-all hover:scale-[0.98]"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#6B7280]">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#6B7280]">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#6B7280]">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#6B7280]">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#6B7280]">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#6B7280]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => {
                const status = getStatusBadge(payment.status);
                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-[#1A2A3A]">
                      #{payment.order_number || payment.order_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#1A2A3A]">
                      ₹{parseFloat(payment.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6B7280]">
                      {payment.payment_method || payment.gateway}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6B7280]">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link
                        href={`/user-dashboard/orders`}
                        className="text-[#FF6B8A] transition-colors hover:underline"
                      >
                        View Order
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}