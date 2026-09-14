import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PayUPaymentState {
  isProcessing: boolean;
  txnid: string | null;
  paymentId: number | null;
  status: 'idle' | 'initiated' | 'pending' | 'success' | 'failed';
  error: string | null;
}

const initialState: PayUPaymentState = {
  isProcessing: false,
  txnid: null,
  paymentId: null,
  status: 'idle',
  error: null,
};

const payuPaymentSlice = createSlice({
  name: 'payuPayment',
  initialState,
  reducers: {
    initiatePayUPayment: (
      state,
      action: PayloadAction<{ txnid: string; paymentId: number }>,
    ) => {
      state.isProcessing = true;
      state.txnid = action.payload.txnid;
      state.paymentId = action.payload.paymentId;
      state.status = 'initiated';
      state.error = null;
    },
    setPayUPending: (state) => {
      state.status = 'pending';
    },
    setPayUSuccess: (state) => {
      state.isProcessing = false;
      state.status = 'success';
      state.error = null;
    },
    setPayUFailed: (state, action: PayloadAction<string>) => {
      state.isProcessing = false;
      state.status = 'failed';
      state.error = action.payload;
    },
    resetPayUPayment: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  initiatePayUPayment,
  setPayUPending,
  setPayUSuccess,
  setPayUFailed,
  resetPayUPayment,
} = payuPaymentSlice.actions;

export default payuPaymentSlice.reducer;