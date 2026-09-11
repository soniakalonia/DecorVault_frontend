import AppImage from '@/components/ui/AppImage';


interface OrderItem {
  id: string;
  name: string;
  image: string;
  alt: string;
  quantity: number;
  variant: string;
  price: number;
}

interface OrderDetailsProps {
  items: OrderItem[];
  subtotal: number;
  gst: number;
  deliveryCharges: number;
  total: number;
}

const OrderDetails = ({ items, subtotal, gst, deliveryCharges, total }: OrderDetailsProps) => {
  return (
    <div className="rounded-lg bg-card p-6 shadow-elevation-2">
      <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
        Order Details
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start space-x-4 rounded-md border border-border p-4 transition-smooth hover:bg-muted"
          >
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
              <AppImage
                src={item.image}
                alt={item.alt}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-foreground">
                {item.name}
              </h3>
              <p className="caption mt-1 text-muted-foreground">
                {item.variant}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="caption text-muted-foreground">
                  Qty: {item.quantity}
                </span>
                <span className="data-text text-base font-semibold text-primary">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-border pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="data-text font-medium text-foreground">
            ₹{subtotal.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">GST (18%)</span>
          <span className="data-text font-medium text-foreground">
            ₹{gst.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Delivery Charges</span>
          <span className="data-text font-medium text-success">
            {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges.toLocaleString('en-IN')}`}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3 text-base">
          <span className="font-semibold text-foreground">Total Amount</span>
          <span className="data-text text-xl font-bold text-primary">
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;



