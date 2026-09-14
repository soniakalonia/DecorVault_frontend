'use client';
import Icon from '@/components/ui/AppIcon';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description?: string;
  isAvailable: boolean;
}

interface PaymentMethodSelectorProps {
  onPaymentSelect: (methodId: string) => void;
  selectedMethodId: string | null;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    icon: 'CreditCardIcon',
    description: 'Pay securely with cards, UPI, Net Banking & more',
    isAvailable: true,
  },
  {
    id: 'setu',
    name: 'Setu (UPI / QR)',
    icon: 'QrCodeIcon',
    description: 'Pay instantly via UPI / QR code using Setu',
    isAvailable: true,
  },
  {
    id: 'payu',
    name: 'PayU',
    icon: 'CreditCardIcon',   // reuse the icon component
    description: 'Pay via Cards, UPI, Net Banking & Wallets through PayU',
    isAvailable: true,
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    icon: 'WalletIcon',
    description: 'Pay when you receive your order',
    isAvailable: true,
  },
];

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onPaymentSelect,
  selectedMethodId,
}) => {
  const handleSelect = (methodId: string) => {
    onPaymentSelect(methodId);
  };

  return (
    <div>
      <h3 className="mb-4 font-heading text-lg font-semibold text-[#1A2A3A]">
        Select Payment Method
      </h3>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => handleSelect(method.id)}
            disabled={!method.isAvailable}
            className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 transition-all duration-200 ${
              selectedMethodId === method.id
                ? 'border-[#FF6B8A] bg-[#FFE0E8] shadow-sm'
                : 'border-gray-200 bg-white hover:border-[#FF6B8A] hover:bg-[#FFF5F7]'
            } ${!method.isAvailable && 'cursor-not-allowed opacity-50'}`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100">
              <Icon name={method.icon} size={24} className="text-[#FF6B8A]" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-[#1A2A3A]">{method.name}</p>
              {method.description && (
                <p className="text-sm text-[#6B7280]">{method.description}</p>
              )}
            </div>
            {selectedMethodId === method.id && (
              <Icon
                name="CheckCircleIcon"
                size={24}
                className="text-[#FF6B8A]"
              />
            )}
            {!method.isAvailable && (
              <span className="text-xs text-[#6B7280]">Coming Soon</span>
            )}
          </button>
        ))}
      </div>

      {/* Razorpay Info */}
      {selectedMethodId === 'razorpay' && (
        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          <div className="flex items-start gap-2">
            <Icon name="ShieldCheckIcon" size={20} className="mt-0.5" />
            <div>
              <p className="font-medium">Secure Payment</p>
              <p className="text-blue-600">
                Your payment is encrypted and secure. Powered by Razorpay.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Setu Info */}
      {selectedMethodId === 'setu' && (
        <div className="mt-4 rounded-lg bg-purple-50 p-3 text-sm text-purple-700">
          <div className="flex items-start gap-2">
            <Icon name="QrCodeIcon" size={20} className="mt-0.5" />
            <div>
              <p className="font-medium">Pay via UPI / QR</p>
              <p className="text-purple-600">
                You will be redirected to Setu to complete your payment
                securely.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PayU Info */}
      {selectedMethodId === 'payu' && (
        <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          <div className="flex items-start gap-2">
            <Icon name="ShieldCheckIcon" size={20} className="mt-0.5" />
            <div>
              <p className="font-medium">Pay via PayU</p>
              <p className="text-amber-700">
                You will be redirected to PayU to complete your payment
                securely using Cards, UPI, Net Banking or Wallets.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* COD Info */}
      {selectedMethodId === 'cod' && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          <div className="flex items-start gap-2">
            <Icon name="WalletIcon" size={20} className="mt-0.5" />
            <div>
              <p className="font-medium">Pay on Delivery</p>
              <p className="text-green-600">
                Pay the full amount when your order arrives at your doorstep.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;