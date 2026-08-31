import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  Flame,
  Star,
  FileText,
  Settings,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Palette,
  Menu,
  Layers,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../common/Logo';
import { AdminLogin, isAdminAuthenticated } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';
import { AdminCategories } from './AdminCategories';
import { AdminCuratedSections } from './AdminCuratedSections';
import { AdminReviews } from './AdminReviews';
import { AdminCMSPages } from './AdminCMSPages';
import { AdminCoupons } from './AdminCoupons';
import { AdminFlashSales } from './AdminFlashSales';
import { AdminSettings } from './AdminSettings';
import { AdminBranding } from './AdminBranding';
import { AdminNavigation } from './AdminNavigation';
import { AdminFooter } from './AdminFooter';
import { AdminSubscribers } from './AdminSubscribers';
import { AdminOrderNotifications } from './AdminOrderNotifications';
import { Order } from '../../types';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'curated_sections'
  | 'categories'
  | 'reviews'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'flash_sales'
  | 'cms_pages'
  | 'branding'
  | 'navigation'
  | 'footer'
  | 'subscribers'
  | 'settings';

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    groupTitle: 'Dashboard',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    groupTitle: 'Catalog',
    items: [
      { id: 'products', label: 'Products', icon: Package },
      { id: 'categories', label: 'Categories', icon: FolderTree },
      { id: 'flash_sales', label: 'Banners & Sales', icon: Flame },
      { id: 'curated_sections', label: 'Trending & Best Sellers', icon: TrendingUp },
      { id: 'reviews', label: 'Reviews', icon: Star },
    ],
  },
  {
    groupTitle: 'Sales',
    items: [
      { id: 'orders', label: 'Orders', icon: ShoppingBag },
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'coupons', label: 'Coupons', icon: Tag },
    ],
  },
  {
    groupTitle: 'Storefront',
    items: [
      { id: 'cms_pages', label: 'CMS Pages', icon: FileText },
      { id: 'navigation', label: 'Navigation Menu', icon: Menu },
      { id: 'footer', label: 'Footer', icon: Layers },
      { id: 'branding', label: 'Branding', icon: Palette },
      { id: 'subscribers', label: 'Subscribers', icon: MessageSquare },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

const allNavItems = navGroups.flatMap(g => g.items);

export const AdminLayout: React.FC = () => {
  const { toggleAdminMode } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [targetOrder, setTargetOrder] = useState<Order | null>(null);
  const [authed, setAuthed] = useState(isAdminAuthenticated());

  // Listen for auth changes from AdminLogin
  useEffect(() => {
    const handler = () => setAuthed(true);
    window.addEventListener('admin-auth-change', handler);
    return () => window.removeEventListener('admin-auth-change', handler);
  }, []);

  const handleSelectNotificationOrder = (order: Order) => {
    setTargetOrder(order);
    setActiveTab('orders');
  };

  // Show login gate if not authenticated
  if (!authed) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-[#18181b] text-[#d4d4d8] flex">
      {/* Admin Sidebar */}
      <aside className="w-56 bg-[#121214] border-r border-[#27272a] flex flex-col justify-between p-3 shrink-0 hidden md:flex overflow-y-auto">
        <div className="space-y-4">
          {/* Logo */}
          <div className="px-2 py-1">
            <Logo variant="light" size="sm" />
            <div className="mt-2 flex items-center gap-1.5 bg-[#27272a] px-2.5 py-1.5 rounded-lg text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ea580c]" />
              <span className="font-bold text-[#fed7aa] uppercase">Admin Panel</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-3">
            {navGroups.map(group => (
              <div key={group.groupTitle} className="space-y-0.5">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#52525b]">
                  {group.groupTitle}
                </div>
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#ea580c] text-white'
                          : 'text-[#a1a1aa] hover:bg-[#27272a] hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Exit Button */}
        <div className="pt-3 border-t border-[#27272a] mt-3">
          <button
            onClick={() => toggleAdminMode(false)}
            className="w-full flex items-center justify-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white py-2.5 rounded-xl text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Store</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        {/* Top Bar */}
        <header className="bg-[#121214] border-b border-[#27272a] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Tab Switcher */}
            <div className="md:hidden">
              <select
                value={activeTab}
                onChange={e => setActiveTab(e.target.value as AdminTab)}
                className="bg-[#27272a] text-white text-xs font-bold px-3 py-2 rounded-xl"
              >
                {allNavItems.map(item => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>
            <h2 className="font-cinzel text-base font-bold text-white uppercase hidden md:block">
              {allNavItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <AdminOrderNotifications
              onSelectOrder={handleSelectNotificationOrder}
              onNavigateToOrders={() => setActiveTab('orders')}
            />
            <button
              onClick={() => toggleAdminMode(false)}
              className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Exit
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={tab => setActiveTab(tab)} />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'curated_sections' && <AdminCuratedSections />}
          {activeTab === 'categories' && <AdminCategories />}
          {activeTab === 'reviews' && <AdminReviews />}
          {activeTab === 'orders' && (
            <AdminOrders
              initialSelectedOrder={targetOrder}
              onClearInitialOrder={() => setTargetOrder(null)}
            />
          )}
          {activeTab === 'customers' && <AdminCustomers />}
          {activeTab === 'coupons' && <AdminCoupons />}
          {activeTab === 'flash_sales' && <AdminFlashSales />}
          {activeTab === 'cms_pages' && <AdminCMSPages />}
          {activeTab === 'branding' && <AdminBranding />}
          {activeTab === 'navigation' && <AdminNavigation />}
          {activeTab === 'footer' && <AdminFooter />}
          {activeTab === 'subscribers' && <AdminSubscribers />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
};
