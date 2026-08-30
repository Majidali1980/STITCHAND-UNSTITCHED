import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Tag,
  Scissors,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartCount,
    subtotal,
    shippingFee,
    appliedCoupon,
    couponDiscount,
    total,
    freeShippingThreshold,
    freeShippingProgress,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    navigate,
    formatPrice,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    await applyCoupon(couponCode.trim());
    setApplying(false);
    setCouponCode('');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#faf8f5] flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-[#f0ece1] shadow-sm space-y-4">
          <div className="w-16 h-16 bg-[#fff7ed] text-[#ea580c] rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-[#1c1917]">
            Your Shopping Bag is Empty
          </h2>
          <p className="text-xs text-[#78716c] leading-relaxed">
            Looks like you haven&apos;t added any Pakistani luxury lawn, ready-to-wear kurtis, or unstitched fabrics to your cart yet.
          </p>
          <button
            onClick={() => navigate('shop')}
            className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-widest shadow-md transition-all active:scale-[0.99]"
          >
            Explore Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#f0ece1]">
          <div>
            <h1 className="font-cinzel text-3xl font-bold text-[#1c1917]">
              SHOPPING BAG ({cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'})
            </h1>
            <p className="text-xs text-[#78716c] mt-0.5">
              Review your selected stitched and unstitched outfits before checkout.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-[#78716c] hover:text-red-600 transition-colors"
          >
            Clear Entire Bag
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-[#fff7ed] p-4 rounded-2xl border border-[#fed7aa] mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-[#c2410c] mb-2">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              {freeShippingProgress >= 100
                ? 'Unlocked: FREE Priority Delivery across Karachi & Pakistan!'
                : `Add ${formatPrice(freeShippingThreshold - subtotal)} more for FREE shipping.`}
            </span>
            <span>{freeShippingProgress}%</span>
          </div>
          <div className="w-full bg-[#ffedd5] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#ea580c] h-full transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Table List: 8 Cols */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-[#f0ece1] shadow-xs divide-y divide-[#f0ece1] overflow-hidden">
              {cart.map(item => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  {/* Image */}
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    className="w-24 h-32 object-cover rounded-2xl border border-[#e5dfd3] shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">
                      {item.product.category} &bull; {item.product.fabric}
                    </span>
                    <h3 className="font-bold text-sm text-[#1c1917] leading-snug">
                      {item.product.name}
                    </h3>
                    <p className="text-[11px] text-[#78716c]">
                      SKU: {item.product.sku}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="bg-[#faf8f5] px-2 py-0.5 rounded text-[11px] font-semibold text-[#44403c] border border-[#e5dfd3]">
                        Size: {item.selectedSize}
                      </span>
                      <span className="bg-orange-50 text-[#c2410c] px-2 py-0.5 rounded text-[11px] font-semibold border border-orange-200 flex items-center gap-1">
                        <Scissors className="w-3 h-3" />
                        {item.stitchChoice === 'stitched' ? 'Stitched & Tailored' : 'Unstitched Fabric'}
                      </span>
                      {item.selectedColor && (
                        <span className="bg-[#faf8f5] px-2 py-0.5 rounded text-[11px] text-[#44403c] border border-[#e5dfd3]">
                          Color: {item.selectedColor}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Qty & Subtotal */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0ece1]">
                    <div className="flex items-center border border-[#d6cfc4] rounded-xl bg-[#faf8f5] p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-[#57534e] hover:text-black"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#1c1917]">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-[#57534e] hover:text-black"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-cinzel text-base font-bold text-[#ea580c]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <span className="text-[10px] text-[#a8a29e] block">
                        ({formatPrice(item.price)} each)
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#a8a29e] hover:text-red-600 transition-colors p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-[#78716c] pt-2">
              <button
                onClick={() => navigate('shop')}
                className="text-[#ea580c] font-bold hover:underline"
              >
                &larr; Continue Shopping
              </button>
              <span>Prices in Pakistani Rupees (PKR)</span>
            </div>
          </div>

          {/* Summary Column: 4 Cols */}
          <div className="lg:col-span-4 space-y-6">
            {/* Order Summary Box */}
            <div className="bg-white p-6 rounded-3xl border border-[#f0ece1] shadow-xs space-y-4">
              <h2 className="font-cinzel text-lg font-bold text-[#1c1917] pb-3 border-b border-[#f0ece1]">
                ORDER SUMMARY
              </h2>

              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Coupon {appliedCoupon.code}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon (e.g. KARACHI10)"
                    className="flex-1 bg-[#faf8f5] border border-[#d6cfc4] text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                  <button
                    type="submit"
                    disabled={applying}
                    className="bg-[#292524] hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    {applying ? '...' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs text-[#57534e] pt-2">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-[#1c1917]">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery (Karachi / Pakistan)</span>
                  <span className="font-bold text-[#1c1917]">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1c1917] pt-3 border-t border-[#f0ece1]">
                  <span>Total Amount</span>
                  <span className="font-cinzel text-xl text-[#ea580c]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="cart-checkout-btn"
                onClick={() => navigate('checkout')}
                className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 transition-all active:scale-[0.99]"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-[11px] text-[#78716c] text-center space-y-1">
                <p>Cash on Delivery &bull; Bank Transfer &bull; Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
