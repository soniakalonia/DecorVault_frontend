import type { Metadata } from 'next';
import DashboardInteractive from './dashboard-components/DashboardInteractive';

export const metadata: Metadata = {
  title: 'My Account - Decor Vault',
  description:
    'Manage your Decor Vault account, view order history, track deliveries, manage wishlist, update profile information, and access saved addresses in your personalized dashboard.',
};

export default function UserDashboardPage() {
  return <DashboardInteractive />;
}
