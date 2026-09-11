import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '@/store/store';
import {
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
} from '@/store/api/paymentApi';
import {
  startPayment,
  paymentPending,
  paymentSuccess,
  paymentFailed,
  resetPayment,
  setRazorpayOrderId,
} from '@/store/slices/payment';

// Simple Razorpay loader
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const isRazorpayLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).Razorpay;
};

const getRazorpayInstance = (): any => {
  if (typeof window !== 'undefined' && (window as any).Razorpay) {
    return (window as any).Razorpay;
  }
  return null;
};

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

  const isRazorpayAvailable = (): boolean => {
    return scriptLoaded && isRazorpayLoaded();
  };

  const initiate = async (orderId: number, amount: number, currency: string = 'INR') => {
    if (!isRazorpayAvailable()) {
      toast.error('Payment gateway is loading. Please try again.');
      return false;
    }

    setIsLoading(true);
    dispatch(startPayment({ orderId }));

    try {
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

      const razorpay = getRazorpayInstance();
      if (!razorpay) {
        throw new Error('Razorpay SDK not available');
      }

      const options = {
        key: keyId,
        amount: razorpayOrder.amount * 100,
        currency: razorpayOrder.currency,
        name: 'DecorVault',
        description: `Order #${orderId}`,
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
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
            dispatch(paymentFailed('Payment cancelled by user'));
            toast.info('Payment cancelled');
            setIsLoading(false);
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
        method: {
          upi: true,
          netbanking: true,
          card: true,
          wallet: true,
          paylater: true,
        },
        upi: {
          flow: 'collect',  // 'collect' or 'intent'
        },
      };

      const razorpayInstance = new razorpay(options);
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
        router.push(
        `/payment/razorpay-success?orderId=${data.orderId}&razorpay_payment_id=${data.razorpay_payment_id}&razorpay_order_id=${data.razorpay_order_id}&razorpay_signature=${data.razorpay_signature}`
      );
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
      router.push(`/payment/failure?orderId=${data.orderId}&error=${encodeURIComponent(errorMessage)}`);
    }
  };

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