'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormInput from '../../../features/auth/components/FormInput';
import { useLoginMutation } from '../../../store/api/authApi';
import { useAuth } from '../../../features/auth/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loginMutation, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.emailOrMobile.trim()) {
      newErrors.emailOrMobile = 'Email or mobile number is required';
    } else if (
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.emailOrMobile) &&
      !/^[6-9]\d{9}$/.test(formData.emailOrMobile)
    ) {
      newErrors.emailOrMobile = 'Enter valid email or 10-digit mobile number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await loginMutation(formData).unwrap();
      login(result.user, result.token);
      router.push('/dashboard');
    } catch (error: any) {
      setErrors({
        general: error?.data?.message || 'Login failed. Please try again.',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-bold text-foreground">Welcome Back</h2>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>

        <div className="bg-card rounded-xl shadow-elevation-3 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <FormInput
              label="Email or Mobile Number"
              type="text"
              name="emailOrMobile"
              value={formData.emailOrMobile}
              onChange={handleChange}
              error={errors.emailOrMobile || ''}
              placeholder="Enter email or mobile number"
              required
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password || ''}
              placeholder="Enter your password"
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <span className="ml-2 text-sm text-muted-foreground">Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-secondary transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:bg-secondary focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link
                href="/register"
                className="text-primary hover:text-secondary font-medium transition-colors"
              >
                Create account
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or</span>
              </div>
            </div>

            <Link
              href="/login-otp"
              className="w-full bg-card border border-border text-foreground py-3 px-4 rounded-lg hover:bg-muted focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors text-center block"
            >
              Login with OTP
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
