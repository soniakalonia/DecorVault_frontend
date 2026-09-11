'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import ReviewModal from './ReviewModal';
import { useCreateReviewMutation, useGetProductReviewsQuery } from '@/store/api/reviewsApi';
import { toast } from 'react-toastify';

interface Specification {
  label: string;
  value: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  alt: string;
  price: number;
  rating: number;
}

interface ProductTabsProps {
  productId: number;
  specifications: Specification[];
  careInstructions: string[];
  warrantyInfo: string;
  reviews: Review[];
  relatedProducts: RelatedProduct[];
}

type TabType = 'specifications' | 'care' | 'warranty' | 'reviews';

const ProductTabs = ({
  productId,
  specifications,
  careInstructions,
  warrantyInfo,
  reviews,
  relatedProducts,
}: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('specifications');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createReview] = useCreateReviewMutation();
  const { data: reviewsData, refetch } = useGetProductReviewsQuery(productId);

  const dynamicReviews = reviewsData?.data?.map((r: any) => ({
    id: r.id.toString(),
    userName: r.user_name || 'Guest User',
    rating: r.rating,
    date: new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    comment: r.comment,
    verified: !!r.user_id,
  })) || [];

  const handleAddReview = async (newReview: { userName: string; rating: number; title: string; comment: string }) => {
    try {
      await createReview({
        product_id: productId,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
      }).unwrap();
      toast.success('Review submitted successfully!');
      refetch();
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error('Failed to submit review');
    }
  };

  const tabs = [
    { id: 'specifications' as TabType, label: 'Specifications', icon: 'DocumentTextIcon' },
    { id: 'care' as TabType, label: 'Care Instructions', icon: 'SparklesIcon' },
    { id: 'warranty' as TabType, label: 'Warranty', icon: 'ShieldCheckIcon' },
    { id: 'reviews' as TabType, label: `Reviews (${dynamicReviews.length})`, icon: 'StarIcon' },
  ];

  return (
    <div className="bg-white">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 overflow-x-auto px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon name={tab.icon as any} size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Specifications Tab */}
        {activeTab === 'specifications' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Product Specifications
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {specifications.map((spec, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    {spec.label}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Care Instructions Tab */}
        {activeTab === 'care' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Care Instructions
            </h3>
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="space-y-4">
                {careInstructions.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Icon
                        name="CheckIcon"
                        size={16}
                        className="text-green-600"
                      />
                    </div>
                    <p className="text-gray-700 leading-relaxed">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Warranty Tab */}
        {activeTab === 'warranty' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Warranty Information
            </h3>
            <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
              <div className="flex items-start space-x-4 mb-6">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon name="ShieldCheckIcon" size={32} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Manufacturer Warranty</h4>
                  <p className="text-blue-700 font-medium">Quality Guaranteed</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">{warrantyInfo}</p>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                Customer Reviews
              </h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
              >
                <Icon name="PencilIcon" size={16} />
                <span>Write Review</span>
              </button>
            </div>

            <div className="space-y-6">
              {dynamicReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                          {review.verified && (
                            <span className="inline-flex items-center space-x-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              <Icon name="CheckBadgeIcon" size={12} />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, index) => (
                        <Icon
                          key={index}
                          name="StarIcon"
                          size={18}
                          variant={index < review.rating ? 'solid' : 'outline'}
                          className={index < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddReview}
      />
    </div>
  );
};

export default ProductTabs;
