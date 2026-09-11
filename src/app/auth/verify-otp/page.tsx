'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import OTPInput from '../../../features/auth/components/OTPInput';
import { useVerifyOTPMutation, useResendOTPMutation } from '../../../store/api/authApi';
import { useAuth } from '../../../features/auth/hooks/useAuth';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get('contact') || '';
  const { login } = useAuth();

  const [verifyOTPMutation, { isLoading: isVerifying }] = useVerifyOTPMutation();
  const [resendOTPMutation, { isLoading: isResending }] = useResendOTPMutation();

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [_error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerifyOTP = useCallback(async () => {
    if (otp.length !== 6) return;

    try {
      const result = await verifyOTPMutation({
        emailOrMobile: contact,
        otp,
      }).unwrap();

      login(result.user, result.token);
      setSuccess('Account verified successfully!');

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      setError(error?.data?.message || 'Invalid OTP. Please try again.');
      setOtp('');
    }
  }, [otp, verifyOTPMutation, contact, login, router]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [timer]);

  useEffect(() => {
    if (timer === 0) {
      // Use setTimeout to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => setCanResend(true), 0);
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [timer]);

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      await resendOTPMutation({ emailOrMobile: contact }).unwrap();
      setTimer(60);
      setCanResend(false);
      setError('');
      setSuccess('OTP sent successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-soft-linen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-bold text-espresso">Verify Your Account</h2>
          <p className="mt-2 text-mocha-grey">Enter the 6-digit code sent to</p>
          <p className="font-medium text-espresso">{contact}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {_error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                {_error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-sm font-medium text-espresso text-center">
                Enter OTP
              </label>

              <OTPInput value={otp} onChange={setOtp} disabled={isVerifying} />

              <button
                onClick={handleVerifyOTP}
                disabled={isVerifying || otp.length !== 6}
                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:bg-secondary focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>

            <div className="text-center space-y-4">
              {timer > 0 ? (
                <p className="text-mocha-grey">Resend OTP in {formatTime(timer)}</p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="text-olive-green hover:text-cocoa-brown font-medium transition-colors disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend OTP'}
                </button>
              )}

              <div className="pt-4">
                <Link
                  href="/login"
                  className="text-mocha-grey hover:text-espresso transition-colors"
                >
                  ← Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-mocha-grey">
          <p>Didn't receive the code? Check your spam folder or</p>
          <Link
            href="/register"
            className="text-olive-green hover:text-cocoa-brown transition-colors"
          >
            try with a different email/mobile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-soft-linen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green mx-auto"></div>
            <p className="mt-4 text-mocha-grey">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}
