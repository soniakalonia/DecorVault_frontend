import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SetuPaymentState {
  isProcessing: boolean;
  sessionId: string | null;
  paymentLink: string | null;
  status: 'idle' | 'initiated' | 'pending' | 'success' | 'failed';
  error: string | null;
}

const initialState: SetuPaymentState = {
  isProcessing: false,
  sessionId: null,
  paymentLink: null,
  status: 'idle',
  error: null,
};

const setuPaymentSlice = createSlice({
  name: 'setuPayment',
  initialState,
  reducers: {
    initiateSetuPayment: (state, action: PayloadAction<{ sessionId: string; paymentLink: string }>) => {
      state.isProcessing = true;
      state.sessionId = action.payload.sessionId;
      state.paymentLink = action.payload.paymentLink;
      state.status = 'initiated';
      state.error = null;
    },
    setSetuPending: (state) => {
      state.status = 'pending';
    },
    setSetuSuccess: (state) => {
      state.isProcessing = false;
      state.status = 'success';
      state.error = null;
    },
    setSetuFailed: (state, action: PayloadAction<string>) => {
      state.isProcessing = false;
      state.status = 'failed';
      state.error = action.payload;
    },
    resetSetuPayment: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  initiateSetuPayment,
  setSetuPending,
  setSetuSuccess,
  setSetuFailed,
  resetSetuPayment,
} = setuPaymentSlice.actions;

export default setuPaymentSlice.reducer;