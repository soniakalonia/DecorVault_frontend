'use client';

import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
  image: string;
  alt: string;
}

interface OrderHistoryItemProps {
  orderId: string;
  orderDate: string;
  status: string;
  statusColor: string;
  totalAmount: number;
  products: OrderProduct[];
  trackingNumber: string;
}

const OrderHistoryItem = ({
  orderId,
  orderDate,
  status,
  statusColor,
  totalAmount,
  products,
  trackingNumber,
}: OrderHistoryItemProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-elevation-1 transition-smooth hover:shadow-elevation-2 md:p-6">
      <div className="mb-4 flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <div className="mb-1 flex items-center space-x-2">
            <h3 className="font-heading text-lg font-semibold text-card-foreground">
              Order #{orderId}
            </h3>
            <span className={`caption rounded-full px-3 py-1 ${statusColor}`}>{status}</span>
          </div>
          <p className="caption text-muted-foreground">Placed on {orderDate}</p>
        </div>
        <div className="flex flex-col space-y-2 md:items-end">
          <p className="data-text text-xl font-semibold text-primary">
            ₹{totalAmount.toLocaleString('en-IN')}
          </p>
          <Link
            href={`/order-tracking?order=${orderId}`}
            className="flex items-center space-x-1 text-sm text-accent transition-smooth hover:text-accent/80"
          >
            <Icon name="TruckIcon" size={16} />
            <span>Track Order</span>
          </Link>
        </div>
      </div>

      <div className="mb-4 space-y-3">
        {products.map(product => (
          <div key={product.id} className="flex items-center space-x-3">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
              <AppImage
                src={product.image}
                alt={product.alt}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">{product.name}</p>
              <p className="caption text-muted-foreground">Qty: {product.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col space-y-2 border-t border-border pt-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <p className="caption text-muted-foreground">
          Tracking:{' '}
          <span className="data-text font-medium text-card-foreground">{trackingNumber}</span>
        </p>
        <div className="flex space-x-2">
          <Link
            href={`/order-tracking?order=${orderId}`}
            className="flex items-center space-x-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.97]"
          >
            <Icon name="EyeIcon" size={16} />
            <span>View Details</span>
          </Link>
          <button className="flex items-center space-x-1 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-muted">
            <Icon name="ArrowDownTrayIcon" size={16} />
            <span>Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryItem;
