'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { usePayment } from '@/features/payment/hooks/usePayment';
import { useGetPaymentStatusQuery } from '@/store/api/paymentApi';
import Icon from '@/components/ui/AppIcon';

interface RazorpayPaymentProps {
  orderId: number;
  amount: number;
  currency?: string;
  onSuccess?: () => void;
  onFailure?: () => void;
}

export const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  orderId,
  amount,
  currency = 'INR',
  onSuccess,
  onFailure,
}) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const { initiate, isLoading, isRazorpayAvailable, error } = usePayment({
    onSuccess: () => {
      setIsProcessing(false);
      onSuccess?.();
    },
    onFailure: () => {
      setIsProcessing(false);
      onFailure?.();
    },
  });

  const { data: paymentStatusData } = useGetPaymentStatusQuery(
    orderId,
    { skip: !orderId }
  );

  const handlePayNow = async () => {
    setIsProcessing(true);
    const result = await initiate(orderId, amount, currency);
    if (!result) {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (paymentStatusData?.data?.status === 'paid') {
      toast.success('Payment already completed');
      router.push(`/payment/success?orderId=${orderId}`);
    }
  }, [paymentStatusData, router, orderId]);

  if (!isRazorpayAvailable()) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8">
        <Icon name="ArrowPathIcon" size={48} className="animate-spin text-[#FF6B8A]" />
        <p className="mt-4 text-[#6B7280]">Loading payment gateway...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#1A2A3A]">Payment Details</h3>
        <span className="rounded-full bg-[#FFE0E8] px-3 py-1 text-sm font-medium text-[#FF6B8A]">
          {currency}
        </span>
      </div>

      <div className="mb-6 rounded-lg bg-[#F5F5F7] p-4">
        <div className="flex items-center justify-between">
          <span className="text-[#6B7280]">Amount to Pay</span>
          <span className="text-2xl font-bold text-[#1A2A3A]">
            ₹{amount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <Icon name="LockClosedIcon" size={16} />
          <span>Your payment is secure with Razorpay</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <Icon name="CreditCardIcon" size={16} />
          <span>We accept all major cards, UPI, and Net Banking</span>
        </div>
      </div>

      <button
        onClick={handlePayNow}
        disabled={isLoading || isProcessing}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF6B8A] px-6 py-3 text-white transition-all duration-200 hover:scale-[0.98] hover:bg-[#e85a7a] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading || isProcessing ? (
          <>
            <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Icon name="ShieldCheckIcon" size={20} />
            <span>Pay ₹{amount.toFixed(2)}</span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          <p>{error}</p>
        </div>
      )}

      <div className="mt-4 flex justify-center gap-4 border-t border-gray-100 pt-4 text-xs text-[#6B7280]">
        <span>🔒 Secure</span>
        <span>🛡️ PCI Compliant</span>
        <span>⚡ Instant</span>
      </div>
    </div>
  );
};

export default RazorpayPayment;