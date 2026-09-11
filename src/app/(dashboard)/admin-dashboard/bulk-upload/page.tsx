'use client';

import { useState } from 'react';
import { useBulkUpload } from '@/features/products/hooks/useBulkUpload';
import { BulkUploadCSV } from '@/features/products/components/BulkUploadCSV';
import { BulkUploadRow } from '@/features/products/components/BulkUploadRow';
import { BulkUploadTable } from '@/features/products/components/BulkUploadTable';
import { BulkUploadPreview } from '@/features/products/components/BulkUploadPreview';
import { BulkUploadErrors } from '@/features/products/components/BulkUploadErrors';
import Icon from '@/components/ui/AppIcon';

export default function BulkUploadPage() {
  const {
    state,
    handleCSVUpload,
    handlePreviewCSV,
    handleProcessProducts,
    addManualRow,
    removeManualRow,
    clearManualRows,
    editingIndex,
    startEdit,
    cancelEdit,
    updateProduct,
  } = useBulkUpload();

  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'csv' | 'manual'>('csv');

  const handleUpload = async (file: File) => {
    await handleCSVUpload(file);
    setShowPreview(false);
  };

  const handlePreview = async (file: File) => {
    await handlePreviewCSV(file);
    setShowPreview(true);
  };

  const handleImport = async () => {
    await handleProcessProducts(
      state.products.filter(p => p._validation?.isValid !== false)
    );
    clearManualRows();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-elevation-1 p-6 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-heading text-espresso flex items-center gap-2">
              <Icon name="CloudArrowUpIcon" size={28} className="text-primary" />
              Bulk Product Upload
            </h1>
            <p className="text-sm text-mocha-grey mt-1">
              Upload multiple products at once via CSV or add them manually
            </p>
          </div>
          {state.result && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-success font-semibold">
                ✅ {state.result.successful} imported
              </span>
              {state.result.failed > 0 && (
                <span className="text-error font-semibold">
                  ❌ {state.result.failed} failed
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('csv')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'csv'
            ? 'border-primary text-primary'
            : 'border-transparent text-mocha-grey hover:text-espresso'
            }`}
        >
          <Icon name="DocumentTextIcon" size={16} className="inline mr-2" />
          CSV Upload
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'manual'
            ? 'border-primary text-primary'
            : 'border-transparent text-mocha-grey hover:text-espresso'
            }`}
        >
          <Icon name="PencilSquareIcon" size={16} className="inline mr-2" />
          Manual Entry
        </button>
      </div>

      {/* CSV Upload Tab */}
      {activeTab === 'csv' && (
        <div className="space-y-4">
          <BulkUploadCSV
            onUpload={handleUpload}
            onPreview={handlePreview}
            isUploading={state.isUploading}
            isPreviewing={state.isPreviewing}
          />

          {/* Preview Section */}
          {showPreview && state.preview && (
            <BulkUploadPreview
              preview={state.preview}
              onImport={handleImport}
              onCancel={() => setShowPreview(false)}
              isImporting={state.isUploading}
            />
          )}

          {/* Errors */}
          {state.result?.errors && state.result.errors.length > 0 && (
            <BulkUploadErrors errors={state.result.errors} />
          )}

          {/* Success Message */}
          {state.result && state.result.successful > 0 && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center gap-3">
              <Icon name="CheckCircleIcon" size={24} className="text-success" />
              <div>
                <p className="font-medium text-success">Import Complete!</p>
                <p className="text-sm text-success/80">
                  {state.result.message}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Entry Tab */}
      {activeTab === 'manual' && (
        <div className="space-y-4">
          {/* Add/Edit Row */}
          <BulkUploadRow
            index={state.products.length}
            onAdd={addManualRow}
            editingIndex={editingIndex}           // ✅ Added
            products={state.products}              // ✅ Added
            onUpdate={updateProduct}               // ✅ Added
            onCancel={cancelEdit}                  // ✅ Added
          />

          {/* Product Table */}
          <div className="bg-white rounded-xl shadow-elevation-1 p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-heading text-espresso">
                Products Added ({state.products.length})
              </h3>
              {state.products.length > 0 && (
                <button
                  onClick={clearManualRows}
                  className="text-sm text-error hover:text-error/80 transition-colors flex items-center gap-1"
                >
                  <Icon name="TrashIcon" size={16} />
                  Clear All
                </button>
              )}
            </div>

            <BulkUploadTable
              products={state.products}
              onRemove={(index) => {
                removeManualRow(index);
              }}
              onEdit={(index) => {
                startEdit(index);
              }}
            />

            {/* Import Button */}
            {state.products.length > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleImport}
                  disabled={state.isUploading}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {state.isUploading ? (
                    <>
                      <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Icon name="ArrowUpTrayIcon" size={16} />
                      Import {state.products.length} Products
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Errors */}
          {state.result?.errors && state.result.errors.length > 0 && (
            <BulkUploadErrors errors={state.result.errors} />
          )}

          {/* Success Message */}
          {state.result && state.result.successful > 0 && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center gap-3">
              <Icon name="CheckCircleIcon" size={24} className="text-success" />
              <div>
                <p className="font-medium text-success">Import Complete!</p>
                <p className="text-sm text-success/80">
                  {state.result.message}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}