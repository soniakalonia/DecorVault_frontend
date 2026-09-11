'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function TestImagesPage() {
  const categories = [
    { name: 'Candles', file: 'candles.jpg' },
    { name: 'Clocks', file: 'clocks.jpg' },
    { name: 'Photo Frames', file: 'photo-frames.jpg' },
    { name: 'Vases', file: 'vases.jpg' },
    { name: 'Wall Decor', file: 'wall-decor.jpg' },
    { name: 'Gift Items', file: 'gift-items.jpg' },
    { name: 'Table Decor', file: 'table-decor.jpg' },
    { name: 'Mirrors', file: 'mirrors.jpg' },
    { name: 'Indoor Plants', file: 'indoor-plants.jpg' },
    { name: 'Festival Decor', file: 'festival-decor.jpg' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2 text-[#1A1A2E]">📸 Test Category Images</h1>
      <p className="text-sm text-[#7A7A7A] mb-6">
        ✅ = Image found, ❌ = Image missing
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <div 
            key={cat.name} 
            className="border rounded-lg p-3 text-center bg-white shadow-sm"
          >
            <div className="w-full h-32 relative rounded-lg overflow-hidden bg-[#F0EDEA]">
              {/* Try using Next.js Image component */}
              <Image
                src={`/assets/images/categories/${cat.file}`}
                alt={cat.name}
                width={200}
                height={128}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Show fallback if image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex flex-col items-center justify-center w-full h-full bg-red-50 text-red-500 text-xs font-medium">
                        <span class="text-2xl">❌</span>
                        <span class="mt-1">${cat.file}</span>
                      </div>
                    `;
                  }
                }}
              />
            </div>
            <p className="mt-2 text-sm font-medium text-[#1A1A2E]">{cat.name}</p>
            <p className="text-[10px] text-[#7A7A7A]">{cat.file}</p>
          </div>
        ))}
      </div>

      {/* Check Public Folder */}
      <div className="mt-8 p-4 bg-[#FFF3D6] border border-[#D4AF37] rounded-lg">
        <h2 className="font-semibold text-[#1A1A2E] mb-2">📁 Images Should Be Here:</h2>
        <code className="block bg-white px-3 py-2 rounded text-xs break-all">
          C:\Users\DELL\Desktop\frontend_frontend\public\assets\images\categories\
        </code>
        <p className="text-sm text-[#7A7A7A] mt-2">
          Files should be: candles.jpg, clocks.jpg, photo-frames.jpg, etc.
        </p>
      </div>

      <div className="mt-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#C5A035] transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}