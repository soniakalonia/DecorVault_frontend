import { useState, useCallback } from 'react';
import {
  useUploadCSVMutation,
  usePreviewCSVMutation,
  useProcessProductsMutation,
} from '@/store/api/bulkProductApi';
import { BulkProduct, BulkProductWithValidation, BulkUploadState } from '@/types/bulkUpload';
import toast from 'react-hot-toast';

const initialState: BulkUploadState = {
  products: [],
  isUploading: false,
  isPreviewing: false,
  result: null,
  preview: null,
  errors: [],
};

export const useBulkUpload = () => {
  const [state, setState] = useState<BulkUploadState>(initialState);
  const [uploadCSV] = useUploadCSVMutation();
  const [previewCSV] = usePreviewCSVMutation();
  const [processProducts] = useProcessProductsMutation();
  
  // Add editing state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Handle CSV file upload
  const handleCSVUpload = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, isUploading: true }));

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadCSV(formData).unwrap();
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          result: result.data,
          isUploading: false,
        }));
        toast.success(result.data.message || 'Products uploaded successfully!');
        
        window.dispatchEvent(new CustomEvent('refreshProducts'));
      } else {
        toast.error(result.data.message || 'Upload failed');
        setState(prev => ({ ...prev, isUploading: false }));
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to upload CSV');
      setState(prev => ({ ...prev, isUploading: false }));
    }
  }, [uploadCSV]);

  // Preview CSV file
  const handlePreviewCSV = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, isPreviewing: true }));

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await previewCSV(formData).unwrap();
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          preview: result.data,
          isPreviewing: false,
        }));
        toast.success(`Preview loaded: ${result.data.total} products found`);
      } else {
        toast.error('Failed to preview CSV');
        setState(prev => ({ ...prev, isPreviewing: false }));
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to preview CSV');
      setState(prev => ({ ...prev, isPreviewing: false }));
    }
  }, [previewCSV]);

  // Process manual products
  const handleProcessProducts = useCallback(async (products: BulkProduct[]) => {
    setState(prev => ({ ...prev, isUploading: true }));

    try {
      const result = await processProducts({ products }).unwrap();
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          result: result.data,
          isUploading: false,
        }));
        toast.success(result.data.message || 'Products uploaded successfully!');
        
        window.dispatchEvent(new CustomEvent('refreshProducts'));
      } else {
        toast.error(result.data.message || 'Upload failed');
        setState(prev => ({ ...prev, isUploading: false }));
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to process products');
      setState(prev => ({ ...prev, isUploading: false }));
    }
  }, [processProducts]);

  // Add manual row
  const addManualRow = useCallback((product: BulkProductWithValidation) => {
    setState(prev => ({
      ...prev,
      products: [...prev.products, product],
    }));
  }, []);

  // Remove manual row
  const removeManualRow = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  }, []);

  // Clear all manual rows
  const clearManualRows = useCallback(() => {
    setState(prev => ({
      ...prev,
      products: [],
    }));
  }, []);

  // Start editing a product
  const startEdit = useCallback((index: number) => {
    setEditingIndex(index);
    // Scroll to the form
    const formElement = document.querySelector('.bulk-upload-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Cancel editing
  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
  }, []);

  // Update product
  const updateProduct = useCallback((index: number, updatedProduct: BulkProductWithValidation) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map((p, i) => 
        i === index ? { ...updatedProduct, _validation: { isValid: true, errors: [] } } : p
      ),
    }));
    setEditingIndex(null);
    toast.success('Product updated successfully!');
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setState(initialState);
    setEditingIndex(null);
  }, []);

  return {
    state,
    editingIndex,           // ✅ Added
    startEdit,              // ✅ Added
    cancelEdit,             // ✅ Added
    updateProduct,          // ✅ Added
    handleCSVUpload,
    handlePreviewCSV,
    handleProcessProducts,
    addManualRow,
    removeManualRow,
    clearManualRows,
    reset,
  };
};