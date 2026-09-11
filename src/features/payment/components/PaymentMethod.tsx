import Icon from '@/components/ui/AppIcon';

interface PaymentMethodProps {
  id: string;
  name: string;
  icon: string;
  description?: string;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  id,
  name,
  icon,
  description,
  selected = false,
  onSelect,
}) => {
  return (
    <button
      onClick={() => onSelect?.(id)}
      className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 transition-all duration-200 ${
        selected
          ? 'border-[#FF6B8A] bg-[#FFE0E8] shadow-sm'
          : 'border-gray-200 bg-white hover:border-[#FF6B8A] hover:bg-[#FFF5F7]'
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100">
        <Icon name={icon} size={24} className="text-[#FF6B8A]" />
      </div>
      <div className="flex-1 text-left">
        <p className="font-medium text-[#1A2A3A]">{name}</p>
        {description && (
          <p className="text-sm text-[#6B7280]">{description}</p>
        )}
      </div>
      {selected && (
        <Icon name="CheckCircleIcon" size={24} className="text-[#FF6B8A]" />
      )}
    </button>
  );
};