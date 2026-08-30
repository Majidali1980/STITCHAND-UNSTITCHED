import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Flame,
  Truck,
  MessageCircle,
  Scissors,
  Package,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const {
    currentView,
    viewParams,
    navigate,
    cartCount,
    subtotal,
    wishlistCount,
    categories,
    navItems,
    setIsCartDrawerOpen,
    setIsSearchOpen,
    setIsAIStylistOpen,
    customer,
    settings,
    formatPrice,
    toggleAdminMode,
    isAdmin,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cleanWhatsAppPhone = (settings?.whatsapp || '+92 300 1234567').replace(/[^0-9]/g, '');

  // Dynamic Navigation Links from Admin CRUD (fallback to default Karachi links if empty)
  const defaultNavLinks = [
    { id: 'def-1', label: 'Home', view: 'home', params: {}, sortOrder: 1, isActive: true },
    { id: 'def-2', label: 'Ladies', view: 'shop', params: { category: 'ladies' }, sortOrder: 2, isActive: true },
    { id: 'def-3', label: 'Gents', view: 'shop', params: { category: 'gents' }, sortOrder: 3, isActive: true },
    { id: 'def-4', label: 'Kids', view: 'shop', params: { category: 'kids' }, sortOrder: 4, isActive: true },
    { id: 'def-5', label: 'Home Apparel', view: 'shop', params: { category: 'home-apparel' }, sortOrder: 5, isActive: true },
    { id: 'def-6', label: 'Bags', view: 'shop', params: { category: 'bags' }, sortOrder: 6, isActive: true },
    { id: 'def-7', label: 'Unstitched', view: 'shop', params: { stitchType: 'unstitched' }, sortOrder: 7, isActive: true },
    { id: 'def-8', label: 'Ready-to-Wear', view: 'shop', params: { stitchType: 'stitched' }, badge: 'HOT', sortOrder: 8, isActive: true },
    { id: 'def-9', label: 'All Categories', view: 'shop', isDropdown: true, sortOrder: 9, isActive: true },
    { id: 'def-10', label: 'Flash Sale', view: 'shop', params: { isSale: true }, isSale: true, badge: '50% OFF', sortOrder: 10, isActive: true },
    { id: 'def-11', label: 'Track Order', view: 'account', params: { tab: 'orders' }, sortOrder: 11, isActive: true },
  ];

  const activeNavItems = (navItems && navItems.length > 0)
    ? navItems.filter(item => item.isActive !== false).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    : defaultNavLinks;

  const categoriesList = categories.length > 0
    ? categories.map(c => ({
        id: c.slug || c.name.toLowerCase(),
        name: c.name,
        subcategories: c.subcategories || [],
      }))
    : [
        { id: 'ladies', name: 'LADIES', subcategories: ['Stitched Pret', 'Unstitched Luxury Lawn', '3-Piece Luxury Suits', 'Kurtis & Tops', 'Chiffon & Formals', 'Bottoms & Trousers'] },
        { id: 'gents', name: 'GENTS', subcategories: ['Stitched Kurtas & Shalwar', 'Unstitched Latha & Egyptian Cotton', 'Festive Waistcoats & Prince Coats', 'Trousers & Pajamas'] },
        { id: 'kids', name: 'KIDS', subcategories: ['Stitched Pret', 'Unstitched Fabric', 'Boys Collection', 'Girls Collection', 'Festive Eid Wear'] },
        { id: 'home-apparel', name: 'HOME APPAREL', subcategories: ['Luxury Bedding', 'Embroidered Cushions', 'Table Runners'] },
        { id: 'bags', name: 'BAGS', subcategories: ['Velvet Clutches', 'Potli Pouches', 'Evening Minaudières'] },
      ];

  const categoryMenu = categoriesList.map(c => ({
    name: c.name,
    params: { category: c.id },
    subcategories: c.subcategories || [],
  }));

  const handleLaunchWhatsApp = () => {
    const msg = encodeURIComponent('Salam! I would like assistance with Stitch & Unstitched Karachi collections.');
    window.open(`https://wa.me/${cleanWhatsAppPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white shadow-md">
      {/* Top Notice Bar with Smooth Left-to-Right Continuous Marquee */}
      <div className="w-full bg-[#1c1917] text-[#fed7aa] text-[11px] py-1.5 overflow-hidden select-none">
        <div className="animate-marquee-ltr flex items-center space-x-10 whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 font-medium tracking-wide">
              <span className="inline-block w-2 h-2 rounded-full bg-[#ea580c] animate-pulse shrink-0"></span>
              <span>{settings?.announcementText || '✨ FREE EXPRESS DELIVERY IN KARACHI ON ORDERS OVER RS. 3,000 | SAME DAY DISPATCH AVAILABLE'}</span>
              <span className="text-[#78716c]">&bull;</span>
              <span className="text-[#fb923c] uppercase font-bold text-[10px] tracking-widest">LUXURY LAWN &amp; READY-TO-WEAR 2026</span>
              <span className="text-[#78716c]">&bull;</span>
              <span className="text-white font-semibold">ALL PAKISTAN CASH ON DELIVERY</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NAVBAR 1: NAME, LOGO & PRIMARY ACTION ICONS (Full Width)                  */}
      {/* ========================================================================= */}
      <div className="w-full bg-white transition-all duration-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 md:gap-6">
          {/* Mobile Left: Menu Toggle */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              id="mobile-menu-button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-[#292524] hover:text-[#ea580c] transition-colors rounded-xl"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#292524] hover:text-[#ea580c] transition-colors rounded-xl"
              aria-label="Search store"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Left / Brand Logo & Name */}
          <div
            id="brand-logo-container"
            onClick={() => navigate('home')}
            className="cursor-pointer flex items-center gap-3 shrink-0"
          >
            <Logo size={isScrolled ? 'sm' : 'md'} />
          </div>

          {/* Center: Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-4">
            <div
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center gap-3 bg-[#faf8f5] hover:bg-[#f5f2eb] text-[#78716c] px-4 py-2.5 rounded-full text-xs font-medium border border-[#e5dfd3] hover:border-[#ea580c]/50 transition-all cursor-pointer shadow-2xs group"
            >
              <Search className="w-4 h-4 text-[#ea580c] group-hover:scale-110 transition-transform" />
              <span className="flex-1 text-[#78716c]">Search Pakistani luxury lawn, stitched kurtis, fabrics, men&apos;s kurta...</span>
              <kbd className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-[#d6cfc4] text-[#a8a29e] font-mono shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right: Primary Action Icons */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {/* AI Fashion Stylist */}
            <button
              id="header-ai-stylist-btn"
              onClick={() => setIsAIStylistOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#ea580c] bg-[#fff7ed] hover:bg-[#ffedd5] px-3.5 py-2 rounded-full border border-[#fed7aa] transition-all shadow-2xs hover:scale-105 active:scale-95"
              title="AI Fashion & Sizing Stylist"
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#ea580c]" />
              <span className="hidden md:inline">AI Stylist</span>
            </button>

            {/* WhatsApp Direct */}
            <button
              id="header-whatsapp-btn"
              onClick={handleLaunchWhatsApp}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-full border border-emerald-200 transition-all shadow-2xs hover:scale-105 active:scale-95"
              title="Chat with Karachi Concierge on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline">WhatsApp</span>
            </button>

            {/* Wishlist */}
            <button
              id="header-wishlist-btn"
              onClick={() => navigate('account', { tab: 'wishlist' })}
              className="relative p-2.5 text-[#44403c] hover:text-[#ea580c] hover:bg-[#faf8f5] rounded-full transition-colors"
              aria-label="Wishlist"
              title="Saved Wishlist Items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#ea580c] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scaleIn shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Customer Account */}
            <button
              id="header-account-btn"
              onClick={() => navigate('account')}
              className="p-2.5 text-[#44403c] hover:text-[#ea580c] hover:bg-[#faf8f5] rounded-full transition-colors relative"
              aria-label="Account"
              title={customer ? `Signed in as ${customer.name}` : 'Sign In / Account'}
            >
              <User className="w-5 h-5" />
              {customer && (
                <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Admin Management Panel */}
            <button
              id="header-admin-btn"
              onClick={() => toggleAdminMode(true)}
              className="p-2.5 text-[#44403c] hover:text-[#ea580c] hover:bg-[#faf8f5] rounded-full transition-colors hidden lg:flex items-center"
              aria-label="Admin Dashboard"
              title="Open Admin Management Panel"
            >
              <ShieldCheck className="w-5 h-5 text-[#ea580c]" />
            </button>

            {/* Shopping Bag / Cart */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative bg-[#1c1917] hover:bg-[#ea580c] text-white px-3.5 py-2 rounded-full transition-all duration-200 shadow-md flex items-center gap-2 group active:scale-95"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ea580c] group-hover:bg-white group-hover:text-[#ea580c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold text-xs">
                {subtotal > 0 ? formatPrice(subtotal) : 'Bag'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NAVBAR 2: CATEGORIES, COLLECTIONS & LINKS (Full Width Edge-to-Edge)       */}
      {/* ========================================================================= */}
      <nav
        id="secondary-navbar"
        className="w-full bg-[#18181b] text-white shadow-inner overflow-x-auto no-scrollbar scrollbar-none"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 py-2">
          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 overflow-x-auto no-scrollbar scrollbar-none whitespace-nowrap py-0.5">
            {activeNavItems.map(link => {
              const labelUpper = (link.label || '').toUpperCase();
              const isCategoryNav =
                labelUpper === 'KIDS' ||
                labelUpper === 'LADIES' ||
                labelUpper === 'GENTS' ||
                labelUpper === 'HOME APPAREL' ||
                labelUpper === 'BAGS';

              // Get matching category info
              const matchedCat = categoriesList?.find(
                c => c.name.toUpperCase() === labelUpper || c.id.toUpperCase() === labelUpper
              );

              if (link.isDropdown || isCategoryNav) {
                const subcats =
                  labelUpper === 'KIDS'
                    ? [
                        { label: 'All Kids Collection', params: { category: 'kids' } },
                        { label: 'Stitched Pret', params: { category: 'kids', stitchType: 'stitched' } },
                        { label: 'Unstitched Fabric', params: { category: 'kids', stitchType: 'unstitched' } },
                        { label: 'For Boys (Kurta Shalwar & Waistcoats)', params: { category: 'kids', subcategory: 'Boys Collection' } },
                        { label: 'For Girls (Gharara, Kurti & Frocks)', params: { category: 'kids', subcategory: 'Girls Collection' } },
                        { label: 'Festive Eid Wear', params: { category: 'kids', subcategory: 'Festive Eid Wear' } },
                      ]
                    : labelUpper === 'LADIES'
                    ? [
                        { label: 'All Ladies Collection', params: { category: 'ladies' } },
                        { label: 'Stitched Pret', params: { category: 'ladies', stitchType: 'stitched' } },
                        { label: 'Unstitched Luxury Lawn', params: { category: 'ladies', stitchType: 'unstitched' } },
                        { label: '3-Piece Luxury Suits', params: { category: 'ladies', subcategory: '3-Piece Luxury Suits' } },
                        { label: 'Kurtis & Tops', params: { category: 'ladies', subcategory: 'Kurtis & Tops' } },
                        { label: 'Chiffon & Formals', params: { category: 'ladies', subcategory: 'Chiffon & Festive Formals' } },
                        { label: 'Bottoms & Trousers', params: { category: 'ladies', subcategory: 'Bottoms & Trousers' } },
                      ]
                    : labelUpper === 'GENTS'
                    ? [
                        { label: 'All Gents Collection', params: { category: 'gents' } },
                        { label: 'Stitched Kurtas & Shalwar', params: { category: 'gents', stitchType: 'stitched' } },
                        { label: 'Unstitched Latha & Egyptian Cotton', params: { category: 'gents', stitchType: 'unstitched' } },
                        { label: 'Festive Waistcoats & Prince Coats', params: { category: 'gents', subcategory: 'Festive Waistcoats & Prince Coats' } },
                        { label: 'Trousers & Pajamas', params: { category: 'gents', subcategory: 'Trousers & Pajamas' } },
                      ]
                    : link.isDropdown
                    ? categoryMenu.map(c => ({ label: c.name, params: c.params }))
                    : (matchedCat?.subcategories || []).map(sub => ({
                        label: sub,
                        params: { category: matchedCat?.id, subcategory: sub },
                      }));

                const isLinkActive =
                  currentView === 'shop' &&
                  ((viewParams.category || '').toLowerCase() === labelUpper.toLowerCase() ||
                    (labelUpper === 'KIDS' && (viewParams.gender === 'kids' || viewParams.category === 'kids')));

                return (
                  <div key={link.id || link.label} className="relative group">
                    <button
                      onClick={() => navigate('shop', link.params || { category: labelUpper.toLowerCase() })}
                      className={`flex items-center gap-1 text-[11px] md:text-xs uppercase tracking-wider font-semibold transition-all px-2.5 py-1.5 rounded-md ${
                        isLinkActive
                          ? 'text-white bg-[#27272a] font-bold shadow-xs'
                          : 'text-[#d4d4d8] hover:text-white hover:bg-[#27272a]'
                      }`}
                    >
                      {link.isDropdown && <Layers className="w-3 h-3 text-[#ea580c]" />}
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="bg-[#ea580c] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ml-0.5">
                          {link.badge}
                        </span>
                      )}
                      <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180 text-[#a1a1aa]" />
                    </button>

                    {/* Subcategory Megamenu Dropdown */}
                    <div className="absolute top-full left-0 w-64 bg-[#18181b] border border-[#27272a] rounded-2xl shadow-2xl p-2.5 opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-1 group-hover:pointer-events-auto transition-all duration-200 z-50">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa] px-3 py-1 mb-1 border-b border-[#27272a]">
                        {link.label} Subcategories
                      </div>
                      <div className="space-y-0.5">
                        {subcats.map((item: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => navigate('shop', item.params)}
                            className="w-full text-left px-3 py-1.5 text-xs font-medium text-[#d4d4d8] hover:bg-[#27272a] hover:text-[#fed7aa] rounded-xl transition-colors flex items-center justify-between group/item"
                          >
                            <span>{item.label}</span>
                            <span className="text-[10px] text-[#71717a] group-hover/item:text-[#ea580c]">&rarr;</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              const isLinkActive =
                currentView === link.view &&
                JSON.stringify(viewParams || {}) === JSON.stringify(link.params || {});

              const handleNavClick = () => {
                if (link.url) {
                  if (link.openInNewTab) {
                    window.open(link.url, '_blank', 'noopener,noreferrer');
                  } else {
                    window.location.href = link.url;
                  }
                  return;
                }
                navigate((link.view || 'home') as any, link.params);
              };

              return (
                <button
                  key={link.id || link.label}
                  onClick={handleNavClick}
                  className={`text-[11px] md:text-xs uppercase tracking-wider font-semibold transition-all px-2.5 py-1.5 rounded-md flex items-center gap-1.5 shrink-0 ${
                    link.isSale
                      ? 'text-[#ea580c] hover:text-white bg-orange-950/40 hover:bg-[#ea580c] border border-orange-800/60 font-bold'
                      : isLinkActive
                      ? 'text-white bg-[#27272a] font-bold shadow-xs'
                      : 'text-[#d4d4d8] hover:text-white hover:bg-[#27272a]'
                  }`}
                >
                  {link.isSale && <Flame className="w-3 h-3 fill-[#ea580c] text-[#ea580c]" />}
                  {link.label?.toLowerCase().includes('unstitched') && <Scissors className="w-3 h-3 text-[#ea580c]" />}
                  {link.label?.toLowerCase().includes('order') && <Package className="w-3 h-3 text-[#ea580c]" />}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-[#ea580c] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ml-0.5">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Status Badge in Navbar 2 */}
          <div className="hidden 2xl:flex items-center gap-2 text-[11px] text-[#a1a1aa] shrink-0 font-medium pl-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Karachi Express Hub Active</span>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER MENU                                                        */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#121214] text-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto border-r border-[#27272a]">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-[#27272a] flex items-center justify-between bg-[#18181b]">
                <Logo variant="light" size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#a1a1aa] hover:text-white rounded-full hover:bg-[#27272a]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Karachi Delivery Badge */}
              <div className="bg-orange-950/40 px-4 py-2.5 border-b border-orange-900/60 flex items-center gap-2 text-xs font-semibold text-[#fed7aa]">
                <Truck className="w-4 h-4 shrink-0 text-[#ea580c]" />
                <span>Karachi 24h Express Delivery</span>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-1">
                {activeNavItems.map(link => {
                  if (link.isDropdown) return null;

                  const handleMobileNavClick = () => {
                    setMobileMenuOpen(false);
                    if (link.url) {
                      if (link.openInNewTab) {
                        window.open(link.url, '_blank', 'noopener,noreferrer');
                      } else {
                        window.location.href = link.url;
                      }
                      return;
                    }
                    navigate((link.view || 'home') as any, link.params);
                  };

                  return (
                    <button
                      key={link.id || link.label}
                      onClick={handleMobileNavClick}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-between ${
                        link.isSale
                          ? 'text-[#ea580c] bg-orange-950/30 border border-orange-800/40 font-bold'
                          : 'text-[#d4d4d8] hover:bg-[#18181b] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="bg-[#ea580c] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      {link.isSale && <Flame className="w-3.5 h-3.5 fill-[#ea580c]" />}
                    </button>
                  );
                })}

                <div className="pt-3 border-t border-[#27272a] mt-3">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa] px-3 mb-2">
                    Pakistani Couture &amp; Subcategories
                  </div>
                  {categoriesList.map(cat => (
                    <div key={cat.id} className="mb-2 bg-[#18181b] rounded-xl p-2 border border-[#27272a]">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('shop', { category: cat.id });
                        }}
                        className="w-full text-left px-2 py-1 text-xs font-bold text-[#fed7aa] uppercase hover:text-white flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-[#ea580c]">View All &rarr;</span>
                      </button>
                      <div className="mt-1 pl-2 border-l border-[#3f3f46] space-y-1">
                        {(cat.subcategories || []).map((sub: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              navigate('shop', { category: cat.id, subcategory: sub });
                            }}
                            className="w-full text-left px-2 py-1 text-[11px] text-[#a1a1aa] hover:text-white hover:bg-[#27272a] rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span>{sub}</span>
                            <span className="text-[9px] text-[#71717a]">&bull;</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#27272a] bg-[#18181b] space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAIStylistOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#ea580c] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ask AI Fashion Stylist
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLaunchWhatsApp();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Karachi Support
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  toggleAdminMode(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#27272a] hover:bg-[#3f3f46] text-[#fed7aa] rounded-xl text-xs font-bold uppercase tracking-wider border border-[#44403c]"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#ea580c]" />
                Admin Management Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
