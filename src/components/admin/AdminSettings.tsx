import React, { useState, useEffect } from 'react';
import { Settings, Save, Building2, Truck, Phone, Bell, MapPin, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';

export const AdminSettings: React.FC = () => {
  const { settings, refreshSettings, addToast } = useStore();

  const [newAreaInput, setNewAreaInput] = useState('');
  const [formData, setFormData] = useState({
    storeName: 'STITCH & UNSTITCHED',
    email: 'care@stitchandunstitched.com',
    phone: '+92 21 35870000',
    whatsapp: '+92 300 1234567',
    address: 'Plot 24-C, Khayaban-e-Shahbaz, Phase 6, DHA',
    city: 'Karachi',
    karachiShippingFee: 150,
    nationwideShippingFee: 250,
    freeShippingThreshold: 3000,
    customDeliveryAreas: [
      'DHA Phase 1 - 8 (All Sectors)',
      'Clifton Blocks 1 - 9 & Sea View',
      'Gulshan-e-Iqbal (Blocks 1 - 19)',
      'Gulistan-e-Johar (Blocks 1 - 20)',
      'PECHS Blocks 2, 3 & 6',
      'Bahria Town Karachi (All Precincts)',
      'North Nazimabad & Buffer Zone',
      'Federal B Area & Nazimabad',
      'KDA Scheme 1, Karsaz & Navy Housing',
      'Saddar, Cantt & Civil Lines',
      'Malir Cantt & Model Colony',
      'Karachi Admin Society & Baloch Colony',
      'Scheme 33 & Gulshan-e-Maymar',
    ],
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
      setFormData({
        storeName: settings.storeName || 'STITCH & UNSTITCHED',
        email: settings.email || 'care@stitchandunstitched.com',
        phone: settings.phone || '+92 21 35870000',
        whatsapp: settings.whatsapp || '+92 300 1234567',
        address: settings.address || 'Plot 24-C, Khayaban-e-Shahbaz, Phase 6, DHA',
        city: settings.city || 'Karachi',
        karachiShippingFee: settings.karachiShippingFee !== undefined 
          ? Number(settings.karachiShippingFee) 
          : (settings.shippingFee !== undefined 
              ? Number(settings.shippingFee) 
              : (settings.deliveryFee !== undefined ? Number(settings.deliveryFee) : 150)),
        nationwideShippingFee: settings.nationwideShippingFee !== undefined ? Number(settings.nationwideShippingFee) : 250,
        freeShippingThreshold: settings.freeShippingThreshold !== undefined ? Number(settings.freeShippingThreshold) : 3000,
        customDeliveryAreas: settings.customDeliveryAreas && settings.customDeliveryAreas.length > 0
          ? settings.customDeliveryAreas
          : [
              'DHA Phase 1 - 8 (All Sectors)',
              'Clifton Blocks 1 - 9 & Sea View',
              'Gulshan-e-Iqbal (Blocks 1 - 19)',
              'Gulistan-e-Johar (Blocks 1 - 20)',
              'PECHS Blocks 2, 3 & 6',
              'Bahria Town Karachi (All Precincts)',
              'North Nazimabad & Buffer Zone',
              'Federal B Area & Nazimabad',
              'KDA Scheme 1, Karsaz & Navy Housing',
              'Saddar, Cantt & Civil Lines',
              'Malir Cantt & Model Colony',
              'Karachi Admin Society & Baloch Colony',
              'Scheme 33 & Gulshan-e-Maymar',
            ],
        announcementText: settings.announcementText || '',
        bankDetails: {
          bankName: settings.bankDetails?.bankName || 'Meezan Bank Limited',
          accountTitle: settings.bankDetails?.accountTitle || 'STITCH AND UNSTITCHED (PVT) LTD',
          accountNumber: settings.bankDetails?.accountNumber || '01020304050607',
          iban: settings.bankDetails?.iban || 'PK45MEZN0001020304050607',
        },
      });
    }
  }, [settings]);

  const handleAddArea = () => {
    if (!newAreaInput.trim()) return;
    if (formData.customDeliveryAreas.includes(newAreaInput.trim())) return;
    setFormData({
      ...formData,
      customDeliveryAreas: [...formData.customDeliveryAreas, newAreaInput.trim()],
    });
    setNewAreaInput('');
  };

  const handleRemoveArea = (areaToRemove: string) => {
    setFormData({
      ...formData,
      customDeliveryAreas: formData.customDeliveryAreas.filter(a => a !== areaToRemove),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        karachiShippingFee: Number(formData.karachiShippingFee),
        nationwideShippingFee: Number(formData.nationwideShippingFee),
        shippingFee: Number(formData.karachiShippingFee),
        deliveryFee: Number(formData.karachiShippingFee),
        freeShippingThreshold: Number(formData.freeShippingThreshold),
        customDeliveryAreas: formData.customDeliveryAreas,
      };

      await api.updateSettings(payload);
      await refreshSettings();

      addToast({
        type: 'success',
        title: 'Settings Saved & Synchronized',
        message: `Delivery rates & custom delivery zones updated successfully.`,
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-white mb-1">Karachi Delivery Fee (PKR)</label>
              <input
                type="number"
                min="0"
                value={formData.karachiShippingFee}
                onChange={e => setFormData({ ...formData, karachiShippingFee: Number(e.target.value) })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
              <span className="text-[10px] text-[#71717a] mt-1 block">Default Karachi rider flat rate</span>
            </div>

            <div>
              <label className="block font-bold text-white mb-1">Nationwide Delivery Fee (PKR)</label>
              <input
                type="number"
                min="0"
                value={formData.nationwideShippingFee}
                onChange={e => setFormData({ ...formData, nationwideShippingFee: Number(e.target.value) })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
              <span className="text-[10px] text-[#71717a] mt-1 block">Other cities across Pakistan</span>
            </div>

            <div>
              <label className="block font-bold text-white mb-1">Free Shipping Order Minimum (PKR)</label>
              <input
                type="number"
                min="0"
                value={formData.freeShippingThreshold}
                onChange={e => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
              <span className="text-[10px] text-[#71717a] mt-1 block">Cart total to waive delivery fee</span>
            </div>
          </div>
        </div>

        {/* Custom Delivery Zones / Karachi Sectors Manager */}
        <div className="bg-[#121214] p-6 rounded-3xl border border-[#27272a] shadow-xs space-y-4">
          <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-[#27272a]">
            <MapPin className="w-4 h-4 text-[#ea580c]" />
            <span>Custom Delivery Areas &amp; Zones</span>
          </h3>

          <p className="text-[11px] text-[#a1a1aa]">
            Define predefined delivery sectors for the checkout dropdown. Customers can also enter any custom delivery location.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newAreaInput}
              onChange={e => setNewAreaInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddArea();
                }
              }}
              placeholder="e.g. DHA Phase 8 Zone D / Askari 4 / Scheme 33 Sector B..."
              className="flex-1 bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
            />
            <button
              type="button"
              onClick={handleAddArea}
              className="inline-flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2.5 rounded-xl font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Area</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {formData.customDeliveryAreas.map((area, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 bg-[#18181b] border border-[#27272a] text-[#d4d4d8] px-3 py-1.5 rounded-xl text-xs"
              >
                <span>{area}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveArea(area)}
                  className="text-[#71717a] hover:text-red-400 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
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
