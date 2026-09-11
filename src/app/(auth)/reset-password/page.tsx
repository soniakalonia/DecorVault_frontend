'use client';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import FormInput from '../../../features/auth/components/FormInput';
import PasswordStrength from '../../../features/auth/components/PasswordStrength';
import { useResetPasswordMutation } from '../../../store/api/authApi';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const contact = searchParams.get('contact') || '';

  const [resetPasswordMutation, { isLoading }] = useResetPasswordMutation();

  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!contact) {
      setErrors({ general: 'Email/Mobile is missing. Please restart the process.' });
      return;
    }

    try {
      await resetPasswordMutation({
        emailOrMobile: contact,
        otp: formData.otp,
        newPassword: formData.newPassword,
      } as any).unwrap();

      setSuccess(true);
    } catch (error: any) {
      setErrors({
        general: error?.data?.message || 'Failed to reset password. Please try again.'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
              Password Reset Successful
            </h2>
            <p className="mt-2 text-mocha-grey">
              Your password has been successfully updated.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center space-y-4">
              <p className="text-mocha-grey">
                You can now sign in with your new password.
              </p>

              <Link
                href="/login"
                className="inline-block w-full bg-olive-green text-white py-3 px-4 rounded-lg hover:bg-cocoa-brown focus:ring-2 focus:ring-olive-green focus:ring-offset-2 transition-colors text-center"
              >
                Continue to Login
              </Link>
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
            Reset Your Password
          </h2>
          <p className="mt-2 text-mocha-grey">
            Enter the OTP sent to {contact} and your new password
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <FormInput
              label="OTP Code"
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              error={errors.otp}
              placeholder="Enter the 6-digit code"
              required
            />

            <div>
              <FormInput
                label="New Password"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
                placeholder="Enter your new password"
                required
              />
              <PasswordStrength password={formData.newPassword} />
            </div>

            <FormInput
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your new password"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-olive-green text-white py-3 px-4 rounded-lg hover:bg-cocoa-brown focus:ring-2 focus:ring-olive-green focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
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
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-soft-linen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green mx-auto"></div>
          <p className="mt-4 text-mocha-grey">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}



