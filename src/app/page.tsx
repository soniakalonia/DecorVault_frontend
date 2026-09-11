import type { Metadata } from 'next';
import HomepageInteractive from './home/HomepageInteractive';

export const metadata: Metadata = {
  title: 'DecorVault - Premium Home Decor & Gifts | Candles, Clocks, Photo Frames',
  description: 'Discover premium home decor collection including designer candles, elegant clocks, photo frames, gift items, and more. Curated for your beautiful home.',
};

export default function HomePage() {
  return (
    <div className="bg-[#F5F5F7]">
      <HomepageInteractive />
    </div>
  );
}

