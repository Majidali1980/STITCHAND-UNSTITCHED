import React, { useState, useEffect } from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Product, CuratedSection } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';

export const BestSellers: React.FC<{ products: Product[] }> = ({ products: fallbackProducts }) => {
  const { navigate } = useStore();
  const [sectionConfig, setSectionConfig] = useState<CuratedSection | null>(null);
  const [curatedProducts, setCuratedProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchSection = async () => {
      try {
        const sec = await api.getCuratedSection('best-sellers');
        if (sec && isMounted) {
          setSectionConfig(sec);
        }
        const prods = await api.getCuratedSectionProducts('best-sellers');
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
    ? curatedProducts.slice(0, 4)
    : fallbackProducts.filter(p => p.isBestSeller || p.salesCount > 30).slice(0, 4);

  const title = sectionConfig?.title || 'BEST SELLERS IN KARACHI';
  const badge = sectionConfig?.badge || 'MOST LOVED SILHOUETTES';

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-16 bg-white border-b border-[#f0ece1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-1">
              <Star className="w-3.5 h-3.5 fill-[#ea580c]" />
              <span>{badge}</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#1c1917]">
              {title}
            </h2>
            {sectionConfig?.subtitle && (
              <p className="text-xs text-[#78716c] mt-1">{sectionConfig.subtitle}</p>
            )}
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
          {displayProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
