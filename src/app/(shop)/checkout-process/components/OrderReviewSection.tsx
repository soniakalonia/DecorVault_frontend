'use client';

import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    variant?: string;
    recordId?: number;
    productId?: string;
    variantId?: string;
    originalPrice?: number;
    packingStandard?: string;
}

interface OrderReviewSectionProps {
    cartItems: CartItem[];
    subtotal: number;
    gst: number;
    deliveryCharges: number;
    discount: number;
}

const OrderReviewSection: React.FC<OrderReviewSectionProps> = ({
    cartItems,
    subtotal,
    gst,
    deliveryCharges,
    discount,
}) => {
    const total = subtotal + gst + deliveryCharges - discount;

    return (
        <div>
            <h3 className="mb-4 font-heading text-lg font-semibold text-[#1A2A3A]">
                Order Summary
            </h3>

            {/* Items */}
            <div className="max-h-60 overflow-y-auto space-y-3 mb-4">
                {cartItems.map((item) => {
                    const price = Number(item.price) || 0;
                    return (
                        <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-3">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={64}
                                        height={64}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                                        <Icon name="PhotoIcon" size={24} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#1A2A3A] truncate">{item.name}</p>
                                {item.variant && (
                                    <p className="text-xs text-[#6B7280]">{item.variant}</p>
                                )}
                                <p className="text-sm text-[#1A2A3A]">
                                    ₹{price.toFixed(2)} × {item.quantity}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-[#1A2A3A]">
                                    ₹{(price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm text-[#6B7280]">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#6B7280]">
                    <span>GST (18%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#6B7280]">
                    <span>Delivery Charges</span>
                    <span>{deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges.toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-₹{discount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold text-[#1A2A3A]">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
            </div>

            {/* ✅ PROCEED TO CHECKOUT BUTTON REMOVED */}
        </div>
    );
};

export default OrderReviewSection;