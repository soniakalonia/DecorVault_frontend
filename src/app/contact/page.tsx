import type { Metadata } from 'next';
import ContactInteractive from './components/ContactInteractive';

export const metadata: Metadata = {
  title: 'Contact Us - DecorVault | Get in Touch',
  description: 'Contact DecorVault for inquiries, bulk orders, or support. We are here to help you with premium home decor, candles, clocks, photo frames, and gift items.',
};

export default function ContactPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <ContactInteractive />
    </div>
  );
}