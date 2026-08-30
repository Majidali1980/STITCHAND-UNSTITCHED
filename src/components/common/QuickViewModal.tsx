import React, { useState } from 'react';
import {
  X,
  Star,
  Check,
  ShoppingBag,
  Heart,
  Scissors,
  Truck,
  MessageCircle,
  Plus,
  Minus,
  Ruler,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    settings,
    addToast,
  } = useStore();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [stitchChoice, setStitchChoice] = useState<'unstitched' | 'stitched'>('unstitched');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
    shirtLength: '',
    trouserLength: '',
    shoulder: '',
    notes: '',
  });

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const currentSize = selectedSize || product.sizes[0] || 'Standard';
  const currentColor = selectedColor || product.colors[0]?.name || '';
  const isSaved = isInWishlist(product.id);

  const priceToDisplay =
    (product.salePrice || product.price) +
    (stitchChoice === 'stitched' && product.customStitchingFee ? product.customStitchingFee : 0);

  const handleAddToCart = () => {
    addToCart(
      product,
      currentSize,
      stitchChoice,
      currentColor,
      quantity,
      stitchChoice === 'stitched' ? measurements : undefined
    );
    addToast({
      type: 'success',
      title: 'Added to Bag',
      message: `${product.name} (${stitchChoice === 'stitched' ? 'Tailored' : 'Unstitched'}) added to your bag.`,
    });
    setQuickViewProduct(null);
  };

  const handleWhatsAppInquiry = () => {
    const cleanPhone = (settings?.whatsapp || '+92 300 1234567').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Salam! I am inquiring about *${product.name}* (SKU: ${product.sku}, Fabric: ${product.fabric}, Option: ${stitchChoice === 'stitched' ? 'Stitched' : 'Unstitched'}, Size: ${currentSize}). Could you please assist me?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 md:p-8 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-[#e5dfd3] z-10 animate-fadeIn max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 hover:bg-white text-[#44403c] rounded-full shadow-md transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto flex-1">
          {/* Gallery Col (5 cols) */}
          <div className="md:col-span-5 bg-[#faf8f5] p-5 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#f0ece1]">
            <div>
              <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#ede8dc] relative shadow-inner">
                <img
                  src={product.images[selectedImageIdx]?.url || product.images[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.salePrice && (
                  <div className="absolute top-3 left-3 bg-[#ea580c] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Sale -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                  {product.fabric} &bull; {product.pieces}
                </div>
              </div>

              {/* Thumbnail selector */}
              {product.images.length > 1 && (
                <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`w-16 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImageIdx === idx
                          ? 'border-[#ea580c] scale-105 shadow-xs'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Karachi Delivery & Guarantee Box */}
            <div className="mt-6 pt-4 border-t border-[#f0ece1] space-y-2 text-xs text-[#78716c]">
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Karachi 24–48h Dispatch &bull; Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span>100% Authentic Fabric Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#78716c] shrink-0" />
                <span>7 Days Hassle-Free Exchange</span>
              </div>
            </div>
          </div>

          {/* Details Col (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 text-xs uppercase font-bold text-[#ea580c] tracking-wider mb-1">
                  <span>{product.category} &bull; {product.fabric}</span>
                  <span className="text-[#a8a29e] font-mono">SKU: {product.sku}</span>
                </div>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1c1917] leading-tight">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-xs text-[#78716c]">
                  <div className="flex items-center text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
                    <span>{product.rating}</span>
                    <span className="text-[#a8a29e] ml-1">({product.reviewCount} reviews)</span>
                  </div>
                  <span>&bull;</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    In Stock (Karachi Dispatch)
                  </span>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-[#f0ece1]">
                <span className="text-2xl sm:text-3xl font-bold text-[#ea580c] font-cinzel">
                  {formatPrice(priceToDisplay)}
                </span>
                {product.salePrice && (
                  <span className="text-sm text-[#a8a29e] line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
                {stitchChoice === 'stitched' && product.customStitchingFee && (
                  <span className="text-[11px] bg-orange-50 text-[#c2410c] px-2.5 py-0.5 rounded-full border border-orange-200 font-medium">
                    +Rs. {product.customStitchingFee} Atelier Tailoring
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
                {product.description || product.shortDescription}
              </p>

              {/* Stitch Type Option (Unstitched vs Stitched) */}
              {product.stitchType === 'both' && (
                <div className="bg-[#faf8f5] p-3.5 rounded-2xl border border-[#e5dfd3]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#292524] mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5 text-[#ea580c]" /> Select Stitching Type
                    </span>
                    <span className="text-[10px] text-[#78716c] font-normal lowercase">
                      professional karachi tailor
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setStitchChoice('unstitched')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        stitchChoice === 'unstitched'
                          ? 'border-2 border-[#ea580c] bg-white text-[#ea580c] shadow-xs'
                          : 'border border-[#d6cfc4] hover:bg-white text-[#57534e]'
                      }`}
                    >
                      Unstitched Fabric
                    </button>
                    <button
                      onClick={() => setStitchChoice('stitched')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        stitchChoice === 'stitched'
                          ? 'border-2 border-[#ea580c] bg-white text-[#ea580c] shadow-xs'
                          : 'border border-[#d6cfc4] hover:bg-white text-[#57534e]'
                      }`}
                    >
                      Stitched (+Rs. {product.customStitchingFee || 1500})
                    </button>
                  </div>
                </div>
              )}

              {/* Sizes Selection */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#292524] mb-2">
                  <span>Size</span>
                  <span className="text-[11px] text-[#78716c] font-medium lowercase">
                    pakistani standard sizing
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                        currentSize === size
                          ? 'border-[#ea580c] bg-[#1c1917] text-white shadow-xs scale-105'
                          : 'border-[#d6cfc4] hover:border-[#ea580c] text-[#44403c] bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collapsible Pakistani Custom Measurements for Stitched Outfits */}
              {stitchChoice === 'stitched' && (
                <div className="border border-[#fed7aa] bg-[#fffaf5] rounded-2xl overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setShowMeasurements(!showMeasurements)}
                    className="w-full p-3 flex items-center justify-between text-xs font-bold text-[#c2410c]"
                  >
                    <span className="flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5" />
                      Optional: Custom Measurements (Karachi Atelier Tailoring)
                    </span>
                    {showMeasurements ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showMeasurements && (
                    <div className="p-3 pt-0 border-t border-[#fed7aa] space-y-2 text-xs">
                      <p className="text-[11px] text-[#78716c] pt-2">
                        Provide measurements in inches (optional). If left blank, standard {currentSize} sizing will be used.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-[#44403c] mb-0.5">Chest / Bust (in)</label>
                          <input
                            type="text"
                            placeholder="e.g. 38"
                            value={measurements.chest}
                            onChange={e => setMeasurements({ ...measurements, chest: e.target.value })}
                            className="w-full bg-white border border-[#fed7aa] p-1.5 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#44403c] mb-0.5">Waist (in)</label>
                          <input
                            type="text"
                            placeholder="e.g. 34"
                            value={measurements.waist}
                            onChange={e => setMeasurements({ ...measurements, waist: e.target.value })}
                            className="w-full bg-white border border-[#fed7aa] p-1.5 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#44403c] mb-0.5">Hips (in)</label>
                          <input
                            type="text"
                            placeholder="e.g. 40"
                            value={measurements.hips}
                            onChange={e => setMeasurements({ ...measurements, hips: e.target.value })}
                            className="w-full bg-white border border-[#fed7aa] p-1.5 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#44403c] mb-0.5">Shirt Length (in)</label>
                          <input
                            type="text"
                            placeholder="e.g. 42"
                            value={measurements.shirtLength}
                            onChange={e => setMeasurements({ ...measurements, shirtLength: e.target.value })}
                            className="w-full bg-white border border-[#fed7aa] p-1.5 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#44403c] mb-0.5">Trouser Length (in)</label>
                          <input
                            type="text"
                            placeholder="e.g. 38"
                            value={measurements.trouserLength}
                            onChange={e => setMeasurements({ ...measurements, trouserLength: e.target.value })}
                            className="w-full bg-white border border-[#fed7aa] p-1.5 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#44403c] mb-0.5">Shoulder (in)</label>
                          <input
                            type="text"
                            placeholder="e.g. 15"
                            value={measurements.shoulder}
                            onChange={e => setMeasurements({ ...measurements, shoulder: e.target.value })}
                            className="w-full bg-white border border-[#fed7aa] p-1.5 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#292524] mb-1.5">
                    Color: <span className="text-[#ea580c] normal-case">{currentColor}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          currentColor === color.name
                            ? 'border-[#ea580c] scale-110 shadow-xs'
                            : 'border-white hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {currentColor === color.name && (
                          <Check className="w-3 h-3 text-white drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#292524]">Quantity</span>
                <div className="flex items-center border border-[#d6cfc4] rounded-xl bg-[#faf8f5]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-[#57534e] hover:text-[#ea580c] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-[#57534e] hover:text-[#ea580c] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-[#f0ece1] space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#ea580c] hover:bg-[#c2410c] text-white py-3.5 px-6 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag &bull; {formatPrice(priceToDisplay * quantity)}</span>
                </button>

                <button
                  onClick={handleWhatsAppInquiry}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 py-3.5 px-5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  title="Inquire on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Ask Stylist</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-2xl border transition-colors flex items-center justify-center ${
                    isSaved
                      ? 'border-red-200 bg-red-50 text-red-600'
                      : 'border-[#d6cfc4] hover:bg-[#faf8f5] text-[#57534e]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-600' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
