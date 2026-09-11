'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useSubmitContactMutation } from '@/store/api/contactApi';

const ContactInteractive = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitContact, { isLoading }] = useSubmitContactMutation();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      await submitContact(formData).unwrap();
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error?.data?.message || 'Failed to send message. Please try again.');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1A1A2E]/5 via-[#D4AF37]/10 to-[#FAFAFA] py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-[#1A1A2E] sm:text-4xl lg:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-[#7A7A7A]">
              Premium Home Decor & Gifting
            </p>
            <p className="mt-2 text-base text-[#7A7A7A] max-w-2xl mx-auto">
              Have a question about our products, need help with an order, or looking for 
              something special? We'd love to hear from you.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Information Cards */}
          <div className="space-y-4 lg:col-span-1">
            {/* Phone */}
            <div className="rounded-lg border border-[#E8E4E0] bg-white p-4 shadow-sm transition-smooth hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <Icon name="PhoneIcon" size={24} className="text-[#D4AF37]" />
              </div>
              <h3 className="mb-2 font-semibold text-[#1A1A2E]">Call Us</h3>
              <p className="text-sm text-[#7A7A7A] mb-2">Mon-Sat: 10 AM - 7 PM</p>
              <a href="tel:+919810092418" className="text-[#D4AF37] hover:underline font-medium">
                +91 98100 92418
              </a>
            </div>

            {/* Email */}
            <div className="rounded-lg border border-[#E8E4E0] bg-white p-4 shadow-sm transition-smooth hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <Icon name="EnvelopeIcon" size={24} className="text-[#D4AF37]" />
              </div>
              <h3 className="mb-2 font-semibold text-[#1A1A2E]">Email Us</h3>
              <p className="text-sm text-[#7A7A7A] mb-2">We'll respond within 24 hours</p>
              <a href="mailto:info@decorvault.online" className="text-[#D4AF37] hover:underline font-medium">
                info@decorvault.online
              </a>
            </div>

            {/* Location */}
            <div className="rounded-lg border border-[#E8E4E0] bg-white p-4 shadow-sm transition-smooth hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <Icon name="MapPinIcon" size={24} className="text-[#D4AF37]" />
              </div>
              <h3 className="mb-2 font-semibold text-[#1A1A2E]">Visit Us</h3>
              <p className="text-sm text-[#7A7A7A]">
                DecorVault Headquarters<br />
                Plot No. 53, Murad Nagar Ind. Area<br />
                Abupur, Ghaziabad (UP) – 201206
              </p>
            </div>

            {/* Social Media */}
            <div className="rounded-lg border border-[#E8E4E0] bg-white p-4 shadow-sm">
              <h3 className="mb-4 font-semibold text-[#1A1A2E]">Follow Us</h3>
              <div className="flex space-x-3">
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-md bg-[#F5F0EB] transition-smooth hover:bg-[#D4AF37] hover:text-[#1A1A2E]">
                  <Icon name="ShareIcon" size={20} />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-md bg-[#F5F0EB] transition-smooth hover:bg-[#D4AF37] hover:text-[#1A1A2E]">
                  <Icon name="CameraIcon" size={20} />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-md bg-[#F5F0EB] transition-smooth hover:bg-[#D4AF37] hover:text-[#1A1A2E]">
                  <Icon name="ChatBubbleLeftRightIcon" size={20} />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-md bg-[#F5F0EB] transition-smooth hover:bg-[#D4AF37] hover:text-[#1A1A2E]">
                  <Icon name="BuildingOfficeIcon" size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-[#E8E4E0] bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-4 font-heading text-2xl font-semibold text-[#1A1A2E]">
                Send us a Message
              </h2>

              {submitStatus === 'success' && (
                <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-3">
                  <div className="flex items-center">
                    <Icon name="CheckCircleIcon" size={20} className="text-green-600 mr-2" />
                    <p className="text-sm text-green-800">
                      Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3">
                  <div className="flex items-center">
                    <Icon name="XCircleIcon" size={20} className="text-red-600 mr-2" />
                    <p className="text-sm text-red-800">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#1A1A2E]">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-[#E8E4E0] bg-[#FAFAFA] px-4 py-2.5 text-[#1A1A2E] placeholder:text-[#7A7A7A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1A1A2E]">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-[#E8E4E0] bg-[#FAFAFA] px-4 py-2.5 text-[#1A1A2E] placeholder:text-[#7A7A7A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#1A1A2E]">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-md border border-[#E8E4E0] bg-[#FAFAFA] px-4 py-2.5 text-[#1A1A2E] placeholder:text-[#7A7A7A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-[#1A1A2E]">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-[#E8E4E0] bg-[#FAFAFA] px-4 py-2.5 text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="bulk">Bulk Order / Wholesale</option>
                      <option value="support">Order Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="collaboration">Collaboration / Partnership</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#1A1A2E]">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-md border border-[#E8E4E0] bg-[#FAFAFA] px-4 py-2.5 text-[#1A1A2E] placeholder:text-[#7A7A7A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Tell us about your decor needs, questions, or feedback..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center space-x-2 rounded-md bg-[#D4AF37] px-6 py-3 font-medium text-[#1A1A2E] transition-smooth hover:scale-[0.98] hover:bg-[#C5A035] disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="PaperAirplaneIcon" size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="mt-6 rounded-lg border border-[#E8E4E0] bg-white p-4 shadow-sm">
              <h3 className="mb-4 font-semibold text-[#1A1A2E]">Quick Answers</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Icon name="QuestionMarkCircleIcon" size={16} className="mt-0.5 text-[#D4AF37] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1A1A2E]">What are your business hours?</p>
                    <p className="text-[#7A7A7A]">We're available Monday to Saturday, 10 AM - 7 PM IST.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Icon name="QuestionMarkCircleIcon" size={16} className="mt-0.5 text-[#D4AF37] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1A1A2E]">Do you offer bulk discounts?</p>
                    <p className="text-[#7A7A7A]">Yes! Contact us for special pricing on bulk and wholesale orders.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Icon name="QuestionMarkCircleIcon" size={16} className="mt-0.5 text-[#D4AF37] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1A1A2E]">How long does shipping take?</p>
                    <p className="text-[#7A7A7A]">Standard delivery takes 3-7 business days across India.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Icon name="QuestionMarkCircleIcon" size={16} className="mt-0.5 text-[#D4AF37] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1A1A2E]">Do you offer gift wrapping?</p>
                    <p className="text-[#7A7A7A]">Yes! We offer premium gift wrapping for all gift items and hampers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInteractive;