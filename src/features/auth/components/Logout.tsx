'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useLogoutMutation } from '../../../store/api/authApi';

interface LogoutProps {
  reason?: 'manual' | 'session-expired' | 'security';
  message?: string;
}

export default function Logout({ reason = 'manual', message }: LogoutProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [logoutMutation] = useLogoutMutation();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logoutMutation().unwrap();
      } catch (error) {
        // Continue with logout even if API call fails
        console.error('Logout API error:', error);
      } finally {
        logout();
        
        // Redirect based on reason
        const redirectUrl = reason === 'session-expired' 
          ? '/auth/login?expired=true'
          : '/auth/login';
        
        router.push(redirectUrl);
      }
    };

    performLogout();
  }, [logout, logoutMutation, router, reason]);

  const getTitle = () => {
    switch (reason) {
      case 'session-expired':
        return 'Session Expired';
      case 'security':
        return 'Security Logout';
      default:
        return 'Signing Out';
    }
  };

  const getMessage = () => {
    if (message) return message;
    
    switch (reason) {
      case 'session-expired':
        return 'Your session has expired. Please sign in again.';
      case 'security':
        return 'You have been logged out for security reasons.';
      default:
        return 'You are being signed out...';
    }
  };

  return (
    <div className="min-h-screen bg-soft-linen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-mocha-grey/10">
            <svg className="h-8 w-8 text-mocha-grey animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-heading font-bold text-espresso">
            {getTitle()}
          </h2>
          <p className="mt-2 text-mocha-grey">
            {getMessage()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="animate-pulse space-y-2">
              <div className="h-2 bg-soft-stone rounded w-3/4 mx-auto"></div>
              <div className="h-2 bg-soft-stone rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



