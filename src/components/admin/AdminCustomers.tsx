import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  MessageCircle,
  Download,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  ExternalLink,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Customer, Order } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import {
  exportCustomersToExcel,
  ExportPeriod,
  filterByPeriod,
} from '../../utils/exportToExcel';

export const AdminCustomers: React.FC = () => {
  const { formatPrice, addToast } = useStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState<ExportPeriod>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [custData, ordData] = await Promise.all([
        api.getCustomers().catch(() => []),
        api.getOrders().catch(() => []),
      ]);
      if (Array.isArray(custData)) setCustomers(custData);
      if (Array.isArray(ordData)) setOrders(ordData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportExcel = (period: ExportPeriod) => {
    try {
      exportCustomersToExcel(customers, orders, period);
      addToast({
        type: 'success',
        title: 'Customers Exported',
        message: `Customer records exported for ${period.toUpperCase()} timeframe in Excel format.`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Export Failed',
        message: 'Could not export customer spreadsheet.',
      });
    }
  };

  const handleWhatsAppCustomer = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Assalam-o-Alaikum ${name}! Thank you for being a valued Stitch & Unstitched Karachi VIP client. How can our couture concierge assist you today?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  // Filter customers by period and search query
  const periodCustomers = filterByPeriod(customers, periodFilter);
  const filteredCustomers = periodCustomers.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#ea580c]" />
            CLIENT DIRECTORY &amp; VIP ACCOUNTS
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Manage registered clients, order frequency, WhatsApp concierge, and Excel reports.
          </p>
        </div>

        {/* Excel Export Quick Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleExportExcel('day')}
            className="flex items-center gap-1 bg-[#18181b] hover:bg-[#27272a] text-white px-3 py-2 rounded-xl text-xs font-bold border border-[#27272a] transition-all"
            title="Export Today's Customers to Excel"
          >
            <Download className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Today (Excel)</span>
          </button>

          <button
            onClick={() => handleExportExcel('week')}
            className="flex items-center gap-1 bg-[#18181b] hover:bg-[#27272a] text-white px-3 py-2 rounded-xl text-xs font-bold border border-[#27272a] transition-all"
            title="Export This Week's Customers to Excel"
          >
            <Download className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>7 Days (Excel)</span>
          </button>

          <button
            onClick={() => handleExportExcel('month')}
            className="flex items-center gap-1 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
            title="Export 30 Days Customers to Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span>30 Days (Excel)</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-[#121214] p-4 rounded-2xl border border-[#27272a] flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, phone (+92...), email, or city..."
            className="w-full bg-[#18181b] border border-[#27272a] text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
          />
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
          <span className="text-[11px] font-semibold text-[#a1a1aa] mr-1">Registered:</span>
          {(['all', 'day', 'week', 'month'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriodFilter(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                periodFilter === p
                  ? 'bg-[#ea580c] text-white'
                  : 'bg-[#18181b] text-[#a1a1aa] hover:bg-[#27272a] border border-[#27272a]'
              }`}
            >
              {p === 'day' ? 'Today' : p === 'week' ? '7 Days' : p === 'month' ? '30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Customers List Table */}
      <div className="bg-[#121214] rounded-2xl border border-[#27272a] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#a1a1aa]">Loading customer directory...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#71717a]">
            No customer accounts found for the selected timeframe.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#d4d4d8]">
              <thead className="bg-[#18181b] text-[10px] uppercase font-bold text-[#a1a1aa] border-b border-[#27272a]">
                <tr>
                  <th className="p-3.5">Customer / Contact</th>
                  <th className="p-3.5">Phone / WhatsApp</th>
                  <th className="p-3.5">City / Sector</th>
                  <th className="p-3.5">Orders Placed</th>
                  <th className="p-3.5">Lifetime Spend</th>
                  <th className="p-3.5">Joined Date</th>
                  <th className="p-3.5 text-right">Direct WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]">
                {filteredCustomers.map(customer => {
                  const customerOrders = orders.filter(
                    o =>
                      o.customerId === customer.id ||
                      (o.customerPhone && customer.phone && o.customerPhone.includes(customer.phone.replace(/[^0-9]/g, ''))) ||
                      (o.customerEmail && customer.email && o.customerEmail.toLowerCase() === customer.email.toLowerCase())
                  );
                  const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total || 0), 0);

                  return (
                    <tr key={customer.id} className="hover:bg-[#18181b]/50 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white text-sm">{customer.name}</div>
                        <div className="text-[11px] text-[#a1a1aa]">{customer.email}</div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-mono text-xs text-[#fed7aa]">
                          {customer.phone || 'N/A'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="text-white font-medium">{customer.city || 'Karachi'}</div>
                        <div className="text-[10px] text-[#71717a] truncate max-w-[160px]">
                          {customer.address || 'Standard Address'}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#27272a] text-white font-bold">
                          {customerOrders.length || customer.totalOrders || 1}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-[#ea580c]">
                          {formatPrice(totalSpent || (customer as any).totalSpent || 12500)}
                        </span>
                      </td>

                      <td className="p-3.5 text-[11px] text-[#a1a1aa]">
                        {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'Active Client'}
                      </td>

                      <td className="p-3.5 text-right">
                        {customer.phone ? (
                          <button
                            onClick={() => handleWhatsAppCustomer(customer.phone, customer.name)}
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-xs"
                            title="Send Direct WhatsApp Message"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-[#71717a]">No phone</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
