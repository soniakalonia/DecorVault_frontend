export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://decorvault.online/api',
  appName: 'Decor Vault',
  version: '1.0.0',
  razorpay: {
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  },
    setu: {
    // If needed (mostly backend handles it)
    clientId: process.env.NEXT_PUBLIC_SETU_CLIENT_ID || '',
    baseUrl: process.env.NEXT_PUBLIC_SETU_BASE_URL || '',
  },
    payu: {
    // Mostly handled by backend — kept here for reference / future use
    merchantKey: process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY || '',
    mode: process.env.NEXT_PUBLIC_PAYU_MODE || 'TEST',
  },
  payment: {
    successUrl: process.env.NEXT_PUBLIC_PAYMENT_SUCCESS_URL || '/payment/success',
    failureUrl: process.env.NEXT_PUBLIC_PAYMENT_FAILURE_URL || '/payment/failure',
  }
}