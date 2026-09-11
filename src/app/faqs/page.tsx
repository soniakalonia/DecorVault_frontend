'use client';

import { useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/common/Breadcrumb';
import Icon from '@/components/ui/AppIcon';

// FAQ Data
const faqCategories = [
  {
    id: 'ordering',
    name: 'Ordering & Payments',
    icon: 'ShoppingCartIcon',
    faqs: [
      {
        question: 'How do I place an order?',
        answer: 'To place an order, simply browse our products, add items to your cart, and proceed to checkout. You will need to provide your shipping details and payment information. You will receive an order confirmation email after placing your order.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept various payment methods including Credit/Debit Cards (VISA, MasterCard), UPI, Net Banking, and Paytm. All transactions are secure and encrypted.'
      },
      {
        question: 'Is it safe to use my credit/debit card on your website?',
        answer: 'Yes, absolutely! We use industry-standard SSL encryption to protect your payment information. All transactions are processed through secure payment gateways.'
      },
      {
        question: 'Can I modify or cancel my order?',
        answer: 'You can modify or cancel your order within 12 hours of placing it. Please contact our customer support team immediately with your order ID. Orders that have already been processed or shipped cannot be modified.'
      }
    ]
  },
  {
    id: 'shipping',
    name: 'Shipping & Delivery',
    icon: 'TruckIcon',
    faqs: [
      {
        question: 'What are the shipping charges?',
        answer: 'Shipping charges are calculated at checkout based on your delivery address and the weight of your order. We offer free shipping on orders above ₹999.'
      },
      {
        question: 'How long does delivery take?',
        answer: 'Delivery times typically range from 3-7 business days depending on your location. Metro cities usually receive deliveries within 3-5 days, while other locations may take 5-7 days.'
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Currently, we only ship within India. We are working on expanding our shipping capabilities internationally in the near future.'
      },
      {
        question: 'How can I track my order?',
        answer: 'You will receive a tracking link via email once your order is shipped. You can also track your order by visiting our Order Tracking page and entering your order ID.'
      }
    ]
  },
  {
    id: 'returns',
    name: 'Returns & Refunds',
    icon: 'ArrowUturnLeftIcon',
    faqs: [
      {
        question: 'What is your return policy?',
        answer: 'We accept returns within 7 days of delivery for unused items in their original packaging. Please visit our Return Policy page for complete details.'
      },
      {
        question: 'How do I initiate a return?',
        answer: 'To initiate a return, contact us at info@decorvault.online with your order ID and reason for return. You will receive a Return Authorization (RA) number and further instructions.'
      },
      {
        question: 'How long does it take to receive a refund?',
        answer: 'Refunds are processed within 7-10 business days after we receive and inspect the returned item. The refund will be credited to your original payment method.'
      },
      {
        question: 'Will I be charged for return shipping?',
        answer: 'If the return is due to our error (damaged, defective, or incorrect item), we will cover the return shipping costs. For other returns, you are responsible for the return shipping charges.'
      }
    ]
  },
  {
    id: 'products',
    name: 'Products & Customization',
    icon: 'TagIcon',
    faqs: [
      {
        question: 'Are your products handmade?',
        answer: 'Many of our products are handcrafted by skilled artisans. Each piece may have slight variations, making it unique and special.'
      },
      {
        question: 'Do you offer customization?',
        answer: 'Yes, we offer customization on select products. Please contact us with your requirements and we will let you know if we can accommodate your request.'
      },
      {
        question: 'Can I get a product catalog?',
        answer: 'You can browse all our products on our website. We update our collection regularly with new arrivals. You can also subscribe to our newsletter for updates on new products.'
      },
      {
        question: 'What is your bulk order policy?',
        answer: 'We offer special pricing for bulk orders. Please contact our team at contact@decorvault.online with your requirements and we will provide you with a quote.'
      }
    ]
  },
  {
    id: 'account',
    name: 'Account & Security',
    icon: 'UserCircleIcon',
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'You can create an account by clicking on the "Register" or "Sign Up" button at the top of the page. Fill in your details and you will be ready to shop!'
      },
      {
        question: 'I forgot my password. What should I do?',
        answer: 'Click on the "Forgot Password" link on the login page. Enter your registered email address and we will send you a link to reset your password.'
      },
      {
        question: 'How can I update my profile information?',
        answer: 'Log in to your account and go to your profile settings. You can update your name, email, phone number, and shipping addresses from there.'
      },
      {
        question: 'Is my personal information secure?',
        answer: 'Yes, we take data security very seriously. We use industry-standard security measures to protect your personal information. Please review our Privacy Policy for more details.'
      }
    ]
  },
  {
    id: 'general',
    name: 'General Questions',
    icon: 'QuestionMarkCircleIcon',
    faqs: [
      {
        question: 'How can I contact customer support?',
        answer: 'You can reach us via email at contact@decorvault.online or call us at +91 98765 43210. Our support team is available Monday to Saturday, 10 AM to 7 PM (IST).'
      },
      {
        question: 'Do you have a physical store?',
        answer: 'Currently, we operate primarily online. However, we do have a showroom by appointment. Please contact us to schedule a visit.'
      },
      {
        question: 'Do you offer gift wrapping?',
        answer: 'Yes, we offer gift wrapping services for select items. You can select the gift wrapping option during checkout for a small additional fee.'
      },
      {
        question: 'How do I apply a coupon code?',
        answer: 'You can apply your coupon code during checkout. Enter the code in the designated field and click "Apply" to see the discount reflected in your order total.'
      }
    ]
  }
];

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState('ordering');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (faqKey: string) => {
    setOpenFaq(openFaq === faqKey ? null : faqKey);
  };

  // Get current category FAQs
  const currentCategory = faqCategories.find(cat => cat.id === activeCategory);
  const currentFaqs = currentCategory?.faqs || [];

  return (
    <main className="bg-[#F5F5F7] min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Page Header */}
        <div className="mb-8 text-center" data-aos="fade-up">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A2A3A] mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-[#6B7280] max-w-2xl mx-auto">
            Find answers to the most common questions about our products, ordering, shipping, and more.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8" data-aos="fade-up">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for answers..."
              className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-lg bg-white text-[#1A2A3A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <Icon name="MagnifyingGlassIcon" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          </div>
        </div>

        {/* Categories & FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" data-aos="fade-up">
          
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sticky top-24">
              <h3 className="font-semibold text-[#1A2A3A] mb-3 px-2">Categories</h3>
              <ul className="space-y-1">
                {faqCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => {
                        setActiveCategory(category.id);
                        setOpenFaq(null);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-smooth ${
                        activeCategory === category.id
                          ? 'bg-[#D4AF37] text-white'
                          : 'text-[#6B7280] hover:bg-[#F5F5F7] hover:text-[#1A2A3A]'
                      }`}
                    >
                      <Icon name={category.icon as any} size={18} />
                      <span>{category.name}</span>
                      {activeCategory === category.id && (
                        <Icon name="ChevronRightIcon" size={16} className="ml-auto" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
              {/* Category Title */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="p-2 bg-[#FDF8F0] rounded-lg">
                  <Icon name={currentCategory?.icon as any} size={24} className="text-[#D4AF37]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#1A2A3A]">{currentCategory?.name}</h2>
                  <p className="text-sm text-[#6B7280]">{currentFaqs.length} questions</p>
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className="space-y-3">
                {currentFaqs.map((faq, index) => {
                  const faqKey = `${activeCategory}-${index}`;
                  const isOpen = openFaq === faqKey;

                  return (
                    <div
                      key={faqKey}
                      className="border border-gray-200 rounded-lg overflow-hidden transition-smooth"
                    >
                      <button
                        onClick={() => toggleFaq(faqKey)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F5F5F7] transition-smooth"
                      >
                        <span className="font-medium text-[#1A2A3A] pr-8">
                          {faq.question}
                        </span>
                        <Icon
                          name={isOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                          size={20}
                          className={`flex-shrink-0 text-[#6B7280] transition-transform duration-300 ${
                            isOpen ? 'text-[#D4AF37]' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? 'max-h-96' : 'max-h-0'
                        }`}
                      >
                        <div className="p-4 pt-0 text-[#374151] border-t border-gray-100">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Still Have Questions */}
              <div className="mt-8 p-6 bg-[#F5F5F7] rounded-lg text-center">
                <Icon name="ChatBubbleLeftRightIcon" size={28} className="mx-auto text-[#D4AF37] mb-3" />
                <h3 className="font-semibold text-[#1A2A3A] mb-2">Still Have Questions?</h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  Can't find what you're looking for? Our team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/contact"
                    className="px-6 py-2 bg-[#D4AF37] text-[#1A2A3A] text-sm font-medium rounded-lg hover:scale-[0.97] transition-smooth"
                  >
                    Contact Us
                  </Link>
                  <a
                    href="mailto:contact@decorvault.online"
                    className="px-6 py-2 border border-[#D4AF37] text-[#D4AF37] text-sm font-medium rounded-lg hover:bg-[#FDF8F0] transition-smooth"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}