import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';

export const TopTrends: React.FC<{ products: Product[] }> = ({ products }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trending = products.filter(p => p.isTrending || p.rating >= 4.8);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-white border-b border-[#f0ece1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Carousel Navigation Controls */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-1">
              <Flame className="w-4 h-4 fill-[#ea580c]" />
              <span>VIRAL IN KARACHI &amp; LAHORE</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#1c1917]">
              TOP TRENDS OF THE SEASON
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="p-2.5 rounded-full border border-[#d6cfc4] hover:border-[#ea580c] hover:bg-orange-50 text-[#44403c] transition-colors"
              aria-label="Previous trending item"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2.5 rounded-full border border-[#d6cfc4] hover:border-[#ea580c] hover:bg-orange-50 text-[#44403c] transition-colors"
              aria-label="Next trending item"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-1 scroll-smooth no-scrollbar"
        >
          {trending.map(product => (
            <div key={product.id} className="min-w-[260px] sm:min-w-[290px] max-w-[290px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
