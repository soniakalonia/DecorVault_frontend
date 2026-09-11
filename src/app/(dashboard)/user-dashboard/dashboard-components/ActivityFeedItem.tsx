import Icon from '@/components/ui/AppIcon';

interface ActivityFeedItemProps {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  timestamp: string;
}

const ActivityFeedItem = ({
  icon,
  iconColor,
  title,
  description,
  timestamp,
}: ActivityFeedItemProps) => {
  return (
    <div className="flex space-x-3 border-b border-border pb-3 last:border-0 last:pb-0">
      <div className={`flex-shrink-0 rounded-full ${iconColor} p-2`}>
        <Icon name={icon as any} size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-card-foreground">{title}</p>
        <p className="caption text-muted-foreground line-clamp-2">{description}</p>
        <p className="caption mt-1 text-muted-foreground">{timestamp}</p>
      </div>
    </div>
  );
};

export default ActivityFeedItem;
