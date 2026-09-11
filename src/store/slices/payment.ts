import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  isProcessing: boolean;
  currentOrderId: number | null;
  paymentStatus: 'idle' | 'initiated' | 'pending' | 'success' | 'failed';
  razorpayOrderId: string | null;
  error: string | null;
}

const initialState: PaymentState = {
  isProcessing: false,
  currentOrderId: null,
  paymentStatus: 'idle',
  razorpayOrderId: null,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    startPayment: (state, action: PayloadAction<{ orderId: number }>) => {
      state.isProcessing = true;
      state.currentOrderId = action.payload.orderId;
      state.paymentStatus = 'initiated';
      state.error = null;
    },
    paymentPending: (state) => {
      state.paymentStatus = 'pending';
    },
    paymentSuccess: (state) => {
      state.isProcessing = false;
      state.paymentStatus = 'success';
      state.error = null;
    },
    paymentFailed: (state, action: PayloadAction<string>) => {
      state.isProcessing = false;
      state.paymentStatus = 'failed';
      state.error = action.payload;
    },
    resetPayment: (state) => {
      state.isProcessing = false;
      state.currentOrderId = null;
      state.paymentStatus = 'idle';
      state.razorpayOrderId = null;
      state.error = null;
    },
    setRazorpayOrderId: (state, action: PayloadAction<string>) => {
      state.razorpayOrderId = action.payload;
    },
  },
});

export const {
  startPayment,
  paymentPending,
  paymentSuccess,
  paymentFailed,
  resetPayment,
  setRazorpayOrderId,
} = paymentSlice.actions;

// ✅ THIS IS THE DEFAULT EXPORT - MAKE SURE THIS LINE EXISTS
export default paymentSlice.reducer;