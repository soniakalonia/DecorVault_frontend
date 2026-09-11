'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Activity {
  id: string;
  type: 'purchase' | 'review' | 'signup';
  message: string;
  location: string;
  timeAgo: string;
}

const SocialProofNotification = () => {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

  const activities: Activity[] = [
    {
      id: '1',
      type: 'purchase',
      message: 'Rajesh from Mumbai just purchased Premium Flower Pot Set',
      location: 'Mumbai',
      timeAgo: '2 minutes ago',
    },
    {
      id: '2',
      type: 'purchase',
      message: 'Priya from Delhi ordered Airtight Container Set',
      location: 'Delhi',
      timeAgo: '5 minutes ago',
    },
    {
      id: '3',
      type: 'review',
      message: 'Amit from Bangalore left a 5-star review',
      location: 'Bangalore',
      timeAgo: '8 minutes ago',
    },
    {
      id: '4',
      type: 'purchase',
      message: 'Sneha from Pune bought Heavy Duty Bucket Set',
      location: 'Pune',
      timeAgo: '12 minutes ago',
    },
  ];

  useEffect(() => {
    if (activities.length > 0) {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      if (randomActivity) {
        setCurrentActivity(randomActivity);
      }
    }
  }, []);

  if (!currentActivity) return null;

  const getIcon = () => {
    switch (currentActivity.type) {
      case 'purchase':
        return 'ShoppingBagIcon';
      case 'review':
        return 'StarIcon';
      case 'signup':
        return 'UserPlusIcon';
      default:
        return 'BellIcon';
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[500] animate-slide-in-left">
      <div className="flex max-w-[350px] items-start space-x-3 rounded-lg border border-border bg-card p-4 shadow-elevation-4">
        <div className="flex-shrink-0 rounded-full bg-success/10 p-2">
          <Icon name={getIcon() as any} size={20} className="text-success" variant="solid" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-card-foreground">{currentActivity.message}</p>
          <p className="caption mt-1 text-muted-foreground">{currentActivity.timeAgo}</p>
        </div>
        <Icon name="XMarkIcon" size={16} className="cursor-pointer text-muted-foreground hover:text-foreground" />
      </div>
    </div>
  );
};

export default SocialProofNotification;



