import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BulkProduct, BulkUploadResult, CSVPreviewResponse } from '@/types/bulkUpload';

interface UploadCSVResponse {
  success: boolean;
  data: BulkUploadResult;
}

interface ProcessProductsResponse {
  success: boolean;
  data: BulkUploadResult;
}

interface PreviewCSVResponse {
  success: boolean;
  data: CSVPreviewResponse;
}

interface TemplateResponse {
  success: boolean;
  data: {
    template: string;
    description: string;
  };
}

export const bulkProductApi = createApi({
  reducerPath: 'bulkProductApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['BulkProduct'],
  endpoints: (builder) => ({
    // Upload CSV file
    uploadCSV: builder.mutation<UploadCSVResponse, FormData>({
      query: (formData) => ({
        url: '/bulk-products/upload-csv',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['BulkProduct'],
    }),

    // Preview CSV file
    previewCSV: builder.mutation<PreviewCSVResponse, FormData>({
      query: (formData) => ({
        url: '/bulk-products/preview-csv',
        method: 'POST',
        body: formData,
      }),
    }),

    // Process manual products (JSON array)
    processProducts: builder.mutation<ProcessProductsResponse, { products: BulkProduct[] }>({
      query: (data) => ({
        url: '/bulk-products/process',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['BulkProduct'],
    }),

    // Get CSV template
    getTemplate: builder.query<TemplateResponse, void>({
      query: () => '/bulk-products/template',
    }),
  }),
});

export const {
  useUploadCSVMutation,
  usePreviewCSVMutation,
  useProcessProductsMutation,
  useGetTemplateQuery,
} = bulkProductApi;