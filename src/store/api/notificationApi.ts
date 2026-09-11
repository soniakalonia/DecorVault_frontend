import { baseApi } from './baseApi';

export interface Notification {
  id: number;
  user_id?: number;
  type: 'order' | 'inventory' | 'system' | 'promotion' | 'alert';
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Array<{ type: string; count: number }>;
  byPriority: Array<{ priority: string; count: number }>;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query<{ success: boolean; notifications: Notification[] }, { type?: string; is_read?: boolean; priority?: string; limit?: number }>({
      query: (params) => ({
        url: '/admin/notifications',
        params,
      }),
      providesTags: ['Notification'],
    }),
    createNotification: builder.mutation<{ success: boolean; notificationId: number }, Partial<Notification>>({
      query: (data) => ({
        url: '/admin/notification',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notification'],
    }),
    markAsRead: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/admin/notification/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/admin/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/admin/notification/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
    getUnreadCount: builder.query<{ success: boolean; count: number }, void>({
      query: () => '/admin/notifications/unread-count',
      providesTags: ['Notification'],
    }),
    getNotificationStats: builder.query<{ success: boolean; stats: NotificationStats }, void>({
      query: () => '/admin/notifications/stats',
      providesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useCreateNotificationMutation,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useGetUnreadCountQuery,
  useGetNotificationStatsQuery,
} = notificationApi;
