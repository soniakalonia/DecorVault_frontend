import { useState } from 'react';
import { toast } from 'react-toastify';
import { useVerifyPaymentMutation } from '@/store/api/paymentApi';

interface WebhookCheckOptions {
  orderId: number;
  onSuccess?: (data: any) => void;
  onFailure?: (error: string) => void;
}

export const useWebhook = (options: WebhookCheckOptions) => {
  const [isChecking, setIsChecking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [verifyPayment] = useVerifyPaymentMutation();

  // Check payment status via webhook
  const checkPaymentStatus = async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    setIsChecking(true);
    setAttempts((prev) => prev + 1);

    try {
      const result = await verifyPayment({
        ...paymentData,
        orderId: options.orderId,
      }).unwrap();

      if (result.success) {
        toast.success('Payment verified successfully!');
        options.onSuccess?.(result);
        return true;
      } else {
        throw new Error(result.message || 'Payment verification failed');
      }
    } catch (error: any) {
      console.error('Webhook check failed:', error);
      
      // Retry up to 3 times
      if (attempts < 3) {
        setTimeout(() => {
          checkPaymentStatus(paymentData);
        }, 2000 * attempts);
        return false;
      }

      const errorMessage = error?.data?.message || error?.message || 'Payment verification failed';
      toast.error(errorMessage);
      options.onFailure?.(errorMessage);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkPaymentStatus,
    isChecking,
    attempts,
  };
};