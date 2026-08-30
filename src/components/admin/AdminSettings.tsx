import React, { useState, useEffect } from 'react';
import { Settings, Save, Building2, Truck, Phone, Bell } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';

export const AdminSettings: React.FC = () => {
  const { settings, addToast } = useStore();

  const [formData, setFormData] = useState({
    storeName: 'STITCH & UNSTITCHED',
    email: 'care@stitchandunstitched.com',
    phone: '+92 21 35870000',
    whatsapp: '+92 300 1234567',
    address: 'Plot 24-C, Khayaban-e-Shahbaz, Phase 6, DHA',
    city: 'Karachi',
    shippingFee: 200,
    freeShippingThreshold: 3000,
    announcementText: '✨ FREE EXPRESS DELIVERY IN KARACHI ON ORDERS OVER RS. 3,000 | SAME DAY DISPATCH AVAILABLE',
    bankDetails: {
      bankName: 'Meezan Bank Limited',
      accountTitle: 'STITCH AND UNSTITCHED (PVT) LTD',
      accountNumber: '01020304050607',
      iban: 'PK45MEZN0001020304050607',
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings(formData);
      addToast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Karachi store parameters & rates updated successfully.',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not update settings.',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-cinzel text-2xl font-bold text-white">
          STORE CONFIGURATION &amp; RATES
        </h1>
        <p className="text-xs text-[#a1a1aa] mt-0.5">
          Manage Karachi delivery charges, free shipping thresholds, bank accounts, and contact points.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Karachi Shipping Rules */}
        <div className="bg-[#121214] p-6 rounded-3xl border border-[#27272a] shadow-xs space-y-4">
          <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-[#27272a]">
            <Truck className="w-4 h-4 text-[#ea580c]" />
            <span>Delivery &amp; Shipping Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white mb-1">Standard Delivery Fee (PKR)</label>
              <input
                type="number"
                value={formData.shippingFee}
                onChange={e => setFormData({ ...formData, shippingFee: Number(e.target.value) })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
              />
              <span className="text-[10px] text-[#71717a] mt-1 block">Default Karachi rider rate</span>
            </div>

            <div>
              <label className="block font-bold text-white mb-1">Free Shipping Order Minimum (PKR)</label>
              <input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={e => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
              />
              <span className="text-[10px] text-[#71717a] mt-1 block">Cart total required to waive delivery fee</span>
            </div>
          </div>
        </div>

        {/* Announcement Ticker */}
        <div className="bg-[#121214] p-6 rounded-3xl border border-[#27272a] shadow-xs space-y-4">
          <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-[#27272a]">
            <Bell className="w-4 h-4 text-[#ea580c]" />
            <span>Top Announcement Banner</span>
          </h3>

          <div>
            <label className="block font-bold text-white mb-1">Header Announcement Message</label>
            <input
              type="text"
              value={formData.announcementText}
              onChange={e => setFormData({ ...formData, announcementText: e.target.value })}
              className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl font-medium"
            />
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-[#121214] p-6 rounded-3xl border border-[#27272a] shadow-xs space-y-4">
          <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-[#27272a]">
            <Building2 className="w-4 h-4 text-[#ea580c]" />
            <span>Official Bank Details for Direct Bank Transfer</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankDetails.bankName}
                onChange={e =>
                  setFormData({
                    ...formData,
                    bankDetails: { ...formData.bankDetails, bankName: e.target.value },
                  })
                }
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-white mb-1">Account Title</label>
              <input
                type="text"
                value={formData.bankDetails.accountTitle}
                onChange={e =>
                  setFormData({
                    ...formData,
                    bankDetails: { ...formData.bankDetails, accountTitle: e.target.value },
                  })
                }
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-white mb-1">Account Number</label>
              <input
                type="text"
                value={formData.bankDetails.accountNumber}
                onChange={e =>
                  setFormData({
                    ...formData,
                    bankDetails: { ...formData.bankDetails, accountNumber: e.target.value },
                  })
                }
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-white mb-1">IBAN Number</label>
              <input
                type="text"
                value={formData.bankDetails.iban}
                onChange={e =>
                  setFormData({
                    ...formData,
                    bankDetails: { ...formData.bankDetails, iban: e.target.value },
                  })
                }
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[#121214] p-6 rounded-3xl border border-[#27272a] shadow-xs space-y-4">
          <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-[#27272a]">
            <Phone className="w-4 h-4 text-[#ea580c]" />
            <span>Karachi Concierge Contact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white mb-1">WhatsApp Concierge</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-white mb-1">Customer Support Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all active:scale-[0.99]"
          >
            <Save className="w-4 h-4" />
            <span>Save All Store Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
