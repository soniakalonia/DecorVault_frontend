'use client';

import { BulkUploadError } from '@/types/bulkUpload';
import Icon from '@/components/ui/AppIcon';

interface BulkUploadErrorsProps {
  errors: BulkUploadError[];
}

export const BulkUploadErrors = ({ errors }: BulkUploadErrorsProps) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-elevation-1 border border-error/20 p-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="ExclamationTriangleIcon" size={20} className="text-error" />
        <h3 className="font-bold font-heading text-espresso">Upload Errors</h3>
        <span className="text-sm text-mocha-grey">({errors.length} errors)</span>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {errors.map((error, index) => (
          <div key={index} className="p-3 bg-error/5 border border-error/10 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold text-error bg-error/10 px-2 py-0.5 rounded-full">
                Row {error.row}
              </span>
              <div className="flex-1">
                <div className="text-xs text-mocha-grey mb-1">
                  <span className="font-medium">Product:</span> {error.data.name || 'Unknown'}
                </div>
                <ul className="list-disc list-inside text-sm text-error">
                  {error.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};