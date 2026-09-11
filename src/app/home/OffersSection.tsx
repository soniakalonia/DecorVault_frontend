'use client';

import { useState, useEffect, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  expiresAt: Date;
  icon: string;
  bgColor: string;
}

const OffersSection = () => {
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});

  const offers: Offer[] = useMemo(() => [
    {
      id: '1',
      title: 'New Year Special',
      description: 'Get 20% off on all orders above ₹1000',
      code: 'NEWYEAR20',
      discount: '20% OFF',
      expiresAt: new Date('2026-01-31'),
      icon: 'GiftIcon',
      bgColor: 'bg-primary/10',
    },
    {
      id: '2',
      title: 'Bulk Purchase Deal',
      description: 'Save 15% when you buy 10 or more items',
      code: 'BULK15',
      discount: '15% OFF',
      expiresAt: new Date('2026-02-15'),
      icon: 'ShoppingBagIcon',
      bgColor: 'bg-secondary/10',
    },
    {
      id: '3',
      title: 'First Order Bonus',
      description: 'Flat ₹100 off on your first purchase',
      code: 'FIRST100',
      discount: '₹100 OFF',
      expiresAt: new Date('2026-12-31'),
      icon: 'SparklesIcon',
      bgColor: 'bg-accent/10',
    },
    {
      id: '4',
      title: 'Weekend Sale',
      description: 'Extra 10% off on weekend orders',
      code: 'WEEKEND10',
      discount: '10% OFF',
      expiresAt: new Date('2026-12-31'),
      icon: 'SparklesIcon',
      bgColor: 'bg-accent/10',
    },
    {
      id: '5',
      title: 'Free Shipping',
      description: 'Free delivery on orders above ₹500',
      code: 'FREESHIP',
      discount: 'FREE',
      expiresAt: new Date('2026-12-31'),
      icon: 'TruckIcon',
      bgColor: 'bg-accent/10',
    },
    {
      id: '6',
      title: 'Loyalty Reward',
      description: 'Get ₹200 off on orders above ₹2000',
      code: 'LOYAL200',
      discount: '₹200 OFF',
      expiresAt: new Date('2026-12-31'),
      icon: 'SparklesIcon',
      bgColor: 'bg-accent/10',
    },
  ], []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const newTimeLeft: { [key: string]: string } = {};
      offers.forEach((offer) => {
        const difference = offer.expiresAt.getTime() - new Date().getTime();
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          newTimeLeft[offer.id] = `${days}d ${hours}h`;
        } else {
          newTimeLeft[offer.id] = 'Expired';
        }
      });
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(interval);
  }, [offers]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const showAsSlider = offers.length > 5;
  const visibleOffers = showAsSlider ? offers : offers.slice(0, 5);
  const duplicatedOffers = showAsSlider ? [...offers, ...offers] : offers;

  return (
    <section className="w-full px-2 py-4 sm:px-4 sm:py-6">
      <div className="mb-4 text-center sm:mb-6" data-aos="fade-up">
        <div className="mb-1 flex items-center justify-center space-x-2 sm:mb-2">
          <Icon name="TagIcon" size={24} className="text-accent sm:size-8" variant="solid" />
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            Best Offers & Coupons
          </h2>
        </div>
        <p className="text-sm text-muted-foreground sm:text-base">
          Save more with our exclusive deals
        </p>
      </div>

      {showAsSlider ? (
        <>
          {/* Desktop Slider */}
          <div className="relative hidden lg:block">
            <div className="overflow-hidden">
              <div className="flex" style={{ animation: `scroll ${offers.length * 3}s linear infinite` }}>
                {duplicatedOffers.map((offer, index) => (
                  <div
                    key={`${offer.id}-${index}`}
                    className="w-1/5 flex-shrink-0 px-2"
                    style={{ minWidth: '20%' }}
                  >
                    <div
                      className={`relative overflow-hidden rounded-lg border border-border ${offer.bgColor} p-6 shadow-elevation-1 transition-smooth hover:shadow-elevation-2 h-full`}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <Icon name={offer.icon as any} size={40} className="text-primary" variant="solid" />
                        <span className="rounded-md bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">
                          {offer.discount}
                        </span>
                      </div>
                      <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
                        {offer.title}
                      </h3>
                      <p className="mb-4 text-sm text-muted-foreground">{offer.description}</p>
                      <div className="mb-4 flex items-center space-x-2">
                        <div className="flex-1 rounded-md border-2 border-dashed border-primary bg-card px-4 py-2 text-center font-mono text-lg font-bold text-primary">
                          {offer.code}
                        </div>
                        <button
                          onClick={() => copyCode(offer.code)}
                          className="rounded-md bg-primary p-2 text-primary-foreground transition-smooth hover:scale-[0.97]"
                          aria-label="Copy code"
                        >
                          <Icon name="ClipboardDocumentIcon" size={20} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center space-x-1 text-muted-foreground">
                          <Icon name="ClockIcon" size={16} />
                          <span>Expires in {timeLeft[offer.id] || 'Loading...'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Grid */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:hidden">
            {offers.map((offer, index) => (
              <div
                key={offer.id}
                className={`relative overflow-hidden rounded-lg border border-border ${offer.bgColor} p-6 shadow-elevation-1 transition-smooth hover:shadow-elevation-2`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <Icon name={offer.icon as any} size={40} className="text-primary" variant="solid" />
                  <span className="rounded-md bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">
                    {offer.discount}
                  </span>
                </div>
                <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
                  {offer.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">{offer.description}</p>
                <div className="mb-4 flex items-center space-x-2">
                  <div className="flex-1 rounded-md border-2 border-dashed border-primary bg-card px-4 py-2 text-center font-mono text-lg font-bold text-primary">
                    {offer.code}
                  </div>
                  <button
                    onClick={() => copyCode(offer.code)}
                    className="rounded-md bg-primary p-2 text-primary-foreground transition-smooth hover:scale-[0.97]"
                    aria-label="Copy code"
                  >
                    <Icon name="ClipboardDocumentIcon" size={20} />
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-1 text-muted-foreground">
                    <Icon name="ClockIcon" size={16} />
                    <span>Expires in {timeLeft[offer.id] || 'Loading...'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {visibleOffers.map((offer, index) => (
            <div
              key={offer.id}
              className={`relative overflow-hidden rounded-lg border border-border ${offer.bgColor} p-6 shadow-elevation-1 transition-smooth hover:shadow-elevation-2`}
              data-aos="flip-left"
              data-aos-delay={index * 200}
            >
              <div className="mb-4 flex items-start justify-between">
                <Icon name={offer.icon as any} size={40} className="text-primary" variant="solid" />
                <span className="rounded-md bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">
                  {offer.discount}
                </span>
              </div>
              <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
                {offer.title}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">{offer.description}</p>
              <div className="mb-4 flex items-center space-x-2">
                <div className="flex-1 rounded-md border-2 border-dashed border-primary bg-card px-4 py-2 text-center font-mono text-lg font-bold text-primary">
                  {offer.code}
                </div>
                <button
                  onClick={() => copyCode(offer.code)}
                  className="rounded-md bg-primary p-2 text-primary-foreground transition-smooth hover:scale-[0.97]"
                  aria-label="Copy code"
                >
                  <Icon name="ClipboardDocumentIcon" size={20} />
                </button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center space-x-1 text-muted-foreground">
                  <Icon name="ClockIcon" size={16} />
                  <span>Expires in {timeLeft[offer.id] || 'Loading...'}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default OffersSection;



