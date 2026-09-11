'use client';

import Icon from '@/components/ui/AppIcon';

interface ClearCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ClearCartModal({ isOpen, onClose, onConfirm }: ClearCartModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[500] bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-[600] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-card p-6 shadow-elevation-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-warning/10 p-3">
            <Icon name="ExclamationTriangleIcon" size={24} className="text-warning" />
          </div>
          <h3 className="font-heading text-xl font-semibold text-card-foreground">
            Clear Cart?
          </h3>
        </div>

        <p className="mb-6 text-muted-foreground">
          Are you sure you want to remove all items from your cart? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-border px-4 py-2 font-medium text-foreground transition-smooth hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-md bg-destructive px-4 py-2 font-medium text-destructive-foreground transition-smooth hover:scale-[0.97]"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </>
  );
}



