'use client';

import Breadcrumb from '@/components/common/Breadcrumb';

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-[#F5F5F7] min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Page Header */}
        <div className="mb-8" data-aos="fade-up">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A2A3A] mb-2">
            Terms & Conditions
          </h1>
          <p className="text-[#6B7280] text-sm">
            Last Updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 lg:p-10" data-aos="fade-up">
          <div className="prose prose-lg max-w-none text-[#374151]">
            
            <p className="text-base">
              Welcome to <strong className="text-[#D4AF37]">DecorVault</strong>. By using our website and purchasing our products, 
              you agree to comply with and be bound by the following terms and conditions. Please read them carefully before 
              placing any order.
            </p>

            <hr className="my-6 border-gray-200" />

            {/* Section 1 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">1. General Terms</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>By using this website, you confirm that you are at least 18 years of age</li>
              <li>You agree to provide accurate and complete information when placing orders</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>We reserve the right to refuse service, terminate accounts, or cancel orders at our discretion</li>
            </ul>

            {/* Section 2 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">2. Products and Pricing</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>All product descriptions, images, and prices are subject to change without notice</li>
              <li>We make every effort to display product colors and images accurately on the website</li>
              <li>Prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise</li>
              <li>We reserve the right to correct any pricing errors that may occur</li>
            </ul>

            {/* Section 3 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">3. Orders and Payment</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>All orders are subject to acceptance and availability</li>
              <li>We accept payments through various payment methods as displayed at checkout</li>
              <li>Payment must be received in full before order processing begins</li>
              <li>You will receive an order confirmation email after placing your order</li>
              <li>We reserve the right to cancel any order due to fraud suspicion or stock unavailability</li>
            </ul>

            {/* Section 4 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">4. Shipping and Delivery</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>Delivery times are estimates and may vary based on location and external factors</li>
              <li>We are not responsible for delays caused by courier services or unforeseen circumstances</li>
              <li>Shipping costs are calculated at checkout based on your delivery address</li>
              <li>Orders are shipped to the delivery address provided by you</li>
              <li>Please ensure someone is available to receive the package at the delivery address</li>
            </ul>

            {/* Section 5 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">5. Returns and Refunds</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>We accept returns within 7 days of delivery for eligible products</li>
              <li>Products must be unused and in their original packaging</li>
              <li>Customized or personalized items are non-returnable</li>
              <li>Refunds will be processed to the original payment method</li>
              <li>Shipping costs are non-refundable unless the return is due to our error</li>
              <li>Please contact our customer support to initiate a return</li>
            </ul>

            {/* Section 6 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">6. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>All content on this website including text, images, logos, and graphics is our property</li>
              <li>You may not reproduce, distribute, or use our content without prior written permission</li>
              <li>Product designs are protected under intellectual property laws</li>
            </ul>

            {/* Section 7 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">7. User Conduct</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>You agree not to use the website for any unlawful purpose</li>
              <li>You will not attempt to gain unauthorized access to any part of the website</li>
              <li>You will not engage in any activity that disrupts the website's functionality</li>
              <li>You will not upload malicious content or viruses</li>
            </ul>

            {/* Section 8 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">8. Disclaimer of Warranties</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>Our products and services are provided on an "as is" basis</li>
              <li>We do not guarantee that the website will be error-free or uninterrupted</li>
              <li>We are not responsible for any damages resulting from the use of our products</li>
            </ul>

            {/* Section 9 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">9. Limitation of Liability</h2>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>Our liability is limited to the purchase price of the products</li>
              <li>We are not liable for any indirect, incidental, or consequential damages</li>
              <li>These limitations apply to the fullest extent permitted by law</li>
            </ul>

            {/* Section 10 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">10. Governing Law</h2>
            <p className="text-base">
              These terms and conditions are governed by and construed in accordance with the laws of India. 
              Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in [Your City].
            </p>

            {/* Section 11 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">11. Changes to Terms</h2>
            <p className="text-base">
              We reserve the right to modify these terms and conditions at any time. Changes will be effective immediately 
              upon posting on this page. Your continued use of the website constitutes acceptance of the updated terms.
            </p>

            {/* Section 12 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">12. Contact Information</h2>
            <p className="text-base">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <div className="mt-3 p-4 bg-[#F5F5F7] rounded-lg">
              <p className="text-base">
                <strong>Email:</strong> <a href="mailto:contact@decorvault.online" className="text-[#D4AF37] hover:underline">contact@decorvault.online</a>
              </p>
              <p className="text-base">
                <strong>Phone:</strong> +91 98765 43210
              </p>
              <p className="text-base">
                <strong>Address:</strong> DecorVault, 123 Main Street, Delhi, India
              </p>
            </div>

            <hr className="my-6 border-gray-200" />

            <p className="text-sm text-[#6B7280] text-center">
              By using our website, you agree to these Terms & Conditions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}