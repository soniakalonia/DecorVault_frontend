'use client';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { useGetAllNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation, useDeleteNotificationMutation, useGetNotificationStatsQuery, useCreateNotificationMutation, Notification } from '@/store/api/notificationApi';
import { Check, Trash2, Filter, Plus, X } from 'lucide-react';

type NotificationFilter = {
  type?: Notification['type'];
  is_read?: boolean;
  priority?: Notification['priority'];
};

type DraftNotification = Pick<Notification, 'type' | 'title' | 'message' | 'priority' | 'link'>;

export default function NotificationsPage() {
  const [filter, setFilter] = useState<NotificationFilter>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState<DraftNotification>({ type: 'system', title: '', message: '', priority: 'medium', link: '' });
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, refetch } = useGetAllNotificationsQuery(filter);
  const { data: stats } = useGetNotificationStatsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [createNotification] = useCreateNotificationMutation();

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
    refetch();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    refetch();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      await deleteNotification(id);
      refetch();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createNotification(newNotification);
    setShowCreateModal(false);
    setNewNotification({ type: 'system', title: '', message: '', priority: 'medium', link: '' });
    refetch();
  };

  useEffect(() => {
    setPage(1);
  }, [filter.type, filter.is_read, filter.priority]);

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order': return '📦';
      case 'inventory': return '📊';
      case 'system': return '⚙️';
      case 'promotion': return '🎉';
      case 'alert': return '⚠️';
      default: return '🔔';
    }
  };

  const totalNotifications = data?.notifications.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalNotifications / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, totalNotifications);
  const paginatedNotifications = data?.notifications.slice(pageStart, pageEnd) || [];

  return (
    <div className="flex-1 p-6 min-w-0">
      <Breadcrumb />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-espresso">Notifications</h1>
          <div className="flex gap-3">
            <button onClick={handleMarkAllAsRead} className="px-4 py-2 bg-[#D4AF37] text-[#1A1A2E] rounded-lg hover:bg-[#C5A035] flex items-center gap-2">
              <Check size={18} /> Mark All Read
            </button>
            <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-[#D4AF37] text-[#1A1A2E] rounded-lg hover:bg-[#C5A035] flex items-center gap-2">
              <Plus size={18} /> Create
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.stats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-black-600">{stats.stats.unread}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-600">By Type</p>
              <div className="text-xs mt-1">{stats.stats.byType.map(t => `${t.type}: ${t.count}`).join(', ')}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-600">By Priority</p>
              <div className="text-xs mt-1">{stats.stats.byPriority.map(p => `${p.priority}: ${p.count}`).join(', ')}</div>
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow-sm border flex gap-3 items-center">
          <Filter size={18} />
          <select
            value={filter.type || ''}
            onChange={(e) =>
              setFilter((prev) => {
                const next = { ...prev };
                if (e.target.value) {
                  next.type = e.target.value as Notification['type'];
                } else {
                  delete next.type;
                }
                return next;
              })
            }
            className="px-3 py-1 border rounded"
          >
            <option value="">All Types</option>
            <option value="order">Order</option>
            <option value="inventory">Inventory</option>
            <option value="system">System</option>
            <option value="promotion">Promotion</option>
            <option value="alert">Alert</option>
          </select>
          <select
            value={filter.is_read === undefined ? '' : filter.is_read.toString()}
            onChange={(e) =>
              setFilter((prev) => {
                const next = { ...prev };
                if (e.target.value === '') {
                  delete next.is_read;
                } else {
                  next.is_read = e.target.value === 'true';
                }
                return next;
              })
            }
            className="px-3 py-1 border rounded"
          >
            <option value="">All Status</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </select>
          <select
            value={filter.priority || ''}
            onChange={(e) =>
              setFilter((prev) => {
                const next = { ...prev };
                if (e.target.value) {
                  next.priority = e.target.value as Notification['priority'];
                } else {
                  delete next.priority;
                }
                return next;
              })
            }
            className="px-3 py-1 border rounded"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border">
          {isLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : totalNotifications === 0 ? (
            <div className="p-8 text-center text-gray-500">No notifications found</div>
          ) : (
            <div className="divide-y">
              {paginatedNotifications.map((notification) => (
                <div key={notification.id} className={`p-4 hover:bg-gray-50 transition ${!notification.is_read ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{notification.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(notification.priority)}`}>{notification.priority}</span>
                          {!notification.is_read && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                        {notification.link && (
                          <a href={notification.link} className="text-blue-600 text-sm hover:underline">View Details →</a>
                        )}
                        <p className="text-xs text-gray-400 mt-2">{new Date(notification.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.is_read && (
                        <button onClick={() => handleMarkAsRead(notification.id)} className="p-2 text-blue-600 hover:bg-blue-100 rounded" title="Mark as read">
                          <Check size={18} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(notification.id)} className="p-2 text-red-600 hover:bg-red-100 rounded" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalNotifications > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              Showing {pageStart + 1} to {pageEnd} of {totalNotifications}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={safePage === 1}
              >
                Prev
              </button>
              <span className="px-2 text-gray-700">
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safePage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create Notification</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={newNotification.type} onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value as Notification['type'] })} className="w-full px-3 py-2 border rounded" required>
                  <option value="order">Order</option>
                  <option value="inventory">Inventory</option>
                  <option value="system">System</option>
                  <option value="promotion">Promotion</option>
                  <option value="alert">Alert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select value={newNotification.priority} onChange={(e) => setNewNotification({ ...newNotification, priority: e.target.value as Notification['priority'] })} className="w-full px-3 py-2 border rounded" required>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={newNotification.title} onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea value={newNotification.message} onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })} className="w-full px-3 py-2 border rounded" rows={3} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link (Optional)</label>
                <input type="text" value={newNotification.link} onChange={(e) => setNewNotification({ ...newNotification, link: e.target.value })} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 px-4 py-2 bg-[#D4AF37] text-[#1A1A2E] rounded hover:bg-[#C5A035]">Create</button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}