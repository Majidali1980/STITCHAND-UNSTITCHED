import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

interface LogoProps {
  variant?: 'dark' | 'light' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  customName?: string;
  customTagline?: string;
  customLogoUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  className = '',
  customName,
  customTagline,
  customLogoUrl,
}) => {
  const { settings } = useStore();
  const isLight = variant === 'light';
  const [imgError, setImgError] = useState(false);

  const storeName = customName || settings?.storeName || 'STITCH & UNSTITCHED';
  const tagline = customTagline !== undefined ? customTagline : (settings?.tagline || 'Karachi Atelier • Est. 2026');
  const logoUrl = customLogoUrl !== undefined ? customLogoUrl : (settings?.logoUrl || settings?.logo || '');

  const sizeClasses = {
    sm: { icon: 'w-7 h-7', img: 'h-7 max-w-[120px]', text: 'text-base sm:text-lg', sub: 'text-[9px] tracking-[0.2em]' },
    md: { icon: 'w-9 h-9', img: 'h-9 max-w-[160px]', text: 'text-lg sm:text-xl md:text-2xl', sub: 'text-[10px] tracking-[0.25em]' },
    lg: { icon: 'w-12 h-12', img: 'h-12 max-w-[200px]', text: 'text-2xl sm:text-3xl', sub: 'text-[11px] tracking-[0.3em]' },
    xl: { icon: 'w-16 h-16', img: 'h-16 max-w-[260px]', text: 'text-3xl sm:text-4xl', sub: 'text-xs tracking-[0.35em]' },
  }[size];

  // Helper to split brand name into stylish primary & accent words
  const renderStyledName = (name: string) => {
    if (name.includes('&')) {
      const parts = name.split('&');
      return (
        <>
          <span>{parts[0].trim()}</span>
          <span className="text-[#ea580c] font-normal mx-1">&amp;</span>
          <span>{parts.slice(1).join('&').trim()}</span>
        </>
      );
    }
    return <span>{name}</span>;
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Custom Uploaded Logo Image OR High-Precision Luxury Vector Monogram */}
      {logoUrl && !imgError ? (
        <img
          src={logoUrl}
          alt={storeName}
          onError={() => setImgError(true)}
          className={`${sizeClasses.img} object-contain shrink-0`}
        />
      ) : (
        <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses.icon}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none">
            {/* Circular Luxury Halo */}
            <circle cx="50" cy="50" r="46" stroke={isLight ? '#fdba74' : '#ea580c'} strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
            
            {/* Stylized 'S' Ribbon in Dark Burnt Orange */}
            <path
              d="M 68 28 C 60 16 34 18 30 32 C 26 44 65 48 58 68 C 52 82 28 80 22 70"
              stroke="url(#orangeGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Stylized 'U' loop in Charcoal/Off-white */}
            <path
              d="M 40 38 L 40 58 C 40 76 68 76 68 58 L 68 38"
              stroke={isLight ? '#ffffff' : '#27272a'}
              strokeWidth="5.5"
              strokeLinecap="round"
            />

            {/* Needle piercing through with golden thread */}
            <line
              x1="32"
              y1="82"
              x2="74"
              y2="18"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Needle eye */}
            <circle cx="70" cy="24" r="1.8" fill="#ffffff" />

            {/* Thread loop curve */}
            <path
              d="M 70 24 Q 85 30 75 48 Q 65 65 80 75"
              stroke="#ea580c"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              fill="none"
            />

            {/* Gradient definitions */}
            <defs>
              <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="60%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#9a3412" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Brand Typography */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-baseline">
          <span
            className={`font-cinzel font-bold tracking-wider leading-tight truncate ${sizeClasses.text} ${
              isLight ? 'text-white' : 'text-[#18181b]'
            }`}
          >
            {renderStyledName(storeName)}
          </span>
        </div>
        {showTagline && tagline && (
          <span
            className={`font-sans font-semibold uppercase ${sizeClasses.sub} mt-0.5 truncate ${
              isLight ? 'text-orange-200/80' : 'text-[#78716c]'
            }`}
          >
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
};

