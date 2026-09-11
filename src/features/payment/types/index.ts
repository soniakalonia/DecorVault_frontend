export * from '@/types/payment';

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentSession {
  orderId: number;
  razorpayOrderId: string;
  keyId: string;
  amount: number;
  currency: string;
}

export interface PaymentResult {
  success: boolean;
  orderId: number;
  paymentId?: string;
  transactionId?: string;
  message?: string;
}