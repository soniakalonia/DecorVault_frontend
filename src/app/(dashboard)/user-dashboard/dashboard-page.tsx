import type { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';
import DashboardInteractive from './dashboard-components/DashboardInteractive';

export const metadata: Metadata = {
  title: 'My Account - Decor Vault',
  description:
    'Manage your Decor Vault account, view order history, track deliveries, manage wishlist, update profile information, and access saved addresses in your personalized dashboard.',
};

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-full px-4 py-6 sm:px-6 md:px-8 md:py-8">
        <Breadcrumb />
        <DashboardInteractive />
      </main>
    </div>
  );
}
