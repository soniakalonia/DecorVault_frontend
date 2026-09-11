// Payment type definitions

export interface PaymentInitiateRequest {
  orderId: number;
  amount: number;
  currency?: string;
  paymentMethod?: string;
}

export interface PaymentInitiateResponse {
  success: boolean;
  data: {
    paymentId: number;
    razorpayOrder: {
      id: string;
      amount: number;
      currency: string;
      receipt: string;
      status: string;
    };
    keyId: string;
    orderId: number;
  };
  message: string;
}

export interface PaymentVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId?: number;
}

export interface PaymentVerifyResponse {
  success: boolean;
  data: {
    paymentId: number;
    orderId: number;
    paymentDetails: any;
  };
  message: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  data: {
    payment: {
      id: number;
      order_id: number;
      user_id: number;
      gateway: string;
      amount: string;
      currency: string;
      payment_method: string;
      gateway_order_id: string;
      gateway_payment_id: string;
      gateway_signature: string;
      gateway_response: any;
      status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled' | 'expired';
      paid_at: string | null;
      created_at: string;
      updated_at: string;
    };
    transactions: any[];
    status: string;
  };
}

export interface PaymentHistoryItem {
  id: number;
  order_id: number;
  user_id: number;
  gateway: string;
  amount: string;
  currency: string;
  payment_method: string;
  gateway_order_id: string;
  gateway_payment_id: string;
  status: string;
  paid_at: string | null;
  created_at: string;
  order_total: string;
  order_number: string;
}

export interface PaymentHistoryResponse {
  success: boolean;
  payments: PaymentHistoryItem[];
}

export interface RefundRequest {
  orderId: number;
  amount: number;
  reason?: string;
}

export interface RefundResponse {
  success: boolean;
  data: {
    refundId: string;
    amount: number;
    status: string;
  };
  message: string;
}

export interface WebhookLogItem {
  id: number;
  gateway: string;
  event_type: string;
  payload: any;
  status: 'received' | 'success' | 'failed';
  signature_valid: boolean | null;
  error_message: string | null;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface WebhookLogsResponse {
  success: boolean;
  logs: WebhookLogItem[];
}

export interface WebhookStatsResponse {
  success: boolean;
  stats: {
    total_webhooks: number;
    successful: number;
    failed: number;
    valid_signatures: number;
    invalid_signatures: number;
    unique_events: number;
  };
}