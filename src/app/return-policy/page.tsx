'use client';
import Breadcrumb from '@/components/common/Breadcrumb';

export default function ReturnPolicyPage() {
  return (
    <main className="bg-[#F5F5F7] min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Page Header */}
        <div className="mb-8" data-aos="fade-up">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A2A3A] mb-2">
            Return Policy
          </h1>
          <p className="text-[#6B7280] text-sm">
            Last Updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 lg:p-10" data-aos="fade-up">
          <div className="prose prose-lg max-w-none text-[#374151]">

            <p className="text-base">
              At <strong className="text-[#D4AF37]">DecorVault</strong>, we want you to be completely satisfied with your purchase.
              If you are not entirely happy with your order, we are here to help. Please read our return policy carefully
              before initiating a return.
            </p>

            <hr className="my-6 border-gray-200" />

            {/* Section 1 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">1. Return Window</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>You have <strong>7 days</strong> from the date of delivery to initiate a return</li>
              <li>Returns requested after 7 days will not be accepted</li>
              <li>The return window is calculated from the delivery date shown on the tracking information</li>
            </ul>

            {/* Section 2 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">2. Eligibility Criteria</h2>
            <p className="text-base">To be eligible for a return, your item must meet the following conditions:</p>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>Item must be <strong>unused</strong> and in the same condition as received</li>
              <li>Item must be in its <strong>original packaging</strong> with all tags attached</li>
              <li>Item must not show any signs of wear, damage, or alteration</li>
              <li>All accessories, manuals, and freebies must be included</li>
              <li>Proof of purchase (order ID) must be provided</li>
            </ul>

            {/* Section 3 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">3. Non-Returnable Items</h2>
            <p className="text-base">The following items cannot be returned:</p>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li><strong>Customized or Personalized Items:</strong> Products made to your specifications</li>
              <li><strong>Clearance or Sale Items:</strong> Products purchased at discounted rates</li>
              <li><strong>Used Items:</strong> Products that have been installed or used</li>
              <li><strong>Damaged Items:</strong> Items damaged due to improper handling by the customer</li>
              <li><strong>Perishable Items:</strong> Products with an expiration date</li>
            </ul>

            {/* Section 4 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">4. Return Process</h2>
            <p className="text-base">To initiate a return, please follow these steps:</p>
            <ol className="list-decimal pl-6 space-y-2 text-base text-[#374151]">
              <li><strong>Contact Us:</strong> Email us at <a href="mailto:contact@decorvault.online" className="text-[#D4AF37] hover:underline">contact@decorvault.online</a> with your order ID and reason for return</li>
              <li><strong>Return Authorization:</strong> You will receive a Return Authorization (RA) number and instructions</li>
              <li><strong>Packaging:</strong> Securely pack the item in its original packaging</li>
              <li><strong>Shipping:</strong> Ship the item to our return address using a trackable shipping method</li>
              <li><strong>Confirmation:</strong> We will notify you once the return is received and inspected</li>
            </ol>

            {/* Section 5 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">5. Return Shipping Costs</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li><strong>Returns due to our error:</strong> We will cover the return shipping costs</li>
              <li><strong>Returns for other reasons:</strong> You are responsible for the return shipping costs</li>
              <li>Original shipping charges are non-refundable</li>
              <li>We recommend using a trackable shipping service for returns</li>
            </ul>

            {/* Section 6 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">6. Refund Processing</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>Refunds will be processed within <strong>7-10 business days</strong> after receiving the return</li>
              <li>Refunds will be issued to the original payment method used for the purchase</li>
              <li>You will receive an email confirmation once the refund is processed</li>
              <li>Processing times may vary depending on your bank or payment provider</li>
            </ul>

            {/* Section 7 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">7. Exchange Policy</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>We offer exchanges for items that are damaged, defective, or incorrect</li>
              <li>Exchanges are subject to product availability</li>
              <li>Please contact us for exchange requests</li>
              <li>Exchange shipping is free for items damaged or incorrect due to our error</li>
            </ul>

            {/* Section 8 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">8. Damaged or Defective Items</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>If you receive a damaged or defective item, please contact us immediately</li>
              <li>We may request photos of the damage to process your claim</li>
              <li>We will arrange for a replacement or full refund at no additional cost</li>
              <li>Claims for damage must be reported within <strong>48 hours</strong> of delivery</li>
            </ul>

            {/* Section 9 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">9. Cancellation Policy</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>Orders can be canceled within <strong>12 hours</strong> of placement</li>
              <li>Full refund will be issued for canceled orders</li>
              <li>Orders already processed or shipped cannot be canceled</li>
              <li>Please contact us immediately for cancellation requests</li>
            </ul>

            {/* Section 10 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">10. Return Address</h2>
            <div className="mt-3 p-4 bg-[#F5F5F7] rounded-lg">
              <p className="text-base font-medium text-[#1A2A3A]">DecorVault Returns</p>
              <p className="text-base text-[#374151]">[Your Return Address]</p>
              <p className="text-base text-[#374151]">[City], [State] - [PIN Code]</p>
              <p className="text-base text-[#374151]">India</p>
            </div>

            {/* Section 11 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">11. Contact Us</h2>
            <p className="text-base">
              If you have any questions about our Return Policy, please reach out to us:
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
                <strong className="text-[#D4AF37]">💡 Quick Tip:</strong> Please inspect your order immediately upon delivery.
                Report any issues within 48 hours to ensure faster resolution.
              </p>
            </div>

            <p className="text-sm text-[#6B7280] text-center mt-4">
              By placing an order with DecorVault, you agree to our Return Policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}