'use client';
import Breadcrumb from '@/components/common/Breadcrumb';

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#F5F5F7] min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Page Header */}
        <div className="mb-8" data-aos="fade-up">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A2A3A] mb-2">
            Privacy Policy
          </h1>
          <p className="text-[#6B7280] text-sm">
            Last Updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 lg:p-10" data-aos="fade-up">
          <div className="prose prose-lg max-w-none text-[#374151]">
            
            <p className="text-base">
              At <strong className="text-[#D4AF37]">DecorVault</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases from us.
            </p>

            <hr className="my-6 border-gray-200" />

            {/* Section 1 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">1. Information We Collect</h2>
            <p className="text-base">
              We collect information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>Create an account on our website</li>
              <li>Place an order for our products</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us through our contact form or email</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p className="text-base mt-3">
              The information we collect may include your name, email address, phone number, shipping address, payment information, and order history.
            </p>

            {/* Section 2 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">2. How We Use Your Information</h2>
            <p className="text-base">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>Process and fulfill your orders</li>
              <li>Send you order confirmations and updates</li>
              <li>Respond to your inquiries and customer service requests</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our products and services</li>
              <li>Prevent fraudulent transactions</li>
            </ul>

            {/* Section 3 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">3. Information Sharing</h2>
            <p className="text-base">
              We do not sell, trade, or rent your personal information to third parties. However, we may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li><strong>Service Providers:</strong> Payment processors, shipping partners, and email service providers</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
            </ul>

            {/* Section 4 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">4. Cookies and Tracking</h2>
            <p className="text-base">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. 
              You can control cookie preferences through your browser settings.
            </p>

            {/* Section 5 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">5. Data Security</h2>
            <p className="text-base">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. 
              All payment transactions are encrypted using SSL technology.
            </p>

            {/* Section 6 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">6. Your Rights</h2>
            <p className="text-base">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 text-base text-[#374151]">
              <li>Access, update, or delete your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>

            {/* Section 7 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">7. Third-Party Links</h2>
            <p className="text-base">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of such external sites. 
              We encourage you to review their privacy policies before providing any personal information.
            </p>

            {/* Section 8 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">8. Children's Privacy</h2>
            <p className="text-base">
              Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children. 
              If you believe we have collected information from a child, please contact us immediately.
            </p>

            {/* Section 9 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">9. Changes to This Policy</h2>
            <p className="text-base">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>

            {/* Section 10 */}
            <h2 className="text-xl font-semibold text-[#1A2A3A] mt-8 mb-3">10. Contact Us</h2>
            <p className="text-base">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:
            </p>
            <div className="mt-3 p-4 bg-[#F5F5F7] rounded-lg">
              <p className="text-base">
                <strong>Email:</strong> <a href="mailto:contact@decorvault.online" className="text-[#D4AF37] hover:underline">contact@decorvault.online</a>
              </p>
              <p className="text-base">
                <strong>Phone:</strong> +91 98765 43210
              </p>
              <p className="text-base">
                <strong>Address:</strong> H No. 9/149, Shyam Block, Kailash Nagar
Gandhi Nagar, New Delhi – 110031
              </p>
            </div>

            <hr className="my-6 border-gray-200" />

            <p className="text-sm text-[#6B7280] text-center">
              By using our website, you consent to our Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}