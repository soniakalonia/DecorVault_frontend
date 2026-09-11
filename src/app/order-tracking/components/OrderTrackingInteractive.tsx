'use client';

import { useSearchParams } from 'next/navigation';
import { useGetOrderByIdQuery, useGetUserOrdersQuery } from '@/store/api/orderApi';
import TrackingTimeline from './TrackingTimeline';
import OrderDetails from './OrderDetails';
import DeliveryInfo from './DeliveryInfo';
import OrderActions from './OrderActions';
import RelatedOrders from './RelatedOrders';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface TimelineStage {
  id: string;
  status: string;
  description: string;
  timestamp: string;
  location: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

const OrderTrackingInteractive = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { data, isLoading, error } = useGetOrderByIdQuery(orderId || '', { skip: !orderId });
  const { data: ordersData, isLoading: ordersLoading } = useGetUserOrdersQuery();

  if (!orderId) {
    if (ordersLoading) {
      return (
        <div className="rounded-md bg-card p-8">
          <div className="h-8 w-48 animate-pulse rounded-md bg-muted mb-4" />
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-md bg-muted" />
            <div className="h-20 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      );
    }

    const recentOrders = ordersData?.orders || [];

    if (recentOrders.length === 0) {
      return (
        <div className="rounded-md bg-card p-8 text-center">
          <Icon name="ShoppingBagIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No orders found</p>
          <p className="text-muted-foreground mb-6">You haven't placed any orders yet</p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98]"
          >
            <span>Start Shopping</span>
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
        </div>
      );
    }

    return (
      <div className="rounded-md bg-card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Select an order to track</h2>
        <div className="space-y-3">
          {recentOrders.map((order: any) => (
            <Link
              key={order.id}
              href={`/order-tracking?orderId=${order.id}`}
              className="block rounded-md border border-border p-4 transition-smooth hover:bg-muted"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-foreground">
                      ORD-{String(order.id).padStart(3, '0')}
                    </p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(order.created_at).toLocaleDateString('en-GB')} • {order.item_count || 1} items
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-base font-semibold text-primary">
                    ₹{order.total.toLocaleString('en-IN')}
                  </p>
                  <Icon name="ChevronRightIcon" size={20} className="mt-1 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 animate-pulse rounded-md bg-muted" />
        <div className="h-48 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="rounded-md bg-card p-8 text-center">
        <p className="text-error">Order not found or you don't have access to this order</p>
      </div>
    );
  }

  const order = data.order;
  let address: any = {};
  try {
    address = typeof order.address === 'string' ? JSON.parse(order.address) : order.address;
  } catch (e) {
    console.error('Failed to parse address:', e);
    address = {};
  }
  
  // ✅ FIXED: getTrackingStages with proper dates from database
  const getTrackingStages = (status: string): TimelineStage[] => {
    const stages: TimelineStage[] = [];

    const formatDate = (date: string) => {
      if (!date) return 'N/A';
      return new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const isCancelled = status === 'cancelled';
    const isDelivered = status === 'delivered';

    // ✅ Get dates from database - ALAG-ALAG DATES
    const createdDate = formatDate(order.created_at);
    const confirmedDate = order.confirmed_at ? formatDate(order.confirmed_at) : 'N/A';
    const shippedDate = order.shipped_at ? formatDate(order.shipped_at) : 'N/A';
    const deliveredDate = order.delivered_at ? formatDate(order.delivered_at) : 'N/A';
    const cancelledDate = order.cancelled_at ? formatDate(order.cancelled_at) : 'N/A';

    const isConfirmed = ['confirmed', 'shipped', 'delivered'].includes(status);
    const isShipped = ['shipped', 'delivered'].includes(status);

    // Stage 1: Order Placed
    stages.push({
      id: '1',
      status: 'Order Placed',
      description: 'Your order has been placed successfully',
      timestamp: createdDate,
      location: 'Online',
      isCompleted: true,
      isCurrent: status === 'pending' && !isCancelled,
    });

    // Stage 2: Order Confirmed
    stages.push({
      id: '2',
      status: 'Order Confirmed',
      description: 'Your order has been confirmed and is being processed',
      timestamp: confirmedDate,
      location: 'Processing Center',
      isCompleted: isConfirmed || isCancelled,
      isCurrent: status === 'confirmed' && !isCancelled,
    });

    // Stage 3: Shipped
    stages.push({
      id: '3',
      status: 'Shipped',
      description: 'Your order has been shipped and is on the way',
      timestamp: shippedDate,
      location: 'In Transit',
      isCompleted: isShipped || isCancelled,
      isCurrent: status === 'shipped' && !isCancelled,
    });

    // Stage 4: Delivered - ONLY if order is delivered
    if (isDelivered) {
      stages.push({
        id: '4',
        status: 'Delivered',
        description: 'Your order has been delivered successfully',
        timestamp: deliveredDate,
        location: 'Delivered to your address',
        isCompleted: true,
        isCurrent: true,
      });
    }

    // Stage 5: Cancelled - ONLY if order is actually cancelled (NOT when delivered)
    if (isCancelled && !isDelivered) {
      // Mark all previous stages as completed
      stages.forEach(s => s.isCompleted = true);
      
      stages.push({
        id: '5',
        status: 'Cancelled',
        description: order.cancel_reason || 'Order has been cancelled',
        timestamp: cancelledDate,
        location: 'Cancelled',
        isCompleted: true,
        isCurrent: true,
      });
    }

    return stages;
  };

  const orderItems = order.items?.map((item: any) => {
    let images = []
    try {
      images = typeof item.product_images === 'string' ? JSON.parse(item.product_images) : item.product_images
    } catch (e) {
      images = []
    }
    return {
      id: item.id.toString(),
      name: item.name,
      image: Array.isArray(images) ? images[0] || '' : '',
      alt: item.name,
      quantity: item.quantity,
      variant: '',
      price: item.price,
    }
  }) || [];

  const relatedOrders = (ordersData?.orders || [])
    .filter((o: any) => o.id.toString() !== orderId)
    .slice(0, 3)
    .map((o: any) => ({
      id: o.id.toString(),
      orderId: `ORD-${String(o.id).padStart(3, '0')}`,
      date: new Date(o.created_at).toLocaleDateString('en-GB'),
      status: o.status === 'delivered' ? 'Delivered' : o.status === 'cancelled' ? 'Cancelled' : o.status === 'pending' ? 'Processing' : 'In Transit',
      total: o.total,
      itemCount: o.item_count || 1,
    }));

  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrackingTimeline 
            orderId={`ORD${orderId}`} 
            stages={getTrackingStages(order.status)} 
          />
        </div>
        <div className="space-y-6">
          <DeliveryInfo
            deliveryPartner="Standard Delivery"
            partnerContact="+91 98765 43210"
            expectedDelivery="5-7 business days"
            deliveryAddress={`${address.addressLine1 || ''}, ${address.city || ''}, ${address.state || ''} - ${address.pincode || ''}`}
            customerName={order.full_name}
            customerEmail={order.email}
            customerPhone={order.mobile}
          />
          <OrderActions
            orderId={`ORD${orderId}`}
            canCancel={!isCancelled && !isDelivered && ['pending', 'confirmed'].includes(order.status)}
            canReturn={!isCancelled && order.status === 'delivered'}
            invoiceUrl={`/invoices/${orderId}.pdf`}
            orderTotal={order.total}
            paymentMethod={order.payment_method}
            orderStatus={order.status}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OrderDetails
            items={orderItems}
            subtotal={order.subtotal}
            gst={order.gst}
            deliveryCharges={order.delivery_charges}
            total={order.total}
          />
        </div>
        <div>
          <RelatedOrders orders={relatedOrders} />
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingInteractive;