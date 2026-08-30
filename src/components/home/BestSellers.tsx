import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { useStore } from '../../context/StoreContext';

export const BestSellers: React.FC<{ products: Product[] }> = ({ products }) => {
  const { navigate } = useStore();
  const bestSellers = products.filter(p => p.isBestSeller || p.salesCount > 30).slice(0, 4);

  return (
    <section className="py-16 bg-white border-b border-[#f0ece1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-1">
              <Star className="w-3.5 h-3.5 fill-[#ea580c]" />
              <span>MOST LOVED SILHOUETTES</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#1c1917]">
              BEST SELLERS IN KARACHI
            </h2>
          </div>

          <button
            onClick={() => navigate('shop', { isBestSeller: true })}
            className="text-xs font-bold uppercase tracking-wider text-[#ea580c] hover:text-[#c2410c] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
