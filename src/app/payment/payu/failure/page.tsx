'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

function PayUFailureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const txnid = searchParams.get('txnid');
  const reason = searchParams.get('reason');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="XCircleIcon" size={40} className="text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-6">
          {reason
            ? decodeURIComponent(reason)
            : 'Your payment could not be processed. Please try again.'}
        </p>

        {(orderId || txnid) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-1">
            {orderId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID</span>
                <span className="font-semibold text-gray-900">#{orderId}</span>
              </div>
            )}
            {txnid && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono text-xs text-gray-900">
                  {txnid.slice(0, 20)}...
                </span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push('/checkout-process')}
            className="block w-full py-3 bg-[#D4AF37] text-white font-medium rounded-lg hover:bg-[#C5A035] transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="block w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PayUFailurePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div>
        </div>
      }
    >
      <PayUFailureContent />
    </Suspense>
  );
}