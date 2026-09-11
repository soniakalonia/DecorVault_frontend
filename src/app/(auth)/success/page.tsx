'use client';
import Link from 'next/link';
import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const type = searchParams.get('type') || 'success';
  const message = searchParams.get('message') || 'Operation completed successfully';
  const redirectTo = searchParams.get('redirect') || '/auth/login';
  const autoRedirect = searchParams.get('autoRedirect') !== 'false';

  useEffect(() => {
    if (autoRedirect) {
      const timer = setTimeout(() => {
        router.push(redirectTo);
      }, 5000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [router, redirectTo, autoRedirect]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'email':
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'phone':
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-olive-green/10">
            <svg className="h-8 w-8 text-olive-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Success!';
      case 'email':
        return 'Check Your Email';
      case 'phone':
        return 'SMS Sent';
      case 'verification':
        return 'Account Verified';
      case 'password-reset':
        return 'Password Reset';
      default:
        return 'Notification';
    }
  };

  return (
    <div className="min-h-screen bg-soft-linen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {getIcon()}
          <h2 className="mt-6 text-3xl font-heading font-bold text-espresso">
            {getTitle()}
          </h2>
          <p className="mt-2 text-mocha-grey">
            {message}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6 text-center">
            {autoRedirect && (
              <div className="bg-soft-linen rounded-lg p-4">
                <p className="text-sm text-mocha-grey">
                  You will be redirected automatically in 5 seconds...
                </p>
              </div>
            )}

            <div className="space-y-4">
              <Link
                href={redirectTo}
                className="inline-block w-full bg-olive-green text-white py-3 px-4 rounded-lg hover:bg-cocoa-brown focus:ring-2 focus:ring-olive-green focus:ring-offset-2 transition-colors text-center"
              >
                Continue
              </Link>

              <div className="flex justify-center space-x-4 text-sm">
                <Link 
                  href="/login" 
                  className="text-mocha-grey hover:text-espresso transition-colors"
                >
                  Login
                </Link>
                <span className="text-soft-stone">•</span>
                <Link 
                  href="/" 
                  className="text-mocha-grey hover:text-espresso transition-colors"
                >
                  Home
                </Link>
                <span className="text-soft-stone">•</span>
                <Link 
                  href="/support" 
                  className="text-mocha-grey hover:text-espresso transition-colors"
                >
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>

        {type === 'email' && (
          <div className="text-center text-sm text-mocha-grey">
            <p>Didn't receive the email? Check your spam folder or</p>
            <button className="text-olive-green hover:text-cocoa-brown transition-colors">
              resend the email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-soft-linen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green mx-auto"></div>
          <p className="mt-4 text-mocha-grey">Loading...</p>
        </div>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}



