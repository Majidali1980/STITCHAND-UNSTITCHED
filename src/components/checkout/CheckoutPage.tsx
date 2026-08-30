import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Scissors,
  CreditCard,
  Building2,
  Receipt,
  Phone,
  MapPin,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';

const DEFAULT_AREAS = [
  'DHA Phase 1',
  'DHA Phase 2',
  'DHA Phase 4',
  'DHA Phase 5 & Extension',
  'DHA Phase 6',
  'DHA Phase 7',
  'DHA Phase 8 (Creek Vistas / Zone)',
  'Clifton Block 1-9',
  'Clifton Sea View',
  'Gulshan-e-Iqbal (Blocks 1-19)',
  'Gulistan-e-Johar (Blocks 1-20)',
  'PECHS Block 2, 3, 6',
  'Bahria Town Karachi',
  'North Nazimabad',
  'Nazimabad & Federal B Area',
  'KDA Scheme 1 / Karsaz',
  'Saddar / Saddar Cantt',
  'Malir Cantt & Model Colony',
  'Karachi Administration Society',
  'Scheme 33 & Gulshan-e-Maymar',
  'Other / Custom Delivery Area',
];

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    subtotal,
    appliedCoupon,
    couponDiscount,
    clearCart,
    customer,
    settings,
    calculateShippingFee,
    navigate,
    formatPrice,
    addToast,
  } = useStore();

  const areaList = settings?.customDeliveryAreas && settings.customDeliveryAreas.length > 0 
    ? settings.customDeliveryAreas 
    : DEFAULT_AREAS;

  const [fullName, setFullName] = useState(customer?.name || 'Ayesha Siddiqui');
  const [email, setEmail] = useState(customer?.email || 'ayesha.siddiqui@gmail.com');
  const [phone, setPhone] = useState(customer?.phone || '+92 321 8472910');
  const [address, setAddress] = useState('Apartment 4B, Creek Vistas, Phase 8');
  const [selectedArea, setSelectedArea] = useState('DHA Phase 8 (Creek Vistas / Zone)');
  const [customAreaText, setCustomAreaText] = useState('');
  const [isCustomArea, setIsCustomArea] = useState(false);
  const [city, setCity] = useState('Karachi');
  const [landmark, setLandmark] = useState('Near Creek Club');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [orderNotes, setOrderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const effectiveDeliveryArea = isCustomArea && customAreaText.trim() 
    ? customAreaText.trim() 
    : (selectedArea === 'Other / Custom Delivery Area' && customAreaText.trim() ? customAreaText.trim() : selectedArea);

  const isKarachi = (city || '').trim().toLowerCase().includes('karachi');
  const freeShippingThreshold = settings?.freeShippingThreshold !== undefined ? Number(settings.freeShippingThreshold) : 3000;
  const isFreeShipping = subtotal >= freeShippingThreshold;

  const dynamicShippingFee = calculateShippingFee 
    ? calculateShippingFee(subtotal, city) 
    : (isFreeShipping || subtotal === 0 
        ? 0 
        : (isKarachi 
            ? (settings?.karachiShippingFee !== undefined ? Number(settings.karachiShippingFee) : (settings?.shippingFee !== undefined ? Number(settings.shippingFee) : (settings?.deliveryFee !== undefined ? Number(settings.deliveryFee) : 150)))
            : (settings?.nationwideShippingFee !== undefined ? Number(settings.nationwideShippingFee) : 250)
          )
      );

  const dynamicTotal = Math.max(0, subtotal - couponDiscount + dynamicShippingFee);

  if (cart.length === 0) {
    navigate('shop');
    return null;
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !address || !city) {
      addToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please provide full name, phone number, and complete delivery address.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: {
          fullName,
          phone,
          address,
          area: effectiveDeliveryArea || 'Karachi Central',
          city,
          province: isKarachi ? 'Sindh' : 'Pakistan',
          postalCode: '75500',
          landmark,
        },
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.product.name,
          productSku: item.product.sku,
          productImage: item.product.images[0]?.url,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          stitchChoice: item.stitchChoice,
          customMeasurements: item.customMeasurements,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        subtotal,
        discount: couponDiscount,
        shippingFee: dynamicShippingFee,
        total: dynamicTotal,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Direct Bank Transfer',
        paymentStatus: 'pending',
        couponCode: appliedCoupon?.code,
        notes: orderNotes,
      };

      const createdOrder = await api.createOrder(orderPayload);

      clearCart();
      addToast({
        type: 'success',
        title: 'Order Placed Successfully!',
        message: `Order #${createdOrder.orderNumber} has been received. Karachi rider will dispatch shortly.`,
      });

      navigate('order-confirmation', { order: createdOrder });
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'Order Placement Error',
        message: 'Could not process order. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Checkout Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#fff7ed] text-[#c2410c] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#fed7aa]">
            <Lock className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Encrypted &amp; Secure Karachi Checkout</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#1c1917]">
            CHECKOUT &amp; SHIPPING
          </h1>
          <p className="text-xs text-[#78716c]">
            Complete your order details below. Cash on Delivery is available across Karachi and Pakistan.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: 7 Columns */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact Details */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f0ece1] shadow-xs space-y-4">
              <h2 className="font-cinzel text-lg font-bold text-[#1c1917] pb-3 border-b border-[#f0ece1] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#ea580c]" />
                <span>1. Contact &amp; Recipient Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#292524] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Ayesha Siddiqui"
                    className="w-full bg-[#faf8f5] border border-[#d6cfc4] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c] font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#292524] mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+92 3XX XXXXXXX"
                    className="w-full bg-[#faf8f5] border border-[#d6cfc4] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c] font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#292524] mb-1">Email Address (for Receipt &amp; Tracking)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-[#faf8f5] border border-[#d6cfc4] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c] font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f0ece1] shadow-xs space-y-4">
              <h2 className="font-cinzel text-lg font-bold text-[#1c1917] pb-3 border-b border-[#f0ece1] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ea580c]" />
                <span>2. Delivery Address</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#292524] mb-1">Street Address, House / Flat &amp; Building *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="e.g. House 42-B, Street 14, Phase 6"
                    className="w-full bg-[#faf8f5] border border-[#d6cfc4] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-[#292524]">
                        {isKarachi ? 'Karachi Area / Sector *' : 'Delivery Area / Zone *'}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomArea(!isCustomArea);
                          if (!isCustomArea && !customAreaText) {
                            setCustomAreaText(selectedArea !== 'Other / Custom Delivery Area' ? selectedArea : '');
                          }
                        }}
                        className="text-[11px] text-[#ea580c] hover:underline font-semibold"
                      >
                        {isCustomArea ? 'Select from List' : '+ Type Custom Area'}
                      </button>
                    </div>

                    {!isCustomArea && selectedArea !== 'Other / Custom Delivery Area' ? (
                      <select
                        value={selectedArea}
                        onChange={e => {
                          setSelectedArea(e.target.value);
                          if (e.target.value === 'Other / Custom Delivery Area') {
                            setIsCustomArea(true);
                          }
                        }}
                        className="w-full bg-[#faf8f5] border border-[#d6cfc4] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c] font-semibold text-[#292524]"
                      >
                        {areaList.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="space-y-1">
                        <input
                          type="text"
                          required
                          value={customAreaText}
                          onChange={e => setCustomAreaText(e.target.value)}
                          placeholder="e.g. DHA Phase 6 Block 5, Scheme 33, Sector 11-A..."
                          className="w-full bg-[#faf8f5] border border-[#ea580c] px-3.5 py-2.5 rounded-xl focus:outline-none font-semibold text-[#292524]"
                        />
                        <span className="text-[10px] text-[#78716c] block">
                          Custom area entered for precision doorstep courier dispatch.
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-[#292524] mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#d6cfc4] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#292524] mb-1">Nearby Landmark (Optional)</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={e => setLandmark(e.target.value)}
                    placeholder="e.g. Near Saba Avenue, Opposite Imtiaz"
                    className="w-full bg-[#faf8f5] border border-[#d6cfc4] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#292524] mb-1">Special Delivery / Tailoring Instructions</label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={e => setOrderNotes(e.target.value)}
                    placeholder="Leave gate code, call before arrival, or stitching instructions..."
                    className="w-full bg-[#faf8f5] border border-[#d6cfc4] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f0ece1] shadow-xs space-y-4">
              <h2 className="font-cinzel text-lg font-bold text-[#1c1917] pb-3 border-b border-[#f0ece1] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#ea580c]" />
                <span>3. Payment Method</span>
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#ea580c] bg-[#fff7ed] shadow-xs'
                      : 'border-[#d6cfc4] hover:bg-[#faf8f5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-[#ea580c]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#1c1917]">
                        Cash on Delivery (COD)
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Most Popular in Karachi
                      </span>
                    </div>
                    <p className="text-[11px] text-[#78716c] mt-0.5">
                      Pay cash to the courier rider upon package inspection at your doorstep.
                    </p>
                  </div>
                </label>

                {/* Bank Transfer */}
                <label
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#ea580c] bg-[#fff7ed] shadow-xs'
                      : 'border-[#d6cfc4] hover:bg-[#faf8f5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-1 accent-[#ea580c]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#1c1917]">
                        Direct Bank Transfer / IBFT
                      </span>
                      <span className="bg-orange-100 text-[#c2410c] text-[10px] font-bold px-2 py-0.5 rounded">
                        Meezan Bank
                      </span>
                    </div>
                    <p className="text-[11px] text-[#78716c] mt-0.5">
                      Transfer directly to our corporate bank account and WhatsApp confirmation screenshot.
                    </p>

                    {paymentMethod === 'bank_transfer' && (
                      <div className="mt-3 p-3.5 bg-white rounded-xl border border-[#fed7aa] text-xs text-[#44403c] space-y-1.5">
                        <div className="font-bold text-[#1c1917] flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#ea580c]" />
                          <span>{settings?.bankDetails?.bankName || 'Meezan Bank Limited'}</span>
                        </div>
                        <div>Account Title: <strong>{settings?.bankDetails?.accountTitle || 'STITCH AND UNSTITCHED (PVT) LTD'}</strong></div>
                        <div>Account Number: <strong>{settings?.bankDetails?.accountNumber || '01020304050607'}</strong></div>
                        <div>IBAN: <strong className="font-mono">{settings?.bankDetails?.iban || 'PK45MEZN0001020304050607'}</strong></div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary: 5 Columns */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f0ece1] shadow-xs space-y-4">
              <h2 className="font-cinzel text-lg font-bold text-[#1c1917] pb-3 border-b border-[#f0ece1]">
                REVIEW YOUR BAG ({cart.length} ITEMS)
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 text-xs">
                    <img
                      src={item.product.images[0]?.url}
                      alt=""
                      className="w-14 h-18 object-cover rounded-xl border border-[#e5dfd3] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#1c1917] truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-[#78716c]">
                        Size: {item.selectedSize} &bull; Qty: {item.quantity}
                      </p>
                      <span className="text-[10px] text-[#c2410c] font-semibold flex items-center gap-1 mt-0.5">
                        <Scissors className="w-2.5 h-2.5" />
                        {item.stitchChoice === 'stitched' ? 'Stitched' : 'Unstitched'}
                      </span>
                    </div>
                    <div className="text-right font-bold text-[#ea580c]">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-[#57534e] pt-3 border-t border-[#f0ece1]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#1c1917]">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div>
                    <span>Shipping &amp; Delivery</span>
                    <span className="text-[10px] text-[#78716c] block">
                      {isFreeShipping 
                        ? `Free delivery unlocked (orders above ${formatPrice(freeShippingThreshold)})` 
                        : (isKarachi ? 'Karachi Doorstep Rider Rate' : 'Nationwide Courier Rate')}
                    </span>
                  </div>
                  <span className="font-bold text-[#1c1917]">
                    {dynamicShippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatPrice(dynamicShippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1c1917] pt-3 border-t border-[#f0ece1]">
                  <span>Total Due</span>
                  <span className="font-cinzel text-2xl text-[#ea580c]">{formatPrice(dynamicTotal)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                id="place-order-btn"
                type="submit"
                disabled={submitting}
                className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-orange-900/25 transition-all active:scale-[0.99]"
              >
                <span>{submitting ? 'PROCESSING YOUR ORDER...' : 'CONFIRM & PLACE ORDER'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-[11px] text-[#78716c] text-center space-y-1">
                <p className="flex items-center justify-center gap-1.5 font-semibold text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Karachi Rider Inspection Guaranteed
                </p>
                <p>Delivery time: 24–48 hours across Karachi</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
