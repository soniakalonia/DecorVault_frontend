import type { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';
import AdminSidebar from '../components/AdminSidebar';

export const metadata: Metadata = {
  title: 'Inactive Draft - Admin Dashboard',
  description: 'Manage inactive and draft products for Decor Vault.',
};

export default function InactiveDraftPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <Breadcrumb />
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-espresso">Inactive Draft</h1>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
              <p className="text-mocha-grey">Inactive and draft products will be displayed here.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}