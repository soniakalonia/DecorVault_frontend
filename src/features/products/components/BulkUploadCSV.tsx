'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import Icon from '@/components/ui/AppIcon';

interface BulkUploadCSVProps {
  onUpload: (file: File) => void;
  onPreview: (file: File) => void;
  isUploading: boolean;
  isPreviewing: boolean;
}

export const BulkUploadCSV = ({ onUpload, onPreview, isUploading, isPreviewing }: BulkUploadCSVProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        toast.error('Please upload a CSV file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  const handlePreview = () => {
    if (file) {
      onPreview(file);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bulk-products/template`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        // Create CSV file from template string
        const blob = new Blob([data.data.template], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bulk_product_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Template downloaded!');
      }
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-elevation-1 p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold font-heading text-espresso">Upload CSV</h3>
        <button
          onClick={handleDownloadTemplate}
          className="text-sm text-primary hover:text-secondary transition-colors flex items-center gap-1"
        >
          <Icon name="DocumentArrowDownIcon" size={16} />
          Download Template
        </button>
      </div>

      {/* Drag & Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${dragActive ? 'border-secondary bg-secondary/5' : 'border-border hover:border-secondary/50'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="CloudArrowUpIcon" size={24} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-espresso">Drop your CSV file here</p>
            <p className="text-sm text-mocha-grey">or click to browse</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Choose File
          </button>
        </div>
      </div>

      {/* File Selected */}
      {file && (
        <div className="mt-4 p-3 bg-soft-linen rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="DocumentTextIcon" size={20} className="text-primary" />
            <span className="text-sm text-espresso">{file.name}</span>
            <span className="text-xs text-mocha-grey">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-error hover:text-error/80 transition-colors"
          >
            <Icon name="XMarkIcon" size={16} />
          </button>
        </div>
      )}

      {/* Actions */}
      {file && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={handlePreview}
            disabled={isPreviewing}
            className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium text-sm disabled:opacity-50"
          >
            {isPreviewing ? (
              <span className="flex items-center justify-center gap-2">
                <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                Previewing...
              </span>
            ) : (
              'Preview'
            )}
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm disabled:opacity-50"
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                Uploading...
              </span>
            ) : (
              'Upload'
            )}
          </button>
        </div>
      )}
    </div>
  );
};