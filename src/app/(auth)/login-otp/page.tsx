'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import FormInput from '../../../features/auth/components/FormInput';
import OTPInput from '../../../features/auth/components/OTPInput';
import { useSendLoginOTPMutation, useVerifyLoginOTPMutation } from '../../../store/api/authApi';
import { useAuth } from '../../../features/auth/hooks/useAuth';

export default function LoginOTPPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [sendLoginOTP, { isLoading: isSending }] = useSendLoginOTPMutation();
  const [verifyLoginOTP, { isLoading: isVerifying }] = useVerifyLoginOTPMutation();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');

  const validateContact = () => {
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

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateContact()) return;

    try {
      await sendLoginOTP({ emailOrMobile }).unwrap();
      setStep('otp');
      setTimer(60);
      setError('');

      // Start timer
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      setError(error?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;

    try {
      const result = await verifyLoginOTP({
        emailOrMobile,
        otp
      }).unwrap();

      login(result.user, result.token);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error?.data?.message || 'Invalid OTP. Please try again.');
      setOtp('');
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;

    try {
      await sendLoginOTP({ emailOrMobile }).unwrap();
      setTimer(60);
      setError('');
      setOtp('');

      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
          <h2 className="text-3xl font-heading font-bold text-espresso">
            {step === 'phone' ? 'Login with OTP' : 'Enter OTP'}
          </h2>
          <p className="mt-2 text-mocha-grey">
            {step === 'phone'
              ? 'Quick and secure login for Indian users'
              : `Enter the 6-digit code sent to ${emailOrMobile}`
            }
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
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
                onChange={(e) => {
                  setEmailOrMobile(e.target.value);
                  if (error) setError('');
                }}
                error=""
                placeholder="Enter email or mobile number"
                required
              />

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-olive-green text-white py-3 px-4 rounded-lg hover:bg-cocoa-brown focus:ring-2 focus:ring-olive-green focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? 'Sending OTP...' : 'Send OTP'}
              </button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-mocha-grey hover:text-espresso transition-colors"
                >
                  ← Back to Password Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <label className="block text-sm font-medium text-espresso text-center">
                  Enter OTP
                </label>

                <OTPInput
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    if (value.length === 6) {
                      handleVerifyOTP();
                    }
                  }}
                  disabled={isVerifying}
                />
              </div>

              <div className="text-center space-y-4">
                {timer > 0 ? (
                  <p className="text-mocha-grey">
                    Resend OTP in {formatTime(timer)}
                  </p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    className="text-olive-green hover:text-cocoa-brown font-medium transition-colors"
                  >
                    Resend OTP
                  </button>
                )}

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setStep('phone');
                      setOtp('');
                      setError('');
                    }}
                    className="text-mocha-grey hover:text-espresso transition-colors"
                  >
                    ← Change Email/Mobile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-mocha-grey">
          <p>Don't have an account? </p>
          <Link
            href="/register"
            className="text-olive-green hover:text-cocoa-brown transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}



