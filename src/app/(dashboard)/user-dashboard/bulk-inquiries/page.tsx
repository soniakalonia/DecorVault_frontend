'use client'

import { useGetBulkOrdersQuery } from '@/store/api/bulkOrdersApi'

export default function BulkInquiriesPage() {
  const { data, isLoading, error } = useGetBulkOrdersQuery()

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      quoted: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-espresso font-heading mb-4">Bulk Inquiries</h1>
      <div className="bg-white p-6 rounded-2xl shadow-elevation-1 border border-border">
        {isLoading && <p className="text-mocha-grey">Loading...</p>}
        {error && <p className="text-red-600">Error loading bulk inquiries</p>}
        {data?.data && data.data.length === 0 && (
          <p className="text-mocha-grey">No bulk inquiries found.</p>
        )}
        {data?.data && data.data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Contact</th>
                  <th className="text-left py-3 px-4">Message</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{order.product_name}</td>
                    <td className="py-3 px-4">{order.name}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>{order.email}</div>
                        <div className="text-mocha-grey">{order.phone}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">{order.message || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-mocha-grey">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
