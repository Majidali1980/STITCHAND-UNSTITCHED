import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { Product, CuratedSection } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { api } from '../../services/api';

export const TopTrends: React.FC<{ products: Product[] }> = ({ products: fallbackProducts }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sectionConfig, setSectionConfig] = useState<CuratedSection | null>(null);
  const [curatedProducts, setCuratedProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchSection = async () => {
      try {
        const sec = await api.getCuratedSection('top-trends');
        if (sec && isMounted) {
          setSectionConfig(sec);
        }
        const prods = await api.getCuratedSectionProducts('top-trends');
        if (Array.isArray(prods) && prods.length > 0 && isMounted) {
          setCuratedProducts(prods);
        }
      } catch (err) {
        // Fallback to prop products
      }
    };
    fetchSection();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayProducts = curatedProducts.length > 0
    ? curatedProducts
    : fallbackProducts.filter(p => p.isTrending || p.rating >= 4.8);

  const title = sectionConfig?.title || 'TOP TRENDS OF THE SEASON';
  const badge = sectionConfig?.badge || 'VIRAL IN KARACHI & LAHORE';

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-16 bg-white border-b border-[#f0ece1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Carousel Navigation Controls */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-1">
              <Flame className="w-4 h-4 fill-[#ea580c]" />
              <span>{badge}</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#1c1917]">
              {title}
            </h2>
            {sectionConfig?.subtitle && (
              <p className="text-xs text-[#78716c] mt-1">{sectionConfig.subtitle}</p>
            )}
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
          {displayProducts.map(product => (
            <div key={product.id} className="min-w-[260px] sm:min-w-[290px] max-w-[290px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
