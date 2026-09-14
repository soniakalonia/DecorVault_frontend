'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { syncCart } from '@/store/slices/cart';
import { useSimulatePayUPaymentMutation } from '@/store/api/payuApi';
import Icon from '@/components/ui/AppIcon';

// ─── Types ───
type Screen = 'options' | 'method-detail' | 'confirming' | 'success';

interface Method {
  id: string;
  name: string;
  icon: string;
}

interface Bank {
  id: string;
  name: string;
  logo?: string;
}

// ─── Constants ───
const METHODS: Method[] = [
  { id: 'card', name: 'Cards', icon: 'CreditCardIcon' },
  { id: 'netbanking', name: 'Netbanking', icon: 'BuildingLibraryIcon' },
  { id: 'wallet', name: 'Wallet', icon: 'WalletIcon' },
  { id: 'upi', name: 'UPI', icon: 'QrCodeIcon' },
];

const POPULAR_BANKS: Bank[] = [
  { id: 'bob', name: 'Bank of Baroda - Retail Banking' },
  { id: 'canara', name: 'Canara Bank' },
  { id: 'pnb-retail', name: 'Punjab National Bank - Retail Banking' },
  { id: 'pnb', name: 'PNB (Erstwhile-United Bank of India)' },
  { id: 'idbi', name: 'IDBI' },
];

const ALL_BANKS: Bank[] = [
  { id: 'airtel', name: 'Airtel Payments Bank' },
  { id: 'indian', name: 'Indian Bank (Erstwhile Allahabad Bank)' },
];

const WALLETS: Bank[] = [
  { id: 'mobikwik', name: 'Mobikwik' },
  { id: 'airtel-wallet', name: 'Airtel Payments Bank' },
  { id: 'ola', name: 'Ola Money (Postpaid + Wallet)' },
];

// ─── Component ───
function PayUMockContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [simulatePayUPayment] = useSimulatePayUPaymentMutation();

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const txnid = searchParams.get('txnid');

  const [screen, setScreen] = useState<Screen>('options');
  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // ─── Invalid session ───
  if (!orderId || !amount || !txnid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] p-4">
        <div className="text-center">
          <Icon name="XCircleIcon" size={48} className="mx-auto text-red-500" />
          <p className="mt-4 text-lg font-medium text-[#1A2A3A]">
            Invalid payment session
          </p>
          <button
            onClick={() => router.push('/checkout-process')}
            className="mt-4 px-6 py-2 bg-[#0a2540] text-white rounded-lg hover:bg-[#1a3a5c]"
          >
            Back to Checkout
          </button>
        </div>
      </div>
    );
  }

  const amountNum = Number(amount);

  // ─── Simulate call ───
  const handleSimulate = async (status: 'success' | 'failure') => {
    if (isSimulating) return;
    setIsSimulating(true);
    setScreen('confirming');

    try {
      const result = await simulatePayUPayment({
        orderId: Number(orderId),
        txnid,
        status,
      }).unwrap();

      if (!result.success) {
        throw new Error(result.message || 'Simulate failed');
      }

      // Small delay so "Confirming Payment" screen is visible for a moment
      await new Promise((r) => setTimeout(r, 1200));

      if (status === 'success') {
        setScreen('success');
        // Auto redirect after showing success receipt for 2s
        setTimeout(() => {
          dispatch(syncCart([]));
          router.push(result.data.redirectUrl);
        }, 2200);
      } else {
        dispatch(syncCart([]));
        router.push(result.data.redirectUrl);
      }
    } catch (error: any) {
      const msg =
        error?.data?.message || error?.message || 'Simulation failed';
      toast.error(msg);
      setIsSimulating(false);
      setScreen('options');
    }
  };

  // ─── When user picks a method ───
  const handleMethodClick = (methodId: string) => {
    setActiveMethod(methodId);
    setScreen('method-detail');
  };

  const handleBankOrWalletClick = () => {
    // User has chosen a payment sub-option → reveal the test actions
    // (In test mode we don't actually charge — we show a small chooser)
    // We'll slide into a mini test bar at bottom
    setScreen('method-detail');
  };

  // ─── Screen: Confirming ───
  if (screen === 'confirming') {
    return (
      <PayUModalShell amount={amountNum}>
        <div className="flex flex-1 flex-col items-center justify-center bg-white p-12">
          <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold text-[#1A2A3A]">
              Confirming Payment
            </h3>
            <p className="mt-1 text-sm text-[#6B7280]">
              This will only take a few seconds.
            </p>
          </div>
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute h-16 w-16 rounded-full border-4 border-[#0a2540]/10" />
            <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-[#0a2540]" />
            <div className="h-6 w-6 rounded-full bg-[#0a2540]" />
          </div>
          <p className="mt-8 text-xs text-[#9CA3AF]">Secured by PayU</p>
        </div>
      </PayUModalShell>
    );
  }

  // ─── Screen: Success (inside modal, then redirect) ───
  if (screen === 'success') {
    return (
      <PayUModalShell amount={amountNum}>
        <div className="relative flex flex-1 flex-col items-center justify-center bg-[#0a8f4a] p-12 text-white">
          <p className="text-xs uppercase tracking-wide opacity-90">
            You will be redirected in 2 seconds
          </p>
          <h2 className="mt-1 text-2xl font-bold">Payment Successful</h2>

          <div className="relative mt-10 flex h-20 w-20 items-center justify-center">
            <div className="absolute h-20 w-20 rounded-full border-4 border-white/30" />
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
              <span className="text-3xl font-bold text-[#0a8f4a]">✓</span>
            </div>
          </div>

          <div className="mt-10 w-full max-w-xs rounded-lg bg-white p-4 text-[#1A2A3A] shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a2540] text-white text-xs font-bold">
                  D
                </div>
                <span className="text-sm font-semibold">DecorVault</span>
              </div>
              <span className="text-sm font-bold">₹{amountNum.toFixed(2)}</span>
            </div>
            <div className="mt-3 border-t border-gray-100 pt-2 text-xs text-[#6B7280]">
              <p>
                {new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
                , {new Date().toLocaleTimeString('en-IN', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
              <p className="mt-1 font-mono text-[10px]">
                PayU | {txnid.slice(0, 20)}...
              </p>
            </div>
          </div>

          <p className="absolute bottom-6 text-xs opacity-80">
            Secured by PayU
          </p>
        </div>
      </PayUModalShell>
    );
  }

  // ─── Screen: Method Detail (netbanking / wallet list) ───
  if (screen === 'method-detail' && activeMethod) {
    const showBanks = activeMethod === 'netbanking';
    const showWallets = activeMethod === 'wallet';

    return (
      <PayUModalShell amount={amountNum}>
        <div className="flex flex-1 flex-col bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h3 className="text-base font-semibold text-[#1A2A3A]">
                {showBanks
                  ? 'Netbanking'
                  : showWallets
                  ? 'Wallet'
                  : activeMethod === 'card'
                  ? 'Cards'
                  : 'UPI'}
              </h3>
              <p className="text-xs text-[#6B7280]">Choose an option</p>
            </div>
            <button
              onClick={() => {
                setActiveMethod(null);
                setScreen('options');
              }}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <Icon name="XMarkIcon" size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {showBanks && (
              <>
                <div className="relative mb-3">
                  <Icon
                    name="MagnifyingGlassIcon"
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search for Banks"
                    className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0a2540]"
                  />
                </div>

                <p className="mb-2 mt-4 text-xs font-medium text-[#6B7280]">
                  Suggested Banks
                </p>
                <div className="space-y-1">
                  {POPULAR_BANKS.map((bank) => (
                    <BankRow
                      key={bank.id}
                      bank={bank}
                      onClick={handleBankOrWalletClick}
                    />
                  ))}
                </div>

                <p className="mb-2 mt-4 text-xs font-medium text-[#6B7280]">
                  All Banks
                </p>
                <div className="space-y-1">
                  {ALL_BANKS.map((bank) => (
                    <BankRow
                      key={bank.id}
                      bank={bank}
                      onClick={handleBankOrWalletClick}
                    />
                  ))}
                </div>
              </>
            )}

            {showWallets && (
              <>
                <p className="mb-2 text-xs font-medium text-[#6B7280]">
                  All Wallet Options
                </p>
                <div className="space-y-1">
                  {WALLETS.map((w) => (
                    <BankRow
                      key={w.id}
                      bank={w}
                      onClick={handleBankOrWalletClick}
                    />
                  ))}
                </div>
              </>
            )}

            {!showBanks && !showWallets && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Icon name="CreditCardIcon" size={40} className="text-gray-300" />
                <p className="mt-3 text-sm text-[#6B7280]">
                  {activeMethod === 'card'
                    ? 'Card form will load here in live mode.'
                    : 'UPI intent will trigger in live mode.'}
                </p>
              </div>
            )}

            {/* ─── TEST MODE ACTION BAR ─── */}
            <div className="mt-6 rounded-lg border-2 border-dashed border-[#0a2540]/30 bg-blue-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">🧪</span>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0a2540]">
                  Test Mode — Choose Outcome
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSimulate('success')}
                  disabled={isSimulating}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-green-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon name="CheckCircleIcon" size={14} />
                  Simulate Success
                </button>
                <button
                  onClick={() => handleSimulate('failure')}
                  disabled={isSimulating}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon name="XCircleIcon" size={14} />
                  Simulate Failure
                </button>
              </div>
            </div>
          </div>
        </div>
      </PayUModalShell>
    );
  }

  // ─── Screen: Options (main) ───
  return (
    <PayUModalShell amount={amountNum}>
      <div className="flex flex-1 flex-col bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="text-base font-semibold text-[#1A2A3A]">
            Payment Options
          </h3>
          <button
            onClick={() => router.push('/checkout-process')}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: method list */}
          <div className="w-40 border-r border-gray-100 bg-[#FAFBFC]">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => handleMethodClick(m.id)}
                className="flex w-full items-center gap-3 px-4 py-4 text-left text-sm font-medium text-[#1A2A3A] transition hover:bg-white"
              >
                <Icon name={m.icon} size={18} className="text-[#0a2540]" />
                <span>{m.name}</span>
              </button>
            ))}
          </div>

          {/* Right: sub-options of selected method */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <p className="mb-3 text-xs font-medium text-[#6B7280]">
              Popular
            </p>
            <div className="space-y-1">
              {POPULAR_BANKS.slice(0, 3).map((bank) => (
                <BankRow
                  key={bank.id}
                  bank={bank}
                  onClick={() => {
                    setActiveMethod('netbanking');
                    setScreen('method-detail');
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PayUModalShell>
  );
}

// ─── Shared Shell (PayU branded modal) ───
function PayUModalShell({
  amount,
  children,
}: {
  amount: number;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Left: PayU branded panel */}
        <div className="hidden w-72 shrink-0 flex-col bg-gradient-to-b from-[#0a2540] to-[#1a3a5c] p-6 text-white md:flex">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <span className="text-sm font-bold text-[#0a2540]">P</span>
            </div>
            <span className="font-semibold">PayU</span>
          </div>

          <div className="mt-8 rounded-lg bg-white/10 p-4">
            <p className="text-xs opacity-80">Price Summary</p>
            <p className="mt-1 text-2xl font-bold">₹{amount.toFixed(2)}</p>
          </div>

          <div className="mt-4 rounded-lg bg-white/10 p-3">
            <div className="flex items-center gap-2 text-xs">
              <Icon name="UserCircleIcon" size={16} />
              <span>Using as +91 96544 65913</span>
              <Icon name="ChevronRightIcon" size={14} className="ml-auto" />
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-[10px] opacity-60">Secured by</p>
            <p className="mt-1 text-lg font-bold">PayU</p>
          </div>
        </div>

        {/* Right: content */}
        <div className="flex flex-1 flex-col min-h-[520px]">{children}</div>
      </div>
    </div>
  );
}

// ─── Bank / Wallet row ───
function BankRow({ bank, onClick }: { bank: Bank; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition hover:border-gray-200 hover:bg-[#FAFBFC]"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0F4F8]">
        <span className="text-xs font-bold text-[#0a2540]">
          {bank.name.charAt(0)}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-[#1A2A3A]">{bank.name}</p>
      </div>
      <Icon name="ChevronRightIcon" size={16} className="text-[#9CA3AF]" />
    </button>
  );
}

export default function PayUMockPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
          <div className="w-12 h-12 border-4 border-[#0a2540] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PayUMockContent />
    </Suspense>
  );
}