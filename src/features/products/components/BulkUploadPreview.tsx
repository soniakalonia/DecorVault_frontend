'use client';

import { CSVPreviewResponse } from '@/types/bulkUpload';
import Icon from '@/components/ui/AppIcon';

interface BulkUploadPreviewProps {
  preview: CSVPreviewResponse;
  onImport: () => void;
  onCancel: () => void;
  isImporting: boolean;
}

export const BulkUploadPreview = ({ preview, onImport, onCancel, isImporting }: BulkUploadPreviewProps) => {
  const { total, validCount, invalidCount, preview: items } = preview;

  return (
    <div className="bg-white rounded-xl shadow-elevation-2 border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold font-heading text-espresso">CSV Preview</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm">
            <span className="text-success font-semibold">{validCount}</span>
            <span className="text-mocha-grey"> valid, </span>
            <span className="text-error font-semibold">{invalidCount}</span>
            <span className="text-mocha-grey"> invalid</span>
          </span>
          <span className="text-sm text-mocha-grey">| Total: {total}</span>
        </div>
      </div>

      <div className="overflow-x-auto max-h-80 overflow-y-auto border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-soft-linen">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">#</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Name</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Price</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Category</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Brand</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Stock</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.slice(0, 10).map((item) => (
              <tr key={item.row} className="border-b border-border hover:bg-soft-linen/30 transition-colors">
                <td className="px-3 py-2 text-mocha-grey text-xs">{item.row}</td>
                <td className="px-3 py-2 font-medium text-espresso text-sm">
                  <span className={!item.isValid ? 'text-error' : ''}>
                    {item.product.name || '-'}
                  </span>
                  {!item.isValid && (
                    <span className="ml-2 text-error" title={item.errors.join(', ')}>
                      <Icon name="ExclamationCircleIcon" size={14} />
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">₹{item.product.price || 0}</td>
                <td className="px-3 py-2 text-mocha-grey">{item.product.category || '-'}</td>
                <td className="px-3 py-2 text-mocha-grey">{item.product.brand || '-'}</td>
                <td className="px-3 py-2 text-mocha-grey">{item.product.stock_quantity || 0}</td>
                <td className="px-3 py-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.isValid ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                  }`}>
                    {item.isValid ? 'Valid' : 'Invalid'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {total > 10 && (
          <div className="p-2 text-center text-xs text-mocha-grey border-t border-border">
            Showing first 10 of {total} products
          </div>
        )}
      </div>

      {invalidCount > 0 && (
        <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
          <p className="text-sm text-error flex items-center gap-2">
            <Icon name="ExclamationTriangleIcon" size={16} />
            {invalidCount} product(s) have validation errors and will be skipped
          </p>
        </div>
      )}

      <div className="mt-4 flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-border text-mocha-grey rounded-lg hover:bg-soft-linen transition-colors font-medium text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onImport}
          disabled={isImporting || validCount === 0}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm disabled:opacity-50"
        >
          {isImporting ? (
            <span className="flex items-center gap-2">
              <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
              Importing...
            </span>
          ) : (
            `Import ${validCount} Valid Products`
          )}
        </button>
      </div>
    </div>
  );
};