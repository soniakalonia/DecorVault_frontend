'use client';
import Link from 'next/link';

import Breadcrumb from '@/components/common/Breadcrumb';
import Icon from '@/components/ui/AppIcon';

export default function ShippingDeliveryPage() {
  return (
    <main className="bg-[#F5F5F7] min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Page Header */}
        <div className="mb-8" data-aos="fade-up">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A2A3A] mb-2">
            Shipping & Delivery
          </h1>
          <p className="text-[#6B7280] text-sm">
            Last Updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 lg:p-10" data-aos="fade-up">
          <div className="prose prose-lg max-w-none text-[#374151]">

            <p className="text-base">
              At <strong className="text-[#D4AF37]">DecorVault</strong>, we are committed to delivering your orders safely and on time.
              Please read our shipping and delivery policy to understand how we process and deliver your orders.
            </p>

            <hr className="my-6 border-gray-200" />

            {/* Section 1 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">1. Shipping Zones</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>We currently ship to all locations within <strong>India</strong></li>
              <li>We are working on expanding our shipping capabilities to international locations</li>
              <li>Shipping to remote areas may take additional time</li>
              <li>Some products may have shipping restrictions based on size or weight</li>
            </ul>

            {/* Section 2 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">2. Shipping Methods & Costs</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse mt-3">
                <thead>
                  <tr className="bg-[#F5F5F7]">
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-[#1A2A3A]">Shipping Method</th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-[#1A2A3A]">Delivery Time</th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-[#1A2A3A]">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-sm">Standard Shipping</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">5-7 Business Days</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">₹99 - ₹199</td>
                  </tr>
                  <tr className="bg-[#F5F5F7]">
                    <td className="border border-gray-200 px-4 py-2 text-sm font-medium text-[#D4AF37]">Free Shipping</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">5-7 Business Days</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm font-medium text-[#D4AF37]">FREE on orders ₹999+</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-sm">Express Shipping</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">2-3 Business Days</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">₹299 - ₹499</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-[#6B7280] mt-2">* Shipping costs may vary based on order weight, size, and delivery location.</p>

            {/* Section 3 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">3. Order Processing Time</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>Orders are processed within <strong>24-48 hours</strong> of order placement</li>
              <li>Orders placed on weekends or public holidays will be processed on the next business day</li>
              <li>Customized or personalized items may take additional processing time</li>
              <li>You will receive a confirmation email once your order is processed</li>
            </ul>

            {/* Section 4 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">4. Order Tracking</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>You will receive a tracking link via email once your order is shipped</li>
              <li>You can also track your order on our <Link href="/order-tracking" className="text-[#D4AF37] hover:underline">Order Tracking</Link> page</li>
              <li>Tracking information is updated in real-time by our shipping partners</li>
              <li>Please allow 24 hours for tracking information to appear after shipping</li>
            </ul>

            {/* Section 5 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">5. Delivery Process</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>Our courier partners will deliver your order to the address provided during checkout</li>
              <li>Please ensure someone is available to receive the package at the delivery address</li>
              <li>In case of multiple delivery attempts, a delivery notification will be left</li>
              <li>You may need to provide a valid ID proof for delivery in some cases</li>
            </ul>

            {/* Section 6 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">6. Delivery Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div className="p-4 bg-[#F5F5F7] rounded-lg text-center">
                <Icon name="BuildingOfficeIcon" size={28} className="mx-auto text-[#6B7280] mb-2" />
                <h4 className="font-semibold text-[#1A2A3A]">Metro Cities</h4>
                <p className="text-sm text-[#6B7280]">3-5 Business Days</p>
              </div>
              <div className="p-4 bg-[#F5F5F7] rounded-lg text-center">
                <Icon name="MapPinIcon" size={28} className="mx-auto text-[#6B7280] mb-2" />
                <h4 className="font-semibold text-[#1A2A3A]">Tier 2 & 3 Cities</h4>
                <p className="text-sm text-[#6B7280]">4-7 Business Days</p>
              </div>
              <div className="p-4 bg-[#F5F5F7] rounded-lg text-center">
                <Icon name="GlobeAltIcon" size={28} className="mx-auto text-[#6B7280] mb-2" />
                <h4 className="font-semibold text-[#1A2A3A]">Remote Areas</h4>
                <p className="text-sm text-[#6B7280]">7-10 Business Days</p>
              </div>
            </div>

            {/* Section 7 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">7. Damaged or Lost Packages</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>If your package arrives damaged, please contact us immediately with photos of the damage</li>
              <li>We will arrange for a replacement or refund at no additional cost</li>
              <li>In case of lost packages, we will initiate a thorough investigation with our courier partner</li>
              <li>Claims for damaged packages must be reported within <strong>48 hours</strong> of delivery</li>
            </ul>

            {/* Section 8 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">8. Undeliverable Packages</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>Packages are considered undeliverable if the address is incorrect or the recipient is unavailable</li>
              <li>We will attempt to contact you for address clarification</li>
              <li>Undeliverable packages will be returned to us</li>
              <li>You will be responsible for re-shipping charges for undeliverable packages</li>
            </ul>

            {/* Section 9 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">9. Shipping Restrictions</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>We do not ship to P.O. Box addresses or military addresses</li>
              <li>Some products may have shipping restrictions due to size, weight, or material</li>
              <li>Bulk orders may require special shipping arrangements</li>
              <li>Fragile items are packed with extra care but cannot be guaranteed against transit damage</li>
            </ul>

            {/* Section 10 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">10. Frequently Asked Questions</h2>

            <div className="space-y-4 mt-3">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-[#1A2A3A]">Do you offer free shipping?</h4>
                <p className="text-sm text-[#374151]">Yes, we offer free shipping on all orders above ₹999 within India.</p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-[#1A2A3A]">Can I change my delivery address after placing an order?</h4>
                <p className="text-sm text-[#374151]">You can request a change of delivery address within 12 hours of placing your order. Once the order is processed, we cannot guarantee address changes.</p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-[#1A2A3A]">Will I be notified when my order is delivered?</h4>
                <p className="text-sm text-[#374151]">Yes, you will receive a delivery confirmation email once your order is successfully delivered.</p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-[#1A2A3A]">What happens if I miss the delivery?</h4>
                <p className="text-sm text-[#374151]">Our courier partners will make up to 3 delivery attempts. If all attempts fail, the package will be returned to us. Re-shipping charges may apply.</p>
              </div>
            </div>

            {/* Section 11 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">11. Contact Us</h2>
            <p className="text-base">
              If you have any questions about our Shipping & Delivery policy, please reach out to us:
            </p>
            <div className="mt-3 p-4 bg-[#F5F5F7] rounded-lg">
              <p className="text-base">
                <strong>Email:</strong> <a href="mailto:contact@decorvault.online" className="text-[#D4AF37] hover:underline">contact@decorvault.online</a>
              </p>
              <p className="text-base">
                <strong>Phone:</strong> +91 98765 43210
              </p>
              <p className="text-base">
                <strong>Working Hours:</strong> Mon-Sat: 10 AM - 7 PM (IST)
              </p>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Quick Tip */}
            <div className="bg-[#FDF8F0] border border-[#D4AF37] rounded-lg p-4">
              <p className="text-sm text-[#1A2A3A]">
                <strong className="text-[#D4AF37]">📦 Quick Tip:</strong> Track your order regularly for real-time updates.
                If you notice any delays, please contact our support team for assistance.
              </p>
            </div>

            <p className="text-sm text-[#6B7280] text-center mt-4">
              By placing an order with DecorVault, you agree to our Shipping & Delivery Policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}