'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean;
  allowedRoles?: ('user' | 'admin')[];
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  requireVerification = false,
  allowedRoles,
  redirectTo = '/auth/login'
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isVerified, hasRole, user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading) {
      return;
    }

    // isAuthenticated is boolean, not function
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (requireVerification && !isVerified()) {
      router.push(`/auth/verify-otp?contact=${encodeURIComponent(user?.email || '')}`);
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const hasValidRole = allowedRoles.some(role => hasRole(role));
      if (!hasValidRole) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [mounted, isAuthenticated, isVerified, hasRole, user, loading, requireAuth, requireVerification, allowedRoles, router, redirectTo]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ✅ Fix: isAuthenticated is boolean, not function
  if (requireAuth && !isAuthenticated) return null;  // ✅ Removed ()
  if (requireVerification && !isVerified()) return null;
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.some(role => hasRole(role))) return null;

  return <>{children}</>;
}