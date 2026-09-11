// Validate amount
export const validateAmount = (amount: number): { valid: boolean; message?: string } => {
  if (!amount || amount <= 0) {
    return { valid: false, message: 'Amount must be greater than 0' };
  }
  if (amount > 1000000) {
    return { valid: false, message: 'Amount cannot exceed 10,00,000' };
  }
  return { valid: true };
};

// Validate order ID
export const validateOrderId = (orderId: number): { valid: boolean; message?: string } => {
  if (!orderId || orderId <= 0) {
    return { valid: false, message: 'Invalid order ID' };
  }
  return { valid: true };
};

// Validate payment verification data
export const validatePaymentVerification = (data: {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}): { valid: boolean; message?: string } => {
  if (!data.razorpay_order_id) {
    return { valid: false, message: 'Missing Razorpay Order ID' };
  }
  if (!data.razorpay_payment_id) {
    return { valid: false, message: 'Missing Razorpay Payment ID' };
  }
  if (!data.razorpay_signature) {
    return { valid: false, message: 'Missing Razorpay Signature' };
  }
  return { valid: true };
};