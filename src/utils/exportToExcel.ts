import { Order, Subscriber, Customer } from '../types';

export type ExportPeriod = 'day' | 'week' | 'month' | 'all';

/**
 * Filter items by createdAt date according to selected timeframe (day, week, month, all)
 */
export function filterByPeriod<T extends { createdAt?: string }>(
  items: T[],
  period: ExportPeriod
): T[] {
  if (period === 'all') return items;

  const now = new Date();
  const cutoff = new Date();

  if (period === 'day') {
    cutoff.setHours(0, 0, 0, 0); // start of today
  } else if (period === 'week') {
    cutoff.setDate(now.getDate() - 7);
  } else if (period === 'month') {
    cutoff.setDate(now.getDate() - 30);
  }

  return items.filter(item => {
    if (!item.createdAt) return true;
    const itemDate = new Date(item.createdAt);
    // If date is invalid or NaN, keep it
    if (isNaN(itemDate.getTime())) return true;
    return itemDate >= cutoff;
  });
}

/**
 * Clean cell content for Excel CSV export (escape double quotes, wrap in quotes)
 */
const escapeCell = (val: any): string => {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
};

/**
 * Trigger download of formatted Excel CSV with UTF-8 BOM
 */
const downloadCsv = (filename: string, csvContent: string) => {
  // \uFEFF is UTF-8 BOM so Excel opens Urdu / English text and symbols with correct encoding
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export Orders to Excel formatted report
 */
export const exportOrdersToExcel = (orders: Order[], period: ExportPeriod) => {
  const filtered = filterByPeriod(orders, period);

  const headers = [
    'Order #',
    'Date & Time',
    'Customer Name',
    'Customer Phone',
    'Customer Email',
    'Karachi Area / Sector',
    'City',
    'Complete Delivery Address',
    'Items Quantity',
    'Ordered Items Detail (Name, Size, Stitching Type, Custom Sizing)',
    'Payment Method',
    'Payment Status',
    'Order Status',
    'Subtotal (PKR)',
    'Delivery Fee (PKR)',
    'Discount (PKR)',
    'Coupon Used',
    'Total Amount (PKR)',
    'Customer / Rider Notes',
  ];

  const rows = filtered.map(order => {
    const itemsDetail = order.items
      .map(item => {
        const pName = item.productName || (item as any).name || 'Luxury Ensemble';
        let text = `${item.quantity}x ${pName} (${item.stitchChoice === 'stitched' ? 'Stitched Pret' : 'Unstitched Fabric'}, Size: ${item.selectedSize || 'Standard'})`;
        if (item.customMeasurements) {
          const m = item.customMeasurements;
          const measurements = [
            m.chest ? `Chest:${m.chest}` : '',
            m.waist ? `Waist:${m.waist}` : '',
            m.hips ? `Hips:${m.hips}` : '',
            m.length ? `Length:${m.length}` : '',
          ]
            .filter(Boolean)
            .join(' | ');
          if (measurements) text += ` [Measurements: ${measurements}]`;
        }
        return text;
      })
      .join('; ');

    const fullAddress =
      order.shippingAddress?.address ||
      order.address ||
      'Karachi Address Not Specified';
    const area =
      order.shippingAddress?.area || order.area || 'Karachi Standard';
    const city =
      order.shippingAddress?.city || order.city || 'Karachi';
    const phone =
      order.customerPhone ||
      order.phone ||
      order.shippingAddress?.phone ||
      '';
    const email = order.customerEmail || order.email || '';

    return [
      escapeCell(order.orderNumber),
      escapeCell(order.createdAt),
      escapeCell(order.customerName),
      escapeCell(phone),
      escapeCell(email),
      escapeCell(area),
      escapeCell(city),
      escapeCell(fullAddress),
      escapeCell(order.items.reduce((acc, i) => acc + i.quantity, 0)),
      escapeCell(itemsDetail),
      escapeCell(order.paymentMethod?.toUpperCase() || 'COD'),
      escapeCell(order.paymentStatus?.toUpperCase() || 'PENDING'),
      escapeCell((order.orderStatus || order.status || 'pending').toUpperCase()),
      escapeCell(order.subtotal || order.total),
      escapeCell(order.shippingFee || 0),
      escapeCell(order.discount || 0),
      escapeCell(order.couponCode || 'None'),
      escapeCell(order.total),
      escapeCell(order.orderNotes || order.notes || ''),
    ].join(',');
  });

  const periodLabel =
    period === 'day'
      ? 'Today'
      : period === 'week'
      ? 'Last_7_Days'
      : period === 'month'
      ? 'Last_30_Days'
      : 'All_Time';

  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `Stitch_Unstitched_Orders_${periodLabel}_${dateStr}.csv`;

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  downloadCsv(filename, csvContent);

  return {
    count: filtered.length,
    totalRevenue: filtered.reduce((acc, o) => acc + (o.total || 0), 0),
    filename,
  };
};

/**
 * Export Customers and Subscribers combined dataset to Excel report
 */
export const exportCustomersToExcel = (
  orders: Order[],
  subscribers: Subscriber[],
  customers: Customer[],
  period: ExportPeriod
) => {
  // Map of unique customer emails/phones from orders and registered accounts
  const customerMap = new Map<string, {
    name: string;
    phone: string;
    email: string;
    city: string;
    area: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
    source: string;
    createdAt: string;
  }>();

  // 1. Process known registered customers
  customers.forEach(c => {
    const key = (c.email || c.phone || c.id).toLowerCase();
    customerMap.set(key, {
      name: c.name,
      phone: c.phone || '',
      email: c.email || '',
      city: c.addresses?.[0]?.city || 'Karachi',
      area: c.addresses?.[0]?.area || '',
      totalOrders: c.ordersCount || 0,
      totalSpent: c.totalSpent || 0,
      lastOrderDate: 'Registered Account',
      source: 'Storefront Registered Member',
      createdAt: c.createdAt || new Date().toISOString(),
    });
  });

  // 2. Process all orders to get real spending & addresses
  orders.forEach(o => {
    const key = (o.customerEmail || o.customerPhone || o.customerName).toLowerCase();
    const existing = customerMap.get(key);
    const area = o.shippingAddress?.area || o.area || '';
    const city = o.shippingAddress?.city || o.city || 'Karachi';
    const phone = o.customerPhone || o.phone || o.shippingAddress?.phone || '';
    const email = o.customerEmail || o.email || '';

    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += o.total || 0;
      existing.lastOrderDate = o.createdAt;
      if (!existing.phone && phone) existing.phone = phone;
      if (!existing.email && email) existing.email = email;
      if (!existing.area && area) existing.area = area;
    } else {
      customerMap.set(key, {
        name: o.customerName,
        phone,
        email,
        city,
        area,
        totalOrders: 1,
        totalSpent: o.total || 0,
        lastOrderDate: o.createdAt,
        source: 'Storefront Order Checkout',
        createdAt: o.createdAt,
      });
    }
  });

  // 3. Process captured subscribers
  subscribers.forEach(s => {
    const key = (s.email || s.whatsapp || s.id).toLowerCase();
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: s.name || 'Store Subscriber',
        phone: s.whatsapp || '',
        email: s.email || '',
        city: s.city || 'Karachi',
        area: '',
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: 'Newsletter VIP',
        source: s.source || 'Newsletter / WhatsApp Opt-in',
        createdAt: s.createdAt,
      });
    }
  });

  const customerList = Array.from(customerMap.values());
  const filtered = filterByPeriod(customerList, period);

  const headers = [
    'Customer Name',
    'Phone / WhatsApp Number',
    'Email Address',
    'Karachi Area / Zone',
    'City',
    'Total Orders Placed',
    'Total Lifetime Spend (PKR)',
    'Average Order Value (PKR)',
    'Last Order / Activity Date',
    'Customer Tier / Source',
    'Date Added',
  ];

  const rows = filtered.map(c => {
    const aov = c.totalOrders > 0 ? Math.round(c.totalSpent / c.totalOrders) : 0;
    const tier =
      c.totalSpent >= 50000
        ? 'Gold VIP'
        : c.totalSpent >= 20000
        ? 'Silver Privé'
        : c.totalOrders > 0
        ? 'Regular Shopper'
        : 'Newsletter Subscriber';

    return [
      escapeCell(c.name),
      escapeCell(c.phone),
      escapeCell(c.email),
      escapeCell(c.area),
      escapeCell(c.city),
      escapeCell(c.totalOrders),
      escapeCell(c.totalSpent),
      escapeCell(aov),
      escapeCell(c.lastOrderDate),
      escapeCell(`${tier} (${c.source})`),
      escapeCell(c.createdAt),
    ].join(',');
  });

  const periodLabel =
    period === 'day'
      ? 'Today'
      : period === 'week'
      ? 'Last_7_Days'
      : period === 'month'
      ? 'Last_30_Days'
      : 'All_Time';

  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `Stitch_Unstitched_Customers_${periodLabel}_${dateStr}.csv`;

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  downloadCsv(filename, csvContent);

  return {
    count: filtered.length,
    filename,
  };
};
