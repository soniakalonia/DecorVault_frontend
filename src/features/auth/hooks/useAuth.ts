import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux';
import { setCredentials, logout, setLoading } from '@/store/slices/auth';
import type { User } from '../types';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  // Add a state to force re-render on storage changes
  const [, setStorageKey] = useState(0);

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'user_data') {
        // Force re-render
        setStorageKey(prev => prev + 1);
      }
    };

    // Listen for storage events (from other tabs)
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically for changes in same tab
    const interval = setInterval(() => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      // If token exists but Redux doesn't have it, sync
      if (token && userData && !auth.token) {
        try {
          const user = JSON.parse(userData);
          dispatch(setCredentials({ user, token }));
        } catch (e) {
          // ignore
        }
      }
    }, 1000); // Check every second

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [auth.token, dispatch]);

  const login = (user: User, token: string) => {
    dispatch(setCredentials({ user, token }));
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    // ✅ Force re-render
    setStorageKey(prev => prev + 1);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('remember_me');
    // ✅ Force re-render
    setStorageKey(prev => prev + 1);
  };

  const setAuthLoading = (loading: boolean) => {
    dispatch(setLoading(loading));
  };

  const isAuthenticated = !!auth.token && !!auth.user;

  const hasRole = (role: 'user' | 'admin') => {
    return auth.user?.role === role;
  };

  const isVerified = () => {
    return auth.user?.isVerified === true;
  };

  return {
    ...auth,
    login,
    logout: handleLogout,
    setLoading: setAuthLoading,
    isAuthenticated,
    hasRole,
    isVerified,
  };
};