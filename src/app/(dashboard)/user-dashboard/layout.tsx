'use client';

import UserSidebar from './components/UserSidebar';
import AdminSidebar from '../admin-dashboard/components/AdminSidebar';
import Breadcrumb from '@/components/common/Breadcrumb';
import AuthGuard from '@/features/auth/components/AuthGuard';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <AuthGuard
      requireAuth={true}
      requireVerification={false}
      allowedRoles={['user', 'admin']}
    >
      <div className="min-h-screen bg-background">
        <main className="flex">
          {isAdmin ? <AdminSidebar /> : <UserSidebar />}
          <div className="flex-1 min-h-screen">
            <div className="p-6 lg:p-8">
              <Breadcrumb />
              <div className="mt-6">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}