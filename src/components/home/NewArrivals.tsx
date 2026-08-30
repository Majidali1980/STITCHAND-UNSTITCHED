import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { useStore } from '../../context/StoreContext';

export const NewArrivals: React.FC<{ products: Product[] }> = ({ products }) => {
  const { navigate } = useStore();
  const [filterTab, setFilterTab] = useState<'all' | 'unstitched' | 'stitched' | 'men'>('all');

  const newProducts = products.filter(p => p.isNew);

  const filtered = newProducts.filter(p => {
    if (filterTab === 'unstitched') return p.stitchType === 'unstitched' || p.stitchType === 'both';
    if (filterTab === 'stitched') return p.stitchType === 'stitched' || p.category === 'stitched';
    if (filterTab === 'men') return p.gender === 'men';
    return true;
  });

  return (
    <section className="py-16 bg-[#faf8f5] border-b border-[#f0ece1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FRESH FROM KARACHI ATELIER</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#1c1917]">
              NEW ARRIVALS 2026
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-white p-1 rounded-full border border-[#e5dfd3] self-start sm:self-auto shadow-2xs">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                filterTab === 'all'
                  ? 'bg-[#ea580c] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-[#ea580c]'
              }`}
            >
              All Drops
            </button>
            <button
              onClick={() => setFilterTab('unstitched')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                filterTab === 'unstitched'
                  ? 'bg-[#ea580c] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-[#ea580c]'
              }`}
            >
              Unstitched
            </button>
            <button
              onClick={() => setFilterTab('stitched')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                filterTab === 'stitched'
                  ? 'bg-[#ea580c] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-[#ea580c]'
              }`}
            >
              Ready-to-Wear
            </button>
            <button
              onClick={() => setFilterTab('men')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                filterTab === 'men'
                  ? 'bg-[#ea580c] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-[#ea580c]'
              }`}
            >
              Men&apos;s
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('shop', { isNew: true })}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#1c1917] hover:text-white text-[#1c1917] border border-[#d6cfc4] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm transition-all active:scale-[0.99]"
          >
            <span>VIEW ALL NEW ARRIVALS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
