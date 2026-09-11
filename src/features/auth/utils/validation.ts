export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
};

export const validateMobile = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

export const validateEmailOrMobile = (input: string): { isValid: boolean; type: 'email' | 'mobile' | null } => {
  const trimmedInput = input.trim();
  
  if (validateEmail(trimmedInput)) {
    return { isValid: true, type: 'email' };
  }
  
  if (validateMobile(trimmedInput)) {
    return { isValid: true, type: 'mobile' };
  }
  
  return { isValid: false, type: null };
};

export const validatePassword = (password: string): { 
  isValid: boolean; 
  errors: string[];
  strength: number;
} => {
  const errors: string[] = [];
  let strength = 0;
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    strength++;
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    strength++;
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    strength++;
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    strength++;
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    strength++;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
};

export const validateName = (name: string): boolean => {
  const trimmedName = name.trim();
  return trimmedName.length >= 2 && /^[a-zA-Z\s]+$/.test(trimmedName);
};

export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

export const getPasswordStrengthLabel = (strength: number): string => {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return labels[Math.max(0, strength - 1)] || 'Very Weak';
};

export const getPasswordStrengthColor = (strength: number): string => {
  const colors = ['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-blue-600', 'text-green-600'];
  return colors[Math.max(0, strength - 1)] || 'text-red-600';
};



