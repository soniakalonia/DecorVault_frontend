'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useGetOrderByIdQuery } from '@/store/api/orderApi';

function OrderSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState<string | null>(null);
    const [fallbackData, setFallbackData] = useState<{
        orderNumber: string;
        total: number;
        paymentMethod: string;
    } | null>(null);

    useEffect(() => {
        const id = searchParams.get('orderId');
        const orderNumber = searchParams.get('orderNumber');
        const total = searchParams.get('total');
        const paymentMethod = searchParams.get('paymentMethod');

        if (id && orderNumber) {
            setOrderId(id);
            setFallbackData({
                orderNumber,
                total: Number(total) || 0,
                paymentMethod: paymentMethod || 'cod',
            });
        } else {
            router.push('/');
        }
    }, [searchParams, router]);

    const { data, isLoading, isError } = useGetOrderByIdQuery(orderId, { skip: !orderId });

    if (isLoading || !fallbackData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Prefer live DB data; fall back to query-string values if the fetch fails
    const order = data?.success ? data.order : null;

    let address: any = {};
    if (order?.address) {
        try {
            address = typeof order.address === 'string' ? JSON.parse(order.address) : order.address;
        } catch {
            address = {};
        }
    }

    const orderNumber = order ? `ORD-${String(order.id).padStart(3, '0')}` : fallbackData.orderNumber;
    const total = order ? Number(order.total) : fallbackData.total;
    const paymentMethod = order ? order.payment_method : fallbackData.paymentMethod;
    const status = order ? order.status : 'pending';
    const items = order?.items || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-500 px-8 py-10 text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="CheckCircleIcon" size={48} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white font-heading">
                            Order Placed Successfully! 🎉
                        </h1>
                        <p className="text-green-100 mt-2">
                            Thank you for shopping with DecorVault
                        </p>
                    </div>

                    <div className="p-8">
                        {/* Order Number */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
                            <p className="text-sm text-gray-500">Order Number</p>
                            <p className="text-2xl font-bold text-gray-800 font-mono">
                                #{orderNumber}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Order ID: {orderId}
                            </p>
                        </div>

                        {isError && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-6 text-sm text-yellow-800">
                                We couldn't refresh full order details right now, but your order was placed successfully.
                            </div>
                        )}

                        {/* Order Summary */}
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <span className="text-gray-600">Payment Method</span>
                                <span className="font-medium text-gray-800 capitalize">
                                    {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <span className="text-gray-600">Order Status</span>
                                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                                    {status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <span className="text-gray-600">Total Amount</span>
                                <span className="text-xl font-bold text-primary">
                                    ₹{total.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        {address?.name && (
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <Icon name="MapPinIcon" size={18} />
                                    Delivering To
                                </h3>
                                <p className="text-sm text-gray-700 font-medium">{address.name}</p>
                                <p className="text-sm text-gray-600">{address.phone}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {address.address_line1 || address.addressLine1}
                                    {(address.address_line2 || address.addressLine2) && `, ${address.address_line2 || address.addressLine2}`}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {address.city}, {address.state} - {address.pincode}
                                </p>
                            </div>
                        )}

                        {/* Items */}
                        {items.length > 0 && (
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Icon name="ShoppingBagIcon" size={18} />
                                    Items ({items.length})
                                </h3>
                                <ul className="space-y-3">
                                    {items.map((item: any, idx: number) => (
                                        <li key={idx} className="flex justify-between items-center text-sm">
                                            <div>
                                                <p className="text-gray-800 font-medium">{item.product_name || item.name}</p>
                                                <p className="text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-gray-800 font-medium">
                                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* COD Message */}
                        {paymentMethod === 'cod' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <Icon name="InformationCircleIcon" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-800">Cash on Delivery</p>
                                        <p className="text-sm text-blue-700">
                                            Please keep the exact amount ready for delivery. Our delivery partner will collect the payment.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* What's Next */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <Icon name="ClockIcon" size={18} />
                                What's Next?
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">✓</span>
                                    <span>Order confirmed and sent to our warehouse</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">✓</span>
                                    <span>Preparing your items for shipment</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">✓</span>
                                    <span>You'll receive tracking details via email/SMS</span>
                                </li>
                            </ul>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3">
                            <Link
                                href={`/order-tracking?orderId=${orderId}`}
                                className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all hover:scale-[0.98]"
                            >
                                <Icon name="TruckIcon" size={18} />
                                Track Your Order
                            </Link>
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/products"
                                    className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-all"
                                >
                                    <Icon name="ShoppingBagIcon" size={18} />
                                    Continue Shopping
                                </Link>
                                <Link
                                    href="/user-dashboard/orders"
                                    className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-all"
                                >
                                    <Icon name="DocumentTextIcon" size={18} />
                                    My Orders
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                            A confirmation email has been sent to your registered email address.
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Need help? <a href="/contact" className="text-primary hover:underline">Contact Support</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ✅ This is the fix - wrap the component in Suspense
export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}