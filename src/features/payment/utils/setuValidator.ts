// Basic validation for Setu payment data
export const validateSetuAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000; // Max 1,000,000 INR
};

export const validateSetuOrderId = (orderId: number): boolean => {
  return orderId > 0;
};

export const validateSetuResponse = (data: any): boolean => {
  return data && data.sessionId && data.paymentLink;
};