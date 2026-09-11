'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Icon from '@/components/ui/AppIcon';
import RazorpayPayment from './RazorpayPayment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  amount: number;
  currency?: string;
  onSuccess?: () => void;
  onFailure?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  amount,
  currency = 'INR',
  onSuccess,
  onFailure,
}) => {
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handleSuccess = () => {
    setPaymentComplete(true);
    onSuccess?.();
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleFailure = () => {
    onFailure?.();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="mb-4 flex items-center justify-between text-lg font-semibold text-[#1A2A3A]">
                  <span>Complete Payment</span>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-gray-100"
                  >
                    <Icon name="XMarkIcon" size={20} />
                  </button>
                </Dialog.Title>

                {paymentComplete ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="mb-4 rounded-full bg-green-100 p-4">
                      <Icon name="CheckCircleIcon" size={48} className="text-green-600" />
                    </div>
                    <p className="text-lg font-medium text-green-600">Payment Successful!</p>
                  </div>
                ) : (
                  <RazorpayPayment
                    orderId={orderId}
                    amount={amount}
                    currency={currency}
                    onSuccess={handleSuccess}
                    onFailure={handleFailure}
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PaymentModal;