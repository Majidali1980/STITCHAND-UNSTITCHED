import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ShopByCategory: React.FC = () => {
  const { categories, navigate } = useStore();
  const [activeGenderTab, setActiveGenderTab] = useState<string>('all');

  const defaultCards = [
    {
      id: 'cat-ladies',
      name: 'LADIES',
      subtitle: 'Luxury Unstitched & Ready-to-Wear Pret',
      gender: 'women',
      count: '48 Styles',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
      slug: 'ladies',
    },
    {
      id: 'cat-gents',
      name: 'GENTS',
      subtitle: 'Egyptian Cotton Kurtas & Shalwar Kameez',
      gender: 'men',
      count: '28 Styles',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=85',
      slug: 'gents',
    },
    {
      id: 'cat-kids',
      name: 'KIDS',
      subtitle: 'Festive Ghararas, Kurtis & Boys Suits',
      gender: 'kids',
      count: '22 Styles',
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=85',
      slug: 'kids',
    },
    {
      id: 'cat-home-apparel',
      name: 'HOME APPAREL',
      subtitle: 'Brocade Bedding, Quilts & Velvet Cushions',
      gender: 'home',
      count: '18 Styles',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=85',
      slug: 'home-apparel',
    },
    {
      id: 'cat-bags',
      name: 'BAGS',
      subtitle: 'Hand-Embroidered Zardozi Clutches & Potlis',
      gender: 'accessories',
      count: '16 Styles',
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=85',
      slug: 'bags',
    },
  ];

  const sourceCategories = categories.length > 0 ? categories : defaultCards;

  const displayList = sourceCategories
    .filter(c => c.isActive !== false)
    .filter(c => {
      if (activeGenderTab === 'all') return true;
      return c.gender === activeGenderTab;
    });

  return (
    <section className="py-16 bg-white border-b border-[#f0ece1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIGNATURE LINES &amp; FABRICS</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#1c1917]">
              FEATURED COLLECTIONS
            </h2>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-[#f5f2eb] p-1.5 rounded-2xl border border-[#e5dfd3] self-start md:self-auto">
            <button
              onClick={() => setActiveGenderTab('all')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeGenderTab === 'all'
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-black'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveGenderTab('women')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeGenderTab === 'women'
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-black'
              }`}
            >
              Ladies
            </button>
            <button
              onClick={() => setActiveGenderTab('men')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeGenderTab === 'men'
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-black'
              }`}
            >
              Gents
            </button>
            <button
              onClick={() => setActiveGenderTab('kids')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeGenderTab === 'kids'
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-black'
              }`}
            >
              Kids
            </button>
            <button
              onClick={() => setActiveGenderTab('home')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeGenderTab === 'home'
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-black'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveGenderTab('accessories')}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeGenderTab === 'accessories'
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-black'
              }`}
            >
              Bags
            </button>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map(cat => {
            const img =
              cat.imageUrl ||
              cat.image ||
              'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85';
            const subList = Array.isArray(cat.subcategories) ? cat.subcategories : [];

            return (
              <div
                key={cat.id}
                onClick={() => navigate('shop', { category: cat.slug })}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#e5dfd3]"
              >
                {/* Image */}
                <img
                  src={img}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:via-black/40 transition-colors" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
                  <div className="flex justify-between items-start">
                    <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-orange-200 border border-white/20">
                      {subList.length > 0 ? `${subList.length} Subcategories` : 'Catalog'}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-orange-300 tracking-wider">
                      {cat.gender || 'Collection'}
                    </span>
                  </div>

                  <div className="space-y-1 transform group-hover:-translate-y-1 transition-transform">
                    <span className="text-[11px] uppercase tracking-wider text-orange-300 font-semibold line-clamp-1">
                      {subList.slice(0, 3).join(' • ') || 'Exclusive Designs'}
                    </span>
                    <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white leading-tight">
                      {cat.name}
                    </h3>

                    <div className="pt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#fed7aa] group-hover:text-white transition-colors">
                      <span>SHOP COLLECTION</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#ea580c]" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
