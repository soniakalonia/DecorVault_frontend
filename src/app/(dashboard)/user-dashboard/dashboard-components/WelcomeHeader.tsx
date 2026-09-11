'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface WelcomeHeaderProps {
  userName: string;
  accountStatus: string;
  loyaltyPoints: number;
}

const WelcomeHeader = ({ userName, accountStatus, loyaltyPoints }: WelcomeHeaderProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      let greeting = 'Good Morning';
      if (hours >= 12 && hours < 17) greeting = 'Good Afternoon';
      else if (hours >= 17) greeting = 'Good Evening';
      setCurrentTime(greeting);
    };
    updateTime();

    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) {
    return (
      <div className="rounded-lg bg-gradient-to-r from-primary to-accent p-6 shadow-elevation-2 md:p-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-white md:text-3xl">
              Welcome Back, {userName}!
            </h1>
            <p className="mt-1 text-sm text-white/90">Manage your orders and account settings</p>
          </div>
          <div className="flex flex-col space-y-2 md:items-end">
            <div className="flex items-center space-x-2 rounded-md bg-white/20 px-4 py-2 backdrop-blur-sm">
              <Icon name="StarIcon" size={20} className="text-white" variant="solid" />
              <span className="data-text text-sm font-medium text-white">
                {loyaltyPoints.toLocaleString('en-IN')} Points
              </span>
            </div>
            <span className="caption text-white/80">{accountStatus}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gradient-to-r from-primary to-accent p-6 shadow-elevation-2 md:p-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-white md:text-3xl">
            {currentTime}, {userName}!
          </h1>
          <p className="mt-1 text-sm text-white/90">Manage your orders and account settings</p>
        </div>
        <div className="flex flex-col space-y-2 md:items-end">
          <div className="flex items-center space-x-2 rounded-md bg-white/20 px-4 py-2 backdrop-blur-sm">
            <Icon name="StarIcon" size={20} className="text-white" variant="solid" />
            <span className="data-text text-sm font-medium text-white">
              {loyaltyPoints.toLocaleString('en-IN')} Points
            </span>
          </div>
          <span className="caption text-white/80">{accountStatus}</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
