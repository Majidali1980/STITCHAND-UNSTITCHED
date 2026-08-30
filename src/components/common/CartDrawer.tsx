import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  Truck,
  CheckCircle2,
  Scissors,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    cartCount,
    subtotal,
    shippingFee,
    appliedCoupon,
    couponDiscount,
    total,
    freeShippingProgress,
    updateCartQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    navigate,
    formatPrice,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponCode.trim());
    setIsApplyingCoupon(false);
    setCouponCode('');
  };

  const handleProceedCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#f0ece1] flex items-center justify-between bg-[#faf8f5]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#ea580c]" />
              <h2 className="font-cinzel font-bold text-lg text-[#1c1917]">
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-[#78716c] hover:text-[#1c1917] hover:bg-[#ede8dc] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-4 py-3 bg-[#fff7ed] border-b border-[#fed7aa]">
            <div className="flex items-center justify-between text-xs font-semibold text-[#c2410c] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                {freeShippingProgress >= 100
                  ? 'You unlocked FREE delivery in Karachi & Nationwide!'
                  : `Add ${formatPrice(3000 - subtotal)} more for FREE Delivery`}
              </span>
              <span>{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-[#ffedd5] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#ea580c] h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 bg-[#f5f2eb] rounded-full flex items-center justify-center mx-auto text-[#a8a29e]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#292524]">
                  Your shopping bag is empty
                </h3>
                <p className="text-xs text-[#78716c] max-w-xs mx-auto">
                  Explore our luxury unstitched lawn, festive velvet, and ready-to-wear kurtis.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('shop');
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 bg-[#faf8f5] rounded-xl border border-[#f0ece1] hover:border-[#fed7aa] transition-colors relative group"
                >
                  {/* Image */}
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-lg shrink-0 border border-[#e5dfd3]"
                  />

                  {/* Item Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#1c1917] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#a8a29e] hover:text-red-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#78716c]">
                        <span className="bg-white px-1.5 py-0.5 rounded border border-[#e5dfd3] font-medium">
                          Size: {item.selectedSize}
                        </span>
                        <span className="bg-orange-50 text-[#c2410c] px-1.5 py-0.5 rounded border border-orange-200 font-medium flex items-center gap-1">
                          <Scissors className="w-2.5 h-2.5" />
                          {item.stitchChoice === 'stitched' ? 'Stitched (+Tailored)' : 'Unstitched Fabric'}
                        </span>
                      </div>

                      {item.selectedColor && (
                        <div className="text-[10px] text-[#78716c] mt-0.5">
                          Color: <span className="font-medium text-[#292524]">{item.selectedColor}</span>
                        </div>
                      )}
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#f0ece1]">
                      <div className="flex items-center border border-[#d6cfc4] rounded-md bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#f5f2eb] text-[#57534e]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#1c1917]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#f5f2eb] text-[#57534e]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#ea580c]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 bg-[#faf8f5] border-t border-[#f0ece1] space-y-3">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{appliedCoupon.code} Applied</span>
                    <span className="text-emerald-600 font-normal">(-{formatPrice(couponDiscount)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon (e.g. KARACHI10, WELCOME500)"
                    className="flex-1 bg-white border border-[#d6cfc4] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#ea580c]"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon}
                    className="bg-[#292524] hover:bg-[#18181b] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    {isApplyingCoupon ? '...' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#57534e]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1c1917]">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping (Karachi / Pakistan)</span>
                  <span className="font-semibold text-[#1c1917]">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1c1917] pt-2 border-t border-[#e5dfd3]">
                  <span>Estimated Total</span>
                  <span className="text-[#ea580c] font-cinzel text-base">{formatPrice(total)}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  id="drawer-checkout-btn"
                  onClick={handleProceedCheckout}
                  className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('cart');
                  }}
                  className="w-full bg-white hover:bg-[#f5f2eb] text-[#292524] border border-[#d6cfc4] py-2 px-4 rounded-xl text-xs font-semibold transition-colors text-center"
                >
                  View Full Cart &amp; Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
