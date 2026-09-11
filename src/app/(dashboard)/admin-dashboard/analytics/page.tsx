import type { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';
import AdminSidebar from '../components/AdminSidebar';
import MobileSidebar from '../components/MobileSidebar';
import AnalyticsDashboard from './AnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Analytics - Admin Dashboard',
  description: 'View analytics and insights for Decor Vault business performance.',
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MobileSidebar />
      <main className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen">
          <div className="p-6 lg:p-8 lg:pl-8 pl-16">
            <Breadcrumb />
            <div className="mt-6">
              <AnalyticsDashboard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
