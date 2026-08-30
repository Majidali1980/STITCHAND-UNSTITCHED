import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Scissors,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CMSPage } from '../../types';
import { api } from '../../services/api';

export const CMSPageView: React.FC = () => {
  const { viewParams, settings, addToast } = useStore();
  const slug = viewParams.slug || 'about-us';
  const [page, setPage] = useState<CMSPage | null>(null);
  const [loading, setLoading] = useState(true);

  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('Custom Stitching Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const data = await api.getCMSPage(slug);
        if (data) {
          setPage(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      addToast({
        type: 'error',
        title: 'Missing Fields',
        message: 'Please complete all required fields.',
      });
      return;
    }
    setContactSent(true);
    addToast({
      type: 'success',
      title: 'Message Dispatched',
      message: 'Our Karachi concierge will respond via WhatsApp / Email within 2 hours.',
    });
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactMessage('');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title Card */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#f0ece1] shadow-xs mb-8">
          <div className="text-xs uppercase font-bold tracking-widest text-[#ea580c] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STITCH &amp; UNSTITCHED ATELIER</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#1c1917]">
            {page?.title || slug.replace('-', ' ').toUpperCase()}
          </h1>

          {/* Contact Specific Layout */}
          {slug === 'contact-us' ? (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
              {/* Form */}
              <div className="space-y-4">
                <h3 className="font-cinzel text-base font-bold text-[#1c1917]">
                  Send a Message to Concierge
                </h3>
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div>
                    <label className="block font-bold text-[#292524] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      placeholder="e.g. Zainab Malik"
                      className="w-full bg-[#faf8f5] border border-[#d6cfc4] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#292524] mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={e => setContactEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full bg-[#faf8f5] border border-[#d6cfc4] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#292524] mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={e => setContactPhone(e.target.value)}
                        placeholder="+92 3XX XXXXXXX"
                        className="w-full bg-[#faf8f5] border border-[#d6cfc4] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#292524] mb-1">Inquiry Subject</label>
                    <select
                      value={contactSubject}
                      onChange={e => setContactSubject(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#d6cfc4] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                    >
                      <option value="Custom Stitching Inquiry">Custom Tailoring / Stitching Consultation</option>
                      <option value="Order Tracking">Order Tracking in Karachi</option>
                      <option value="Exchange Request">7-Day Exchange Request</option>
                      <option value="Wholesale">Corporate / Festive Bulk Orders</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#292524] mb-1">Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={e => setContactMessage(e.target.value)}
                      placeholder="How may our Karachi team assist your fashion requirements?"
                      className="w-full bg-[#faf8f5] border border-[#d6cfc4] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-3 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry</span>
                  </button>

                  {contactSent && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Thank you. Our Karachi stylist team will connect promptly.</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Direct Atelier Details */}
              <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#f0ece1] space-y-6">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-[#1c1917] mb-2">
                    Karachi Flagship Atelier
                  </h3>
                  <p className="text-[#78716c] leading-relaxed">
                    Visit our studio for fabric viewings, bridal consultations, and bespoke master tailoring appointments.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#1c1917]">Studio Address</h4>
                      <p className="text-[#78716c]">{settings?.address || 'Plot 24-C, Khayaban-e-Shahbaz, Phase 6, DHA'}</p>
                      <p className="text-[#78716c]">{settings?.city || 'Karachi, Sindh, Pakistan'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#1c1917]">Phone &amp; WhatsApp Concierge</h4>
                      <p className="text-[#78716c]">Landline: {settings?.phone || '+92 21 35870000'}</p>
                      <p className="text-[#ea580c] font-bold">WhatsApp: {settings?.whatsapp || '+92 300 1234567'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#1c1917]">Customer Care Email</h4>
                      <p className="text-[#78716c]">{settings?.email || 'care@stitchandunstitched.com'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#fff7ed] rounded-xl border border-[#fed7aa] text-[#9a3412]">
                  <strong>Karachi Delivery Hours:</strong> Orders received before 3:00 PM are dispatched for same/next day delivery across all Karachi zones.
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 prose prose-orange max-w-none text-xs sm:text-sm text-[#57534e] leading-relaxed whitespace-pre-line space-y-4">
              {page?.content ? (
                <div dangerouslySetInnerHTML={{ __html: page.content.replace(/\n/g, '<br/>') }} />
              ) : (
                <p>Loading page content...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
