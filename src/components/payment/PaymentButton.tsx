'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Icon from '@/components/ui/AppIcon';
import { useInitiatePaymentMutation } from '@/store/api/paymentApi';

interface PaymentButtonProps {
  orderId: number;
  amount: number;
  currency?: string;
  className?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  orderId,
  amount,
  currency = 'INR',
  className = '',
  onSuccess,
  onError,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [initiatePayment] = useInitiatePaymentMutation();

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const result = await initiatePayment({
        orderId,
        amount,
        currency,
        paymentMethod: 'razorpay',
      }).unwrap();

      if (result.success) {
        // Redirect to payment page with order details
        router.push(
          `/payment?orderId=${orderId}&razorpayOrderId=${result.data.razorpayOrder.id}&amount=${amount}`
        );
        onSuccess?.(result);
      } else {
        throw new Error(result.message || 'Failed to initiate payment');
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Payment initiation failed';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {isLoading ? (
        <>
          <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          <Icon name="ShoppingBagIcon" size={20} />
          <span>Pay ₹{amount.toFixed(2)}</span>
        </>
      )}
    </button>
  );
};

export default PaymentButton;