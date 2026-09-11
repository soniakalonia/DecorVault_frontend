'use client';

import { useState } from 'react';
import { useGetWebhookLogsQuery, useGetWebhookStatsQuery } from '@/store/api/paymentApi';
import Icon from '@/components/ui/AppIcon';

export default function PaymentLogsPage() {
  const [selectedGateway, setSelectedGateway] = useState<string>('');
  const [limit, setLimit] = useState(50);

  // Fix: Only include gateway if it has a value
  const queryParams = {
    ...(selectedGateway && { gateway: selectedGateway }),
    limit,
  };

  const { data: logsData, isLoading: logsLoading } = useGetWebhookLogsQuery(queryParams);

  const { data: statsData, isLoading: statsLoading } = useGetWebhookStatsQuery();

  const stats = statsData?.stats;
  const logs = logsData?.logs || [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A2A3A]">Payment Logs</h1>
        <p className="text-[#6B7280]">Monitor all payment webhook activity</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-[#6B7280]">Total Webhooks</p>
          <p className="text-2xl font-bold text-[#1A2A3A]">
            {statsLoading ? '-' : stats?.total_webhooks || 0}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-[#6B7280]">Successful</p>
          <p className="text-2xl font-bold text-green-600">
            {statsLoading ? '-' : stats?.successful || 0}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-[#6B7280]">Failed</p>
          <p className="text-2xl font-bold text-red-600">
            {statsLoading ? '-' : stats?.failed || 0}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-[#6B7280]">Valid Signatures</p>
          <p className="text-2xl font-bold text-blue-600">
            {statsLoading ? '-' : stats?.valid_signatures || 0}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="mr-2 text-sm text-[#6B7280]">Gateway:</label>
          <select
            value={selectedGateway}
            onChange={(e) => setSelectedGateway(e.target.value)}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm"
          >
            <option value="">All</option>
            <option value="razorpay">Razorpay</option>
          </select>
        </div>
        <div>
          <label className="mr-2 text-sm text-[#6B7280]">Limit:</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm"
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {logsLoading ? (
        <div className="flex justify-center py-12">
          <Icon name="ArrowPathIcon" size={32} className="animate-spin text-[#FF6B8A]" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#6B7280]">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#6B7280]">Event</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#6B7280]">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#6B7280]">Signature</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#6B7280]">IP</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#6B7280]">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#6B7280]">
                    No logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-[#1A2A3A]">#{log.id}</td>
                    <td className="px-4 py-3 text-sm text-[#1A2A3A]">{log.event_type}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${log.status === 'success'
                            ? 'bg-green-100 text-green-600'
                            : log.status === 'failed'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-yellow-100 text-yellow-600'
                          }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${log.signature_valid
                            ? 'bg-green-100 text-green-600'
                            : log.signature_valid === false
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {log.signature_valid ? 'Valid' : log.signature_valid === false ? 'Invalid' : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6B7280]">{log.ip_address || '-'}</td>
                    <td className="px-4 py-3 text-sm text-[#6B7280]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}