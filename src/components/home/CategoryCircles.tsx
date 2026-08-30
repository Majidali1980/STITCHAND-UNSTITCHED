import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronRight, Sparkles, Tag } from 'lucide-react';
import { Category } from '../../types';

export const CategoryCircles: React.FC = () => {
  const { categories, navigate } = useStore();
  const [hoveredCatId, setHoveredCatId] = useState<string | null>(null);

  // Fallback defaults if categories are still fetching
  const defaultCategories: Partial<Category>[] = [
    {
      id: 'cat-ladies',
      name: 'LADIES',
      slug: 'ladies',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      subcategories: [
        'Unstitched Lawn',
        'Ready-to-Wear (Stitched)',
        '3-Piece Luxury Suits',
        'Kurtis & Tops',
        'Chiffon & Formals',
      ],
    },
    {
      id: 'cat-gents',
      name: 'GENTS',
      slug: 'gents',
      imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
      subcategories: [
        'Cotton Kurtas',
        'Shalwar Kameez Sets',
        'Festive Waistcoats',
        'Unstitched Latha',
      ],
    },
    {
      id: 'cat-kids',
      name: 'KIDS',
      slug: 'kids',
      imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
      subcategories: [
        'Girls Gharara Sets',
        'Boys Kurta Shalwar',
        'Festive Eid Wear',
        'Casual Kurtis',
      ],
    },
    {
      id: 'cat-home-apparel',
      name: 'HOME APPAREL',
      slug: 'home-apparel',
      imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      subcategories: [
        'Luxury Bed Quilt Sets',
        'Embroidered Cushions',
        'Table Runners',
        'Velvet Throws',
      ],
    },
    {
      id: 'cat-bags',
      name: 'BAGS',
      slug: 'bags',
      imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
      subcategories: [
        'Luxury Velvet Clutches',
        'Embroidered Potli Pouches',
        'Evening Bags',
        'Festive Clutches',
      ],
    },
  ];

  const displayCategories = categories.length > 0
    ? categories.filter(c => c.isActive !== false)
    : (defaultCategories as Category[]);

  const handleCategoryClick = (cat: Category) => {
    navigate('shop', { category: cat.slug });
  };

  const handleSubcategoryClick = (e: React.MouseEvent, cat: Category, subcat: string) => {
    e.stopPropagation();
    navigate('shop', { category: cat.slug, subcategory: subcat });
  };

  return (
    <section className="py-12 bg-[#faf8f5] border-b border-[#ebd7cb]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ea580c]/10 text-[#ea580c] text-[11px] font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXPLORE DEPARTMENTS</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1c1917] tracking-tight">
            SHOP BY POPULAR CATEGORIES
          </h2>
          <p className="text-xs sm:text-sm text-[#78716c] mt-2">
            Discover bespoke unstitched fabrics, luxury pret, festive childrenswear, fine home linens, and handcrafted evening accessories.
          </p>
        </div>

        {/* Circular Category Grid matching user's reference */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 justify-items-center">
          {displayCategories.map(cat => {
            const img =
              cat.imageUrl ||
              cat.image ||
              'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
            const subList = Array.isArray(cat.subcategories) ? cat.subcategories : [];
            const isHovered = hoveredCatId === cat.id;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => setHoveredCatId(cat.id)}
                onMouseLeave={() => setHoveredCatId(null)}
                className="flex flex-col items-center group relative w-full max-w-[200px]"
              >
                {/* Circular Image Container with golden border */}
                <div
                  onClick={() => handleCategoryClick(cat)}
                  className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full p-1.5 border-2 border-[#ea580c]/40 group-hover:border-[#ea580c] transition-all duration-300 shadow-md group-hover:shadow-xl cursor-pointer bg-white"
                >
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <img
                      src={img}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
                </div>

                {/* Category Label */}
                <button
                  onClick={() => handleCategoryClick(cat)}
                  className="mt-3.5 text-center group-hover:text-[#ea580c] transition-colors focus:outline-none"
                >
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#1c1917] tracking-wider uppercase group-hover:text-[#ea580c]">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-[#a8a29e] font-medium block">
                    {subList.length > 0 ? `${subList.length} Collections` : 'View All'}
                  </span>
                </button>

                {/* Subcategory Popover Menu on Hover/Interaction */}
                {isHovered && subList.length > 0 && (
                  <div className="absolute top-[85%] z-30 w-52 bg-white/95 backdrop-blur-md border border-[#ebd7cb] rounded-2xl p-2.5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-2 py-1 border-b border-[#f5ece5] flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#ea580c] flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>Subcategories</span>
                      </span>
                      <span className="text-[10px] text-[#a8a29e]">{subList.length}</span>
                    </div>

                    <div className="mt-1 space-y-0.5 max-h-48 overflow-y-auto">
                      {subList.map((sub, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={(e) => handleSubcategoryClick(e, cat, sub)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#44403c] hover:text-[#ea580c] hover:bg-[#fff7ed] transition-colors flex items-center justify-between group/sub"
                        >
                          <span className="truncate">{sub}</span>
                          <ChevronRight className="w-3 h-3 text-[#d6d3d1] group-hover/sub:text-[#ea580c] transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>

                    <div className="pt-1.5 mt-1 border-t border-[#f5ece5]">
                      <button
                        onClick={() => handleCategoryClick(cat)}
                        className="w-full text-center text-[11px] font-bold text-[#ea580c] hover:underline py-0.5 uppercase tracking-wider"
                      >
                        Browse All {cat.name} &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
