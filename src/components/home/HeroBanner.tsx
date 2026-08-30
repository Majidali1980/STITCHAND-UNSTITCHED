import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Scissors, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { Banner } from '../../types';

export const HeroBanner: React.FC = () => {
  const { navigate } = useStore();
  const [slides, setSlides] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fallbackSlides: Banner[] = [
    {
      id: 'default-hero-1',
      title: 'STYLE THAT SPEAKS FOR YOU',
      subtitle: 'Discover our latest luxury stitched & unstitched collections, tailored for modern Pakistani fashion. Pure Pima lawn, intricate tilla embroideries, and master-crafted menswear.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=90',
      ctaText: 'SHOP STITCHED',
      ctaUrl: '/shop?category=stitched',
      position: 'hero',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 'default-hero-2',
      title: 'SUMMER LAWN & FESTIVE SILK 2026',
      subtitle: 'Breathable Karachi summer lawn with opulent zari motifs and pure digital silk dupattas ready to style.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=90',
      ctaText: 'EXPLORE UNSTITCHED',
      ctaUrl: '/shop?category=unstitched',
      position: 'hero',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 'default-hero-3',
      title: 'GENTLEMEN & KIDS FESTIVE COUTURE',
      subtitle: 'Tailored Egyptian cotton kurtas, luxury velvet waistcoats, and vibrant kids festive ensembles.',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=2000&q=90',
      ctaText: 'SHOP GENTS & KIDS',
      ctaUrl: '/shop?category=gents',
      position: 'hero',
      sortOrder: 3,
      isActive: true,
    },
  ];

  useEffect(() => {
    const fetchHeroBanners = async () => {
      try {
        const data = await api.getBanners();
        if (Array.isArray(data)) {
          const heroBanners = data.filter(b => b.position === 'hero' && b.isActive !== false);
          if (heroBanners.length > 0) {
            setSlides(heroBanners.sort((a, b) => a.sortOrder - b.sortOrder));
            return;
          }
        }
        setSlides(fallbackSlides);
      } catch (err) {
        console.error('Failed to load hero banners', err);
        setSlides(fallbackSlides);
      }
    };
    fetchHeroBanners();
  }, []);

  const activeSlides = slides.length > 0 ? slides : fallbackSlides;

  // Auto-scroll loop
  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeSlides.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeSlides.length]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeSlides.length);
  };

  const handleCtaClick = (ctaUrl: string) => {
    if (!ctaUrl) {
      navigate('shop');
      return;
    }

    try {
      if (ctaUrl.startsWith('/shop') || ctaUrl.startsWith('shop')) {
        const urlParams = new URLSearchParams(ctaUrl.split('?')[1] || '');
        const category = urlParams.get('category');
        const stitchType = urlParams.get('stitchType');
        const gender = urlParams.get('gender');
        const isSale = urlParams.get('isSale') === 'true';

        navigate('shop', {
          category: category || undefined,
          stitchType: (stitchType as any) || undefined,
          gender: (gender as any) || undefined,
          isSale: isSale || undefined,
        });
      } else {
        navigate('shop');
      }
    } catch {
      navigate('shop');
    }
  };

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  return (
    <section
      id="hero-banner-section"
      className="relative w-full bg-[#1c1917] text-white overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Full Width Background Image Carousel Container */}
      <div className="relative w-full min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] flex items-center">
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Width to width full-bleed hero image */}
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover object-center transform transition-transform duration-7000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Cinematic Luxury Dark Gradients for perfect legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/95 via-[#18181b]/75 to-transparent" />
              <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#09090b]/40 to-[#09090b]/80" />
            </div>
          );
        })}

        {/* Foreground Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl space-y-6">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 bg-orange-950/80 border border-orange-500/50 text-orange-200 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-md animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
              <span className="tracking-widest uppercase text-[10px] font-bold">
                Karachi Summer Lawn &bull; Eid Festive Edit 2026
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] drop-shadow-md">
              {currentSlide?.title || 'STYLE THAT SPEAKS FOR YOU'}
            </h1>

            {/* Supporting Text */}
            <p className="font-sans text-sm sm:text-base text-[#d4d4d8] leading-relaxed max-w-xl font-normal drop-shadow-sm">
              {currentSlide?.subtitle ||
                'Discover our latest luxury stitched & unstitched collections, tailored for modern Pakistani fashion.'}
            </p>

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                id="hero-primary-cta-btn"
                onClick={() => handleCtaClick(currentSlide.ctaUrl)}
                className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-orange-950/50 transition-all hover:gap-3 active:scale-[0.98]"
              >
                <span>{currentSlide?.ctaText || 'SHOP COLLECTION'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-secondary-cta-btn"
                onClick={() => navigate('shop', { category: 'unstitched' })}
                className="bg-black/40 hover:bg-black/60 text-white border border-white/30 backdrop-blur-md px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-all active:scale-[0.98]"
              >
                <Scissors className="w-4 h-4 text-[#ea580c]" />
                <span>SHOP UNSTITCHED</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/20 max-w-lg text-[11px] text-[#d4d4d8] font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
                <span>Karachi 24h Express</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
                <span>100% Pure Fabrics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Arrow Controls (Left & Right) */}
        {activeSlides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Slide Progress Dot Indicators */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-black/50 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md">
            {activeSlides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  dotIdx === currentIndex
                    ? 'w-7 h-2 bg-[#ea580c]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
