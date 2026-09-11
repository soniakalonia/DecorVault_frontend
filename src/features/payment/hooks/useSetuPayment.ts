import { useInitiateSetuPaymentMutation, useVerifySetuPaymentMutation } from '@/store/api/setuApi';
import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux';
import { resetSetuPayment } from '@/store/slices/setuPayment';

export const useSetuPayment = () => {
  const dispatch = useAppDispatch();
  const [initiate, { isLoading: isInitiating }] = useInitiateSetuPaymentMutation();
  const [verify, { isLoading: isVerifying }] = useVerifySetuPaymentMutation();

  const setuState = useAppSelector((state) => state.setuPayment);

  const initiatePayment = async (orderId: number, amount: number, currency = 'INR') => {
    try {
      const result = await initiate({ orderId, amount, currency }).unwrap();
      if (result.success && result.data.paymentLink) {
        // Redirect to Setu payment page
        window.location.href = result.data.paymentLink;
        return { success: true, sessionId: result.data.sessionId };
      }
      return { success: false, error: result.message || 'Initiation failed' };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || error.message || 'Something went wrong',
      };
    }
  };

  const verifyPayment = async (sessionId: string, orderId?: number) => {
    try {
      // Build the request object conditionally
      const requestPayload: { sessionId: string; orderId?: number } = { sessionId };
      
      // Only add orderId if it's provided (not undefined)
      if (orderId !== undefined) {
        requestPayload.orderId = orderId;
      }

      const result = await verify(requestPayload).unwrap();
      if (result.success) {
        return { success: true, orderId: result.data.orderId };
      }
      return { success: false, error: result.message || 'Verification failed' };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || error.message || 'Verification error',
      };
    }
  };

  const reset = () => {
    dispatch(resetSetuPayment());
  };

  return {
    initiatePayment,
    verifyPayment,
    reset,
    isInitiating,
    isVerifying,
    state: setuState,
  };
};