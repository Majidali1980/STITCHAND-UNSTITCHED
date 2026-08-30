import React, { useState, useEffect } from 'react';
import {
  Star,
  Heart,
  Share2,
  Scissors,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Info,
  CheckCircle2,
  MessageSquare,
  Ruler,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import { Product, Review } from '../../types';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { ProductCard } from './ProductCard';

export const ProductDetailPage: React.FC = () => {
  const {
    viewParams,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigate,
    formatPrice,
    addToast,
    settings,
  } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [stitchChoice, setStitchChoice] = useState<'unstitched' | 'stitched'>('unstitched');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCustomMeasurementsOpen, setIsCustomMeasurementsOpen] = useState(false);

  // Custom Measurements Form
  const [customMeasurements, setCustomMeasurements] = useState({
    chest: '36',
    waist: '30',
    hips: '39',
    shirtLength: '42',
    trouserLength: '38',
    shoulder: '14.5',
    sleeveLength: '21',
  });

  // Review Submission Form
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('Karachi');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const idOrSlug = viewParams.id || viewParams.slug || 'prod-1';
        const data = await api.getProduct(idOrSlug);
        if (data) {
          setProduct(data);
          setSelectedSize(data.sizes[0] || 'Standard');
          setSelectedColor(data.colors[0]?.name || '');
          setStitchChoice(data.stitchType === 'stitched' ? 'stitched' : 'unstitched');

          // Fetch related
          const relRes = await api.getProducts({
            category: data.category,
            limit: 4,
          });
          if (relRes && relRes.products) {
            setRelatedProducts(relRes.products.filter(p => p.id !== data.id));
          }

          // Fetch reviews
          const revs = await api.getReviews(data.id);
          if (Array.isArray(revs)) {
            setReviews(revs);
          }
        }
      } catch (err) {
        console.error('Failed to load product detail', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [viewParams.id, viewParams.slug]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-3 border-[#ea580c] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-cinzel text-base font-bold text-[#1c1917]">
            Loading Stitch &amp; Unstitched Atelier...
          </p>
        </div>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const currentPrice =
    (product.salePrice || product.price) +
    (stitchChoice === 'stitched' && product.customStitchingFee ? product.customStitchingFee : 0);

  const handleAddToCart = (proceedToCheckout = false) => {
    addToCart(
      product,
      selectedSize,
      stitchChoice,
      selectedColor,
      quantity,
      isCustomMeasurementsOpen ? customMeasurements : undefined
    );
    if (proceedToCheckout) {
      navigate('checkout');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'info',
        title: 'Link Copied',
        message: 'Product link copied to clipboard.',
      });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      addToast({
        type: 'error',
        title: 'Incomplete Review',
        message: 'Please fill out your name and review details.',
      });
      return;
    }

    setSubmittingReview(true);
    try {
      const created = await api.createReview({
        productId: product.id,
        author: newReviewAuthor.trim(),
        city: newReviewCity.trim(),
        rating: newReviewRating,
        comment: newReviewComment.trim(),
        verifiedPurchase: true,
      });

      setReviews(prev => [created, ...prev]);
      setNewReviewAuthor('');
      setNewReviewComment('');
      addToast({
        type: 'success',
        title: 'Review Published',
        message: 'Thank you for reviewing our Pakistani fashion atelier.',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Review Error',
        message: 'Could not submit review. Please retry.',
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-[#78716c] uppercase tracking-wider mb-6 flex items-center gap-1.5 flex-wrap">
          <button onClick={() => navigate('home')} className="hover:text-[#ea580c]">Home</button>
          <span>&bull;</span>
          <button onClick={() => navigate('shop', { category: product.category })} className="hover:text-[#ea580c]">
            {product.category}
          </button>
          <span>&bull;</span>
          <span className="text-[#1c1917] font-semibold truncate">{product.name}</span>
        </div>

        {/* Main Product Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-8 rounded-3xl border border-[#f0ece1] shadow-xs">
          {/* Left Gallery: 7 Columns on Large */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main High-Res Image with Zoom Preview */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#faf8f5] border border-[#e5dfd3] shadow-inner group">
              <img
                src={product.images[selectedImgIdx]?.url || product.images[0]?.url}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110 cursor-crosshair"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountPercent > 0 && (
                  <span className="bg-[#ea580c] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    -{discountPercent}% OFF
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-[#1c1917] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> New 2026
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all shadow-md ${
                  isSaved
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-white/90 backdrop-blur-xs text-[#44403c] hover:bg-white hover:text-[#ea580c]'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-600' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImgIdx === idx
                        ? 'border-[#ea580c] scale-105 shadow-xs'
                        : 'border-[#e5dfd3] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Specs & Action Form: 5 Columns */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category, SKU & Rating */}
              <div>
                <div className="flex items-center justify-between text-xs text-[#78716c]">
                  <span className="font-bold uppercase tracking-widest text-[#ea580c]">
                    {product.brand} &bull; {product.category}
                  </span>
                  <span>SKU: <strong className="text-[#292524]">{product.sku}</strong></span>
                </div>

                <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1c1917] mt-1.5 leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-500 mr-1" />
                    <span>{product.rating}</span>
                    <span className="text-[#78716c] font-normal ml-1">
                      ({reviews.length || product.reviewCount} customer reviews)
                    </span>
                  </div>
                  <span>&bull;</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    In Stock ({product.stockQuantity} pieces ready)
                  </span>
                </div>
              </div>

              {/* Price Row */}
              <div className="p-4 bg-[#faf8f5] rounded-2xl border border-[#f0ece1] flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-cinzel text-2xl sm:text-3xl font-bold text-[#ea580c]">
                      {formatPrice(currentPrice)}
                    </span>
                    {product.salePrice && (
                      <span className="text-sm text-[#a8a29e] line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  {stitchChoice === 'stitched' && product.customStitchingFee && (
                    <div className="text-[11px] text-[#c2410c] font-semibold mt-0.5">
                      + Includes Rs. {product.customStitchingFee} Master Atelier Tailoring
                    </div>
                  )}
                </div>

                <span className="text-[11px] text-[#78716c] text-right font-medium">
                  Tax included.<br />Karachi COD Available
                </span>
              </div>

              {/* Stitch Type Selector */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1c1917] mb-2">
                  <span className="flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-[#ea580c]" /> Select Stitching Type
                  </span>
                  {product.stitchType === 'both' && (
                    <span className="text-[11px] text-[#ea580c] font-normal normal-case">
                      Custom Stitching by Karachi Tailors
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setStitchChoice('unstitched')}
                    disabled={product.stitchType === 'stitched'}
                    className={`py-3 px-4 rounded-xl text-xs font-semibold border transition-all text-left flex flex-col justify-between ${
                      stitchChoice === 'unstitched'
                        ? 'border-[#ea580c] bg-[#fff7ed] text-[#c2410c] shadow-xs'
                        : 'border-[#d6cfc4] hover:bg-[#faf8f5] text-[#57534e]'
                    }`}
                  >
                    <span className="font-bold uppercase tracking-wider">Unstitched Fabric</span>
                    <span className="text-[10px] text-[#78716c] mt-0.5">Original Fabric + Patches &amp; Dupatta</span>
                  </button>

                  <button
                    onClick={() => setStitchChoice('stitched')}
                    disabled={product.stitchType === 'unstitched'}
                    className={`py-3 px-4 rounded-xl text-xs font-semibold border transition-all text-left flex flex-col justify-between ${
                      stitchChoice === 'stitched'
                        ? 'border-[#ea580c] bg-[#fff7ed] text-[#c2410c] shadow-xs'
                        : 'border-[#d6cfc4] hover:bg-[#faf8f5] text-[#57534e]'
                    }`}
                  >
                    <span className="font-bold uppercase tracking-wider">
                      Stitched (+Rs. {product.customStitchingFee || 1500})
                    </span>
                    <span className="text-[10px] text-[#78716c] mt-0.5">Tailored with custom neckline &amp; trousers</span>
                  </button>
                </div>
              </div>

              {/* Sizes Selection & Size Guide */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1c1917] mb-2">
                  <span>Size</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(!isSizeGuideOpen)}
                    className="text-[#ea580c] hover:underline flex items-center gap-1 font-semibold normal-case"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Pakistani Size Chart (Inches)</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                        selectedSize === size
                          ? 'border-[#ea580c] bg-[#1c1917] text-white shadow-xs'
                          : 'border-[#d6cfc4] hover:border-[#ea580c] text-[#292524] bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Measurements Optional Form for Stitched */}
              {stitchChoice === 'stitched' && (
                <div className="bg-[#fffbf5] p-3.5 rounded-2xl border border-[#fed7aa] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-[#9a3412] flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5" />
                      Provide Custom Measurements (Optional)
                    </span>
                    <button
                      onClick={() => setIsCustomMeasurementsOpen(!isCustomMeasurementsOpen)}
                      className="text-xs font-semibold text-[#ea580c] hover:underline"
                    >
                      {isCustomMeasurementsOpen ? 'Hide' : 'Add Tailoring Notes'}
                    </button>
                  </div>

                  {isCustomMeasurementsOpen && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
                      <div>
                        <label className="text-[10px] text-[#78716c] font-bold uppercase">Chest (Inches)</label>
                        <input
                          type="text"
                          value={customMeasurements.chest}
                          onChange={e => setCustomMeasurements({ ...customMeasurements, chest: e.target.value })}
                          className="w-full bg-white border border-[#d6cfc4] px-2 py-1 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#78716c] font-bold uppercase">Waist (Inches)</label>
                        <input
                          type="text"
                          value={customMeasurements.waist}
                          onChange={e => setCustomMeasurements({ ...customMeasurements, waist: e.target.value })}
                          className="w-full bg-white border border-[#d6cfc4] px-2 py-1 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#78716c] font-bold uppercase">Hips (Inches)</label>
                        <input
                          type="text"
                          value={customMeasurements.hips}
                          onChange={e => setCustomMeasurements({ ...customMeasurements, hips: e.target.value })}
                          className="w-full bg-white border border-[#d6cfc4] px-2 py-1 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#78716c] font-bold uppercase">Shirt Length</label>
                        <input
                          type="text"
                          value={customMeasurements.shirtLength}
                          onChange={e => setCustomMeasurements({ ...customMeasurements, shirtLength: e.target.value })}
                          className="w-full bg-white border border-[#d6cfc4] px-2 py-1 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#78716c] font-bold uppercase">Trouser Length</label>
                        <input
                          type="text"
                          value={customMeasurements.trouserLength}
                          onChange={e => setCustomMeasurements({ ...customMeasurements, trouserLength: e.target.value })}
                          className="w-full bg-white border border-[#d6cfc4] px-2 py-1 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#78716c] font-bold uppercase">Shoulder</label>
                        <input
                          type="text"
                          value={customMeasurements.shoulder}
                          onChange={e => setCustomMeasurements({ ...customMeasurements, shoulder: e.target.value })}
                          className="w-full bg-white border border-[#d6cfc4] px-2 py-1 rounded text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Color Swatches */}
              {product.colors.length > 0 && (
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#1c1917] mb-2">
                    Color: <strong className="text-[#ea580c]">{selectedColor}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedColor === color.name
                            ? 'border-[#ea580c] scale-110 shadow-xs ring-2 ring-orange-200'
                            : 'border-white hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Action Buttons */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Qty Box */}
                  <div className="flex items-center border border-[#d6cfc4] rounded-xl bg-[#faf8f5] p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-[#57534e] hover:text-black"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-[#1c1917]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-[#57534e] hover:text-black"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Bag */}
                  <button
                    onClick={() => handleAddToCart(false)}
                    className="flex-1 bg-[#ea580c] hover:bg-[#c2410c] text-white py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 transition-all active:scale-[0.99]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag</span>
                  </button>
                </div>

                {/* Buy Now & Share */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(true)}
                    className="flex-1 bg-[#1c1917] hover:bg-[#292524] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                  >
                    <span>Instant Checkout &bull; COD</span>
                    <ArrowRight className="w-4 h-4 text-[#ea580c]" />
                  </button>

                  <button
                    onClick={() => {
                      const cleanPhone = (settings?.whatsapp || '+92 300 1234567').replace(/[^0-9]/g, '');
                      const text = encodeURIComponent(
                        `Salam! I am inquiring about *${product.name}* (SKU: ${product.sku}, Fabric: ${product.fabric}, Option: ${stitchChoice === 'stitched' ? 'Stitched' : 'Unstitched'}, Size: ${selectedSize || 'Standard'}). Could you please assist me?`
                      );
                      window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
                    }}
                    className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5 font-bold text-xs"
                    title="Ask Stylist / Order on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span className="hidden sm:inline">Inquire on WhatsApp</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-3 bg-[#faf8f5] hover:bg-[#ede8dc] text-[#57534e] rounded-xl border border-[#d6cfc4] transition-colors"
                    title="Share product link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Assurance strip */}
              <div className="bg-[#faf8f5] p-3.5 rounded-2xl border border-[#f0ece1] space-y-2 text-xs text-[#57534e]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#ea580c]" />
                  <span><strong>Karachi 24–48h Delivery:</strong> DHA, Clifton, Gulshan, Johar, PECHS</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#ea580c]" />
                  <span><strong>100% Guaranteed Fabric:</strong> Pure {product.fabric} with authentic tilla</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#ea580c]" />
                  <span><strong>7-Day Doorstep Exchange:</strong> Hassle-free rider pickup</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Size Chart Modal */}
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsSizeGuideOpen(false)} />
            <div className="relative bg-white p-6 rounded-2xl max-w-xl w-full border border-[#e5dfd3] shadow-2xl z-10">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1] mb-4">
                <h3 className="font-cinzel text-lg font-bold text-[#1c1917]">
                  Pakistani Standard Size Chart (Inches)
                </h3>
                <button onClick={() => setIsSizeGuideOpen(false)} className="text-xs text-[#78716c] hover:text-black">
                  Close
                </button>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#faf8f5] text-[#1c1917] font-bold border-b border-[#e5dfd3]">
                      <th className="p-2.5">Size</th>
                      <th className="p-2.5">Chest</th>
                      <th className="p-2.5">Waist</th>
                      <th className="p-2.5">Hips</th>
                      <th className="p-2.5">Shirt Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ece1] text-[#57534e]">
                    <tr>
                      <td className="p-2.5 font-bold text-[#ea580c]">XS</td>
                      <td className="p-2.5">34&quot;</td>
                      <td className="p-2.5">28&quot;</td>
                      <td className="p-2.5">36&quot;</td>
                      <td className="p-2.5">40&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-[#ea580c]">S</td>
                      <td className="p-2.5">36&quot;</td>
                      <td className="p-2.5">30&quot;</td>
                      <td className="p-2.5">38&quot;</td>
                      <td className="p-2.5">41&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-[#ea580c]">M</td>
                      <td className="p-2.5">39&quot;</td>
                      <td className="p-2.5">33&quot;</td>
                      <td className="p-2.5">41&quot;</td>
                      <td className="p-2.5">42&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-[#ea580c]">L</td>
                      <td className="p-2.5">42&quot;</td>
                      <td className="p-2.5">36&quot;</td>
                      <td className="p-2.5">44&quot;</td>
                      <td className="p-2.5">43&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-[#ea580c]">XL</td>
                      <td className="p-2.5">45&quot;</td>
                      <td className="p-2.5">39&quot;</td>
                      <td className="p-2.5">47&quot;</td>
                      <td className="p-2.5">44&quot;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Tabs: Specifications, Fabric & Care, Tailoring */}
        <div className="mt-12 bg-white p-6 sm:p-8 rounded-3xl border border-[#f0ece1] shadow-xs">
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1c1917] mb-6 pb-3 border-b border-[#f0ece1]">
            PRODUCT SPECIFICATIONS &amp; DETAILS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-[#57534e]">
            {/* Overview */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-[#1c1917] text-sm">
                About this Piece
              </h4>
              <p className="leading-relaxed">{product.description}</p>
              <ul className="space-y-1.5 pt-2">
                <li><strong>Pieces Included:</strong> {product.pieces}</li>
                <li><strong>Fabric:</strong> {product.fabric}</li>
                <li><strong>Gender / Department:</strong> {product.gender.toUpperCase()}</li>
                <li><strong>Season:</strong> {product.season}</li>
              </ul>
            </div>

            {/* Inclusions */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-[#1c1917] text-sm">
                Included in Package
              </h4>
              <ul className="space-y-2">
                {product.includes?.map((inc, i) => (
                  <li key={i} className="flex items-center gap-2 text-[#292524]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fabric Care */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-[#1c1917] text-sm">
                Care &amp; Wash Instructions
              </h4>
              <p className="leading-relaxed">{product.careInstructions || 'Dry clean recommended for silk and velvet. Hand wash in cold water for pure Pima lawn with mild detergent.'}</p>
              <div className="p-3 bg-[#fff7ed] rounded-xl border border-[#fed7aa] text-[#c2410c] text-[11px]">
                <strong>Karachi Climate Tip:</strong> Iron unstitched lawn on medium steam setting to preserve vibrant digital prints.
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Submit Form */}
        <div className="mt-12 bg-white p-6 sm:p-8 rounded-3xl border border-[#f0ece1] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#f0ece1]">
            <div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1c1917]">
                CUSTOMER RATINGS &amp; REVIEWS
              </h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-[#78716c]">
                <div className="flex items-center text-amber-500 font-bold text-base">
                  <Star className="w-4 h-4 fill-amber-500 mr-1" />
                  <span>{product.rating} / 5.0</span>
                </div>
                <span>&bull;</span>
                <span>Based on {reviews.length || product.reviewCount} customer experiences in Pakistan</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-[#78716c] italic">No reviews submitted yet. Be the first to review this design!</p>
              ) : (
                reviews.map(rev => (
                  <div key={rev.id} className="p-4 bg-[#faf8f5] rounded-2xl border border-[#f0ece1] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#1c1917]">{rev.author}</span>
                        {rev.city && (
                          <span className="text-[10px] text-[#78716c]">({rev.city})</span>
                        )}
                        {rev.verifiedPurchase && (
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#57534e] leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-[#a8a29e] block">{rev.createdAt}</span>
                  </div>
                ))
              )}
            </div>

            {/* Review Submission Form */}
            <div className="lg:col-span-5 bg-[#faf8f5] p-5 rounded-2xl border border-[#f0ece1]">
              <h3 className="font-cinzel text-sm font-bold text-[#1c1917] mb-3 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#ea580c]" /> Write a Review
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#292524] mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={e => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Fatima Tariq"
                    className="w-full bg-white border border-[#d6cfc4] px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#292524] mb-1">City</label>
                  <input
                    type="text"
                    value={newReviewCity}
                    onChange={e => setNewReviewCity(e.target.value)}
                    placeholder="Karachi, Lahore, Islamabad..."
                    className="w-full bg-white border border-[#d6cfc4] px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#292524] mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 text-amber-500"
                      >
                        <Star
                          className={`w-5 h-5 ${star <= newReviewRating ? 'fill-amber-500' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#292524] mb-1">Review Comments</label>
                  <textarea
                    rows={3}
                    required
                    value={newReviewComment}
                    onChange={e => setNewReviewComment(e.target.value)}
                    placeholder="Describe fabric softness, embroidery quality, or Karachi delivery speed..."
                    className="w-full bg-white border border-[#d6cfc4] px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-2.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  {submittingReview ? 'Publishing...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1c1917]">
                YOU MAY ALSO LIKE
              </h2>
              <button
                onClick={() => navigate('shop', { category: product.category })}
                className="text-xs font-bold uppercase tracking-wider text-[#ea580c] hover:underline"
              >
                View Full Collection &rarr;
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
