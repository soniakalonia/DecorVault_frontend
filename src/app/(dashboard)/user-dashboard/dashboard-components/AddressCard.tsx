'use client';

import Icon from '@/components/ui/AppIcon';

interface AddressCardProps {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

const AddressCard = ({
  name,
  addressLine1,
  addressLine2,
  city,
  state,
  pincode,
  phone,
  isDefault,
}: AddressCardProps) => {
  return (
    <div className="w-full rounded-lg border border-border bg-card p-4 shadow-elevation-1 transition-smooth hover:shadow-elevation-2">
      <div className="mb-1 flex items-center space-x-2">
        <h3 className="font-heading text-base font-semibold text-card-foreground">{name}</h3>
        {isDefault && (
          <span className="caption rounded-full bg-success/10 px-2 py-1 text-success">
            Default
          </span>
        )}
      </div>
      <p className="text-sm text-card-foreground">{addressLine1}</p>
      {addressLine2 && <p className="text-sm text-card-foreground">{addressLine2}</p>}
      <p className="text-sm text-card-foreground">
        {city}, {state} - {pincode}
      </p>
      <p className="caption mt-2 flex items-center space-x-1 text-muted-foreground">
        <Icon name="PhoneIcon" size={14} />
        <span>{phone}</span>
      </p>
    </div>
  );
};

export default AddressCard;