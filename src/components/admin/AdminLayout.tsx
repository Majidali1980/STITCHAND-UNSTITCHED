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
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../common/Logo';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCategories } from './AdminCategories';
import { AdminCoupons } from './AdminCoupons';
import { AdminFlashSales } from './AdminFlashSales';
import { AdminSettings } from './AdminSettings';
import { AdminBranding } from './AdminBranding';
import { AdminNavigation } from './AdminNavigation';
import { AdminFooter } from './AdminFooter';
import { AdminSubscribers } from './AdminSubscribers';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'categories'
  | 'subscribers'
  | 'coupons'
  | 'flash_sales'
  | 'branding'
  | 'navigation'
  | 'footer'
  | 'settings';

export const AdminLayout: React.FC = () => {
  const { toggleAdminMode, adminRole, setAdminRole, navigate } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Analytics', icon: LayoutDashboard },
    { id: 'branding', label: 'Brand Identity & Logo (CRUD)', icon: Palette },
    { id: 'navigation', label: 'Navbar Menu (CRUD)', icon: Menu },
    { id: 'footer', label: 'Footer & Badges (CRUD)', icon: Layers },
    { id: 'subscribers', label: 'Newsletter & WhatsApp VIP (Broadcast)', icon: Users },
    { id: 'products', label: 'Products Catalog', icon: Package },
    { id: 'orders', label: 'Orders & Dispatch', icon: ShoppingBag },
    { id: 'categories', label: 'Categories & Couture', icon: FolderTree },
    { id: 'coupons', label: 'Coupons & Discounts', icon: Tag },
    { id: 'flash_sales', label: 'Hero Banners & Sales (CRUD)', icon: Flame },
    { id: 'settings', label: 'Store & Karachi Rates', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#18181b] text-[#d4d4d8] flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#121214] border-r border-[#27272a] flex flex-col justify-between p-4 shrink-0 hidden md:flex">
        <div className="space-y-6">
          {/* Logo & Admin Badge */}
          <div className="px-2 py-1">
            <Logo variant="light" size="sm" />
            <div className="mt-2 flex items-center justify-between bg-[#27272a] px-2.5 py-1 rounded-lg text-[10px]">
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

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#ea580c] text-white shadow-md'
                      : 'text-[#a1a1aa] hover:bg-[#27272a] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-[#27272a] space-y-2">
          <button
            onClick={() => {
              toggleAdminMode(false);
              navigate('home');
            }}
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
                {navItems.map(item => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>

            <div className="hidden md:block">
              <h2 className="font-cinzel text-base font-bold text-white uppercase">
                {navItems.find(i => i.id === activeTab)?.label}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#a1a1aa] hidden sm:inline">
              Karachi Store: <strong>ONLINE &bull; 24/7</strong>
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
          {activeTab === 'branding' && <AdminBranding />}
          {activeTab === 'navigation' && <AdminNavigation />}
          {activeTab === 'footer' && <AdminFooter />}
          {activeTab === 'subscribers' && <AdminSubscribers />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'categories' && <AdminCategories />}
          {activeTab === 'coupons' && <AdminCoupons />}
          {activeTab === 'flash_sales' && <AdminFlashSales />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
};

