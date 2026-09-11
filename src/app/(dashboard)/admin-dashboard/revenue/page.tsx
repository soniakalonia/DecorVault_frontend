import type { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';

export const metadata: Metadata = {
  title: 'Revenue - Admin Dashboard',
  description: 'View revenue and earnings analytics for Decor Vault.',
};

export default function RevenuePage() {
  return (
    <div className="flex-1 p-6">
      <Breadcrumb />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-espresso">Revenue</h1>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
          <p className="text-mocha-grey">Revenue analytics and earnings will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}