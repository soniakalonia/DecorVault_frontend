'use client';

import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  productPurchased: string;
  date: string;
  avatar: string;
  verified: boolean;
}

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Priya Sharma',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      comment: 'Absolutely love the lavender candle! The fragrance is so soothing and the packaging was beautiful. Perfect gift for my sister.',
      productPurchased: 'Aromatherapy Lavender Candle',
      date: 'Aug 5, 2026',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      verified: true,
    },
    {
      id: '2',
      name: 'Rajesh Kumar',
      location: 'Delhi, NCR',
      rating: 5,
      comment: 'The wall clock is stunning! Beautiful design and the silent movement is a blessing. Looks premium and elegant on my living room wall.',
      productPurchased: 'Modern Wall Clock',
      date: 'Aug 3, 2026',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      verified: true,
    },
    {
      id: '3',
      name: 'Anita Desai',
      location: 'Bangalore, Karnataka',
      rating: 4,
      comment: 'The photo frame set is gorgeous! Perfect for our family wall. The quality is excellent and the gold finish looks so elegant.',
      productPurchased: 'Modern Gold Photo Frame',
      date: 'Jul 30, 2026',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      verified: true,
    },
    {
      id: '4',
      name: 'Vikram Singh',
      location: 'Pune, Maharashtra',
      rating: 5,
      comment: 'The gift hamper was a huge hit! Everything from the candle to the chocolates was premium quality. Will definitely order again.',
      productPurchased: 'Premium Gift Hamper',
      date: 'Jul 28, 2026',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
      verified: true,
    },
  ];

  return (
    <section className="bg-[#FAFAFA] py-4 sm:py-6">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-4 text-center" data-aos="fade-up">
          <div className="mb-2 flex items-center justify-center space-x-2">
            <Icon name="ChatBubbleLeftRightIcon" size={32} className="text-[#D4AF37]" variant="solid" />
            <h2 className="font-heading text-3xl font-bold text-[#1A1A2E] sm:text-4xl">
              Customer Testimonials
            </h2>
          </div>
          <p className="text-[#7A7A7A]">
            What our customers say about us
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="rounded-lg border border-[#E8E4E0] bg-white p-6 shadow-elevation-1 transition-smooth hover:shadow-elevation-2"
              data-aos="fade-up"
              data-aos-delay={index * 200}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-[#F0EDEA]">
                    <AppImage
                      src={testimonial.avatar}
                      alt={`${testimonial.name} profile picture`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1A1A2E]">{testimonial.name}</h3>
                    <p className="caption text-[#7A7A7A]">{testimonial.location}</p>
                  </div>
                </div>
                {testimonial.verified && (
                  <div className="flex items-center space-x-1 rounded-md bg-[#2ECC71]/10 px-2 py-1 text-xs font-medium text-[#2ECC71]">
                    <Icon name="CheckBadgeIcon" size={14} variant="solid" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              <div className="mb-3 flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name="StarIcon"
                    size={16}
                    variant={i < testimonial.rating ? 'solid' : 'outline'}
                    className={i < testimonial.rating ? 'text-[#D4AF37]' : 'text-[#E8E4E0]'}
                  />
                ))}
              </div>

              <p className="mb-4 text-sm text-[#1A1A2E]">{testimonial.comment}</p>

              <div className="border-t border-[#E8E4E0] pt-4">
                <p className="caption mb-1 text-[#7A7A7A]">Purchased:</p>
                <p className="text-sm font-medium text-[#1A1A2E]">{testimonial.productPurchased}</p>
                <p className="caption mt-2 text-[#7A7A7A]">{testimonial.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;