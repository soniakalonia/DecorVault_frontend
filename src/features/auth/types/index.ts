export interface User {
  id: string;
  email: string;
  mobile: string;
  fullName: string;
  role: 'retail' | 'bulk' | 'user' | 'admin';
  isVerified: boolean;
}

export interface LoginRequest {
  emailOrMobile: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface OTPRequest {
  emailOrMobile: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  emailOrMobile: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface ApiError {
  message: string;
  field?: string;
}



