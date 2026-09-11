'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ExitIntentPopupProps {
  onClose: () => void;
}

const ExitIntentPopup = ({ onClose }: ExitIntentPopupProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-[600] bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[700] w-full max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-card p-8 shadow-elevation-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 transition-smooth hover:bg-muted"
          aria-label="Close popup"
        >
          <Icon name="XMarkIcon" size={24} className="text-muted-foreground" />
        </button>

        {!isSubmitted ? (
          <>
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-accent/10 p-4">
                <Icon name="GiftIcon" size={48} className="text-accent" variant="solid" />
              </div>
            </div>
            <h2 className="mb-2 text-center font-heading text-2xl font-bold text-foreground">
              Wait! Don&apos;t Miss Out!
            </h2>
            <p className="mb-6 text-center text-muted-foreground">
              Get an exclusive 15% discount on your first order. Subscribe now!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                className="flex w-full items-center justify-center space-x-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-smooth hover:scale-[0.97]"
              >
                <span>Claim My 15% Discount</span>
                <Icon name="ArrowRightIcon" size={18} />
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              No spam, unsubscribe anytime. Offer valid for 24 hours.
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <Icon name="CheckCircleIcon" size={64} className="text-success" variant="solid" />
            </div>
            <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
              Success! Check Your Email
            </h3>
            <p className="text-muted-foreground">
              Your exclusive discount code is on its way!
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ExitIntentPopup;



