'use client';

import { useGetUserReviewsQuery } from '@/store/api/reviewsApi';
import Icon from '@/components/ui/AppIcon';
import Image from 'next/image';

export default function ReviewsPage() {
  const { data: reviews, isLoading } = useGetUserReviewsQuery();

  if (isLoading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  const reviewsList = Array.isArray(reviews) ? reviews : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Reviews & Ratings</h1>
      
      {reviewsList.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <Icon name="StarIcon" size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">You haven't written any reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviewsList.map((review: any) => (
            <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex gap-4">
                <Image
                  src={review.product_image ? JSON.parse(review.product_image)[0] : '/placeholder.png'}
                  alt={review.product_name || 'Product'}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{review.product_name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                          key={star}
                          name="StarIcon"
                          size={16}
                          variant={star <= review.rating ? 'solid' : 'outline'}
                          className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
