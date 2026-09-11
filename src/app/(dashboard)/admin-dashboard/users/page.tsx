"use client";

import { useGetAllUsersQuery, useUpdateUserRoleMutation } from '@/store/api/usersApi';
// ❌ REMOVED: import AdminSidebar from '../components/AdminSidebar';
import Breadcrumb from '@/components/common/Breadcrumb';
import Icon from '@/components/ui/AppIcon';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

export default function UsersPage() {
  const { data, isLoading, error } = useGetAllUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  const handleRoleChange = async (userId: number, currentRole: 'user' | 'admin', userName: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const action = newRole === 'admin' ? 'promote' : 'demote';

    if (window.confirm(`Are you sure you want to ${action} ${userName} to ${newRole}?`)) {
      try {
        setUpdatingUserId(userId);
        await updateUserRole({ userId, role: newRole }).unwrap();
        toast.success(`User successfully ${action}d to ${newRole}`);
      } catch (err: any) {
        console.error('Failed to update user role:', err);
        toast.error(err.data?.message || 'Failed to update user role');
      } finally {
        setUpdatingUserId(null);
      }
    }
  };

  const users = data?.users || [];

  if (isLoading) return <div className="p-6">Loading users...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading users</div>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex-1 p-6 min-w-0 h-[calc(100vh-64px)] overflow-y-auto">
        <Breadcrumb />
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-espresso">Users ({users.length})</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm min-w-[1000px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Info</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.full_name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono text-gray-600">{user.mobile}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${user.is_verified
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                          {user.is_verified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleRoleChange(user.id, user.role, user.full_name)}
                          disabled={updatingUserId === user.id}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${user.role === 'admin'
                              ? 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                            }`}
                        >
                          {updatingUserId === user.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Icon name="ShieldCheckIcon" size={14} />
                          )}
                          {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="UsersIcon" size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                <p className="text-gray-500 mt-1">There are no registered users in the system yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}