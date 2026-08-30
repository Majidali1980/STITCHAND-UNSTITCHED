import React from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  Printer,
  ShoppingBag,
  ArrowRight,
  Receipt,
  Scissors,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

export const OrderConfirmationPage: React.FC = () => {
  const { viewParams, navigate, formatPrice } = useStore();
  const order: Order | null = viewParams.order || null;

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#faf8f5]">
        <div className="text-center p-8 bg-white rounded-3xl border border-[#f0ece1] shadow-xs space-y-3">
          <p className="font-cinzel text-lg font-bold text-[#1c1917]">No order details found.</p>
          <button
            onClick={() => navigate('home')}
            className="bg-[#ea580c] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Success Banner */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#f0ece1] shadow-md text-center space-y-4 print:border-none print:shadow-none">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-1">
              <span>Karachi Atelier Confirmed</span>
            </div>
            <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#1c1917]">
              SHUKRIYA FOR YOUR ORDER!
            </h1>
            <p className="text-xs sm:text-sm text-[#78716c] mt-1 max-w-md mx-auto">
              Your order <strong className="text-[#1c1917]">#{order.orderNumber}</strong> has been booked and is being prepared for dispatch.
            </p>
          </div>

          {/* Delivery Status Card */}
          <div className="bg-[#fff7ed] p-4 rounded-2xl border border-[#fed7aa] max-w-lg mx-auto flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#ea580c] text-white flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <h4 className="font-bold text-[#9a3412]">Estimated Delivery: 24–48 Hours</h4>
              <p className="text-[#c2410c] text-[11px]">
                Our Karachi dispatch rider will contact {order.customerPhone} prior to arrival.
              </p>
            </div>
          </div>

          {/* Action Bar (Print / Continue) */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-[#faf8f5] hover:bg-[#ede8dc] text-[#292524] px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#d6cfc4] transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice Receipt</span>
            </button>

            <button
              onClick={() => navigate('account', { tab: 'orders' })}
              className="inline-flex items-center gap-2 bg-[#1c1917] hover:bg-[#ea580c] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span>Track in My Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Details Layout */}
        <div className="mt-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#f0ece1] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f0ece1]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#ea580c] tracking-widest">
                STITCH &amp; UNSTITCHED INVOICE
              </span>
              <h2 className="font-cinzel text-xl font-bold text-[#1c1917]">
                Order #{order.orderNumber}
              </h2>
              <span className="text-xs text-[#78716c]">Placed on {order.createdAt}</span>
            </div>

            <div className="text-right sm:text-right">
              <span className="inline-block bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase">
                Status: {order.status}
              </span>
              <p className="text-xs text-[#78716c] mt-1 font-semibold">
                Payment: {order.paymentMethod} ({order.paymentStatus})
              </p>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#57534e]">
            <div className="space-y-1">
              <h4 className="font-bold uppercase tracking-wider text-[#1c1917] mb-1">
                Recipient Details
              </h4>
              <p className="font-semibold text-[#1c1917]">{order.customerName}</p>
              <p>{order.customerPhone || order.phone || order.shippingAddress?.phone}</p>
              <p>{order.customerEmail || order.email}</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold uppercase tracking-wider text-[#1c1917] mb-1">
                Shipping Destination
              </h4>
              <p>{order.shippingAddress?.address || order.address || 'Delivery Address'}</p>
              <p>
                <strong>{order.shippingAddress?.area || order.area || 'Karachi Central'}</strong>, {order.shippingAddress?.city || order.city || 'Karachi'}
              </p>
              {order.shippingAddress?.landmark && (
                <p className="text-[#78716c]">Landmark: {order.shippingAddress?.landmark}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="pt-4 border-t border-[#f0ece1]">
            <h4 className="font-cinzel text-sm font-bold text-[#1c1917] mb-3">
              ORDERED ITEMS ({order.items.length})
            </h4>

            <div className="divide-y divide-[#f0ece1]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt=""
                      className="w-12 h-16 object-cover rounded-lg border border-[#e5dfd3]"
                    />
                    <div>
                      <h5 className="font-bold text-[#1c1917]">{item.productName}</h5>
                      <div className="flex items-center gap-2 text-[#78716c] text-[11px] mt-0.5">
                        <span>Size: {item.selectedSize}</span>
                        <span>&bull;</span>
                        <span>Qty: {item.quantity}</span>
                        <span>&bull;</span>
                        <span className="text-[#ea580c] font-semibold flex items-center gap-1">
                          <Scissors className="w-2.5 h-2.5" />
                          {item.stitchChoice === 'stitched' ? 'Stitched' : 'Unstitched'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-bold text-[#ea580c]">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="pt-4 border-t border-[#f0ece1] flex justify-end">
            <div className="w-full sm:w-64 space-y-2 text-xs text-[#57534e]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#1c1917]">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-[#1c1917]">
                  {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1c1917] pt-2 border-t border-[#f0ece1]">
                <span>Total Amount</span>
                <span className="font-cinzel text-lg text-[#ea580c]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
