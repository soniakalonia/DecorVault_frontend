'use client';

import { Bell, Check, CheckCheck } from 'lucide-react';
import {
  useGetUserNotificationsQuery,
  useMarkAllUserNotificationsAsReadMutation,
  useMarkUserNotificationAsReadMutation,
} from '@/store/api/userNotificationApi';

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'medium':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'low':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function NotificationsPage() {
  const { data, isLoading, isError, refetch } = useGetUserNotificationsQuery({ limit: 100 });
  const [markAsRead, { isLoading: isMarkingRead }] = useMarkUserNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAllRead }] = useMarkAllUserNotificationsAsReadMutation();

  const notifications = data?.notifications ?? [];
  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id).unwrap();
    refetch();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead().unwrap();
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-espresso font-heading">All Notifications</h1>
          <p className="text-sm text-mocha-grey mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0 || isMarkingAllRead}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95"
        >
          <CheckCheck size={16} />
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-elevation-1 border border-border overflow-hidden">
        {isLoading && (
          <div className="p-6 text-mocha-grey text-sm">Loading notifications...</div>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="p-10 text-center">
            <Bell size={20} className="mx-auto text-mocha-grey/70 mb-3" />
            <p className="text-mocha-grey text-sm">No notifications yet.</p>
            {isError && (
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 px-3 py-1.5 border border-border rounded-md text-sm text-espresso hover:bg-soft-linen"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {!isLoading && notifications.length > 0 && (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={`p-4 md:p-5 transition-colors ${
                  notification.is_read ? 'bg-white' : 'bg-primary/5'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm md:text-base font-semibold text-espresso">
                        {notification.title}
                      </h2>
                      <span
                        className={`px-2 py-0.5 text-[11px] font-semibold border rounded-full ${getPriorityStyles(notification.priority)}`}
                      >
                        {notification.priority}
                      </span>
                      {!notification.is_read && (
                        <span className="w-2 h-2 rounded-full bg-primary" aria-label="Unread" />
                      )}
                    </div>
                    <p className="text-sm text-mocha-grey mt-1">{notification.message}</p>
                    <div className="mt-2 flex items-center gap-3 flex-wrap">
                      <p className="text-xs text-mocha-grey/80">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                      {notification.link && (
                        <a
                          href={notification.link}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          View details
                        </a>
                      )}
                    </div>
                  </div>

                  {!notification.is_read && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={isMarkingRead}
                      className="inline-flex items-center gap-1.5 text-xs md:text-sm px-3 py-1.5 rounded-md border border-border text-espresso hover:bg-soft-linen disabled:opacity-60"
                    >
                      <Check size={14} />
                      Mark read
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
