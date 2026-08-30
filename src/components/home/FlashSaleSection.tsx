import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import { Product, FlashSale } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
}

export const FlashSaleSection: React.FC<{ products: Product[] }> = ({ products }) => {
  const { navigate } = useStore();
  const [flashSale, setFlashSale] = useState<FlashSale | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 2,
    hours: 8,
    minutes: 35,
    seconds: 42,
    isEnded: false,
  });

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const data = await api.getFlashSale();
        if (data) setFlashSale(data);
      } catch (e) {
        console.error('Failed to load flash sale');
      }
    };
    fetchSale();
  }, []);

  useEffect(() => {
    const targetDate = flashSale?.endDate
      ? new Date(flashSale.endDate).getTime()
      : Date.now() + (2 * 86400000 + 8 * 3600000 + 35 * 60000 + 42000);

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true });
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds, isEnded: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [flashSale]);

  const saleProducts = products.filter(p => p.salePrice || p.isFeatured).slice(0, 4);

  if (saleProducts.length === 0) return null;

  return (
    <section className="py-14 bg-gradient-to-b from-[#faf8f5] to-white border-b border-[#f0ece1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Strip with Countdown Timer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#e5dfd3]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-1.5 bg-orange-100/70 px-3 py-1 rounded-full">
              <Flame className="w-4 h-4 fill-[#ea580c]" />
              <span>LIMITED TIME OFFER &bull; KARACHI PRIORITY</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1c1917]">
              FLASH SALE &amp; EID OFFERS
            </h2>
            <p className="text-xs sm:text-sm text-[#78716c] mt-1 max-w-md">
              Special promotional markdowns on our luxury summer lawn and tailored ensembles.
            </p>
          </div>

          {/* Live Dynamic Countdown Box */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#57534e]">
              <Clock className="w-4 h-4 text-[#ea580c] animate-pulse" />
              <span>{timeLeft.isEnded ? 'SALE STATUS:' : 'ENDS IN:'}</span>
            </div>

            {timeLeft.isEnded ? (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-xs font-bold tracking-wider">
                SALE ENDED
              </div>
            ) : (
              <div className="flex items-center gap-2 font-cinzel">
                {/* Days */}
                <div className="bg-[#1c1917] text-white px-3 py-2 rounded-xl text-center min-w-[52px] shadow-sm">
                  <span className="block text-base sm:text-lg font-bold leading-none text-[#fed7aa]">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[#a8a29e] font-sans">Days</span>
                </div>
                <span className="text-lg font-bold text-[#ea580c]">:</span>

                {/* Hours */}
                <div className="bg-[#1c1917] text-white px-3 py-2 rounded-xl text-center min-w-[52px] shadow-sm">
                  <span className="block text-base sm:text-lg font-bold leading-none text-[#fed7aa]">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[#a8a29e] font-sans">Hours</span>
                </div>
                <span className="text-lg font-bold text-[#ea580c]">:</span>

                {/* Mins */}
                <div className="bg-[#1c1917] text-white px-3 py-2 rounded-xl text-center min-w-[52px] shadow-sm">
                  <span className="block text-base sm:text-lg font-bold leading-none text-[#fed7aa]">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[#a8a29e] font-sans">Mins</span>
                </div>
                <span className="text-lg font-bold text-[#ea580c]">:</span>

                {/* Secs */}
                <div className="bg-[#ea580c] text-white px-3 py-2 rounded-xl text-center min-w-[52px] shadow-sm">
                  <span className="block text-base sm:text-lg font-bold leading-none text-white animate-pulse">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-orange-200 font-sans">Secs</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {saleProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('shop', { isSale: true })}
            className="inline-flex items-center gap-2 bg-[#1c1917] hover:bg-[#ea580c] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-md transition-all active:scale-[0.99]"
          >
            <span>EXPLORE ALL FLASH SALE PRODUCTS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
