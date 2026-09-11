'use client';

import AuthGuard from '@/features/auth/components/AuthGuard';
import AdminSidebar from './components/AdminSidebar';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={true} requireVerification={false} allowedRoles={['admin']}>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}