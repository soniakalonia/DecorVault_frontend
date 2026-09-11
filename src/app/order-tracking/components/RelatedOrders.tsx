import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface RelatedOrder {
  id: string;
  orderId: string;
  date: string;
  status: string;
  total: number;
  itemCount: number;
}

interface RelatedOrdersProps {
  orders: RelatedOrder[];
}

const RelatedOrders = ({ orders }: RelatedOrdersProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-success/10 text-success';
      case 'in transit':
        return 'bg-primary/10 text-primary';
      case 'processing':
        return 'bg-accent/10 text-accent';
      case 'cancelled':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="rounded-lg bg-card p-6 shadow-elevation-2">
      <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
        Your Recent Orders
      </h2>

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/order-tracking?orderId=${order.orderId}`}
            className="block rounded-md border border-border p-4 transition-smooth hover:bg-muted"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="data-text text-sm font-medium text-foreground">
                    {order.orderId}
                  </p>
                  <span
                    className={`caption rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="caption mt-1 text-muted-foreground">
                  {order.date} • {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="data-text text-base font-semibold text-primary">
                  ₹{order.total.toLocaleString('en-IN')}
                </p>
                <Icon name="ChevronRightIcon" size={20} className="mt-1 text-muted-foreground" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/dashboard"
        className="mt-4 flex items-center justify-center space-x-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
      >
        <span>View All Orders</span>
        <Icon name="ArrowRightIcon" size={16} />
      </Link>
    </div>
  );
};

export default RelatedOrders;



