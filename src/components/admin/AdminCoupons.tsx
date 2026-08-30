import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import { Coupon } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

export const AdminCoupons: React.FC = () => {
  const { formatPrice, addToast } = useStore();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(2500);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await api.getCoupons();
      if (Array.isArray(data)) {
        setCoupons(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCoupon({
        code: code.toUpperCase(),
        discountType: type,
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue),
        isActive: true,
        expiryDate: '2026-12-31',
        usageLimit: 500,
        usageCount: 0,
      });

      addToast({
        type: 'success',
        title: 'Coupon Created',
        message: `Voucher ${code.toUpperCase()} is now live.`,
      });

      setIsModalOpen(false);
      setCode('');
      loadCoupons();
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not create coupon.',
      });
    }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!window.confirm(`Delete coupon ${couponCode}?`)) return;
    try {
      await api.deleteCoupon(id);
      addToast({
        type: 'info',
        title: 'Coupon Removed',
        message: `${couponCode} has been deactivated.`,
      });
      loadCoupons();
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not delete coupon.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white">
            PROMOTIONAL COUPONS &amp; VOUCHERS
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Configure discount codes for Karachi Eid festivals, first-order promotions, and seasonal perks.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(coupon => (
          <div
            key={coupon.id}
            className="bg-[#121214] p-5 rounded-2xl border border-[#27272a] shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#ea580c]" />
                <span className="font-cinzel text-base font-bold text-white tracking-widest">
                  {coupon.code}
                </span>
              </div>
              <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800 uppercase">
                Active
              </span>
            </div>

            <div className="space-y-1 text-xs text-[#a1a1aa]">
              <div className="text-sm font-bold text-[#fed7aa]">
                {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `Rs. ${coupon.discountValue} FLAT OFF`}
              </div>
              <div>Min Order: <strong>{formatPrice(coupon.minOrderValue)}</strong></div>
              <div>Valid Until: {coupon.expiryDate}</div>
              <div>Usage: {coupon.usageCount} redemption{coupon.usageCount === 1 ? '' : 's'}</div>
            </div>

            <div className="pt-2 border-t border-[#27272a] flex justify-end">
              <button
                onClick={() => handleDelete(coupon.id, coupon.code)}
                className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#121214] border border-[#27272a] rounded-3xl p-6 max-w-md w-full shadow-2xl z-10 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a] mb-4">
              <h3 className="font-cinzel text-lg font-bold text-white">Create Promo Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#a1a1aa] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block font-bold text-white mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. KARACHI20"
                  className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-white mb-1">Discount Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (PKR)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-white mb-1">Discount Value *</label>
                <input
                  type="number"
                  required
                  value={discountValue}
                  onChange={e => setDiscountValue(Number(e.target.value))}
                  className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-white mb-1">Minimum Order Value (PKR)</label>
                <input
                  type="number"
                  value={minOrderValue}
                  onChange={e => setMinOrderValue(Number(e.target.value))}
                  className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-[#27272a] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-5 py-2 rounded-xl"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
