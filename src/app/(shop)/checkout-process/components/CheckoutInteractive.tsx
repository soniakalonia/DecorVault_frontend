'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { syncCart } from '@/store/slices/cart';
import { useCreateOrderMutation, useGetUserAddressesQuery } from '@/store/api/orderApi';
import { useInitiatePaymentMutation } from '@/store/api/paymentApi';
import { useInitiateSetuPaymentMutation } from '@/store/api/setuApi';
import Icon from '@/components/ui/AppIcon';
import DeliveryAddressForm from './DeliveryAddressForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import OrderReviewSection from './OrderReviewSection';
import CheckoutProgress from './CheckoutProgress';
import { toast } from 'react-toastify';

interface Address {
    id: string;
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}

const CheckoutInteractive = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isHydrated, setIsHydrated] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showOrderSummary, setShowOrderSummary] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const cartItems = useSelector((state: RootState) => state.cart.items);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useGetUserAddressesQuery(undefined, { skip: !isAuthenticated });
    const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();
    const [initiatePayment] = useInitiatePaymentMutation();
    const [initiateSetuPayment] = useInitiateSetuPaymentMutation();

    useEffect(() => {
        setIsHydrated(true);
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=/checkout-process');
            return;
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (isHydrated && isAuthenticated && cartItems.length === 0) {
            toast.error('Your cart is empty');
            router.push('/products');
        }
    }, [isHydrated, isAuthenticated, cartItems, router]);

    const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const gst = Math.round(subtotal * 0.18);
    const deliveryCharges = subtotal > 1000 ? 0 : 50;
    const discount = 0;
    const total = subtotal + gst + deliveryCharges - discount;

    const handleAddressSelect = (address: Address) => {
        setSelectedAddress(address);
    };

    const handlePaymentSelect = (methodId: string) => {
        setSelectedPaymentMethod(methodId);
    };

    const handleContinueToPayment = () => {
        if (selectedAddress) {
            setCurrentStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleContinueToReview = () => {
        if (selectedPaymentMethod) {
            setCurrentStep(3);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // ===================== handlePlaceOrder =====================
    // ===================== handlePlaceOrder =====================
    const handlePlaceOrder = async () => {
        if (!termsAccepted) {
            toast.error('Please accept the terms and conditions');
            return;
        }

        try {
            // ✅ Map cart items to order items
            const orderItems = cartItems.map((item: any) => {
                let productId = item.productId || item.id;

                if (typeof productId === 'string') {
                    productId = parseInt(productId);
                }

                if (isNaN(productId) || productId <= 0) {
                    console.error('❌ Invalid product ID for item:', item);
                    throw new Error(`"${item.name}" has an invalid product reference. Please remove it from your cart and add it again.`);
                }

                return {
                    id: productId,
                    recordId: productId,
                    name: item.name,
                    image: item.image || item.product_images || '',
                    quantity: item.quantity || 1,
                    price: Number(item.price) || 0,
                    original_price: Number(item.original_price || item.price) || 0,
                    discount_price: Number(item.discount_price || item.price) || 0,
                    variant_id: item.variant_id || null,
                    product_images: item.product_images || item.image || '',
                };
            });

            const orderData = {
                items: orderItems,
                address: selectedAddress,
                paymentMethod: selectedPaymentMethod,
                subtotal,
                gst,
                deliveryCharges,
                discount,
                total,
            };

            // Create order
            const orderResult = await createOrder(orderData).unwrap();
            const orderId = orderResult.orderId;
            const orderNumber = orderResult.orderNumber || `ORD-${String(orderId).padStart(3, '0')}`;


            // Route based on payment method
            if (selectedPaymentMethod === 'razorpay') {
                setIsProcessingPayment(true);
                const paymentResult = await initiatePayment({
                    orderId,
                    amount: total,
                    currency: 'INR',
                    paymentMethod: 'razorpay',
                }).unwrap();

                if (paymentResult.success && paymentResult.data) {
                    router.push(
                        `/payment?orderId=${orderId}&amount=${total}&razorpayOrderId=${paymentResult.data.razorpayOrder.id}`
                    );
                } else {
                    throw new Error(paymentResult.message || 'Razorpay initiation failed');
                }
            }
            else if (selectedPaymentMethod === 'setu') {
                setIsProcessingPayment(true);
                const result = await initiateSetuPayment({
                    orderId,
                    amount: total,
                    currency: 'INR',
                }).unwrap();

                if (result.success && result.data.paymentLink) {
                    window.location.href = result.data.paymentLink;
                } else {
                    throw new Error(result.message || 'Setu payment initiation failed');
                }
            }
            else {
                // ✅ Cash on Delivery - Clear cart and redirect
                dispatch(syncCart([]));
                toast.success(`Order #${orderNumber} placed successfully!`);
                router.push(`/order-success?orderId=${orderId}&orderNumber=${orderNumber}&total=${total}&paymentMethod=cod`);
            }
        } catch (error: any) {
            console.error('❌ Order error:', error);
            console.error('❌ Error details:', error?.data || error?.message || error);

            // ✅ Show proper error message
            const errorMessage = error?.data?.message || error?.message || 'Failed to place order. Please try again.';
            toast.error(errorMessage);
            setIsProcessingPayment(false);
        }
    };

    const handleBackStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (!isHydrated || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-background">
                <div className="w-full px-2 py-8 sm:px-4">
                    <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
                    <div className="mt-6 h-64 animate-pulse rounded-md bg-muted" />
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <div className="w-full px-2 py-8 sm:px-4 text-center">
                    <Icon name="ShoppingCartIcon" size={64} className="mx-auto text-muted-foreground" />
                    <h2 className="mt-4 text-xl font-semibold text-foreground">Your cart is empty</h2>
                    <p className="mt-2 text-muted-foreground">Add items to your cart to proceed with checkout</p>
                    <button
                        onClick={() => router.push('/products')}
                        className="mt-6 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98]"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20 lg:pb-8">
            <div className="w-full px-2 py-8 sm:px-4">
                <CheckoutProgress currentStep={currentStep} />

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2">
                        <div className="space-y-6">
                            {/* Step 1: Address */}
                            {currentStep === 1 && (
                                <div className="rounded-md bg-card p-6 shadow-elevation-2">
                                    <DeliveryAddressForm
                                        onAddressSelect={handleAddressSelect}
                                        selectedAddressId={selectedAddress?.id || null}
                                    />
                                    <div className="mt-6 flex items-center justify-between">
                                        <button
                                            onClick={() => router.push('/shopping-cart')}
                                            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
                                        >
                                            <Icon name="ArrowLeftIcon" size={16} />
                                            <span>Back to Cart</span>
                                        </button>
                                        <button
                                            onClick={handleContinueToPayment}
                                            disabled={!selectedAddress}
                                            className="flex items-center space-x-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <span>Continue to Payment</span>
                                            <Icon name="ArrowRightIcon" size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Payment */}
                            {currentStep === 2 && (
                                <div className="rounded-md bg-card p-6 shadow-elevation-2">
                                    <PaymentMethodSelector
                                        onPaymentSelect={handlePaymentSelect}
                                        selectedMethodId={selectedPaymentMethod}
                                    />
                                    <div className="mt-6 flex items-center justify-between">
                                        <button
                                            onClick={handleBackStep}
                                            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
                                        >
                                            <Icon name="ArrowLeftIcon" size={16} />
                                            <span>Back to Address</span>
                                        </button>
                                        <button
                                            onClick={handleContinueToReview}
                                            disabled={!selectedPaymentMethod}
                                            className="flex items-center space-x-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <span>Continue to Review</span>
                                            <Icon name="ArrowRightIcon" size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="rounded-md bg-card p-6 shadow-elevation-2">
                                        <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
                                            Delivery Address
                                        </h2>
                                        {selectedAddress && (
                                            <div className="rounded-md bg-muted p-4">
                                                <p className="font-medium text-foreground">{selectedAddress.name}</p>
                                                <p className="caption mt-1 text-muted-foreground">{selectedAddress.phone}</p>
                                                <p className="mt-2 text-sm text-foreground">
                                                    {selectedAddress.addressLine1}
                                                    {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                                                </p>
                                                <p className="text-sm text-foreground">
                                                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                                                </p>
                                                <button
                                                    onClick={() => setCurrentStep(1)}
                                                    className="mt-3 text-sm font-medium text-primary transition-smooth hover:text-primary/80"
                                                >
                                                    Change Address
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="rounded-md bg-card p-6 shadow-elevation-2">
                                        <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
                                            Payment Method
                                        </h2>
                                        <div className="rounded-md bg-muted p-4">
                                            <p className="font-medium text-foreground">
                                                {selectedPaymentMethod === 'razorpay' && 'Razorpay (Card/UPI/Net Banking)'}
                                                {selectedPaymentMethod === 'setu' && 'Setu (UPI / QR)'}
                                                {selectedPaymentMethod === 'cod' && 'Cash on Delivery'}
                                            </p>
                                            <button
                                                onClick={() => setCurrentStep(2)}
                                                className="mt-3 text-sm font-medium text-primary transition-smooth hover:text-primary/80"
                                            >
                                                Change Payment Method
                                            </button>
                                        </div>
                                    </div>

                                    <div className="rounded-md bg-card p-6 shadow-elevation-2">
                                        <div className="flex items-start space-x-3">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                                className="mt-1 h-4 w-4 cursor-pointer rounded border-border text-primary transition-smooth focus:ring-2 focus:ring-ring"
                                            />
                                            <label htmlFor="terms" className="cursor-pointer text-sm text-foreground">
                                                I agree to the{' '}
                                                <span className="font-medium text-primary">Terms and Conditions</span> and{' '}
                                                <span className="font-medium text-primary">Privacy Policy</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={handleBackStep}
                                            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
                                        >
                                            <Icon name="ArrowLeftIcon" size={16} />
                                            <span>Back to Payment</span>
                                        </button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={!termsAccepted || isPlacingOrder || isProcessingPayment}
                                            className="flex items-center space-x-2 rounded-md bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-smooth hover:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {(isPlacingOrder || isProcessingPayment) ? (
                                                <>
                                                    <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                                                    <span>{isProcessingPayment ? 'Redirecting...' : 'Processing...'}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Icon name={selectedPaymentMethod === 'cod' ? 'CheckCircleIcon' : 'LockClosedIcon'} size={20} />
                                                    <span>
                                                        {selectedPaymentMethod === 'cod' && 'Place Order'}
                                                        {selectedPaymentMethod === 'razorpay' && 'Pay & Place Order'}
                                                        {selectedPaymentMethod === 'setu' && 'Pay with Setu'}
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    {currentStep === 3 && (
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 rounded-md bg-card p-6 shadow-elevation-2">
                                <OrderReviewSection
                                    cartItems={cartItems as any}
                                    subtotal={subtotal}
                                    gst={gst}
                                    deliveryCharges={deliveryCharges}
                                    discount={discount}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Order Summary Button */}
            {currentStep === 3 && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-card p-4 shadow-elevation-4 lg:hidden">
                    <button
                        onClick={() => setShowOrderSummary(!showOrderSummary)}
                        className="flex w-full items-center justify-between rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98]"
                    >
                        <span>Order Summary</span>
                        <Icon name={showOrderSummary ? 'ChevronDownIcon' : 'ChevronUpIcon'} size={20} />
                    </button>
                </div>
            )}

            {/* Mobile Order Summary Modal */}
            {showOrderSummary && currentStep === 3 && (
                <>
                    <div
                        className="fixed inset-0 z-[100] bg-background/80 lg:hidden"
                        onClick={() => setShowOrderSummary(false)}
                    />
                    <div className="fixed bottom-0 left-0 right-0 z-[200] max-h-[80vh] overflow-y-auto rounded-t-xl bg-card p-6 shadow-elevation-4 lg:hidden">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-heading text-lg font-semibold text-foreground">
                                Order Summary
                            </h3>
                            <button
                                onClick={() => setShowOrderSummary(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-smooth hover:bg-muted"
                            >
                                <Icon name="XMarkIcon" size={20} />
                            </button>
                        </div>
                        <OrderReviewSection
                            cartItems={cartItems as any}
                            subtotal={subtotal}
                            gst={gst}
                            deliveryCharges={deliveryCharges}
                            discount={discount}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default CheckoutInteractive;


