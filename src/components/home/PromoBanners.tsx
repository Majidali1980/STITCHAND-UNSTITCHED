import React from 'react';
import { ArrowRight, Scissors, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const PromoBanners: React.FC = () => {
  const { navigate } = useStore();

  return (
    <section className="py-14 bg-[#faf8f5] border-b border-[#f0ece1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Banner 1: Stitched Ready-to-Wear */}
          <div
            onClick={() => navigate('shop', { category: 'stitched' })}
            className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 border border-[#e5dfd3]"
          >
            <img
              src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=85"
              alt="Ready to Wear Stitched Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#fed7aa] mb-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full self-start border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Ready-to-Wear Pret</span>
              </div>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold leading-tight mb-2">
                Effortless Everyday <br />
                Stitched Kurtis
              </h3>
              <p className="text-xs text-[#d4d4d8] max-w-sm mb-4">
                Tailored with precision in Karachi. Breathable cottons and minimalist silhouettes.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:text-[#fed7aa] transition-colors">
                <span>SHOP STITCHED PRET</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#ea580c]" />
              </div>
            </div>
          </div>

          {/* Banner 2: Unstitched Luxury & Custom Tailoring */}
          <div
            onClick={() => navigate('shop', { category: 'unstitched' })}
            className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 border border-[#e5dfd3]"
          >
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
              alt="Unstitched Luxury Lawn"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#fed7aa] mb-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full self-start border border-white/20">
                <Scissors className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Custom Stitching Available</span>
              </div>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold leading-tight mb-2">
                Pure Pima Unstitched <br />
                Festive 3-Piece Suits
              </h3>
              <p className="text-xs text-[#d4d4d8] max-w-sm mb-4">
                Embroidered organza patches, silk dupattas, and doorstep Karachi tailoring services.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:text-[#fed7aa] transition-colors">
                <span>EXPLORE UNSTITCHED FABRICS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#ea580c]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
