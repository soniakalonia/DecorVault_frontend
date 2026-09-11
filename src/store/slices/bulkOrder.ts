import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface BulkOrderData {
  name: string;
  email: string;
  number: string;
  message: string;
  productName: string;
}

interface BulkOrderItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  product_name: string;
  status: string;
  created_at: string;
}

interface BulkOrderState {
  loading: boolean;
  success: boolean;
  error: string | null;
  inquiries: BulkOrderItem[];
  fetchLoading: boolean;
}

const initialState: BulkOrderState = {
  loading: false,
  success: false,
  error: null,
  inquiries: [],
  fetchLoading: false,
};

export const updateBulkOrderStatus = createAsyncThunk(
  'bulkOrder/updateStatus',
  async ({ id, status }: { id: number; status: string }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bulk-orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update status');
    }
    return { id, status };
  }
);

export const fetchBulkOrders = createAsyncThunk(
  'bulkOrder/fetchAll',
  async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bulk-orders`);
    if (!response.ok) {
      throw new Error('Failed to fetch bulk orders');
    }
    return await response.json();
  }
);

export const submitBulkOrder = createAsyncThunk(
  'bulkOrder/submit',
  async (orderData: BulkOrderData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bulk-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit bulk order');
    }

    return await response.json();
  }
);

const bulkOrderSlice = createSlice({
  name: 'bulkOrder',
  initialState,
  reducers: {
    resetBulkOrder: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBulkOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitBulkOrder.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitBulkOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit bulk order';
      })
      .addCase(fetchBulkOrders.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(fetchBulkOrders.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.inquiries = action.payload.data || [];
      })
      .addCase(fetchBulkOrders.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.error.message || 'Failed to fetch inquiries';
      })
      .addCase(updateBulkOrderStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const inquiry = state.inquiries.find(item => item.id === id);
        if (inquiry) {
          inquiry.status = status;
        }
      });
  },
});

export const { resetBulkOrder } = bulkOrderSlice.actions;
export default bulkOrderSlice.reducer;