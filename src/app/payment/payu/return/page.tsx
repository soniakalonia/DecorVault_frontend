'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVerifyPayUPaymentMutation } from '@/store/api/payuApi';
import { useAppDispatch } from '@/lib/hooks/redux';
import { setPayUSuccess, setPayUFailed } from '@/store/slices/payuPayment';
import { useDispatch } from 'react-redux';
import { syncCart } from '@/store/slices/cart';

function PayUReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const rootDispatch = useDispatch();
  const [verifyPayment, { isLoading }] = useVerifyPayUPaymentMutation();

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
    'loading',
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const txnid = searchParams.get('txnid');
    const statusParam = searchParams.get('status');

    if (!txnid) {
      setStatus('failed');
      setMessage('Missing transaction ID.');
      return;
    }

    const payload: Record<string, any> = { txnid };
    searchParams.forEach((value, key) => {
      payload[key] = value;
    });

    verifyPayment(payload)
      .unwrap()
      .then((result) => {
        if (result.success) {
          setStatus('success');
          setMessage('Payment verified successfully!');
          dispatch(setPayUSuccess());
          rootDispatch(syncCart([]));

          setTimeout(() => {
            router.push(`/orders/${result.data.orderId}`);
          }, 3000);
        } else {
          // If verification fails but PayU reports success, still route to success page
          if (statusParam === 'success') {
            router.replace(`/payment/payu/success?txnid=${txnid}`);
            return;
          }
          setStatus('failed');
          setMessage(result.message || 'Payment verification failed');
          dispatch(setPayUFailed(result.message || 'Verification failed'));
        }
      })
      .catch((error) => {
        setStatus('failed');
        const msg =
          error.data?.message || error.message || 'Verification error';
        setMessage(msg);
        dispatch(setPayUFailed(msg));
      });
  }, [searchParams, verifyPayment, dispatch, rootDispatch, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FAFAFA]">
        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-[#1A2A3A]">
          Verifying your payment...
        </p>
        <p className="text-sm text-[#6B7280]">Please wait...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FAFAFA]">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg">
          ✓
        </div>
        <h1 className="text-3xl font-heading font-bold text-green-600 mb-2">
          Payment Successful!
        </h1>
        <p className="text-[#6B7280] text-center max-w-md">{message}</p>
        <p className="text-sm text-[#9CA3AF] mt-4">
          Redirecting to order details...
        </p>
        <button
          onClick={() => router.push('/orders')}
          className="mt-6 px-6 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A035] transition"
        >
          View My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FAFAFA]">
      <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg">
        ✕
      </div>
      <h1 className="text-3xl font-heading font-bold text-red-600 mb-2">
        Payment Failed
      </h1>
      <p className="text-[#6B7280] text-center max-w-md">
        {message || 'There was an issue processing your payment.'}
      </p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => router.push('/checkout-process')}
          className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A035] transition"
        >
          Try Again
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#FFF8F0] transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default function PayUReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FAFAFA]">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-[#1A2A3A]">
            Loading payment verification...
          </p>
        </div>
      }
    >
      <PayUReturnContent />
    </Suspense>
  );
}