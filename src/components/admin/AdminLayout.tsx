import React, { useState } from 'react';
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
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Palette,
  Menu,
  Layers,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../common/Logo';
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

interface NavGroup {
  groupTitle: string;
  items: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[];
}

export const AdminLayout: React.FC = () => {
  const { toggleAdminMode, adminRole, setAdminRole } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [targetOrder, setTargetOrder] = useState<Order | null>(null);

  const handleSelectNotificationOrder = (order: Order) => {
    setTargetOrder(order);
    setActiveTab('orders');
  };

  const navGroups: NavGroup[] = [
    {
      groupTitle: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Live Dashboard & Analytics', icon: LayoutDashboard },
      ],
    },
    {
      groupTitle: 'CATALOG & MERCHANDISING',
      items: [
        { id: 'products', label: 'Products & Multi-Image (CRUD)', icon: Package },
        { id: 'curated_sections', label: 'Top Trends & Best Sellers', icon: TrendingUp },
        { id: 'categories', label: 'Categories & Subcategories', icon: FolderTree },
        { id: 'reviews', label: 'Customer Reviews & Approval', icon: Star },
        { id: 'flash_sales', label: 'Hero Banners & Sales (CRUD)', icon: Flame },
      ],
    },
    {
      groupTitle: 'SALES & CLIENTS',
      items: [
        { id: 'orders', label: 'Orders & Excel Dispatch', icon: ShoppingBag },
        { id: 'customers', label: 'Client Directory & WhatsApp', icon: Users },
        { id: 'coupons', label: 'Coupons & Promo Codes', icon: Tag },
      ],
    },
    {
      groupTitle: 'STOREFRONT CMS & BRANDING',
      items: [
        { id: 'branding', label: 'Brand Logo & Favicon (CRUD)', icon: Palette },
        { id: 'cms_pages', label: 'About Us & Contact Us CMS', icon: FileText },
        { id: 'navigation', label: 'Navbar Menu Builder (CRUD)', icon: Menu },
        { id: 'footer', label: 'Footer & Trust Badges (CRUD)', icon: Layers },
      ],
    },
    {
      groupTitle: 'MARKETING & CONFIG',
      items: [
        { id: 'subscribers', label: 'VIP Broadcast (SMS/WhatsApp)', icon: MessageSquare },
        { id: 'settings', label: 'Shipping Fees & Store Rates', icon: Settings },
      ],
    },
  ];

  const allNavItems = navGroups.flatMap(g => g.items);

  return (
    <div className="min-h-screen bg-[#18181b] text-[#d4d4d8] flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#121214] border-r border-[#27272a] flex flex-col justify-between p-4 shrink-0 hidden md:flex overflow-y-auto">
        <div className="space-y-5">
          {/* Logo & Admin Badge */}
          <div className="px-2 py-1">
            <Logo variant="light" size="sm" />
            <div className="mt-2.5 flex items-center justify-between bg-[#27272a] px-2.5 py-1.5 rounded-lg text-[10px]">
              <span className="font-bold text-[#fed7aa] uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ea580c]" />
                Role: {adminRole.replace('_', ' ')}
              </span>
              <select
                value={adminRole}
                onChange={e => setAdminRole(e.target.value as any)}
                className="bg-transparent text-[10px] text-[#a1a1aa] focus:outline-none cursor-pointer"
              >
                <option value="super_admin" className="bg-[#18181b]">Super Admin</option>
                <option value="admin" className="bg-[#18181b]">Admin</option>
                <option value="editor" className="bg-[#18181b]">Editor</option>
              </select>
            </div>
          </div>

          {/* Categorized Navigation Links */}
          <nav className="space-y-4">
            {navGroups.map(group => (
              <div key={group.groupTitle} className="space-y-1">
                <div className="px-3 text-[9px] font-extrabold uppercase tracking-widest text-[#71717a]">
                  {group.groupTitle}
                </div>
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#ea580c] text-white shadow-md'
                          : 'text-[#a1a1aa] hover:bg-[#27272a] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3 h-3 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-[#27272a] space-y-2 mt-4">
          <button
            onClick={() => toggleAdminMode(false)}
            className="w-full flex items-center justify-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white py-2.5 rounded-xl text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Customer Store</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        {/* Top Navbar */}
        <header className="bg-[#121214] border-b border-[#27272a] p-4 flex items-center justify-between">
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

            <div className="hidden md:block">
              <h2 className="font-cinzel text-base font-bold text-white uppercase">
                {allNavItems.find(i => i.id === activeTab)?.label}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time Order Alert Bell Notification */}
            <AdminOrderNotifications
              onSelectOrder={handleSelectNotificationOrder}
              onNavigateToOrders={() => setActiveTab('orders')}
            />

            <span className="text-xs text-[#a1a1aa] hidden sm:inline">
              Karachi Store: <strong className="text-emerald-400">ONLINE 24/7</strong>
            </span>
            <button
              onClick={() => toggleAdminMode(false)}
              className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Exit Admin
            </button>
          </div>
        </header>

        {/* Content View Body */}
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
