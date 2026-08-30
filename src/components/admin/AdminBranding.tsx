import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  Image as ImageIcon,
  Globe,
  Upload,
  Layers,
  Palette,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Eye,
  Type,
  Share2,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { Logo } from '../common/Logo';
import { StoreSettings } from '../../types';

export const AdminBranding: React.FC = () => {
  const { settings, refreshSettings, addToast } = useStore();

  const [formData, setFormData] = useState<Partial<StoreSettings>>({
    storeName: 'STITCH & UNSTITCHED',
    tagline: 'Karachi Atelier • Est. 2026',
    logoUrl: '',
    logo: '',
    faviconUrl: '',
    favicon: '',
    brandDescription: "Karachi's premier fashion atelier offering bespoke stitched kurtis, pure Pima lawn, festive velvet ensembles, and contemporary Pakistani menswear.",
    announcementText: '✨ FREE EXPRESS DELIVERY IN KARACHI ON ORDERS OVER RS. 3,000 | SAME DAY DISPATCH AVAILABLE',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    tiktokUrl: 'https://tiktok.com',
    youtubeUrl: 'https://youtube.com',
    phone: '+92 21 35870000',
    whatsapp: '+92 300 1234567',
    email: 'care@stitchandunstitched.com',
    address: 'Plot 24-C, Khayaban-e-Shahbaz, Phase 6, DHA, Karachi, Pakistan',
    city: 'Karachi',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [logoPreviewTab, setLogoPreviewTab] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (settings) {
      setFormData({
        ...settings,
        logoUrl: settings.logoUrl || settings.logo || '',
        faviconUrl: settings.faviconUrl || settings.favicon || '',
        brandDescription: settings.brandDescription || "Karachi's premier fashion atelier offering bespoke stitched kurtis, pure Pima lawn, festive velvet ensembles, and contemporary Pakistani menswear.",
      });
    }
  }, [settings]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'faviconUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 2MB for data URI)
    if (file.size > 2 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'File Too Large',
        message: 'Please choose an image under 2MB.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setFormData(prev => ({
        ...prev,
        [field]: dataUri,
        ...(field === 'logoUrl' ? { logo: dataUri } : { favicon: dataUri }),
      }));
      addToast({
        type: 'success',
        title: 'Image Loaded',
        message: `${field === 'logoUrl' ? 'Logo' : 'Favicon'} preview updated. Click Save Changes to apply.`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload: Partial<StoreSettings> = {
        ...formData,
        logo: formData.logoUrl || formData.logo || '',
        logoUrl: formData.logoUrl || '',
        favicon: formData.faviconUrl || formData.favicon || '',
        faviconUrl: formData.faviconUrl || '',
      };

      await api.updateSettings(payload);
      await refreshSettings();

      // Dynamically update document title and favicon
      if (payload.storeName) {
        document.title = `${payload.storeName} | ${payload.tagline || 'Karachi Atelier 2026'}`;
      }
      if (payload.faviconUrl) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = payload.faviconUrl;
      }

      addToast({
        type: 'success',
        title: 'Branding Saved',
        message: 'Store name, logos, favicon, and brand metadata updated across customer storefront.',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not update branding settings. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToPreset = () => {
    setFormData(prev => ({
      ...prev,
      storeName: 'STITCH & UNSTITCHED',
      tagline: 'Karachi Atelier • Est. 2026',
      logoUrl: '',
      logo: '',
      faviconUrl: '',
      favicon: '',
      brandDescription: "Karachi's premier fashion atelier offering bespoke stitched kurtis, pure Pima lawn, festive velvet ensembles, and contemporary Pakistani menswear.",
    }));
    addToast({
      type: 'info',
      title: 'Reset to Karachi Atelier Presets',
      message: 'Default branding values loaded. Click Save Changes to apply.',
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white flex items-center gap-2.5">
            <Palette className="w-6 h-6 text-[#ea580c]" />
            <span>BRANDING &amp; VISUAL IDENTITY (CRUD)</span>
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Customize your store name, logo image, favicon icon, taglines, and brand narrative with live real-time preview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToPreset}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-xs font-semibold text-[#d4d4d8] rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Preset</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Branding'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        {/* ========================================================================= */}
        {/* SECTION 1: LIVE BRANDING PREVIEWS (Header, Footer, Browser Tab)           */}
        {/* ========================================================================= */}
        <div className="bg-[#121214] p-6 rounded-3xl border border-[#27272a] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
            <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#ea580c]" />
              <span>Live Visual Identity Previews</span>
            </h3>
            <div className="flex items-center gap-1.5 bg-[#18181b] p-1 rounded-xl border border-[#27272a]">
              <button
                type="button"
                onClick={() => setLogoPreviewTab('dark')}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                  logoPreviewTab === 'dark' ? 'bg-[#ea580c] text-white' : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                Dark Canvas
              </button>
              <button
                type="button"
                onClick={() => setLogoPreviewTab('light')}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                  logoPreviewTab === 'light' ? 'bg-[#ea580c] text-white' : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                Light Canvas
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 1. Header/Navbar Logo Preview */}
            <div
              className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                logoPreviewTab === 'dark'
                  ? 'bg-[#18181b] border-[#27272a]'
                  : 'bg-white border-zinc-200'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717a] mb-4">
                Header &amp; Navigation Logo
              </span>
              <Logo
                variant={logoPreviewTab === 'dark' ? 'light' : 'dark'}
                size="md"
                customName={formData.storeName}
                customTagline={formData.tagline}
                customLogoUrl={formData.logoUrl}
              />
              <span className="text-[10px] text-[#71717a] mt-4">
                Appears at the top of every storefront page
              </span>
            </div>

            {/* 2. Browser Tab & Favicon Preview */}
            <div className="bg-[#18181b] p-5 rounded-2xl border border-[#27272a] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717a] block mb-3">
                  Browser Tab &amp; Favicon Simulation
                </span>
                <div className="bg-[#27272a] rounded-t-xl p-2.5 flex items-center gap-2 border-b border-[#3f3f46]">
                  {/* Favicon icon */}
                  {formData.faviconUrl ? (
                    <img
                      src={formData.faviconUrl}
                      alt="Favicon"
                      className="w-4 h-4 rounded-xs object-contain"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-[#ea580c] flex items-center justify-center text-[9px] font-bold text-white">
                      SU
                    </div>
                  )}
                  <span className="text-[11px] font-medium text-white truncate max-w-[170px]">
                    {formData.storeName || 'STITCH & UNSTITCHED'} | {formData.tagline || 'Karachi Atelier'}
                  </span>
                  <span className="text-[10px] text-[#a1a1aa] ml-auto">&times;</span>
                </div>
                <div className="bg-[#121214] p-3 rounded-b-xl border border-t-0 border-[#27272a] text-[10px] text-[#a1a1aa]">
                  Tab URL: <span className="text-zinc-300">https://stitchandunstitched.pk/</span>
                </div>
              </div>

              <p className="text-[10px] text-[#71717a] mt-3">
                Favicon is dynamically synchronized into the browser tab upon saving.
              </p>
            </div>

            {/* 3. Footer Luxury Badge Preview */}
            <div className="bg-[#18181b] p-5 rounded-2xl border border-[#27272a] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717a] block mb-3">
                  Footer Brand Block
                </span>
                <Logo
                  variant="light"
                  size="sm"
                  customName={formData.storeName}
                  customTagline={formData.tagline}
                  customLogoUrl={formData.logoUrl}
                />
                <p className="text-[11px] text-[#a1a1aa] mt-2.5 line-clamp-3 leading-relaxed">
                  {formData.brandDescription}
                </p>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium mt-3 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Fully Dynamic Across Entire Store
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: BRAND NAME, TAGLINE & MISSION                                  */}
        {/* ========================================================================= */}
        <div className="bg-[#121214] p-6 rounded-3xl border border-[#27272a] shadow-xs space-y-4">
          <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-[#27272a]">
            <Type className="w-4 h-4 text-[#ea580c]" />
            <span>Store Name &amp; Tagline</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white mb-1.5">
                Brand / Store Name <span className="text-[#ea580c]">*</span>
              </label>
              <input
                type="text"
                value={formData.storeName || ''}
                onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                placeholder="e.g. STITCH & UNSTITCHED"
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c] font-semibold text-sm"
                required
              />
              <span className="text-[10px] text-[#71717a] mt-1 block">
                Use an ampersand (&amp;) to create the dual-accent typography in luxury headers.
              </span>
            </div>

            <div>
              <label className="block font-bold text-white mb-1.5">
                Brand Tagline / Atelier Slogan
              </label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. Karachi Atelier • Est. 2026"
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
              <span className="text-[10px] text-[#71717a] mt-1 block">
                Appears beneath the logo and on social preview cards.
              </span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-white mb-1.5">
              Brand Story / Footer About Summary
            </label>
            <textarea
              rows={3}
              value={formData.brandDescription || ''}
              onChange={e => setFormData({ ...formData, brandDescription: e.target.value })}
              placeholder="Karachi's premier fashion atelier offering bespoke stitched kurtis, pure Pima lawn..."
              className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c] leading-relaxed"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: LOGO & FAVICON CRUD (Image Upload & Direct URL)                */}
        {/* ========================================================================= */}
        <div className="bg-[#121214] p-6 rounded-3xl border border-[#27272a] shadow-xs space-y-6">
          <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-[#27272a]">
            <ImageIcon className="w-4 h-4 text-[#ea580c]" />
            <span>Logo &amp; Favicon Asset CRUD</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Manager */}
            <div className="bg-[#18181b] p-5 rounded-2xl border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#ea580c]" />
                  <span>Primary Store Logo</span>
                </h4>
                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logoUrl: '', logo: '' })}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    Clear (Use SVG Monogram)
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#a1a1aa] mb-1.5">
                  Logo Image URL (PNG, SVG, WebP, JPG)
                </label>
                <input
                  type="text"
                  value={formData.logoUrl || ''}
                  onChange={e => setFormData({ ...formData, logoUrl: e.target.value, logo: e.target.value })}
                  placeholder="https://example.com/brand-logo.png"
                  className="w-full bg-[#121214] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div className="relative border-2 border-dashed border-[#27272a] hover:border-[#ea580c] rounded-xl p-4 text-center transition-colors">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={e => handleFileUpload(e, 'logoUrl')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 text-[#a1a1aa] mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-white block">
                  Click or drag image to upload logo
                </span>
                <span className="text-[10px] text-[#71717a]">
                  PNG, SVG, or WebP recommended (Max 2MB)
                </span>
              </div>

              <div className="text-[10px] text-[#71717a]">
                💡 <em>If left blank, the app will automatically use the built-in luxury Karachi artisan vector monogram!</em>
              </div>
            </div>

            {/* Favicon Manager */}
            <div className="bg-[#18181b] p-5 rounded-2xl border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#ea580c]" />
                  <span>Browser Favicon (.ico / .png)</span>
                </h4>
                {formData.faviconUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, faviconUrl: '', favicon: '' })}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    Clear Favicon
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#a1a1aa] mb-1.5">
                  Favicon Image URL (.ico, .png, .svg)
                </label>
                <input
                  type="text"
                  value={formData.faviconUrl || ''}
                  onChange={e => setFormData({ ...formData, faviconUrl: e.target.value, favicon: e.target.value })}
                  placeholder="https://example.com/favicon.png"
                  className="w-full bg-[#121214] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div className="relative border-2 border-dashed border-[#27272a] hover:border-[#ea580c] rounded-xl p-4 text-center transition-colors">
                <input
                  type="file"
                  accept="image/png, image/x-icon, image/vnd.microsoft.icon, image/svg+xml, image/jpeg"
                  onChange={e => handleFileUpload(e, 'faviconUrl')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 text-[#a1a1aa] mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-white block">
                  Click or drag to upload favicon (.ico / .png)
                </span>
                <span className="text-[10px] text-[#71717a]">
                  Square 32x32 or 64x64 icon recommended
                </span>
              </div>

              <div className="text-[10px] text-[#71717a]">
                🌐 Automatically injected into browser favicon header tag on update.
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: HEADER ANNOUNCEMENT TICKER                                     */}
        {/* ========================================================================= */}
        <div className="bg-[#121214] p-6 rounded-3xl border border-[#27272a] shadow-xs space-y-4">
          <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-[#27272a]">
            <Sparkles className="w-4 h-4 text-[#ea580c]" />
            <span>Top Header Announcement Ticker</span>
          </h3>

          <div>
            <label className="block font-bold text-white mb-1.5">
              Marquee Announcement Text
            </label>
            <input
              type="text"
              value={formData.announcementText || ''}
              onChange={e => setFormData({ ...formData, announcementText: e.target.value })}
              placeholder="✨ FREE EXPRESS DELIVERY IN KARACHI ON ORDERS OVER RS. 3,000 | SAME DAY DISPATCH AVAILABLE"
              className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c] font-medium"
            />
            <span className="text-[10px] text-[#71717a] mt-1 block">
              Plays in a smooth, continuous loop across the top of every screen.
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 5: CONTACT & SOCIAL MEDIA HANDLES                                 */}
        {/* ========================================================================= */}
        <div className="bg-[#121214] p-6 rounded-3xl border border-[#27272a] shadow-xs space-y-4">
          <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-[#27272a]">
            <Share2 className="w-4 h-4 text-[#ea580c]" />
            <span>Contact Points &amp; Social Links</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-white mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                value={formData.whatsapp || ''}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+92 300 1234567"
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-white mb-1">Karachi Landline</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 21 35870000"
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-white mb-1">Support Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="care@stitchandunstitched.com"
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-white mb-1">City Hub</label>
              <input
                type="text"
                value={formData.city || 'Karachi'}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block font-bold text-white mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.instagramUrl || ''}
                onChange={e => setFormData({ ...formData, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/stitchandunstitched"
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-white mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.facebookUrl || ''}
                onChange={e => setFormData({ ...formData, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/stitchandunstitched"
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-white mb-1">TikTok URL</label>
              <input
                type="text"
                value={formData.tiktokUrl || ''}
                onChange={e => setFormData({ ...formData, tiktokUrl: e.target.value })}
                placeholder="https://tiktok.com/@stitchandunstitched"
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-white mb-1">YouTube URL</label>
              <input
                type="text"
                value={formData.youtubeUrl || ''}
                onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })}
                placeholder="https://youtube.com/@stitchandunstitched"
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272a]">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save All Branding Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
