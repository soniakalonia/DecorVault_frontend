'use client';

import { useState } from 'react';
import { useGetUserOrdersQuery } from '@/store/api/orderApi';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Show 10 orders per page

  const { data: ordersData, isLoading } = useGetUserOrdersQuery();
  const allOrders = ordersData?.orders || [];

  // Calculate pagination
  const totalOrders = allOrders.length;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = allOrders.slice(startIndex, endIndex);

  // Reset to page 1 when orders change
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading mb-4">My Orders</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (allOrders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading mb-4">My Orders</h1>
        <div className="bg-card p-12 rounded-lg shadow-elevation-1 border border-border text-center">
          <Icon name="ShoppingBagIcon" size={64} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No orders yet</p>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98]"
          >
            <span>Browse Products</span>
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground font-heading">My Orders</h1>
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, totalOrders)} of {totalOrders} orders
        </p>
      </div>
      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-elevation-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Products</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Items</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-muted/50 transition-smooth">
                  <td className="px-4 py-4">
                    <p className="font-medium text-foreground">ORD-{String(order.id).padStart(3, '0')}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-foreground">{new Date(order.created_at).toLocaleDateString('en-GB')}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-foreground line-clamp-2">{order.product_names || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-foreground">{order.item_count || 1}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-primary">₹{order.total}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-success/10 text-success' :
                      order.status === 'pending' ? 'bg-warning/10 text-warning' :
                      'bg-accent/10 text-accent'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center">
                      <Link
                        href={`/order-tracking?orderId=${order.id}`}
                        className="flex items-center space-x-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98]"
                      >
                        <Icon name="TruckIcon" size={16} />
                        <span>Track</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md border border-border text-sm font-medium transition-smooth ${
                currentPage === 1
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-card hover:bg-muted hover:border-primary'
              }`}
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and 1 page around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-md border border-border text-sm font-medium transition-smooth ${
                        currentPage === page
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card hover:bg-muted'
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                // Show ellipsis
                if (page === 2 || page === totalPages - 1) {
                  return (
                    <span key={page} className="w-10 h-10 flex items-center justify-center text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md border border-border text-sm font-medium transition-smooth ${
                currentPage === totalPages
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-card hover:bg-muted hover:border-primary'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}