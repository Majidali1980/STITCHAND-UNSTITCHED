import React from 'react';
import { Truck, ShieldCheck, Scissors, RotateCcw } from 'lucide-react';

export const BrandFeatures: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: 'Karachi Express Dispatch',
      desc: 'Same day or 24–48h doorstep delivery across DHA, Clifton, Gulshan, PECHS & all Karachi zones.',
    },
    {
      icon: ShieldCheck,
      title: '100% Pure Luxury Fabric',
      desc: 'Authentic 80s/100s Pima lawn, Egyptian cotton, Swiss voile, and pure Chinese silk dupattas.',
    },
    {
      icon: Scissors,
      title: 'Atelier Custom Stitching',
      desc: 'Select "Stitched" at checkout for tailor-made finishing with neckline piping and custom trousers.',
    },
    {
      icon: RotateCcw,
      title: '7-Day Easy Exchange',
      desc: 'No-hassle exchange policy across Pakistan with dedicated rider pickups in Karachi.',
    },
  ];

  return (
    <section className="py-14 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-[#f0ece1] shadow-2xs hover:border-[#fed7aa] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-bold text-sm text-[#1c1917] mb-1.5">{f.title}</h3>
                <p className="text-xs text-[#78716c] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
