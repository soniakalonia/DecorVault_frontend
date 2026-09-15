'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks/redux';

interface Props {
  orderId: number | string;
  className?: string;
  label?: string;
}

export default function DownloadInvoiceButton({
  orderId,
  className,
  label = 'Download Invoice',
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector((s: any) => s.auth?.token);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

  const handleDownload = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${apiBase}/orders/${orderId}/invoice/pdf`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) {
        throw new Error(`Failed to download invoice (${res.status})`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-ORD-${String(orderId).padStart(3, '0')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || 'Download failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37] bg-white px-6 py-3 font-medium text-[#1A1A2E] transition-all hover:bg-[#D4AF37] hover:text-[#1A1A2E] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {loading ? 'Preparing…' : label}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}