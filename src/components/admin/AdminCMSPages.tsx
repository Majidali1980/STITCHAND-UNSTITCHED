import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  MessageSquare,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { AboutUsConfig, ContactUsConfig, ContactInquiry } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

export const AdminCMSPages: React.FC = () => {
  const { addToast } = useStore();
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'inquiries'>('about');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // About Us CMS State
  const [aboutConfig, setAboutConfig] = useState<AboutUsConfig>({
    title: 'THE ATELIER HERITAGE',
    subtitle: 'Karachi Couture • Craftsmanship • Timeless Silhouettes',
    heroImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1600',
    historyTitle: 'Born in the Heart of Karachi',
    historyStory: 'Founded in 2026, Stitch & Unstitched redefines contemporary Pakistani couture through pristine artisanal craftsmanship, pure Pima lawns, and hand-embroidered tilla threads. Each silhouette honors timeless Eastern heritage while catering to modern aesthetics.',
    craftsmanshipStory: 'Our master karigars in Karachi weave intricate zari, resham, and mirror work with surgical precision, ensuring unmatched luxury for unstitched connoisseurs and pret aficionados.',
    stats: [
      { label: 'Karachi Atelier Est.', value: '2026' },
      { label: 'Master Karigars', value: '45+' },
      { label: 'Bespoke Ensembles Delivered', value: '12,000+' },
      { label: 'Customer Satisfaction', value: '99.4%' },
    ],
    values: [
      { title: 'Pure Pima Fabric', description: '100% genuine Pakistani lawn and raw silk with zero synthetic blends.' },
      { title: 'Artisanal Karigari', description: 'Hand-finished hems, intricate organza inserts, and tilla embroidery.' },
      { title: 'Karachi Express Dispatch', description: 'Same-day and 24-hour express courier delivery across all Karachi sectors.' },
    ],
    seoTitle: 'About Us | Stitch & Unstitched Karachi Couture Atelier',
    seoDescription: 'Discover the heritage, craftsmanship, and story behind Stitch & Unstitched - Karachi premier luxury lawn and stitched pret fashion atelier.',
  });

  // Contact Us CMS State
  const [contactConfig, setContactConfig] = useState<ContactUsConfig>({
    title: 'CONTACT OUR KARACHI ATELIER',
    subtitle: 'We are here to assist with custom sizing, orders, and bespoke inquiries.',
    phone: '+92 21 35870000',
    whatsapp: '+92 300 1234567',
    email: 'care@stitchandunstitched.com',
    address: 'Plot 24-C, Khayaban-e-Shahbaz, Phase 6, DHA, Karachi, Pakistan',
    workingHours: 'Monday - Saturday: 11:00 AM - 10:00 PM PST',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14486.299119102434!2d67.0543!3d24.8021!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33cf134c0e64f%3A0xb3515099238c9!2sDHA%20Karachi!5e0!3m2!1sen!2s!4v1700000000000',
    seoTitle: 'Contact Us | Stitch & Unstitched Karachi Customer Concierge',
    seoDescription: 'Reach Stitch & Unstitched concierge for WhatsApp support, boutique visits in DHA Karachi, custom measurement assistance, and order status.',
  });

  // Contact Inquiries State
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [about, contact, inq] = await Promise.all([
        api.getAboutUsConfig(),
        api.getContactUsConfig(),
        api.getContactInquiries(),
      ]);
      if (about && about.title) setAboutConfig(about);
      if (contact && contact.title) setContactConfig(contact);
      if (Array.isArray(inq)) setInquiries(inq);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateAboutUsConfig(aboutConfig);
      addToast({
        type: 'success',
        title: 'About Us Saved',
        message: 'About Us page content and SEO metadata updated live.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not update About Us content.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateContactUsConfig(contactConfig);
      addToast({
        type: 'success',
        title: 'Contact Us Saved',
        message: 'Contact Us page content, WhatsApp concierge, and address updated live.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not update Contact Us content.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: 'new' | 'in_progress' | 'resolved') => {
    try {
      await api.updateContactInquiryStatus(id, status);
      setInquiries(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));
      addToast({
        type: 'success',
        title: 'Inquiry Updated',
        message: `Inquiry status changed to ${status.replace('_', ' ').toUpperCase()}`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update inquiry.',
      });
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await api.deleteContactInquiry(id);
      setInquiries(prev => prev.filter(i => i.id !== id));
      addToast({
        type: 'info',
        title: 'Inquiry Deleted',
        message: 'Inquiry record removed.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Could not delete inquiry.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#ea580c]" />
            STOREFRONT CMS &amp; INQUIRIES
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Manage dynamic About Us, Contact Us pages, and customer inquiries inbox.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#27272a] pb-3">
        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'about'
              ? 'bg-[#ea580c] text-white shadow-md'
              : 'bg-[#18181b] text-[#a1a1aa] hover:bg-[#27272a] border border-[#27272a]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>About Us Page CMS</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'contact'
              ? 'bg-[#ea580c] text-white shadow-md'
              : 'bg-[#18181b] text-[#a1a1aa] hover:bg-[#27272a] border border-[#27272a]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Contact Us Page CMS</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'inquiries'
              ? 'bg-[#ea580c] text-white shadow-md'
              : 'bg-[#18181b] text-[#a1a1aa] hover:bg-[#27272a] border border-[#27272a]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Customer Inquiries Inbox</span>
          {inquiries.filter(i => i.status === 'new').length > 0 && (
            <span className="bg-amber-500 text-black text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              {inquiries.filter(i => i.status === 'new').length}
            </span>
          )}
        </button>
      </div>

      {/* About Us Form */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="bg-[#121214] p-6 rounded-2xl border border-[#27272a] space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <h3 className="font-cinzel text-sm font-bold text-white">ABOUT US CONTENT &amp; STORY</h3>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-xl font-bold uppercase transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Page Main Title</label>
              <input
                type="text"
                value={aboutConfig.title}
                onChange={e => setAboutConfig({ ...aboutConfig, title: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Subtitle / Slogan</label>
              <input
                type="text"
                value={aboutConfig.subtitle}
                onChange={e => setAboutConfig({ ...aboutConfig, subtitle: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">
              Hero Banner Image URL
              <span className="text-[10px] text-[#fed7aa] ml-2 font-normal">
                (Required Dimensions: 1600 x 600 px Landscape)
              </span>
            </label>
            <input
              type="text"
              value={aboutConfig.heroImage}
              onChange={e => setAboutConfig({ ...aboutConfig, heroImage: e.target.value })}
              className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Our Heritage &amp; Story</label>
            <textarea
              rows={4}
              value={aboutConfig.historyStory}
              onChange={e => setAboutConfig({ ...aboutConfig, historyStory: e.target.value })}
              className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Artisanal Craftsmanship &amp; Karigari</label>
            <textarea
              rows={3}
              value={aboutConfig.craftsmanshipStory}
              onChange={e => setAboutConfig({ ...aboutConfig, craftsmanshipStory: e.target.value })}
              className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#27272a]">
            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">SEO Meta Title</label>
              <input
                type="text"
                value={aboutConfig.seoTitle || ''}
                onChange={e => setAboutConfig({ ...aboutConfig, seoTitle: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">SEO Meta Description</label>
              <input
                type="text"
                value={aboutConfig.seoDescription || ''}
                onChange={e => setAboutConfig({ ...aboutConfig, seoDescription: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
            </div>
          </div>
        </form>
      )}

      {/* Contact Us Form */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveContact} className="bg-[#121214] p-6 rounded-2xl border border-[#27272a] space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <h3 className="font-cinzel text-sm font-bold text-white">CONTACT US &amp; CONCIERGE SETTINGS</h3>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-xl font-bold uppercase transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Page Title</label>
              <input
                type="text"
                value={contactConfig.title}
                onChange={e => setContactConfig({ ...contactConfig, title: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Subtitle</label>
              <input
                type="text"
                value={contactConfig.subtitle}
                onChange={e => setContactConfig({ ...contactConfig, subtitle: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Phone Number</label>
              <input
                type="text"
                value={contactConfig.phone}
                onChange={e => setContactConfig({ ...contactConfig, phone: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">WhatsApp Concierge</label>
              <input
                type="text"
                value={contactConfig.whatsapp}
                onChange={e => setContactConfig({ ...contactConfig, whatsapp: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Email Address</label>
              <input
                type="email"
                value={contactConfig.email}
                onChange={e => setContactConfig({ ...contactConfig, email: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Karachi Boutique Address</label>
            <input
              type="text"
              value={contactConfig.address}
              onChange={e => setContactConfig({ ...contactConfig, address: e.target.value })}
              className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Opening / Working Hours</label>
            <input
              type="text"
              value={contactConfig.workingHours}
              onChange={e => setContactConfig({ ...contactConfig, workingHours: e.target.value })}
              className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">Google Maps Embed URL</label>
            <input
              type="text"
              value={contactConfig.mapEmbedUrl || ''}
              onChange={e => setContactConfig({ ...contactConfig, mapEmbedUrl: e.target.value })}
              className="w-full bg-[#18181b] border border-[#27272a] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
            />
          </div>
        </form>
      )}

      {/* Inquiries Inbox */}
      {activeTab === 'inquiries' && (
        <div className="bg-[#121214] rounded-2xl border border-[#27272a] overflow-hidden">
          <div className="p-4 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between">
            <h3 className="font-cinzel text-sm font-bold text-white">CUSTOMER MESSAGES &amp; INQUIRIES</h3>
            <span className="text-xs text-[#a1a1aa]">{inquiries.length} total inquiries</span>
          </div>

          {inquiries.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#71717a]">
              No customer inquiries received yet.
            </div>
          ) : (
            <div className="divide-y divide-[#27272a]">
              {inquiries.map(inq => (
                <div key={inq.id} className="p-4 sm:p-5 hover:bg-[#18181b]/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{inq.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            inq.status === 'new'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : inq.status === 'in_progress'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}
                        >
                          {inq.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs text-[#fed7aa] font-semibold">{inq.subject}</p>
                      <p className="text-xs text-[#d4d4d8] leading-relaxed">{inq.message}</p>

                      <div className="flex items-center gap-3 text-[11px] text-[#a1a1aa] pt-1">
                        <span>📧 {inq.email}</span>
                        {inq.phone && <span>📞 {inq.phone}</span>}
                        <span>🕒 {new Date(inq.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {inq.phone && (
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum ${inq.name}! Stitch & Unstitched Karachi here regarding your inquiry "${inq.subject}".`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          <span>WhatsApp</span>
                        </a>
                      )}

                      <select
                        value={inq.status}
                        onChange={e => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                        className="bg-[#18181b] border border-[#27272a] text-xs text-white px-2 py-1.5 rounded-lg focus:outline-none"
                      >
                        <option value="new">Mark New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>

                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-1.5 text-[#71717a] hover:text-red-400 hover:bg-[#27272a] rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
