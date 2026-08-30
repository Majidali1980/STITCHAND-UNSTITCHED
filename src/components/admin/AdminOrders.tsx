import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Truck,
  Printer,
  CheckCircle2,
  X,
  MapPin,
  Phone,
  Scissors,
  MessageCircle,
  Download,
  Calendar,
  Send,
  Sparkles,
  FileSpreadsheet,
  Users,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Order, Subscriber, Customer } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { PrintableInvoice } from '../common/PrintableInvoice';
import {
  exportOrdersToExcel,
  exportCustomersToExcel,
  ExportPeriod,
  filterByPeriod,
} from '../../utils/exportToExcel';

interface AdminOrdersProps {
  initialSelectedOrder?: Order | null;
  onClearInitialOrder?: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  initialSelectedOrder,
  onClearInitialOrder,
}) => {
  const { formatPrice, addToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);

  // Excel Export Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportPeriod, setExportPeriod] = useState<ExportPeriod>('month');

  // WhatsApp Message Composer in Order Detail Modal
  const [whatsappTemplate, setWhatsappTemplate] = useState<string>('confirmed');
  const [customWhatsappMsg, setCustomWhatsappMsg] = useState<string>('');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const [ordersData, subsData] = await Promise.all([
        api.getOrders(),
        api.getSubscribers().catch(() => []),
      ]);
      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
      }
      if (Array.isArray(subsData)) {
        setSubscribers(subsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Handle incoming notification click from top bar
  useEffect(() => {
    if (initialSelectedOrder) {
      setSelectedOrder(initialSelectedOrder);
      if (onClearInitialOrder) onClearInitialOrder();
    }
  }, [initialSelectedOrder]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      addToast({
        type: 'success',
        title: 'Order Status Updated',
        message: `Order status changed to ${newStatus.toUpperCase()}`,
      });
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => (prev ? { ...prev, status: newStatus, orderStatus: newStatus } : null));
      }
    } catch {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update order status.',
      });
    }
  };

  const getCleanPhone = (phoneStr?: string) => {
    if (!phoneStr) return '';
    let cleaned = phoneStr.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('03')) {
      cleaned = '92' + cleaned.slice(1);
    }
    return cleaned;
  };

  // Generate WhatsApp Message according to chosen Pakistani E-Commerce Template
  const getWhatsAppMessageText = (order: Order, templateKey: string) => {
    const area = order.shippingAddress?.area || order.area || 'Karachi';
    const totalFormatted = formatPrice(order.total);
    const orderNum = order.orderNumber;
    const customer = order.customerName;
    const itemsCount = order.items.reduce((acc, i) => acc + i.quantity, 0);

    switch (templateKey) {
      case 'confirmed':
        return `Assalam-o-Alaikum ${customer}! ✨ Thank you for shopping with Stitch & Unstitched Karachi. Your order #${orderNum} for ${itemsCount} item(s) worth ${totalFormatted} has been confirmed. Delivery destination: ${area}, Karachi. We will notify you once dispatched!`;
      case 'tailoring':
        return `Assalam-o-Alaikum ${customer}! ✂️ Your bespoke stitched attire for order #${orderNum} is currently in crafting & tailoring at our Karachi atelier. Estimated dispatch in 24–48 hours.`;
      case 'dispatched':
        return `Assalam-o-Alaikum ${customer}! 🚚 Great news! Your Stitch & Unstitched order #${orderNum} has been handed over to our Karachi courier rider for delivery to ${area}. Amount to pay (if COD): ${totalFormatted}. Please keep cash ready.`;
      case 'delivered':
        return `Assalam-o-Alaikum ${customer}! 🎉 Your order #${orderNum} has been marked delivered. We hope you love your bespoke attire! For any tailoring adjustments or care guidance, please reply here.`;
      case 'custom':
        return (
          customWhatsappMsg ||
          `Assalam-o-Alaikum ${customer}! Stitch & Unstitched Karachi checking in regarding your Order #${orderNum}.`
        );
      default:
        return `Assalam-o-Alaikum ${customer}! Update regarding your order #${orderNum} from Stitch & Unstitched Karachi.`;
    }
  };

  const handleLaunchWhatsApp = (order: Order, templateKey = 'confirmed') => {
    const phone = getCleanPhone(
      order.customerPhone || order.phone || order.shippingAddress?.phone
    );
    if (!phone) {
      addToast({
        type: 'error',
        title: 'No Phone Number',
        message: 'No valid phone number found for this customer.',
      });
      return;
    }

    const message = getWhatsAppMessageText(order, templateKey);
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  // Trigger Excel Export for Orders
  const handleExportOrders = () => {
    const res = exportOrdersToExcel(orders, exportPeriod);
    addToast({
      type: 'success',
      title: 'Orders Report Exported! 📊',
      message: `Exported ${res.count} order(s) for period: ${exportPeriod.toUpperCase()} (${res.filename})`,
    });
    setIsExportModalOpen(false);
  };

  // Trigger Excel Export for Customers
  const handleExportCustomers = () => {
    const res = exportCustomersToExcel(orders, subscribers, customers, exportPeriod);
    addToast({
      type: 'success',
      title: 'Customers Directory Exported! 👥',
      message: `Exported ${res.count} customer & subscriber record(s) (${res.filename})`,
    });
    setIsExportModalOpen(false);
  };

  const filtered = orders.filter(o => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerPhone && o.customerPhone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.shippingAddress?.area && o.shippingAddress.area.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus =
      filterStatus === 'all' ||
      (o.orderStatus || o.status || 'pending').toLowerCase() === filterStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  // Calculate live preview metrics for export period
  const periodFilteredOrders = filterByPeriod<Order>(orders, exportPeriod);
  const periodTotalRevenue = periodFilteredOrders.reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header with Title & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-[#ea580c]" />
            <span>ORDERS &amp; DISPATCH MANAGEMENT</span>
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Track customer orders, WhatsApp status directly to customers, and export day/week/month reports in Excel format.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-[#3f3f46] shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Excel / Reports</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-[#121214] p-4 rounded-2xl border border-[#27272a] flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, Customer Name, Phone, or Karachi Area..."
            className="w-full bg-[#18181b] border border-[#27272a] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
          />
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-[#18181b] border border-[#27272a] text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
        >
          <option value="all">All Statuses ({orders.length})</option>
          <option value="pending">Pending (New)</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing (Tailoring)</option>
          <option value="shipped">Shipped (Out for Delivery)</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[#121214] rounded-2xl border border-[#27272a] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#d4d4d8]">
            <thead className="bg-[#18181b] text-[#a1a1aa] font-bold uppercase tracking-wider border-b border-[#27272a]">
              <tr>
                <th className="p-3.5">Order #</th>
                <th className="p-3.5">Customer &amp; Karachi Area</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5">Total &amp; Payment</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions &amp; WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#71717a]">Loading orders...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#71717a]">No orders found matching your search.</td>
                </tr>
              ) : (
                filtered.map(order => {
                  const currentStatus = order.orderStatus || order.status || 'pending';
                  const isPending = currentStatus.toLowerCase() === 'pending';

                  return (
                    <tr
                      key={order.id}
                      className={`transition-colors ${
                        isPending
                          ? 'bg-[#ea580c]/5 hover:bg-[#ea580c]/10 border-l-4 border-l-[#ea580c]'
                          : 'hover:bg-[#18181b]/50'
                      }`}
                    >
                      <td className="p-3.5 font-bold font-mono text-[#ea580c]">
                        <div className="flex items-center gap-1.5">
                          <span>#{order.orderNumber}</span>
                          {isPending && (
                            <span className="bg-[#ea580c] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase animate-pulse flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              NEW
                            </span>
                          )}
                        </div>
                        <span className="block text-[10px] text-[#71717a] font-normal font-sans mt-0.5">
                          {order.createdAt}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{order.customerName}</span>
                        </div>
                        <div className="text-[10px] text-[#fed7aa] font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#ea580c] shrink-0" />
                          <span>
                            {order.shippingAddress?.area || order.area || 'Karachi'}
                            {order.shippingAddress?.city || order.city ? `, ${order.shippingAddress?.city || order.city}` : ''}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#a1a1aa] flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" />
                          <span>{order.customerPhone || order.phone || order.shippingAddress?.phone || 'No phone'}</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="bg-[#18181b] text-[#d4d4d8] font-bold px-2 py-0.5 rounded border border-[#27272a]">
                          {order.items.reduce((acc, i) => acc + i.quantity, 0)} pcs
                        </span>
                      </td>

                      <td className="p-3.5 font-bold">
                        <div className="text-white">{formatPrice(order.total)}</div>
                        <div className="text-[10px] text-[#a1a1aa] font-normal uppercase">{order.paymentMethod}</div>
                      </td>

                      <td className="p-3.5">
                        <select
                          value={currentStatus}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          className={`border text-[11px] font-bold px-2.5 py-1 rounded-lg focus:outline-none uppercase cursor-pointer ${
                            isPending
                              ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                              : currentStatus === 'delivered'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                              : currentStatus === 'shipped'
                              ? 'bg-blue-950/80 text-blue-300 border-blue-800'
                              : 'bg-[#18181b] text-white border-[#27272a]'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing (Tailoring)</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {/* Direct WhatsApp Message Button */}
                        <button
                          onClick={() => handleLaunchWhatsApp(order, 'confirmed')}
                          className="p-1.5 bg-emerald-950/90 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition-colors border border-emerald-800/60 inline-flex items-center gap-1 text-[10px] px-2 font-bold"
                          title="Direct WhatsApp Message to Customer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          onClick={() => setOrderToPrint(order)}
                          className="p-1.5 bg-[#ea580c]/10 hover:bg-[#ea580c] text-[#ea580c] hover:text-white rounded-lg transition-colors border border-[#ea580c]/30"
                          title="Print 1-Page Invoice Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg transition-colors"
                          title="View Full Details & Dispatch Hub"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXCEL & CSV REPORT EXPORT MODAL (Day, Week, Month, All Time)              */}
      {/* ========================================================================= */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setIsExportModalOpen(false)} />
          <div className="relative bg-[#121214] border border-[#27272a] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl z-10 text-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base font-bold text-white">
                    EXCEL DATA EXPORT CENTER
                  </h3>
                  <p className="text-[10px] text-[#a1a1aa]">
                    Download formatted Excel / CSV reports with complete orders and customer directories.
                  </p>
                </div>
              </div>
              <button onClick={() => setIsExportModalOpen(false)} className="text-[#a1a1aa] hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeframe Presets (Day, Week, Month, All) */}
            <div className="space-y-2">
              <label className="block font-bold text-white uppercase text-[11px] tracking-wider">
                Select Time Horizon:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'day', label: 'Today (Day)' },
                  { id: 'week', label: '7 Days (Week)' },
                  { id: 'month', label: '30 Days (Month)' },
                  { id: 'all', label: 'All Time' },
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setExportPeriod(p.id as ExportPeriod)}
                    className={`py-2 px-1 rounded-xl text-center font-bold text-[11px] transition-all border ${
                      exportPeriod === p.id
                        ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-xs'
                        : 'bg-[#18181b] text-[#a1a1aa] hover:text-white border-[#27272a]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Filter Summary Cards */}
            <div className="p-4 bg-[#18181b] rounded-2xl border border-[#27272a] grid grid-cols-2 gap-3 text-center">
              <div>
                <span className="text-[10px] uppercase text-[#71717a] block font-semibold">Orders In Scope</span>
                <span className="font-cinzel text-lg font-bold text-white">{periodFilteredOrders.length}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#71717a] block font-semibold">Revenue (PKR)</span>
                <span className="font-cinzel text-lg font-bold text-[#ea580c]">{formatPrice(periodTotalRevenue)}</span>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleExportOrders}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Orders Report ({periodFilteredOrders.length} orders)</span>
              </button>

              <button
                onClick={handleExportCustomers}
                className="w-full py-3 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#3f3f46] transition-colors"
              >
                <Users className="w-4 h-4 text-blue-400" />
                <span>Download Customers &amp; VIP Contacts Directory</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ORDER DETAIL & WHATSAPP STATUS DISPATCH MODAL                             */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-[#121214] border border-[#27272a] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl z-10 text-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#27272a] mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    Order Details: #{selectedOrder.orderNumber}
                  </h3>
                  <span className="bg-[#27272a] text-[#fed7aa] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {selectedOrder.orderStatus || selectedOrder.status || 'Pending'}
                  </span>
                </div>
                <span className="text-[11px] text-[#a1a1aa]">Placed on {selectedOrder.createdAt}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOrderToPrint(selectedOrder)}
                  className="inline-flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white px-3 py-1.5 rounded-xl font-bold text-xs transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print 1-Page Receipt</span>
                </button>
                <button onClick={() => setSelectedOrder(null)} className="text-[#a1a1aa] hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* WhatsApp Customer Status Dispatcher (Packaged specifically for Pakistani e-commerce) */}
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Direct Status Dispatch</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono">
                    {selectedOrder.customerPhone || selectedOrder.phone || selectedOrder.shippingAddress?.phone}
                  </span>
                </div>

                {/* Template Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { id: 'confirmed', label: '1. Confirmed' },
                    { id: 'tailoring', label: '2. Tailoring' },
                    { id: 'dispatched', label: '3. Out for Delivery' },
                    { id: 'delivered', label: '4. Delivered' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setWhatsappTemplate(t.id)}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all text-center border ${
                        whatsappTemplate === t.id
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                          : 'bg-[#18181b] text-[#a1a1aa] hover:text-white border-[#27272a]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Message Preview */}
                <div className="bg-[#121214] p-3 rounded-xl border border-emerald-900/50 text-[11px] text-[#d4d4d8] leading-relaxed">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Pre-Formatted Message:</p>
                  <p>{getWhatsAppMessageText(selectedOrder, whatsappTemplate)}</p>
                </div>

                {/* Send Button */}
                <button
                  onClick={() => handleLaunchWhatsApp(selectedOrder, whatsappTemplate)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold uppercase text-[11px] flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Status Update on WhatsApp</span>
                </button>
              </div>

              {/* Customer & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#18181b] rounded-2xl border border-[#27272a]">
                <div>
                  <h4 className="font-bold text-white mb-1">Customer Details</h4>
                  <p className="font-semibold text-white">{selectedOrder.customerName}</p>
                  <p className="text-[#a1a1aa]">{selectedOrder.customerPhone || selectedOrder.phone || selectedOrder.shippingAddress?.phone}</p>
                  <p className="text-[#a1a1aa]">{selectedOrder.customerEmail || selectedOrder.email}</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Karachi Destination</h4>
                  <p>{selectedOrder.shippingAddress?.address || selectedOrder.address || 'Delivery Address'}</p>
                  <p className="text-[#ea580c] font-semibold">
                    {selectedOrder.shippingAddress?.area || selectedOrder.area || ''}{selectedOrder.shippingAddress?.area || selectedOrder.area ? ', ' : ''}{selectedOrder.shippingAddress?.city || selectedOrder.city || 'Karachi'}
                  </p>
                  {selectedOrder.shippingAddress?.landmark && (
                    <p className="text-[#71717a]">Landmark: {selectedOrder.shippingAddress?.landmark}</p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <h4 className="font-bold text-white">Items in Order ({selectedOrder.items.length})</h4>
                <div className="divide-y divide-[#27272a] bg-[#18181b] rounded-2xl border border-[#27272a] p-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="py-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage}
                          alt=""
                          className="w-10 h-12 object-cover rounded-lg border border-[#27272a]"
                        />
                        <div>
                          <h5 className="font-bold text-white">{item.productName}</h5>
                          <p className="text-[10px] text-[#a1a1aa]">
                            Size: {item.selectedSize} &bull; Qty: {item.quantity} &bull; {item.stitchChoice}
                          </p>
                          {item.customMeasurements && (
                            <p className="text-[9px] text-[#fed7aa]">
                              Chest: {item.customMeasurements.chest}&quot; | Shirt: {item.customMeasurements.shirtLength}&quot;
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="font-bold text-[#ea580c]">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial summary */}
              <div className="p-4 bg-[#18181b] rounded-2xl border border-[#27272a] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#a1a1aa]">Subtotal</span>
                  <span className="font-bold text-white">{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#a1a1aa]">Delivery Fee</span>
                  <span className="font-bold text-white">
                    {selectedOrder.shippingFee === 0 ? 'FREE' : formatPrice(selectedOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#27272a]">
                  <span className="text-white">Total</span>
                  <span className="text-[#ea580c] font-cinzel">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1-Page Printable Invoice Modal */}
      {orderToPrint && (
        <PrintableInvoice
          order={orderToPrint}
          onClose={() => setOrderToPrint(null)}
        />
      )}
    </div>
  );
};
