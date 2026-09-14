// Basic validation for PayU payment data

export const validatePayUAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000; // Max 10,00,000 INR
};

export const validatePayUOrderId = (orderId: number): boolean => {
  return orderId > 0;
};

export const validatePayUForm = (payuForm: any): boolean => {
  if (!payuForm || !payuForm.action || !payuForm.fields) return false;
  const f = payuForm.fields;
  return Boolean(f.key && f.txnid && f.amount && f.hash);
};

export const validatePayUTxnId = (txnid: string | null | undefined): boolean => {
  return typeof txnid === 'string' && txnid.length > 0;
};