'use client';

import { useState } from 'react';
import { useInitiateSetuPaymentMutation } from '@/store/api/setuApi';
import { useAppDispatch } from '@/lib/hooks/redux';
import { initiateSetuPayment } from '@/store/slices/setuPayment';

interface SetuPaymentButtonProps {
  orderId: number;
  amount: number;
  currency?: string;
  className?: string;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: string) => void;
}

export const SetuPaymentButton: React.FC<SetuPaymentButtonProps> = ({
  orderId,
  amount,
  currency = 'INR',
  className = '',
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [initiatePayment] = useInitiateSetuPaymentMutation();
  const dispatch = useAppDispatch();

  const handlePay = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await initiatePayment({
        orderId,
        amount,
        currency,
      }).unwrap();

      if (result.success && result.data.paymentLink) {
        // Store session info in Redux
        dispatch(initiateSetuPayment({
          sessionId: result.data.sessionId,
          paymentLink: result.data.paymentLink,
        }));

        // Redirect user to Setu payment page
        window.location.href = result.data.paymentLink;
        onSuccess?.(result.data.sessionId);
      } else {
        throw new Error(result.message || 'Payment initiation failed');
      }
    } catch (error: any) {
      const errorMsg = error.data?.message || error.message || 'Something went wrong';
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={isLoading}
      className={`w-full py-3 px-6 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C5A035] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <span>Pay with Setu</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </>
      )}
    </button>
  );
};