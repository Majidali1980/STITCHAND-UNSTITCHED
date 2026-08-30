import React from 'react';
import { Printer, X, CheckCircle2, Scissors, Truck, Phone, Mail, MapPin } from 'lucide-react';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';

interface PrintableInvoiceProps {
  order: Order;
  onClose?: () => void;
  autoPrint?: boolean;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ order, onClose, autoPrint = false }) => {
  const { settings, formatPrice } = useStore();

  React.useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  const handlePrint = () => {
    window.print();
  };

  const storeName = settings?.storeName || 'STITCH & UNSTITCHED';
  const storePhone = settings?.phone || '+92 21 35870000';
  const storeWhatsapp = settings?.whatsapp || '+92 300 1234567';
  const storeEmail = settings?.email || 'care@stitchandunstitched.com';
  const storeAddress = settings?.address || 'Khayaban-e-Shahbaz, Phase 6, DHA, Karachi';

  const recipientArea = order.shippingAddress?.area || order.area || 'Custom Delivery Area';
  const recipientCity = order.shippingAddress?.city || order.city || 'Karachi';
  const recipientAddress = order.shippingAddress?.address || order.address || 'Delivery Address';
  const recipientPhone = order.shippingAddress?.phone || order.customerPhone || order.phone;
  const recipientName = order.shippingAddress?.fullName || order.customerName;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:static print:bg-white print:backdrop-blur-none">
      {/* Container - fits on exactly 1 single A4 / Letter page when printed */}
      <div 
        id="printable-invoice-page"
        className="relative bg-white text-black w-full max-w-3xl rounded-2xl print:rounded-none shadow-2xl p-6 sm:p-8 print:p-6 print:shadow-none print:max-w-none print:w-full font-sans text-xs border border-[#e5e5e5] print:border-none"
      >
        {/* On-screen control bar (Hidden in print) */}
        <div className="no-print flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="bg-orange-100 text-orange-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              1-Page Print Ready
            </span>
            <span className="text-stone-500 text-xs">Order #{order.orderNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print 1-Page Receipt</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* 1-PAGE INVOICE RECEIPT BODY */}
        <div className="space-y-4">
          {/* Header Row */}
          <div className="flex justify-between items-start border-b-2 border-black pb-3">
            <div>
              <h1 className="font-cinzel text-xl font-extrabold tracking-wider text-black">
                {storeName}
              </h1>
              <p className="text-[10px] text-stone-600 font-semibold tracking-wide uppercase">
                Luxury Stitched &amp; Unstitched Atelier Karachi
              </p>
              <div className="text-[10px] text-stone-600 space-y-0.5 mt-1">
                <p>{storeAddress}</p>
                <p>Phone: {storePhone} | WhatsApp: {storeWhatsapp}</p>
                <p>Email: {storeEmail}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block bg-black text-white font-bold font-cinzel text-xs px-3 py-1 uppercase tracking-widest rounded-sm">
                ORDER INVOICE / RECEIPT
              </div>
              <div className="mt-2 text-right">
                <p className="font-mono text-sm font-extrabold text-black">
                  #{order.orderNumber}
                </p>
                <p className="text-[10px] text-stone-600 font-medium">
                  Date: {order.createdAt || new Date().toLocaleDateString('en-PK')}
                </p>
                <p className="text-[10px] font-bold text-black uppercase mt-0.5">
                  Payment: <span className="bg-stone-100 px-1.5 py-0.5 border border-stone-300 rounded">{order.paymentMethod}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Area Grid */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 border border-stone-300 rounded-lg text-[11px]">
            <div>
              <span className="font-bold text-stone-500 uppercase text-[9px] tracking-wider block mb-0.5">
                BILL TO / CUSTOMER DETAILS
              </span>
              <p className="font-bold text-black text-xs">{recipientName}</p>
              <p className="text-stone-700">Phone: {recipientPhone}</p>
              {order.customerEmail && <p className="text-stone-600 text-[10px]">{order.customerEmail}</p>}
            </div>

            <div>
              <span className="font-bold text-stone-500 uppercase text-[9px] tracking-wider block mb-0.5">
                DISPATCH DESTINATION &amp; AREA
              </span>
              <p className="text-black font-semibold">
                {recipientAddress}
              </p>
              <p className="font-bold text-black text-xs text-orange-950 mt-0.5">
                Area: <span className="underline decoration-orange-500 decoration-2">{recipientArea}</span>, {recipientCity}
              </p>
              {order.shippingAddress?.landmark && (
                <p className="text-[10px] text-stone-600">Landmark: {order.shippingAddress.landmark}</p>
              )}
            </div>
          </div>

          {/* Special Order/Tailoring Notes if any */}
          {order.notes && (
            <div className="px-3 py-1.5 bg-orange-50/70 border border-orange-200 rounded text-[10px] text-orange-900">
              <strong>Instructions:</strong> {order.notes}
            </div>
          )}

          {/* Items Table */}
          <div>
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-y-2 border-black bg-stone-100 text-[10px] font-bold uppercase tracking-wider text-black">
                  <th className="py-1.5 px-2">#</th>
                  <th className="py-1.5 px-2">Item Description</th>
                  <th className="py-1.5 px-2">Size / Stitch</th>
                  <th className="py-1.5 px-2 text-center">Qty</th>
                  <th className="py-1.5 px-2 text-right">Price</th>
                  <th className="py-1.5 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {order.items.map((item, index) => (
                  <tr key={index} className="align-top">
                    <td className="py-2 px-2 text-stone-500 font-mono text-[10px]">{index + 1}</td>
                    <td className="py-2 px-2">
                      <div className="font-bold text-black">{item.productName}</div>
                      {item.productSku && (
                        <div className="text-[9px] text-stone-500 font-mono">SKU: {item.productSku}</div>
                      )}
                      {item.customMeasurements && (
                        <div className="text-[9px] text-stone-600 bg-stone-100 px-1 py-0.5 rounded mt-0.5 inline-block">
                          Custom Fit: C: {item.customMeasurements.chest}&quot; | W: {item.customMeasurements.waist}&quot; | L: {item.customMeasurements.shirtLength}&quot;
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      <span className="font-semibold text-black">{item.selectedSize}</span>
                      <span className="block text-[10px] text-stone-600">
                        {item.stitchChoice === 'stitched' ? 'Ready Stitched' : 'Unstitched Fabric'}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center font-bold">{item.quantity}</td>
                    <td className="py-2 px-2 text-right font-mono text-stone-700">{formatPrice(item.price)}</td>
                    <td className="py-2 px-2 text-right font-bold font-mono text-black">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary & COD Amount */}
          <div className="flex justify-between items-start pt-2 border-t-2 border-black">
            <div className="max-w-[50%] space-y-1.5">
              <div className="p-2 border border-stone-300 rounded bg-stone-50 text-[10px] space-y-0.5">
                <p className="font-bold text-black uppercase tracking-wider">Payment Status: {order.paymentStatus.toUpperCase()}</p>
                <p className="text-stone-600">All prices are inclusive of applicable sales tax.</p>
                <p className="text-stone-600">Exchange / Returns acceptable within 7 days with original tag &amp; receipt.</p>
              </div>

              {/* Barcode representation */}
              <div className="pt-1">
                <div className="font-mono text-[9px] text-stone-500 tracking-[0.2em] uppercase">
                  *ORD-{order.orderNumber}*
                </div>
              </div>
            </div>

            <div className="w-64 space-y-1 text-xs">
              <div className="flex justify-between text-stone-700">
                <span>Subtotal ({order.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-mono font-semibold">{formatPrice(order.subtotal)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span className="font-mono">-{formatPrice(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-700">
                <span>Delivery &amp; Courier Fee</span>
                <span className="font-mono font-semibold">
                  {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-black pt-1.5 border-t border-stone-400">
                <span>GRAND TOTAL</span>
                <span className="font-mono text-base text-black">{formatPrice(order.total)}</span>
              </div>

              {order.paymentMethod.toLowerCase().includes('cash') && (
                <div className="mt-1 p-1.5 bg-orange-100 border border-orange-300 rounded text-center">
                  <span className="text-[10px] font-bold uppercase text-orange-950 block">Cash to Collect by Rider</span>
                  <span className="font-mono font-extrabold text-sm text-orange-900">{formatPrice(order.total)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Signatures & Footer (Ensures 1-Page Polish) */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dashed border-stone-400 text-[9px] text-stone-600 text-center">
            <div>
              <div className="border-b border-stone-400 pb-4 mb-1"></div>
              <span className="uppercase font-bold text-stone-800">Packed &amp; Verified By</span>
            </div>
            <div>
              <div className="border-b border-stone-400 pb-4 mb-1"></div>
              <span className="uppercase font-bold text-stone-800">Rider / Dispatch Agent</span>
            </div>
            <div>
              <div className="border-b border-stone-400 pb-4 mb-1"></div>
              <span className="uppercase font-bold text-stone-800">Customer Receiver Signature</span>
            </div>
          </div>

          <div className="text-center text-[9px] text-stone-500 pt-1">
            Thank you for choosing {storeName}! For inquiries or tailoring adjustments, WhatsApp us at {storeWhatsapp}.
          </div>
        </div>
      </div>
    </div>
  );
};
