export interface Coupon {
  id: number;
  code: string;
  name: string;
  type: 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y';
  value: number;
  minimum_amount: number;
  maximum_discount?: number;
  usage_limit?: number;
  used_count: number;
  user_limit: number;
  applicable_to: 'all' | 'categories' | 'products' | 'brands';
  applicable_ids?: number[];
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive' | 'expired';
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  brand?: string;
}

export interface CouponValidationResult {
  isValid: boolean;
  discount: number;
  message: string;
  coupon?: Coupon;
}

export const calculateCouponDiscount = (
  coupon: Coupon,
  cartTotal: number,
  cartItems?: CartItem[]
): number => {
  let discount = 0;

  switch (coupon.type) {
    case 'percentage':
      discount = (cartTotal * coupon.value) / 100;
      if (coupon.maximum_discount && discount > coupon.maximum_discount) {
        discount = coupon.maximum_discount;
      }
      break;

    case 'fixed':
      discount = Math.min(coupon.value, cartTotal);
      break;

    case 'free_shipping':
      discount = coupon.value; // This should be the shipping cost
      break;

    case 'buy_x_get_y':
      // This would need more complex logic based on cart items
      // For now, treating it as a fixed discount
      discount = coupon.value;
      break;

    default:
      discount = 0;
  }

  return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

export const validateCouponClient = (
  coupon: Coupon,
  cartTotal: number,
  userId?: string,
  userUsageCount: number = 0
): CouponValidationResult => {
  const now = new Date();
  const startDate = new Date(coupon.start_date);
  const endDate = new Date(coupon.end_date);

  // Check if coupon is active
  if (coupon.status !== 'active') {
    return {
      isValid: false,
      discount: 0,
      message: 'This coupon is not active'
    };
  }

  // Check date validity
  if (now < startDate) {
    return {
      isValid: false,
      discount: 0,
      message: 'This coupon is not yet valid'
    };
  }

  if (now > endDate) {
    return {
      isValid: false,
      discount: 0,
      message: 'This coupon has expired'
    };
  }

  // Check usage limit
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return {
      isValid: false,
      discount: 0,
      message: 'This coupon has reached its usage limit'
    };
  }

  // Check user usage limit
  if (userId && coupon.user_limit && userUsageCount >= coupon.user_limit) {
    return {
      isValid: false,
      discount: 0,
      message: 'You have already used this coupon the maximum number of times'
    };
  }

  // Check minimum amount
  if (cartTotal < coupon.minimum_amount) {
    return {
      isValid: false,
      discount: 0,
      message: `Minimum order amount of ₹${coupon.minimum_amount} required`
    };
  }

  const discount = calculateCouponDiscount(coupon, cartTotal);

  return {
    isValid: true,
    discount,
    message: `Coupon applied successfully! You saved ₹${discount}`,
    coupon
  };
};

export const formatCouponType = (type: string): string => {
  switch (type) {
    case 'percentage':
      return 'Percentage Discount';
    case 'fixed':
      return 'Fixed Amount';
    case 'free_shipping':
      return 'Free Shipping';
    case 'buy_x_get_y':
      return 'Buy X Get Y';
    default:
      return type;
  }
};

export const formatCouponValue = (type: string, value: number): string => {
  switch (type) {
    case 'percentage':
      return `${value}% OFF`;
    case 'fixed':
      return `₹${value} OFF`;
    case 'free_shipping':
      return 'FREE SHIPPING';
    case 'buy_x_get_y':
      return `Buy ${value} Get 1 Free`;
    default:
      return `${value}`;
  }
};

export const getCouponStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'expired':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const generateCouponCode = (prefix: string = 'SAVE'): string => {
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${randomString}`;
};