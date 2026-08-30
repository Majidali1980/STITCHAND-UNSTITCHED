import React, { useState } from 'react';
import {
  Heart,
  Eye,
  ShoppingBag,
  Star,
  Scissors,
  Flame,
  Sparkles,
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const {
    navigate,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    formatPrice,
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const isSaved = isInWishlist(product.id);

  const mainImage = product.images[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
  const hoverImage = product.images[1]?.url || mainImage;

  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleCardClick = () => {
    navigate('product', { id: product.id, slug: product.slug });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'Standard';
    const defaultStitch = product.stitchType === 'stitched' ? 'stitched' : 'unstitched';
    addToCart(product, defaultSize, defaultStitch, product.colors[0]?.name);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('product', { id: product.id, slug: product.slug });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#f0ece1] hover:border-[#ea580c]/30 hover:shadow-xl transition-all duration-300 cursor-pointer ${className}`}
    >
      {/* Image Container with Hover Swap */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f5f2eb]">
        <img
          src={isHovered ? hoverImage : mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-[#ea580c] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#1c1917] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" /> New
            </span>
          )}
          {product.isTrending && !product.isNew && (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Flame className="w-2.5 h-2.5" /> Trending
            </span>
          )}
        </div>

        {/* Stitching Badge (Bottom Left of Image) */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="bg-white/90 backdrop-blur-xs text-[#292524] text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#e5dfd3] shadow-2xs flex items-center gap-1">
            <Scissors className="w-2.5 h-2.5 text-[#ea580c]" />
            {product.pieces} &bull; {product.fabric}
          </span>
        </div>

        {/* Wishlist Top Right Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs ${
            isSaved
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-white/85 backdrop-blur-xs text-[#44403c] hover:bg-white hover:text-[#ea580c] border border-white/60'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-600' : ''}`} />
        </button>

        {/* Quick Action Overlay (Desktop Hover) */}
        <div className="absolute inset-x-3 bottom-3 hidden lg:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-20">
          <button
            onClick={handleQuickAdd}
            className="flex-1 bg-[#1c1917] hover:bg-[#ea580c] text-white py-2 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Bag</span>
          </button>
          <button
            onClick={handleQuickView}
            className="bg-white/95 hover:bg-white text-[#292524] p-2 rounded-xl border border-[#d6cfc4] shadow-md transition-colors"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#78716c] mb-1">
            <span className="uppercase tracking-wider font-semibold text-[#ea580c]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-500" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-sans font-bold text-xs md:text-sm text-[#1c1917] group-hover:text-[#ea580c] transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>

          <p className="text-[11px] text-[#78716c] line-clamp-1 mt-0.5">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Mobile Add */}
        <div className="pt-2 border-t border-[#f5f2eb] flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-cinzel font-bold text-sm md:text-base text-[#ea580c]">
              {formatPrice(product.salePrice || product.price)}
            </span>
            {product.salePrice && (
              <span className="text-[10px] text-[#a8a29e] line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Mobile Cart Button */}
          <button
            onClick={handleQuickAdd}
            className="lg:hidden p-1.5 bg-[#1c1917] text-white rounded-lg hover:bg-[#ea580c] transition-colors"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
