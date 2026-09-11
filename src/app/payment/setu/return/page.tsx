'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVerifySetuPaymentMutation } from '@/store/api/setuApi';
import { useAppDispatch } from '@/lib/hooks/redux';
import { setSetuSuccess, setSetuFailed } from '@/store/slices/setuPayment';

function SetuReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [verifyPayment, { isLoading }] = useVerifySetuPaymentMutation();

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('sessionId') || searchParams.get('id');
    const orderId = searchParams.get('orderId') ? Number(searchParams.get('orderId')) : undefined;
    const statusParam = searchParams.get('status');

    // If Setu returned an error status, handle it quickly
    if (statusParam === 'FAILED') {
      setStatus('failed');
      setMessage('Payment was cancelled or failed at Setu.');
      dispatch(setSetuFailed('Payment failed at gateway'));
      return;
    }

    if (!sessionId) {
      setStatus('failed');
      setMessage('Missing session ID. Payment verification cannot proceed.');
      return;
    }

    // ✅ Build the request object conditionally
    const verifyRequest: any = { sessionId };
    if (orderId !== undefined) {
      verifyRequest.orderId = orderId;
    }

    // Call backend verification
    verifyPayment(verifyRequest)
      .unwrap()
      .then((result) => {
        if (result.success) {
          setStatus('success');
          setMessage('Payment successful!');
          dispatch(setSetuSuccess());
          // Redirect to order confirmation after short delay
          setTimeout(() => {
            router.push(`/orders/${result.data.orderId}`);
          }, 3000);
        } else {
          setStatus('failed');
          setMessage(result.message || 'Payment verification failed');
          dispatch(setSetuFailed(result.message || 'Verification failed'));
        }
      })
      .catch((error) => {
        setStatus('failed');
        setMessage(error.data?.message || 'Verification error');
        dispatch(setSetuFailed(error.data?.message || 'Verification error'));
      });
  }, [searchParams, verifyPayment, dispatch, router]);

  // Render loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FAFAFA]">
        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-[#1A2A3A]">Verifying your payment...</p>
        <p className="text-sm text-[#6B7280]">Please wait while we confirm your transaction.</p>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FAFAFA]">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg">
          ✓
        </div>
        <h1 className="text-3xl font-heading font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-[#6B7280] text-center max-w-md">{message}</p>
        <p className="text-sm text-[#9CA3AF] mt-4">Redirecting to order details...</p>
        <button
          onClick={() => router.push('/orders')}
          className="mt-6 px-6 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A035] transition"
        >
          View My Orders
        </button>
      </div>
    );
  }

  // Failure state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FAFAFA]">
      <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg">
        ✕
      </div>
      <h1 className="text-3xl font-heading font-bold text-red-600 mb-2">Payment Failed</h1>
      <p className="text-[#6B7280] text-center max-w-md">{message || 'There was an issue processing your payment.'}</p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => router.push('/cart')}
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

export default function SetuReturnPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FAFAFA]">
        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-[#1A2A3A]">Loading payment verification...</p>
        <p className="text-sm text-[#6B7280]">Please wait...</p>
      </div>
    }>
      <SetuReturnContent />
    </Suspense>
  );
}