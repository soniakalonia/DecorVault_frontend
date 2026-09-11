# 🔐 Authentication System

A comprehensive authentication system built for Indian e-commerce users with support for both retail and bulk buyers.

## 🎯 Features

- **Secure Login/Register** - Email or mobile number support
- **OTP Verification** - India-first UX with SMS/Email OTP
- **Password Management** - Strong password requirements with strength indicator
- **Role-based Access** - Support for retail and bulk buyer roles
- **Session Management** - Secure JWT token handling
- **Route Protection** - AuthGuard component for protected routes

## 📁 Structure

```
src/features/auth/
├── components/
│   ├── FormInput.tsx          # Reusable form input with validation
│   ├── OTPInput.tsx           # 6-digit OTP input with auto-focus
│   ├── PasswordStrength.tsx   # Password strength indicator
│   ├── ChangePassword.tsx     # Change password form
│   ├── AuthGuard.tsx          # Route protection component
│   └── Logout.tsx             # Logout handler
├── hooks/
│   └── useAuth.ts             # Authentication hook
├── types/
│   └── index.ts               # TypeScript interfaces
├── utils/
│   └── validation.ts          # Validation utilities
└── index.ts                   # Exports
```

## 🚀 Pages

### 1. Login (`/auth/login`)
- Email/mobile + password login
- Remember me option
- Link to forgot password
- Link to OTP login

### 2. Register (`/auth/register`)
- Full name, email, mobile, password
- Password strength indicator
- Terms & conditions acceptance
- Redirects to OTP verification

### 3. OTP Verification (`/auth/verify-otp`)
- 6-digit OTP input with auto-focus
- 60-second timer with resend option
- Auto-submit on complete OTP

### 4. Forgot Password (`/auth/forgot-password`)
- Email/mobile input
- Security-first approach (always shows success)

### 5. Reset Password (`/auth/reset-password`)
- Token-based password reset
- Password strength validation
- Success confirmation

### 6. OTP Login (`/auth/login-otp`)
- Two-step OTP login
- India-first UX approach

### 7. Success Page (`/auth/success`)
- Generic success/confirmation page
- Auto-redirect functionality
- Customizable messages

## 🔧 Usage

### Basic Authentication

```tsx
import { useAuth } from '@/features/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated()) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome, {user?.fullName}!</div>;
}
```

### Route Protection

```tsx
import { AuthGuard } from '@/features/auth';

function ProtectedPage() {
  return (
    <AuthGuard requireAuth requireVerification>
      <div>Protected content</div>
    </AuthGuard>
  );
}
```

### Role-based Access

```tsx
import { AuthGuard } from '@/features/auth';

function BulkBuyerPage() {
  return (
    <AuthGuard allowedRoles={['bulk']}>
      <div>Bulk buyer content</div>
    </AuthGuard>
  );
}
```

## 🎨 Styling

Uses Tailwind CSS with custom color palette:
- `olive-green` - Primary actions
- `cocoa-brown` - Hover states
- `espresso` - Text
- `mocha-grey` - Secondary text
- `soft-linen` - Background
- `soft-stone` - Borders

## 🔒 Security Features

- **Input Validation** - Client and server-side validation
- **Password Strength** - Enforced strong password requirements
- **Rate Limiting** - OTP resend limitations
- **Token Management** - Secure JWT handling
- **Session Timeout** - Automatic logout on expiry
- **CSRF Protection** - Built-in security measures

## 📱 Mobile-First

- **Responsive Design** - Works on all screen sizes
- **Touch-Friendly** - Large touch targets
- **Indian UX** - Mobile number support, OTP-first approach
- **Accessibility** - WCAG compliant components

## 🔗 API Integration

All components integrate with RTK Query for:
- Automatic loading states
- Error handling
- Caching
- Optimistic updates

## 🧪 Validation Rules

### Email
- Valid email format
- Required for registration

### Mobile
- 10-digit Indian mobile number
- Starts with 6, 7, 8, or 9

### Password
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### OTP
- Exactly 6 digits
- Numeric only
- Auto-submit on completion

## 🎯 Best Practices

1. **Always use AuthGuard** for protected routes
2. **Validate on both client and server** side
3. **Show loading states** during API calls
4. **Handle errors gracefully** with user-friendly messages
5. **Use proper TypeScript types** for type safety
6. **Follow accessibility guidelines** for form inputs
7. **Implement proper session management** with token refresh

## 🚀 Getting Started

1. Import required components:
```tsx
import { useAuth, AuthGuard, FormInput } from '@/features/auth';
```

2. Wrap your app with authentication:
```tsx
function App() {
  return (
    <AuthGuard requireAuth>
      <YourApp />
    </AuthGuard>
  );
}
```

3. Use authentication in components:
```tsx
function Header() {
  const { user, logout } = useAuth();
  
  return (
    <header>
      <span>Welcome, {user?.fullName}</span>
      <button onClick={logout}>Logout</button>
    </header>
  );
}
```

Built with ❤️ for Indian e-commerce users.