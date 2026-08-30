import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Tag,
  Headphones,
  ExternalLink,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Smartphone,
  Send,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from './Logo';
import { api } from '../../services/api';

export const Footer: React.FC = () => {
  const { navigate, settings, footerConfig, addToast, toggleAdminMode } = useStore();
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !whatsapp) {
      addToast({
        type: 'error',
        title: 'Input Required',
        message: 'Please enter either your Email address or WhatsApp number to join our VIP club.',
      });
      return;
    }

    if (email && !email.includes('@')) {
      addToast({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please provide a valid email address.',
      });
      return;
    }

    setLoading(true);
    try {
      await api.subscribeNewsletter({
        email: email || undefined,
        whatsapp: whatsapp || undefined,
        name: email ? email.split('@')[0] : 'Karachi Shopper',
        source: 'Footer VIP Club',
      });

      setSubscribed(true);
      addToast({
        type: 'success',
        title: `Welcome to ${settings?.storeName || 'Stitch & Unstitched'} Privé`,
        message: 'Your details have been registered for seasonal previews, designer drops, and WhatsApp broadcasts.',
      });
      setEmail('');
      setWhatsapp('');
    } catch (err) {
      console.error('Newsletter error', err);
      addToast({
        type: 'error',
        title: 'Subscription Failed',
        message: 'Unable to subscribe right now. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper for trust badge icons
  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'truck':
        return <Truck className="w-5 h-5" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5" />;
      case 'rotate':
        return <RotateCcw className="w-5 h-5" />;
      case 'tag':
        return <Tag className="w-5 h-5" />;
      case 'phone':
        return <Phone className="w-5 h-5" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  // Default fallback data if footerConfig not yet populated
  const defaultBadges = [
    { id: 'tb-1', title: 'Karachi Express', subtitle: 'Priority 24–48h Dispatch', icon: 'truck', isActive: true },
    { id: 'tb-2', title: '100% Authentic Fabric', subtitle: 'Pure Pima Lawn & Silk', icon: 'shield', isActive: true },
    { id: 'tb-3', title: 'Custom Stitching', subtitle: 'Karachi Master Tailors', icon: 'sparkles', isActive: true },
    { id: 'tb-4', title: '7-Day Easy Exchange', subtitle: 'Hassle-free doorstep service', icon: 'rotate', isActive: true },
  ];

  const defaultSections = [
    {
      id: 'sec-shop',
      title: 'Shop',
      isActive: true,
      links: [
        { id: 'l-1', label: 'Stitched Collection', view: 'shop', params: { category: 'stitched' }, isActive: true },
        { id: 'l-2', label: 'Unstitched Fabrics', view: 'shop', params: { category: 'unstitched' }, isActive: true },
        { id: 'l-3', label: 'New Arrivals', view: 'shop', params: { isNew: true }, isActive: true },
        { id: 'l-4', label: 'Best Sellers', view: 'shop', params: { isBestSeller: true }, isActive: true },
        { id: 'l-5', label: 'Flash Sale & Offers', view: 'shop', params: { isSale: true }, highlight: true, isActive: true },
      ],
    },
    {
      id: 'sec-care',
      title: 'Customer Care',
      isActive: true,
      links: [
        { id: 'l-6', label: 'Contact Concierge', view: 'cms', params: { slug: 'contact-us' }, isActive: true },
        { id: 'l-7', label: 'Shipping & Dispatch', view: 'cms', params: { slug: 'shipping-policy' }, isActive: true },
        { id: 'l-8', label: 'Returns & Exchange', view: 'cms', params: { slug: 'return-policy' }, isActive: true },
        { id: 'l-9', label: 'Track Order', view: 'account', params: { tab: 'orders' }, isActive: true },
        { id: 'l-10', label: 'My Account', view: 'account', isActive: true },
      ],
    },
  ];

  const trustBadges = (footerConfig?.trustBadges && footerConfig.trustBadges.length > 0)
    ? footerConfig.trustBadges.filter(b => b.isActive !== false)
    : defaultBadges;

  const sections = (footerConfig?.sections && footerConfig.sections.length > 0)
    ? footerConfig.sections.filter(s => s.isActive !== false)
    : defaultSections;

  const bottomLinks = footerConfig?.bottomLinks || [
    { id: 'bl-1', label: 'Privacy Policy', view: 'cms', params: { slug: 'privacy-policy' }, isActive: true },
    { id: 'bl-2', label: 'Terms & Conditions', view: 'cms', params: { slug: 'terms-and-conditions' }, isActive: true },
  ];

  const handleLinkClick = (link: any) => {
    if (link.url) {
      if (link.openInNewTab) {
        window.open(link.url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = link.url;
      }
      return;
    }
    navigate((link.view || 'home') as any, link.params);
  };

  return (
    <footer className="bg-[#18181b] text-[#d4d4d8] border-t border-[#27272a] pt-16 pb-8">
      {/* Brand Trust Badges Strip */}
      {footerConfig?.showTrustBadges !== false && trustBadges.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-[#27272a]/80">
          <div className={`grid grid-cols-2 md:grid-cols-${Math.min(trustBadges.length, 4)} gap-6`}>
            {trustBadges.map(badge => (
              <div key={badge.id} className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#27272a] flex items-center justify-center text-[#ea580c] shrink-0">
                  {renderBadgeIcon(badge.icon)}
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">{badge.title}</h4>
                  <p className="text-[11px] text-[#a1a1aa]">{badge.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#27272a]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-sm">
              {footerConfig?.aboutText ||
                settings?.brandDescription ||
                "Karachi's premier fashion atelier offering bespoke stitched kurtis, pure Pima lawn, festive velvet ensembles, and contemporary Pakistani menswear."}
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#a1a1aa]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                <span>{settings?.address || 'Plot 24-C, Khayaban-e-Shahbaz, Phase 6, DHA, Karachi, Pakistan'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span>{settings?.phone || '+92 21 35870000'} | WhatsApp: {settings?.whatsapp || '+92 300 1234567'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span>{settings?.email || 'care@stitchandunstitched.com'}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Footer Sections / Link Columns */}
          {sections.map(section => (
            <div key={section.id}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">{section.title}</h4>
              <ul className="space-y-2.5 text-xs">
                {(section.links || [])
                  .filter(l => l.isActive !== false)
                  .map(link => (
                    <li key={link.id}>
                      <button
                        onClick={() => handleLinkClick(link)}
                        className={`transition-colors text-left flex items-center gap-1 ${
                          link.highlight
                            ? 'text-orange-400 hover:text-white font-semibold'
                            : 'hover:text-[#ea580c]'
                        }`}
                      >
                        <span>{link.label}</span>
                        {link.url && <ExternalLink className="w-3 h-3 text-[#71717a]" />}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          {footerConfig?.showNewsletter !== false && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-2">
                {footerConfig?.newsletterTitle || 'Join VIP Broadcasts'}
              </h4>
              <p className="text-xs text-[#a1a1aa] mb-4">
                {footerConfig?.newsletterSubtitle ||
                  'Receive seasonal lawn drops, Eid collections, and WhatsApp flash alerts.'}
              </p>

              <form onSubmit={handleSubscribe} className="space-y-2">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter email address..."
                    className="w-full bg-[#27272a] border border-[#3f3f46] text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#ea580c] placeholder:text-[#71717a]"
                  />
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="WhatsApp No (e.g. 03001234567)"
                    className="w-full bg-[#27272a] border border-[#3f3f46] text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#ea580c] pr-10 placeholder:text-[#71717a]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1 top-1 p-1.5 bg-[#ea580c] text-white rounded-md hover:bg-[#c2410c] transition-colors disabled:opacity-50"
                    aria-label="Subscribe"
                    title="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {subscribed && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Subscribed successfully!
                  </p>
                )}
              </form>

              {footerConfig?.showSocialLinks !== false && (
                <div className="pt-4">
                  <div className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2">
                    Connect With Us
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={settings?.instagramUrl || 'https://instagram.com'}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="w-8 h-8 rounded-full bg-[#27272a] hover:bg-[#ea580c] text-[#d4d4d8] hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs group"
                    >
                      <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </a>
                    <a
                      href={settings?.facebookUrl || 'https://facebook.com'}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      className="w-8 h-8 rounded-full bg-[#27272a] hover:bg-[#ea580c] text-[#d4d4d8] hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs group"
                    >
                      <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </a>
                    <a
                      href={settings?.youtubeUrl || 'https://youtube.com'}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="YouTube"
                      className="w-8 h-8 rounded-full bg-[#27272a] hover:bg-[#ea580c] text-[#d4d4d8] hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs group"
                    >
                      <Youtube className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </a>
                    <a
                      href={`https://wa.me/${(settings?.whatsapp || '+923001234567').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp"
                      className="w-8 h-8 rounded-full bg-[#27272a] hover:bg-emerald-600 text-[#d4d4d8] hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs group"
                    >
                      <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#71717a]">
          <div>
            {footerConfig?.copyrightText ||
              `© ${new Date().getFullYear()} ${settings?.storeName || 'STITCH & UNSTITCHED'}. All Rights Reserved. Crafted for Karachi & Pakistan.`}
          </div>

          <div className="flex items-center flex-wrap gap-4">
            {bottomLinks.filter(l => l.isActive !== false).map((bl, idx) => (
              <React.Fragment key={bl.id}>
                <button onClick={() => handleLinkClick(bl)} className="hover:text-white transition-colors">
                  {bl.label}
                </button>
                {idx < bottomLinks.length - 1 && <span>&bull;</span>}
              </React.Fragment>
            ))}
            <span>&bull;</span>
            <button
              onClick={() => toggleAdminMode(true)}
              className="hover:text-white text-[#a1a1aa] transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Admin</span>
            </button>
            <span>&bull;</span>
            <span className="text-[#a1a1aa] font-medium bg-[#27272a] px-2 py-0.5 rounded text-[11px]">
              Cash on Delivery (COD) &bull; Bank Transfer
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

