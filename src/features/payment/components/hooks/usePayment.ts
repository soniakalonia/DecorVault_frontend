import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '@/store/store';
import { useInitiatePaymentMutation, useVerifyPaymentMutation } from '@/store/api/paymentApi';
import {
  startPayment,
  paymentPending,
  paymentSuccess,
  paymentFailed,
  resetPayment,
  setRazorpayOrderId,
} from '@/store/slices/payment';
import {
  loadRazorpayScript,
  isRazorpayLoaded,
  getRazorpayInstance,
} from '../../utils/razorpayLoader';
import { validateAmount, validateOrderId } from '../../utils/paymentValidator';
import { config } from '@/config/env';

interface UsePaymentOptions {
  onSuccess?: (orderId: number) => void;
  onFailure?: (error: string) => void;
}

export const usePayment = (options: UsePaymentOptions = {}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const { currentOrderId, paymentStatus, error } = useSelector((state: RootState) => state.payment);

  const [initiatePayment] = useInitiatePaymentMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  // Load Razorpay script on mount
  useEffect(() => {
    const loadScript = async () => {
      const loaded = await loadRazorpayScript();
      setScriptLoaded(loaded);
      if (!loaded) {
        console.error('Failed to load Razorpay script');
      }
    };
    loadScript();
  }, []);

  // Check if Razorpay is available
  const isRazorpayAvailable = (): boolean => {
    return scriptLoaded && isRazorpayLoaded();
  };

  // Initiate payment
  const initiate = async (orderId: number, amount: number, currency: string = 'INR') => {
    // Validate inputs
    const amountValidation = validateAmount(amount);
    if (!amountValidation.valid) {
      toast.error(amountValidation.message || 'Invalid amount');
      return false;
    }

    const orderValidation = validateOrderId(orderId);
    if (!orderValidation.valid) {
      toast.error(orderValidation.message || 'Invalid order');
      return false;
    }

    // Check Razorpay availability
    if (!isRazorpayAvailable()) {
      toast.error('Payment gateway is loading. Please try again.');
      return false;
    }

    setIsLoading(true);
    dispatch(startPayment({ orderId }));

    try {
      // Step 1: Initiate payment on backend
      const result = await initiatePayment({
        orderId,
        amount,
        currency,
        paymentMethod: 'razorpay',
      }).unwrap();

      if (!result.success) {
        throw new Error(result.message || 'Failed to initiate payment');
      }

      const { razorpayOrder, keyId } = result.data;
      dispatch(setRazorpayOrderId(razorpayOrder.id));

      // Step 2: Open Razorpay checkout
      const razorpay = getRazorpayInstance();
      if (!razorpay) {
        throw new Error('Razorpay SDK not available');
      }

      // Use a different variable name to avoid conflict
      const razorpayOptions = {
        key: keyId,
        amount: razorpayOrder.amount * 100, // Convert to paise
        currency: razorpayOrder.currency,
        name: 'DecorVault',
        description: `Order #${orderId}`,
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          // Payment successful - verify
          dispatch(paymentPending());
          await verify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId,
          });
        },
        modal: {
          ondismiss: () => {
            // User closed the modal
            dispatch(paymentFailed('Payment cancelled by user'));
            toast.info('Payment cancelled');
            setIsLoading(false);
            // Now 'options' correctly refers to the function parameter
            options.onFailure?.('Payment cancelled by user');
          },
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#FF6B8A',
        },
      };

      const razorpayInstance = new razorpay(razorpayOptions);
      razorpayInstance.open();

      return true;
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      const errorMessage = error?.data?.message || error?.message || 'Payment initiation failed';
      dispatch(paymentFailed(errorMessage));
      toast.error(errorMessage);
      options.onFailure?.(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  // Verify payment
  const verify = async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: number;
  }) => {
    try {
      const result = await verifyPayment(data).unwrap();

      if (result.success) {
        dispatch(paymentSuccess());
        toast.success('Payment successful!');
        setIsLoading(false);
        options.onSuccess?.(data.orderId);

        // Redirect to success page
        router.push(`${config.payment.successUrl}?orderId=${data.orderId}`);
      } else {
        throw new Error(result.message || 'Payment verification failed');
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      const errorMessage = error?.data?.message || error?.message || 'Payment verification failed';
      dispatch(paymentFailed(errorMessage));
      toast.error(errorMessage);
      setIsLoading(false);
      options.onFailure?.(errorMessage);

      // Redirect to failure page
      router.push(
        `${config.payment.failureUrl}?orderId=${data.orderId}&error=${encodeURIComponent(errorMessage)}`
      );
    }
  };

  // Reset payment state
  const reset = () => {
    dispatch(resetPayment());
    setIsLoading(false);
  };

  return {
    initiate,
    verify,
    reset,
    isLoading,
    isRazorpayAvailable,
    paymentStatus,
    currentOrderId,
    error,
    scriptLoaded,
  };
};