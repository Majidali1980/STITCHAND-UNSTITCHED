import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Clock,
  Save,
  Sparkles,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  MoveUp,
  MoveDown,
  Upload,
  Eye,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import { FlashSale, Banner } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

export const AdminFlashSales: React.FC = () => {
  const { addToast } = useStore();
  const [flashSale, setFlashSale] = useState<FlashSale | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Flash Sale Form
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [discountBadge, setDiscountBadge] = useState('UP TO 40% OFF');
  const [isActive, setIsActive] = useState(true);
  const [endTime, setEndTime] = useState('2026-08-30T23:59:59');

  // Banner CRUD Modal State
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    mobileImage: '',
    ctaText: 'SHOP NOW',
    ctaUrl: '/shop?category=stitched',
    position: 'hero' as Banner['position'],
    sortOrder: 1,
    isActive: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [flashData, bannersData] = await Promise.all([
        api.getFlashSale(),
        api.getBanners(),
      ]);

      if (flashData) {
        setFlashSale(flashData);
        setTitle(flashData.title || '');
        setSubtitle(flashData.subtitle || '');
        setDiscountBadge(flashData.discountBadge || 'UP TO 40% OFF');
        setIsActive(flashData.isActive ?? true);
        setEndTime(flashData.endTime || '2026-08-30T23:59:59');
      }

      if (Array.isArray(bannersData)) {
        setBanners(bannersData);
      }
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not load flash sale & banner configurations.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveFlashSale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateFlashSale({
        title,
        subtitle,
        discountBadge,
        isActive,
        endTime,
      });

      addToast({
        type: 'success',
        title: 'Flash Sale Configured',
        message: 'Countdown timer and banners updated on storefront.',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not update flash sale configuration.',
      });
    }
  };

  // Banner image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast({
        type: 'error',
        title: 'Invalid File',
        message: 'Please upload an image file (JPG, PNG, WebP).',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBannerForm(prev => ({ ...prev, image: result }));
      addToast({
        type: 'success',
        title: 'Hero Banner Uploaded',
        message: 'Full-width image ready to save.',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      title: 'SUMMER LAWN & FESTIVE COUTURE',
      subtitle: 'Pure Pima cotton, handcrafted zari embroideries, and bespoke cuts delivered across Karachi.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=90',
      mobileImage: '',
      ctaText: 'EXPLORE COLLECTION',
      ctaUrl: '/shop?category=ladies',
      position: 'hero',
      sortOrder: banners.filter(b => b.position === 'hero').length + 1,
      isActive: true,
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      mobileImage: banner.mobileImage || '',
      ctaText: banner.ctaText,
      ctaUrl: banner.ctaUrl,
      position: banner.position,
      sortOrder: banner.sortOrder,
      isActive: banner.isActive,
    });
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.image) {
      addToast({
        type: 'error',
        title: 'Image Required',
        message: 'Please upload or provide a full-width image URL for the banner.',
      });
      return;
    }

    try {
      if (editingBanner) {
        const updated = await api.updateBanner(editingBanner.id, bannerForm);
        setBanners(prev => prev.map(b => (b.id === editingBanner.id ? updated : b)));
        addToast({
          type: 'success',
          title: 'Banner Updated',
          message: 'Hero slide saved successfully.',
        });
      } else {
        const created = await api.createBanner(bannerForm);
        setBanners(prev => [...prev, created]);
        addToast({
          type: 'success',
          title: 'Hero Banner Created',
          message: 'New full-width slide added to the storefront carousel.',
        });
      }
      setIsBannerModalOpen(false);
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save banner slide.',
      });
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to remove this banner slide?')) return;
    try {
      const success = await api.deleteBanner(id);
      if (success) {
        setBanners(prev => prev.filter(b => b.id !== id));
        addToast({
          type: 'success',
          title: 'Banner Removed',
          message: 'Slide deleted from carousel.',
        });
      }
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete banner.',
      });
    }
  };

  const heroBanners = banners.filter(b => b.position === 'hero').sort((a, b) => a.sortOrder - b.sortOrder);
  const promoBanners = banners.filter(b => b.position !== 'hero').sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#ea580c]" />
            <span>HERO SLIDES &amp; FLASH SALE BANNERS (CRUD)</span>
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Full-width image upload, auto-scrolling hero carousel management, and real-time flash sales.
          </p>
        </div>

        <button
          onClick={handleOpenAddBanner}
          className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Hero Banner</span>
        </button>
      </div>

      {/* Hero Full Width Carousel Banners CRUD Section */}
      <div className="bg-[#121214] p-6 rounded-3xl border border-[#27272a] space-y-6">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#ea580c]" />
              <span>Full-Width Hero Carousel Slides ({heroBanners.length})</span>
            </h2>
            <p className="text-xs text-[#a1a1aa] mt-0.5">
              These images display full-width (width-to-width) on the storefront and automatically scroll.
            </p>
          </div>
        </div>

        {heroBanners.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-[#27272a] rounded-2xl p-6">
            <ImageIcon className="w-10 h-10 text-[#52525b] mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No Hero Slides Configured</p>
            <p className="text-xs text-[#a1a1aa] mt-1 mb-4">Upload high-resolution full-width images (1920x800px recommended).</p>
            <button
              onClick={handleOpenAddBanner}
              className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Upload First Hero Slide
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heroBanners.map((slide, index) => (
              <div
                key={slide.id}
                className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between group"
              >
                {/* Full Width Image Preview */}
                <div className="relative aspect-[21/9] w-full bg-black overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c] bg-black/60 px-2 py-0.5 rounded w-max mb-1">
                      Slide #{index + 1} &bull; {slide.isActive ? 'Active' : 'Disabled'}
                    </span>
                    <h3 className="font-cinzel text-sm font-bold text-white line-clamp-1">
                      {slide.title}
                    </h3>
                    <p className="text-[11px] text-[#d4d4d8] line-clamp-1">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>

                {/* Info & Action Controls */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white">CTA:</span>
                      <span className="bg-[#27272a] text-white px-2 py-0.5 rounded text-[11px] font-mono">
                        {slide.ctaText} &rarr; {slide.ctaUrl}
                      </span>
                    </div>
                    <span className="text-[11px]">Order: {slide.sortOrder}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#27272a]">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        slide.isActive ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {slide.isActive ? 'Visible in Carousel' : 'Hidden'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditBanner(slide)}
                        className="flex items-center gap-1 bg-[#27272a] hover:bg-[#3f3f46] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Slide</span>
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(slide.id)}
                        className="p-1.5 text-[#a1a1aa] hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flash Sale Settings Section */}
      <div className="bg-[#121214] p-6 sm:p-8 rounded-3xl border border-[#27272a] space-y-6">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ea580c]" />
              <span>Real-Time Flash Sale Countdown Campaign</span>
            </h2>
            <p className="text-xs text-[#a1a1aa] mt-0.5">
              Configure real-time countdown clocks, discount banners, and urgent deals across the storefront.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveFlashSale} className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 bg-[#18181b] rounded-2xl border border-[#27272a]">
            <div>
              <span className="font-bold text-white block">Active Campaign Status</span>
              <span className="text-[11px] text-[#a1a1aa]">Show countdown timer and flash discount badges on home page</span>
            </div>
            <input
              type="checkbox"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="w-5 h-5 accent-[#ea580c] cursor-pointer"
            />
          </div>

          <div>
            <label className="block font-bold text-white mb-1">Campaign Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. KARACHI EXCLUSIVE FLASH SALE"
              className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-white mb-1">Subtitle / Notice</label>
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="e.g. Limited Stock on Luxury Lawn & Ready-to-Wear"
              className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white mb-1">Discount Headline Badge</label>
              <input
                type="text"
                value={discountBadge}
                onChange={e => setDiscountBadge(e.target.value)}
                placeholder="UP TO 40% OFF"
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl font-bold uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-white mb-1">Countdown Expiry (ISO Date)</label>
              <input
                type="text"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                placeholder="2026-08-30T23:59:59"
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#27272a] flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-[0.99]"
            >
              <Save className="w-4 h-4" />
              <span>Save Campaign Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Banner Upload / Edit Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#121214] border border-[#27272a] rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#ea580c]" />
                <span>{editingBanner ? 'Edit Hero Banner Slide' : 'Upload Full-Width Hero Slide'}</span>
              </h3>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="text-[#a1a1aa] hover:text-white text-sm"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              {/* Full Width Image Upload & Preview */}
              <div>
                <label className="block font-bold text-white mb-2">
                  Hero Full-Width Image (Upload or URL) *
                </label>

                {bannerForm.image && (
                  <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-[#27272a] mb-3 bg-black">
                    <img
                      src={bannerForm.image}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-[10px] text-white">
                      Full Width Preview
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={bannerForm.image}
                      onChange={e => setBannerForm({ ...bannerForm, image: e.target.value })}
                      placeholder="https://... or upload local image file below"
                      className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full min-h-[38px] flex items-center justify-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white px-3 py-2 rounded-xl font-bold uppercase transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#ea580c]" />
                      <span>Choose File</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <label className="block font-bold text-white mb-1">Headline Text *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="e.g. STYLE THAT SPEAKS FOR YOU"
                  className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-white mb-1">Supporting Subtitle Text</label>
                <textarea
                  rows={2}
                  value={bannerForm.subtitle}
                  onChange={e => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="e.g. Discover our latest luxury stitched & unstitched collections..."
                  className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl resize-none"
                />
              </div>

              {/* CTA and Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-white mb-1">Button CTA Label *</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.ctaText}
                    onChange={e => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                    placeholder="e.g. SHOP STITCHED"
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Target Link / Route *</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.ctaUrl}
                    onChange={e => setBannerForm({ ...bannerForm, ctaUrl: e.target.value })}
                    placeholder="e.g. /shop?category=stitched"
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-white mb-1">Position</label>
                  <select
                    value={bannerForm.position}
                    onChange={e => setBannerForm({ ...bannerForm, position: e.target.value as any })}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                  >
                    <option value="hero">Hero Full-Width Slider</option>
                    <option value="promo-1">Promo Grid 1</option>
                    <option value="promo-2">Promo Grid 2</option>
                    <option value="promo-3">Promo Grid 3</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={bannerForm.sortOrder}
                    onChange={e => setBannerForm({ ...bannerForm, sortOrder: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="banner-is-active"
                    checked={bannerForm.isActive}
                    onChange={e => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                    className="w-4 h-4 accent-[#ea580c] cursor-pointer"
                  />
                  <label htmlFor="banner-is-active" className="font-bold text-white cursor-pointer">
                    Active on Storefront
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#27272a] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-[#a1a1aa] hover:bg-[#27272a] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider shadow-md transition-all"
                >
                  {editingBanner ? 'Save Changes' : 'Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
