import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Clock, CheckCircle2, ShoppingBag, Scissors, HelpCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customQuery, setCustomQuery] = useState('');

  const rawPhone = settings?.whatsapp || '+92 300 1234567';
  // Remove non-numeric characters for wa.me link
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  const quickPrompts = [
    {
      icon: Scissors,
      label: 'Custom Stitching & Sizing',
      text: 'Hello! I need guidance with custom stitching measurements and size selection for my order.',
    },
    {
      icon: ShoppingBag,
      label: 'Order Status & Karachi Delivery',
      text: 'Hi, I would like an update on my order delivery status in Karachi.',
    },
    {
      icon: Sparkles,
      label: 'Fabric & Lawn Inquiries',
      text: 'Salam, I would like more details regarding the fabric composition and festive collections.',
    },
    {
      icon: HelpCircle,
      label: 'General Assistance',
      text: 'Hello Stitch & Unstitched team, I would like assistance with an inquiry.',
    },
  ];

  const handleLaunchWhatsApp = (messageText: string) => {
    const finalMsg = encodeURIComponent(messageText.trim() || 'Hello Stitch & Unstitched Concierge, I would like assistance with your collection.');
    const url = `https://wa.me/${cleanPhone}?text=${finalMsg}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    handleLaunchWhatsApp(customQuery);
    setCustomQuery('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Expanded Quick Chat Concierge Card */}
      {isOpen && (
        <div
          id="whatsapp-chat-popup"
          className="mb-3 w-[calc(100vw-2.5rem)] sm:w-88 max-w-sm bg-[#121214] text-white rounded-3xl shadow-2xl border border-[#27272a] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-[#18181b] p-4 border-b border-[#27272a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#18181b]" />
              </div>
              <div>
                <h4 className="font-cinzel text-xs font-bold text-white tracking-wider flex items-center gap-1.5">
                  <span>KARACHI CONCIERGE</span>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] px-1.5 py-0.2 rounded font-sans font-bold uppercase">
                    Online
                  </span>
                </h4>
                <p className="text-[11px] text-[#a1a1aa] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#ea580c]" />
                  <span>Typically replies in ~5 mins</span>
                </p>
              </div>
            </div>

            <button
              id="whatsapp-close-btn"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#a1a1aa] hover:text-white rounded-lg hover:bg-[#27272a] transition-colors"
              aria-label="Close WhatsApp chat popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3.5 max-h-[60vh] overflow-y-auto">
            <div className="bg-[#18181b] p-3 rounded-2xl border border-[#27272a] text-xs text-[#d4d4d8] leading-relaxed">
              <p className="font-semibold text-white mb-1">
                Salam &amp; Welcome to Stitch &amp; Unstitched! 👋
              </p>
              <p className="text-[11px] text-[#a1a1aa]">
                How can our Karachi atelier stylists assist you today? Select a topic below or type your inquiry.
              </p>
            </div>

            {/* Quick Topic Buttons */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#71717a] px-1">
                Frequently Asked Topics
              </p>
              {quickPrompts.map((prompt, idx) => {
                const IconComponent = prompt.icon;
                return (
                  <button
                    key={idx}
                    id={`whatsapp-prompt-${idx}`}
                    onClick={() => {
                      handleLaunchWhatsApp(prompt.text);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] hover:border-[#3f3f46] text-left text-xs text-white transition-all group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#27272a] group-hover:bg-[#ea580c] text-[#ea580c] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 font-medium text-[11px] group-hover:text-[#fed7aa] transition-colors">
                      {prompt.label}
                    </span>
                    <Send className="w-3 h-3 text-[#71717a] group-hover:text-white transition-colors" />
                  </button>
                );
              })}
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleSubmit} className="pt-2 border-t border-[#27272a] space-y-2">
              <div className="relative">
                <input
                  id="whatsapp-custom-input"
                  type="text"
                  value={customQuery}
                  onChange={e => setCustomQuery(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full bg-[#18181b] border border-[#27272a] focus:border-[#ea580c] text-white rounded-xl py-2.5 pl-3 pr-10 text-xs focus:outline-hidden"
                />
                <button
                  id="whatsapp-send-btn"
                  type="submit"
                  disabled={!customQuery.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-30 text-white rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Send message to WhatsApp"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#71717a] px-1">
                <span>Official Line: {rawPhone}</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Verified Support
                </span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Primary Floating Action Button */}
      <button
        id="whatsapp-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-emerald-400/30"
        aria-label="Chat with customer support on WhatsApp"
      >
        {/* Pulsing indicator ring */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-[#121214]" />
        </span>

        <div className="w-6 h-6 flex items-center justify-center shrink-0">
          <MessageCircle className="w-6 h-6 text-white transition-transform group-hover:rotate-6" />
        </div>

        <span className="hidden sm:inline-block font-bold text-xs tracking-wider uppercase pr-1">
          Chat With Us
        </span>
      </button>
    </div>
  );
};
