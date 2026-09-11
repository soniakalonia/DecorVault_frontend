import { baseApi } from './baseApi';
import type { Notification } from './notificationApi';

export const userNotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserNotifications: builder.query<{ success: boolean; notifications: Notification[] }, { limit?: number }>({
      query: (params) => ({
        url: '/protected/notifications',
        params,
      }),
      providesTags: ['Notification'],
    }),
    markUserNotificationAsRead: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/protected/notification/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllUserNotificationsAsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/protected/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    getUserUnreadCount: builder.query<{ success: boolean; count: number }, void>({
      query: () => '/protected/notifications/unread-count',
      providesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetUserNotificationsQuery,
  useMarkUserNotificationAsReadMutation,
  useMarkAllUserNotificationsAsReadMutation,
  useGetUserUnreadCountQuery,
} = userNotificationApi;
