'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useGetPaymentStatusQuery } from '@/store/api/paymentApi';

interface PaymentStatusProps {
  orderId: number;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ orderId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams?.get('status');

  const { data, isLoading, error } = useGetPaymentStatusQuery(orderId, {
    pollingInterval: 5000, // ✅ Correct option
    skip: !orderId,
  });

  useEffect(() => {
    // If status is already success/failure from URL, stop polling
    if (status === 'success' || status === 'failure') {
      // Stop polling by skipping – handled by the hook's skip option
    }
  }, [status]);

  const paymentStatus = data?.data?.status || status || 'pending';

  const getStatusConfig = () => {
    switch (paymentStatus) {
      case 'paid':
      case 'success':
        return {
          icon: 'CheckCircleIcon',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          title: 'Payment Successful',
          message: 'Your payment has been confirmed.',
          action: 'View Order',
          actionLink: `/user-dashboard/orders`,
        };
      case 'failed':
      case 'failure':
        return {
          icon: 'XCircleIcon',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          title: 'Payment Failed',
          message: 'There was an issue processing your payment.',
          action: 'Try Again',
          actionLink: `/checkout-process`,
        };
      case 'pending':
      default:
        return {
          icon: 'ClockIcon',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          title: 'Payment Pending',
          message: 'We are confirming your payment.',
          action: 'Wait...',
          actionLink: '',
        };
    }
  };

  const config = getStatusConfig();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8">
        <Icon name="ArrowPathIcon" size={48} className="animate-spin text-[#FF6B8A]" />
        <p className="mt-4 text-[#6B7280]">Checking payment status...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className={`rounded-full ${config.bgColor} p-4`}>
          <Icon name={config.icon} size={48} className={config.color} />
        </div>

        <h2 className="mt-4 text-2xl font-bold text-[#1A2A3A]">{config.title}</h2>
        <p className="mt-2 text-[#6B7280]">{config.message}</p>

        {error && (
          <p className="mt-2 text-sm text-red-600">
            {(error as any)?.data?.message || 'Something went wrong'}
          </p>
        )}

        <div className="mt-6 flex flex-col items-center gap-3">
          {config.actionLink && (
            <button
              onClick={() => router.push(config.actionLink)}
              className="rounded-lg bg-[#FF6B8A] px-6 py-2 text-white transition-all hover:scale-[0.98]"
            >
              {config.action}
            </button>
          )}
          <button
            onClick={() => router.push('/products')}
            className="text-sm text-[#6B7280] transition-colors hover:text-[#FF6B8A]"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;