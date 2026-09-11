'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface TimelineStage {
  id: string;
  status: string;
  description: string;
  timestamp: string;
  location: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface TrackingTimelineProps {
  orderId: string;
  stages: TimelineStage[];
}

const TrackingTimeline = ({ orderId, stages }: TrackingTimelineProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [copiedTrackingId, setCopiedTrackingId] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleCopyTrackingId = () => {
    if (!isHydrated) return;
    
    navigator.clipboard.writeText(orderId);
    setCopiedTrackingId(true);
    setTimeout(() => setCopiedTrackingId(false), 2000);
  };

  // ✅ Check if order is cancelled
  const isOrderCancelled = stages.some(stage => 
    stage.status.toLowerCase() === 'cancelled' && stage.isCompleted
  );

  // ✅ Check if order is delivered
  const isOrderDelivered = stages.some(stage => 
    stage.status.toLowerCase() === 'delivered' && stage.isCompleted
  );

  // ✅ Get cancelled stage if exists
  const cancelledStage = stages.find(stage => 
    stage.status.toLowerCase() === 'cancelled'
  );

  // ✅ Filter stages - if cancelled, only show up to cancelled
  const displayStages = isOrderCancelled 
    ? stages.filter((stage, index) => {
        const cancelledIndex = stages.findIndex(s => s.status.toLowerCase() === 'cancelled');
        return index <= cancelledIndex;
      })
    : stages;

  if (!isHydrated) {
    return (
      <div className="rounded-lg bg-card p-6 shadow-elevation-2">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              Order Tracking
            </h2>
            <p className="caption mt-1 text-muted-foreground">
              Tracking ID: {orderId}
            </p>
          </div>
          <button
            className="flex items-center space-x-2 rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground transition-smooth"
            disabled
          >
            <Icon name="ClipboardDocumentIcon" size={18} />
            <span>Copy ID</span>
          </button>
        </div>

        <div className="relative space-y-8">
          {displayStages.map((stage, index) => (
            <div key={stage.id} className="relative flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    stage.isCompleted
                      ? stage.status.toLowerCase() === 'cancelled'
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                      : stage.isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {stage.isCompleted ? (
                    stage.status.toLowerCase() === 'cancelled' ? (
                      <Icon name="XMarkIcon" size={20} />
                    ) : (
                      <Icon name="CheckIcon" size={20} />
                    )
                  ) : (
                    <span className="data-text text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < displayStages.length - 1 && (
                  <div
                    className={`mt-2 h-16 w-0.5 ${
                      stage.isCompleted && stage.status.toLowerCase() !== 'cancelled'
                        ? 'bg-green-500' 
                        : stage.status.toLowerCase() === 'cancelled'
                        ? 'bg-red-500'
                        : 'bg-border'
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 pb-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-base font-semibold ${
                      stage.status.toLowerCase() === 'cancelled' 
                        ? 'text-red-600' 
                        : stage.status.toLowerCase() === 'delivered'
                        ? 'text-green-600'
                        : 'text-foreground'
                    }`}>
                      {stage.status}
                      {stage.status.toLowerCase() === 'cancelled' && (
                        <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Cancelled
                        </span>
                      )}
                      {stage.status.toLowerCase() === 'delivered' && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Delivered
                        </span>
                      )}
                    </h3>
                    <p className={`caption mt-1 ${
                      stage.status.toLowerCase() === 'cancelled' 
                        ? 'text-red-500' 
                        : stage.status.toLowerCase() === 'delivered'
                        ? 'text-green-600'
                        : 'text-muted-foreground'
                    }`}>
                      {stage.status.toLowerCase() === 'cancelled' 
                        ? 'Order has been cancelled' 
                        : stage.description}
                    </p>
                    <p className="caption mt-2 flex items-center space-x-1 text-muted-foreground">
                      <Icon name="MapPinIcon" size={14} />
                      <span>{stage.location}</span>
                    </p>
                  </div>
                  <span className="data-text text-sm text-muted-foreground">
                    {stage.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Show cancellation message if order is cancelled */}
        {isOrderCancelled && cancelledStage && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="XCircleIcon" size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Order Cancelled</p>
                <p className="text-sm text-red-600">
                  This order has been cancelled. {cancelledStage.description || 'No further updates will be available.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Show delivery message if order is delivered */}
        {isOrderDelivered && !isOrderCancelled && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="CheckCircleIcon" size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Order Delivered</p>
                <p className="text-sm text-green-600">
                  Your order has been delivered successfully. Thank you for shopping with us!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-card p-6 shadow-elevation-2">
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Order Tracking
          </h2>
          <p className="caption mt-1 text-muted-foreground">
            Tracking ID: {orderId}
          </p>
        </div>
        <button
          onClick={handleCopyTrackingId}
          className="flex items-center justify-center space-x-2 rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-primary hover:text-primary-foreground"
        >
          <Icon name={copiedTrackingId ? 'CheckIcon' : 'ClipboardDocumentIcon'} size={18} />
          <span>{copiedTrackingId ? 'Copied!' : 'Copy ID'}</span>
        </button>
      </div>

      {/* ✅ Show cancellation banner at top if order is cancelled */}
      {isOrderCancelled && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="XCircleIcon" size={24} className="text-red-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800">Order Cancelled</p>
              <p className="text-sm text-red-600">
                This order has been cancelled. {cancelledStage?.description || 'No further updates will be available.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Show delivery banner at top if order is delivered */}
      {isOrderDelivered && !isOrderCancelled && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="CheckCircleIcon" size={24} className="text-green-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Order Delivered Successfully</p>
              <p className="text-sm text-green-600">
                Your order has been delivered. Thank you for shopping with Decor Vault!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative space-y-8">
        {displayStages.map((stage, index) => {
          const isCancelledStage = stage.status.toLowerCase() === 'cancelled';
          const isDeliveredStage = stage.status.toLowerCase() === 'delivered';
          
          return (
            <div key={stage.id} className="relative flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-smooth ${
                    isCancelledStage
                      ? 'bg-red-500 text-white'
                      : isDeliveredStage
                      ? 'bg-green-500 text-white'
                      : stage.isCompleted
                      ? 'bg-green-500 text-white'
                      : stage.isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCancelledStage ? (
                    <Icon name="XMarkIcon" size={20} />
                  ) : isDeliveredStage || stage.isCompleted ? (
                    <Icon name="CheckIcon" size={20} />
                  ) : (
                    <span className="data-text text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < displayStages.length - 1 && (
                  <div
                    className={`mt-2 h-16 w-0.5 transition-smooth ${
                      isCancelledStage ? 'bg-red-500' :
                      isDeliveredStage || (stage.isCompleted && !isCancelledStage) ? 'bg-green-500' :
                      'bg-border'
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 pb-8">
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                  <div>
                    <h3 className={`text-base font-semibold ${
                      isCancelledStage ? 'text-red-600' :
                      isDeliveredStage ? 'text-green-600' :
                      'text-foreground'
                    }`}>
                      {stage.status}
                      {isCancelledStage && (
                        <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Cancelled
                        </span>
                      )}
                      {isDeliveredStage && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Delivered
                        </span>
                      )}
                    </h3>
                    <p className={`caption mt-1 ${
                      isCancelledStage ? 'text-red-500' :
                      isDeliveredStage ? 'text-green-600' :
                      'text-muted-foreground'
                    }`}>
                      {isCancelledStage ? 'Order has been cancelled' : stage.description}
                    </p>
                    <p className="caption mt-2 flex items-center space-x-1 text-muted-foreground">
                      <Icon name="MapPinIcon" size={14} />
                      <span>{stage.location}</span>
                    </p>
                  </div>
                  <span className="data-text text-sm text-muted-foreground">
                    {stage.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackingTimeline;