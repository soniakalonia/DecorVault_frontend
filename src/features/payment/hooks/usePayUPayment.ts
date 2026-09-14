'use client';

import { useInitiatePayUPaymentMutation, useVerifyPayUPaymentMutation } from '@/store/api/payuApi';
import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux';
import { resetPayUPayment, initiatePayUPayment as setInitiatePayU } from '@/store/slices/payuPayment';
import { validatePayUAmount, validatePayUForm } from '../utils/payuValidator';

export const usePayUPayment = () => {
  const dispatch = useAppDispatch();
  const [initiate, { isLoading: isInitiating }] = useInitiatePayUPaymentMutation();
  const [verify, { isLoading: isVerifying }] = useVerifyPayUPaymentMutation();

  const payuState = useAppSelector((state) => state.payuPayment);

  /**
   * Initiate PayU payment.
   * Returns the payuForm object (action + fields) so the caller can
   * render a hidden form and auto-submit it.
   */
  const initiatePayment = async (
    orderId: number,
    amount: number,
    currency = 'INR',
    productInfo?: string,
  ) => {
    if (!validatePayUAmount(amount)) {
      return { success: false, error: 'Invalid amount' };
    }

    try {
      const result = await initiate({
        orderId,
        amount,
        currency,
        productInfo,
      }).unwrap();

      if (result.success && validatePayUForm(result.data.payuForm)) {
        // Store txnid + paymentId in Redux
        dispatch(
          setInitiatePayU({
            txnid: result.data.txnid,
            paymentId: result.data.paymentId,
          }),
        );

        return {
          success: true,
          txnid: result.data.txnid,
          paymentId: result.data.paymentId,
          payuForm: result.data.payuForm,
        };
      }

      return { success: false, error: result.message || 'Initiation failed' };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.data?.message || error.message || 'Something went wrong',
      };
    }
  };

  /**
   * Verify PayU payment after redirect.
   * `payload` is the full query/body object from PayU.
   */
  const verifyPayment = async (payload: Record<string, any>) => {
    try {
      if (!payload?.txnid) {
        return { success: false, error: 'Missing txnid' };
      }

      const result = await verify(payload).unwrap();

      if (result.success) {
        return {
          success: true,
          orderId: result.data.orderId,
          paymentId: result.data.paymentId,
        };
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
    dispatch(resetPayUPayment());
  };

  return {
    initiatePayment,
    verifyPayment,
    reset,
    isInitiating,
    isVerifying,
    state: payuState,
  };
};