'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { syncCart } from '@/store/slices/cart';
import { useAppDispatch } from '@/lib/hooks/redux';
import { setPayUSuccess, setPayUFailed } from '@/store/slices/payuPayment';

function PayUSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const rootDispatch = useDispatch();

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
    'loading',
  );
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const txnid = searchParams.get('txnid');
    const orderIdParam = searchParams.get('orderId')
      ? Number(searchParams.get('orderId'))
      : undefined;
    const simulated = searchParams.get('simulated') === 'true';

    if (orderIdParam) setOrderId(orderIdParam);

    if (!txnid && !orderIdParam) {
      setStatus('failed');
      setMessage('Missing transaction ID. Verification cannot proceed.');
      return;
    }

    // ─── SIMULATED FLOW ───
    if (simulated) {
      setStatus('success');
      setMessage('Your payment was completed successfully (test mode).');
      dispatch(setPayUSuccess());
      rootDispatch(syncCart([]));
      return;
    }

    // ─── REAL FLOW: fetch payment status from backend DB ───
    if (!orderIdParam) {
      setStatus('failed');
      setMessage('Missing orderId. Cannot confirm payment status.');
      dispatch(setPayUFailed('Missing orderId'));
      return;
    }

    let cancelled = false;

    const checkStatus = async () => {
      try {
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('token')
            : null;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payment/payu/status/${orderIdParam}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );

        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        const paymentStatus =
          data?.data?.status || data?.data?.paymentStatus || data?.status;

        if (paymentStatus === 'paid' || paymentStatus === 'SUCCESS') {
          setStatus('success');
          setMessage('Your payment was completed successfully.');
          dispatch(setPayUSuccess());
          rootDispatch(syncCart([]));
        } else if (
          paymentStatus === 'failed' ||
          paymentStatus === 'FAILED'
        ) {
          setStatus('failed');
          setMessage('Payment failed. Please try again.');
          dispatch(setPayUFailed('Payment failed'));
        } else {
          // pending — poll once more after 2s
          setTimeout(checkStatus, 2000);
        }
      } catch (err: any) {
        if (cancelled) return;
        setStatus('failed');
        const msg = err?.message || 'Could not fetch payment status';
        setMessage(msg);
        dispatch(setPayUFailed(msg));
      }
    };

    checkStatus();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ─── Auto-redirect countdown on success ───
  useEffect(() => {
    if (status !== 'success') return;

    const timer = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  // Separate effect: navigate when countdown hits 0
  useEffect(() => {
    if (status === 'success' && countdown === 0) {
      router.push('/');
    }
  }, [countdown, status, router]);

  // ─── Confirming ───
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FAFAFA]">
        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-[#1A2A3A]">
          Confirming your payment...
        </p>
        <p className="text-sm text-[#6B7280]">
          Please wait while we confirm the transaction.
        </p>
      </div>
    );
  }

  // ─── Success ───
  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FAFAFA]">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg">
          ✓
        </div>

        <h1 className="text-3xl font-heading font-bold text-green-600 mb-2">
          Payment Successful!
        </h1>
        <p className="text-[#6B7280] text-center max-w-md mb-2">{message}</p>
        <p className="text-base font-medium text-[#1A2A3A] text-center mb-8">
          Your order has been placed 🎉
        </p>

        <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-[#1A2A3A] mb-3 uppercase tracking-wide">
            Order Details
          </h3>
          <div className="space-y-2 text-sm">
            {orderId && (
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Order ID</span>
                <span className="font-semibold text-[#1A2A3A]">
                  #{orderId}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Payment Status</span>
              <span className="font-medium text-green-600">Paid</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Payment Method</span>
              <span className="font-medium text-[#1A2A3A]">PayU</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Order Status</span>
              <span className="font-medium text-blue-600">Confirmed</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-[#9CA3AF] mt-6">
          Redirecting to home in{' '}
          <span className="font-semibold text-[#D4AF37]">{countdown}s</span>...
        </p>

        <div className="mt-4">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#FFF8F0] transition"
          >
            Go Home Now
          </button>
        </div>
      </div>
    );
  }

  // ─── Failure ───
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

export default function PayUSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FAFAFA]">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-[#1A2A3A]">Loading...</p>
        </div>
      }
    >
      <PayUSuccessContent />
    </Suspense>
  );
}