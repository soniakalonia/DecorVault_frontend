import type { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';

export const metadata: Metadata = {
  title: 'Returns - Admin Dashboard',
  description: 'Manage product returns and refunds for Decor Vault.',
};

export default function ReturnPage() {
  return (
    <div className="flex-1 p-6">
      <Breadcrumb />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-espresso">Returns</h1>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
          <p className="text-mocha-grey">Return management content will be implemented here.</p>
        </div>
      </div>
    </div>
  );
}