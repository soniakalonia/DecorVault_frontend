'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import RazorpayPayment from '@/components/payment/RazorpayPayment';
import PaymentSummary from '@/components/payment/PaymentSummary';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'react-toastify';

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isMounted, setIsMounted] = useState(false);

    const orderId = searchParams?.get('orderId');
    const amount = searchParams?.get('amount');

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        setIsMounted(true);
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=/payment');
            return;
        }
        if (!orderId || !amount) {
            toast.error('Invalid payment details');
            router.push('/products');
        }
    }, [isAuthenticated, router, orderId, amount]);

    if (!isMounted || !orderId || !amount) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Icon name="ArrowPathIcon" size={48} className="animate-spin text-[#FF6B8A]" />
                    <p className="mt-4 text-[#6B7280]">Loading payment...</p>
                </div>
            </div>
        );
    }

    const handleSuccess = () => {
        router.push(`/payment/success?orderId=${orderId}`);
    };

    const handleFailure = () => {
        router.push(`/payment/failure?orderId=${orderId}`);
    };

    return (
        <main className="min-h-screen bg-[#FAFAFA] py-8">
            <div className="container mx-auto max-w-4xl px-4">
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/checkout-process')}
                        className="flex items-center gap-2 text-sm text-[#6B7280] transition-colors hover:text-[#FF6B8A]"
                    >
                        <Icon name="ArrowLeftIcon" size={16} />
                        Back to Checkout
                    </button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <RazorpayPayment
                            orderId={parseInt(orderId)}
                            amount={parseFloat(amount)}
                            onSuccess={handleSuccess}
                            onFailure={handleFailure}
                        />
                    </div>

                    <div className="md:col-span-1">
                        <PaymentSummary total={parseFloat(amount)} />
                        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
                            <h4 className="mb-2 text-sm font-medium text-[#1A2A3A]">Secure Payment</h4>
                            <p className="text-xs text-[#6B7280]">
                                Your payment information is encrypted and secure. We use Razorpay's
                                PCI DSS compliant payment gateway.
                            </p>
                            <div className="mt-3 flex justify-center gap-4 text-xs text-[#6B7280]">
                                <span>🔒 Secure</span>
                                <span>🛡️ PCI DSS</span>
                                <span>⚡ Instant</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B8A] mx-auto"></div>
                    <p className="mt-4 text-[#6B7280]">Loading payment...</p>
                </div>
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}