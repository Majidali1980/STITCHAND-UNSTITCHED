import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { AIStylistModal } from './components/common/AIStylistModal';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { ToastContainer } from './components/common/Toast';

// Storefront Customer Pages
import { HomePage } from './components/home/HomePage';
import { ShopPage } from './components/shop/ShopPage';
import { CartPage } from './components/cart/CartPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderConfirmationPage } from './components/checkout/OrderConfirmationPage';
import { AccountPage } from './components/account/AccountPage';
import { CMSPageView } from './components/cms/CMSPageView';
import { ProductDetailPage } from './components/product/ProductDetailPage';

// Admin Panel Layout
import { AdminLayout } from './components/admin/AdminLayout';

const AppContent: React.FC = () => {
  const { currentView, isAdmin, settings } = useStore();

  // Dynamic Browser Tab Title and Favicon Synchronization
  useEffect(() => {
    if (settings?.storeName) {
      document.title = `${settings.storeName} | ${settings.tagline || 'Karachi Atelier 2026'}`;
    }
    const faviconUrl = settings?.faviconUrl || settings?.favicon;
    if (faviconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [settings?.storeName, settings?.tagline, settings?.favicon, settings?.faviconUrl]);

  if (currentView === 'admin' || isAdmin) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#d4d4d8] font-sans antialiased">
        <AdminLayout />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#1c1917] font-sans antialiased selection:bg-[#ea580c] selection:text-white">
      {/* Primary Storefront Header with Dual Full-Width Navbars */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {currentView === 'home' && <HomePage />}
        {currentView === 'shop' && <ShopPage />}
        {currentView === 'product-detail' && <ProductDetailPage />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'order-confirmation' && <OrderConfirmationPage />}
        {currentView === 'account' && <AccountPage />}
        {currentView === 'cms' && <CMSPageView />}
      </main>

      {/* Primary Storefront Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <AIStylistModal />
      <WhatsAppButton />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
