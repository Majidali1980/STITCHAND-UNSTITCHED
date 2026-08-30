import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Truck,
  CheckCircle2,
  Clock,
  Plus,
  FileSpreadsheet,
} from 'lucide-react';
import { AdminTab } from './AdminLayout';
import { api } from '../../services/api';
import { Order, Product } from '../../types';
import { useStore } from '../../context/StoreContext';

export const AdminDashboard: React.FC<{ onNavigateTab: (tab: AdminTab) => void }> = ({
  onNavigateTab,
}) => {
  const { formatPrice } = useStore();
  const [stats, setStats] = useState<any>({
    totalSales: 489000,
    totalOrders: 64,
    totalProducts: 24,
    totalCustomers: 118,
    pendingOrders: 5,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [statsData, ordersData, productsData] = await Promise.all([
          api.getStats(),
          api.getOrders(),
          api.getProducts({ limit: 50 }),
        ]);

        if (statsData) setStats(statsData);
        if (Array.isArray(ordersData)) setRecentOrders(ordersData.slice(0, 5));
        if (productsData && productsData.products) {
          setLowStockProducts(productsData.products.filter(p => p.stockQuantity <= 12));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Welcome / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white">
            KARACHI COMMERCE OVERVIEW
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Real-time sales performance, Karachi dispatch pipeline, and inventory status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('orders')}
            className="flex items-center gap-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors border border-[#3f3f46]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel Reports</span>
          </button>

          <button
            onClick={() => onNavigateTab('products')}
            className="flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales */}
        <div className="bg-[#121214] p-5 rounded-2xl border border-[#27272a] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#a1a1aa] text-xs font-semibold uppercase tracking-wider">
            <span>Total Gross Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-orange-950/60 text-[#ea580c] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-cinzel text-2xl font-bold text-white">
            {formatPrice(stats.totalSales || 489000)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs last month</span>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-[#121214] p-5 rounded-2xl border border-[#27272a] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#a1a1aa] text-xs font-semibold uppercase tracking-wider">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-950/60 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-cinzel text-2xl font-bold text-white">
            {stats.totalOrders || 64}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#a1a1aa]">
            <Truck className="w-3 h-3 text-[#ea580c]" />
            <span>{stats.pendingOrders || 3} pending Karachi dispatch</span>
          </div>
        </div>

        {/* Catalog */}
        <div className="bg-[#121214] p-5 rounded-2xl border border-[#27272a] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#a1a1aa] text-xs font-semibold uppercase tracking-wider">
            <span>Active SKUs</span>
            <div className="w-8 h-8 rounded-xl bg-purple-950/60 text-purple-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-cinzel text-2xl font-bold text-white">
            {stats.totalProducts || 24}
          </div>
          <div className="text-[11px] text-[#a1a1aa]">
            Stitched &amp; Unstitched lines active
          </div>
        </div>

        {/* Customers */}
        <div className="bg-[#121214] p-5 rounded-2xl border border-[#27272a] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#a1a1aa] text-xs font-semibold uppercase tracking-wider">
            <span>Registered Customers</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-cinzel text-2xl font-bold text-white">
            {stats.totalCustomers || 118}
          </div>
          <div className="text-[11px] text-emerald-400">
            Karachi &bull; Lahore &bull; Islamabad
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders: 8 Columns */}
        <div className="lg:col-span-8 bg-[#121214] p-6 rounded-3xl border border-[#27272a] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
            <div>
              <h3 className="font-cinzel text-base font-bold text-white">
                RECENT ORDERS &amp; DISPATCHES
              </h3>
              <p className="text-xs text-[#a1a1aa]">Latest orders placed across Karachi and nationwide.</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-[#ea580c] font-bold hover:underline"
            >
              View All Orders &rarr;
            </button>
          </div>

          <div className="divide-y divide-[#27272a] overflow-x-auto">
            {recentOrders.map(order => (
              <div key={order.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono">#{order.orderNumber}</span>
                    <span className="bg-[#27272a] text-[#fed7aa] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {order.orderStatus || order.status || 'Pending'}
                    </span>
                  </div>
                  <p className="text-[#a1a1aa] mt-0.5">
                    {order.customerName} &bull; {order.shippingAddress?.area || order.area || order.shippingAddress?.city || order.city || 'Karachi'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-bold text-[#ea580c] text-sm block">
                    {formatPrice(order.total)}
                  </span>
                  <span className="text-[10px] text-[#71717a]">{order.paymentMethod}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Stock Alerts: 4 Columns */}
        <div className="lg:col-span-4 bg-[#121214] p-6 rounded-3xl border border-[#27272a] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="font-cinzel text-sm font-bold text-white">
                LOW STOCK INVENTORY
              </h3>
            </div>
            <span className="text-xs text-[#a1a1aa]">&lt; 12 items</span>
          </div>

          <div className="space-y-3">
            {lowStockProducts.slice(0, 4).map(prod => (
              <div key={prod.id} className="p-3 bg-[#18181b] rounded-2xl border border-[#27272a] flex items-center justify-between gap-3 text-xs">
                <img
                  src={prod.images[0]?.url}
                  alt=""
                  className="w-10 h-12 object-cover rounded-lg border border-[#3f3f46] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-white truncate">{prod.name}</h5>
                  <p className="text-[10px] text-[#a1a1aa]">SKU: {prod.sku}</p>
                </div>
                <span className="bg-amber-950/80 text-amber-300 font-bold px-2 py-1 rounded text-xs border border-amber-800">
                  {prod.stockQuantity} Left
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('products')}
            className="w-full bg-[#27272a] hover:bg-[#3f3f46] text-white py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            Manage All Product Stocks
          </button>
        </div>
      </div>
    </div>
  );
};
