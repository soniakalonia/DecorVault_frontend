'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import FormInput from '../../../features/auth/components/FormInput';
import { useForgotPasswordMutation } from '../../../store/api/authApi';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPasswordMutation, { isLoading }] = useForgotPasswordMutation();

  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateInput = () => {
    if (!emailOrMobile.trim()) {
      setError('Email or mobile number is required');
      return false;
    }

    const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailOrMobile);
    const isMobile = /^[6-9]\d{9}$/.test(emailOrMobile);

    if (!isEmail && !isMobile) {
      setError('Enter a valid email or 10-digit mobile number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput()) return;

    try {
      await forgotPasswordMutation({ emailOrMobile }).unwrap();
      router.push(`/reset-password?contact=${encodeURIComponent(emailOrMobile)}`);
    } catch {
      // Even on error, we might want to redirect for security, 
      // but usually for dev/better UX we show error if it's "not found"
      setError('Account not found with this email/mobile');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailOrMobile(e.target.value);
    if (error) setError('');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-soft-linen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-heading font-bold text-espresso">
              Check Your Inbox
            </h2>
            <p className="mt-2 text-mocha-grey">
              If an account exists with that email/mobile, we've sent password reset instructions.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <p className="text-sm text-mocha-grey">
                  Didn't receive the email? Check your spam folder or
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-olive-green hover:text-cocoa-brown font-medium transition-colors"
                >
                  try again with a different email/mobile
                </button>
              </div>

              <div className="pt-4 border-t border-soft-stone">
                <Link
                  href="/auth/login"
                  className="text-mocha-grey hover:text-espresso transition-colors"
                >
                  ← Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-linen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-bold text-espresso">
            Forgot Password?
          </h2>
          <p className="mt-2 text-mocha-grey">
            Enter your email or mobile number to reset your password
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <FormInput
              label="Email or Mobile Number"
              type="text"
              name="emailOrMobile"
              value={emailOrMobile}
              onChange={handleChange}
              error=""
              placeholder="Enter your email or mobile number"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-olive-green text-white py-3 px-4 rounded-lg hover:bg-cocoa-brown focus:ring-2 focus:ring-olive-green focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-mocha-grey hover:text-espresso transition-colors"
              >
                ← Back to Login
              </Link>
            </div>
          </form>
        </div>

        <div className="text-center text-sm text-mocha-grey">
          <p>Remember your password? </p>
          <Link
            href="/login"
            className="text-olive-green hover:text-cocoa-brown transition-colors"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}



