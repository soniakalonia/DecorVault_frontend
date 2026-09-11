import Icon from '@/components/ui/AppIcon';

interface QuickActionCardProps {
  title: string;
  value: string | number;
  icon: string;
  bgColor: string;
  textColor: string;
  onClick: () => void;
}

const QuickActionCard = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
  onClick,
}: QuickActionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${textColor} group rounded-lg p-6 shadow-elevation-1 transition-smooth hover:scale-[0.98] hover:shadow-elevation-2`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="caption mb-1 opacity-90">{title}</p>
          <p className="data-text text-2xl font-semibold md:text-3xl">{value}</p>
        </div>
        <div className="rounded-lg bg-white/20 p-3 transition-smooth group-hover:bg-white/30">
          <Icon name={icon as any} size={24} />
        </div>
      </div>
    </button>
  );
};

export default QuickActionCard;
