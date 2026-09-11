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
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
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
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-elevation-1 transition-smooth hover:shadow-elevation-2">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
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
      </div>

      <div className="flex space-x-2 border-t border-border pt-3">
        <button
          onClick={onEdit}
          className="flex flex-1 items-center justify-center space-x-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
        >
          <Icon name="PencilIcon" size={16} />
          <span>Edit</span>
        </button>
        {!isDefault && (
          <button
            onClick={onSetDefault}
            className="flex flex-1 items-center justify-center space-x-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.97]"
          >
            <Icon name="CheckIcon" size={16} />
            <span>Set Default</span>
          </button>
        )}
        <button
          onClick={onDelete}
          className="flex items-center justify-center rounded-md border border-error bg-background px-3 py-2 text-error transition-smooth hover:bg-error/10"
          aria-label="Delete address"
        >
          <Icon name="TrashIcon" size={16} />
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
