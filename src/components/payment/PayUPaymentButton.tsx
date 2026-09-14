'use client';

import { useState } from 'react';
import { useInitiatePayUPaymentMutation } from '@/store/api/payuApi';
import { useAppDispatch } from '@/lib/hooks/redux';
import { initiatePayUPayment } from '@/store/slices/payuPayment';
import PayUPaymentForm from './PayUPaymentForm';

interface PayUPaymentButtonProps {
  orderId: number;
  amount: number;
  currency?: string;
  className?: string;
  onSuccess?: (txnid: string) => void;
  onError?: (error: string) => void;
}

export const PayUPaymentButton: React.FC<PayUPaymentButtonProps> = ({
  orderId,
  amount,
  currency = 'INR',
  className = '',
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [payuForm, setPayuForm] = useState<{
    action: string;
    fields: any;
  } | null>(null);

  const [initiatePayment] = useInitiatePayUPaymentMutation();
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

      if (result.success && result.data.payuForm) {
        dispatch(
          initiatePayUPayment({
            txnid: result.data.txnid,
            paymentId: result.data.paymentId,
          }),
        );

        // Set form data — the PayUPaymentForm will auto-submit on render
        setPayuForm({
          action: result.data.payuForm.action,
          fields: result.data.payuForm.fields,
        });

        onSuccess?.(result.data.txnid);
      } else {
        throw new Error(result.message || 'Payment initiation failed');
      }
    } catch (error: any) {
      const errorMsg =
        error.data?.message || error.message || 'Something went wrong';
      onError?.(errorMsg);
      setIsLoading(false);
    }
  };

  // Once we have the form data, render the hidden auto-submitting form
  if (payuForm) {
    return (
      <PayUPaymentForm action={payuForm.action} fields={payuForm.fields} />
    );
  }

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
          <span>Pay with PayU</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </>
      )}
    </button>
  );
};

export default PayUPaymentButton;