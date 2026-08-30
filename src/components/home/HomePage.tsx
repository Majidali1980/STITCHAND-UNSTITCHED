import React, { useState, useEffect } from 'react';
import { HeroBanner } from './HeroBanner';
import { CategoryCircles } from './CategoryCircles';
import { FlashSaleSection } from './FlashSaleSection';
import { ShopByCategory } from './ShopByCategory';
import { NewArrivals } from './NewArrivals';
import { TopTrends } from './TopTrends';
import { PromoBanners } from './PromoBanners';
import { BestSellers } from './BestSellers';
import { BrandFeatures } from './BrandFeatures';
import { Product } from '../../types';
import { api } from '../../services/api';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.getProducts({ limit: 20 });
        if (res && res.products) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('Failed to fetch home products', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner with Dark Orange Accents */}
      <HeroBanner />

      {/* Flash Sale with Live 4-Unit Countdown */}
      <FlashSaleSection products={products} />

      {/* Circular Categories matching attached design */}
      <CategoryCircles />

      {/* Shop By Category Matrix */}
      <ShopByCategory />

      {/* New Arrivals 2026 Grid */}
      <NewArrivals products={products} />

      {/* Promo Editorial Banners */}
      <PromoBanners />

      {/* Top Trends Carousel */}
      <TopTrends products={products} />

      {/* Best Sellers */}
      <BestSellers products={products} />

      {/* Brand Trust and Features */}
      <BrandFeatures />
    </div>
  );
};
