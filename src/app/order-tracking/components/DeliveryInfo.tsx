import Icon from '@/components/ui/AppIcon';

interface DeliveryInfoProps {
  deliveryPartner: string;
  partnerContact: string;
  expectedDelivery: string;
  deliveryAddress: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

const DeliveryInfo = ({
  deliveryPartner,
  partnerContact,
  expectedDelivery,
  deliveryAddress,
  customerName,
  customerEmail,
  customerPhone,
}: DeliveryInfoProps) => {
  return (
    <div className="rounded-lg bg-card p-6 shadow-elevation-2">
      <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
        Delivery Information
      </h2>

      <div className="space-y-4">
        {customerName && (
          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Icon name="UserIcon" size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Customer Name</p>
              <p className="caption mt-1 text-muted-foreground">{customerName}</p>
            </div>
          </div>
        )}

        {customerEmail && (
          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
              <Icon name="EnvelopeIcon" size={20} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Email</p>
              <p className="caption mt-1 text-muted-foreground">{customerEmail}</p>
            </div>
          </div>
        )}

        {customerPhone && (
          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-success/10">
              <Icon name="PhoneIcon" size={20} className="text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Phone Number</p>
              <p className="caption mt-1 text-muted-foreground">{customerPhone}</p>
            </div>
          </div>
        )}

        <div className="flex items-start space-x-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary/10">
            <Icon name="MapPinIcon" size={20} className="text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Delivery Address</p>
            <p className="caption mt-1 text-muted-foreground">{deliveryAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;



