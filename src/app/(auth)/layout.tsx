import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Decor Vault',
  description: 'Secure login and registration for Decor Vault',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-soft-linen">
      {children}
    </div>
  );
}



