import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Customer,
  Coupon,
  StoreSettings,
  Category,
  AdminRole,
  NavItem,
  FooterConfig,
} from '../types';
import { api } from '../services/api';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export type AppView =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'account'
  | 'wishlist'
  | 'cms'
  | 'admin';

interface StoreContextType {
  // Navigation
  currentView: AppView;
  viewParams: Record<string, any>;
  navigate: (view: AppView, params?: Record<string, any>) => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  total: number;
  freeShippingProgress: number;
  addToCart: (
    product: Product,
    selectedSize: string,
    stitchChoice?: 'unstitched' | 'stitched',
    selectedColor?: string,
    quantity?: number,
    customMeasurements?: CartItem['customMeasurements']
  ) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Wishlist
  wishlist: Product[];
  wishlistCount: number;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Auth / Customer
  customer: Customer | null;
  loginCustomer: (email: string) => Promise<void>;
  logoutCustomer: () => void;

  // Admin Mode
  isAdmin: boolean;
  adminRole: AdminRole;
  setAdminRole: (role: AdminRole) => void;
  toggleAdminMode: (enable?: boolean) => void;

  // Modals & Drawers
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | null) => void;
  isAIStylistOpen: boolean;
  setIsAIStylistOpen: (open: boolean) => void;

  // Global Data
  settings: StoreSettings | null;
  categories: Category[];
  navItems: NavItem[];
  footerConfig: FooterConfig | null;
  refreshSettings: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshNavItems: () => Promise<void>;
  refreshFooterConfig: () => Promise<void>;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Formatting
  formatPrice: (amount: number) => string;
}

const StoreContext = createContext<StoreContextType | null>(null);

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'STITCH & UNSTITCHED',
  tagline: 'Modern Pakistani Sartorial Luxury',
  logo: '/logo.png',
  phone: '+92 21 35870000',
  whatsapp: '+92 300 1234567',
  email: 'care@stitchandunstitched.com',
  address: 'Plot 24-C, Khayaban-e-Shahbaz, Phase 6, DHA',
  city: 'Karachi, Pakistan',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  freeShippingThreshold: 3000,
  karachiShippingFee: 150,
  nationwideShippingFee: 250,
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  tiktokUrl: 'https://tiktok.com',
  youtubeUrl: 'https://youtube.com',
  announcementText: 'FREE DELIVERY ON ORDERS ABOVE RS. 3,000 | KARACHI DELIVERY AVAILABLE',
  enableCod: true,
  enableBankTransfer: true,
  bankDetails: {
    bankName: 'Meezan Bank Limited',
    accountTitle: 'STITCH AND UNSTITCHED (PVT) LTD',
    accountNumber: '01020304050607',
    iban: 'PK45MEZN0001020304050607'
  },
  seoTitle: 'Stitch & Unstitched | Luxury Pakistani Stitched & Unstitched Fashion Karachi',
  seoDescription: 'Discover luxury Pakistani lawn, unstitched festive fabrics, ready-to-wear kurtis, and men\'s shalwar kameez.'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [viewParams, setViewParams] = useState<Record<string, any>>({});

  // Cart & Wishlist persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('su_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('su_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Customer Auth
  const [customer, setCustomer] = useState<Customer | null>(() => {
    try {
      const saved = localStorage.getItem('su_customer');
      return saved ? JSON.parse(saved) : {
        id: 'cust-1',
        name: 'Ayesha Siddiqui',
        email: 'ayesha.siddiqui@gmail.com',
        phone: '+92 321 8472910',
        addresses: [
          {
            id: 'addr-1',
            title: 'Home (DHA)',
            fullName: 'Ayesha Siddiqui',
            phone: '+92 321 8472910',
            address: 'Apartment 4B, Creek Vistas, Phase 8',
            area: 'DHA Phase 8',
            city: 'Karachi',
            isDefault: true
          }
        ],
        wishlistProductIds: [],
        totalSpent: 16800,
        ordersCount: 3,
        isActive: true,
        createdAt: new Date().toISOString()
      };
    } catch {
      return null;
    }
  });

  // Admin Role State
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole>('super_admin');

  // Modals
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAIStylistOpen, setIsAIStylistOpen] = useState(false);

  // Global Config & Toasts
  const [settings, setSettings] = useState<StoreSettings | null>(DEFAULT_SETTINGS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync Cart & Wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('su_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('su_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (customer) {
      localStorage.setItem('su_customer', JSON.stringify(customer));
    }
  }, [customer]);

  // Initial loads
  const refreshSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data && data.storeName) setSettings(data);
    } catch (e) {
      console.warn('Using default settings fallback');
    }
  };

  const refreshCategories = async () => {
    try {
      const data = await api.getCategories();
      if (Array.isArray(data)) setCategories(data);
    } catch (e) {
      console.warn('Failed to load categories');
    }
  };

  const refreshNavItems = async () => {
    try {
      const data = await api.getNavItems();
      if (Array.isArray(data)) setNavItems(data);
    } catch (e) {
      console.warn('Failed to load nav items');
    }
  };

  const refreshFooterConfig = async () => {
    try {
      const data = await api.getFooterConfig();
      if (data && data.sections) setFooterConfig(data);
    } catch (e) {
      console.warn('Failed to load footer config');
    }
  };

  useEffect(() => {
    refreshSettings();
    refreshCategories();
    refreshNavItems();
    refreshFooterConfig();
  }, []);

  // Toasts
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Navigation
  const navigate = (view: AppView, params: Record<string, any> = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const freeShippingThreshold = settings?.freeShippingThreshold || 3000;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : (settings?.karachiShippingFee || 150);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const total = Math.max(0, subtotal - couponDiscount + shippingFee);

  const addToCart = (
    product: Product,
    selectedSize: string,
    stitchChoice: 'unstitched' | 'stitched' = 'unstitched',
    selectedColor?: string,
    quantity = 1,
    customMeasurements?: CartItem['customMeasurements']
  ) => {
    const itemPrice = (product.salePrice || product.price) + (stitchChoice === 'stitched' && product.customStitchingFee ? product.customStitchingFee : 0);
    const cartItemId = `${product.id}-${selectedSize}-${stitchChoice}-${selectedColor || 'default'}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        product,
        selectedSize,
        selectedColor,
        stitchChoice,
        customMeasurements,
        quantity,
        price: itemPrice,
      };
      return [...prev, newItem];
    });

    addToast({
      type: 'success',
      title: 'Added to Bag',
      message: `${product.name} (${selectedSize}, ${stitchChoice}) is now in your shopping bag.`,
    });

    setIsCartDrawerOpen(true);
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => (item.id === itemId ? { ...item, quantity: qty } : item)));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    addToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Item was removed from your bag.',
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.valid && res.coupon && res.discount !== undefined) {
        setAppliedCoupon(res.coupon);
        setCouponDiscount(res.discount);
        addToast({
          type: 'success',
          title: 'Coupon Applied!',
          message: `Saved Rs. ${res.discount.toLocaleString()} with code ${res.coupon.code}.`,
        });
        return { success: true, message: res.message || 'Coupon applied' };
      } else {
        addToast({
          type: 'error',
          title: 'Invalid Coupon',
          message: res.message || 'Coupon cannot be applied.',
        });
        return { success: false, message: res.message || 'Invalid coupon' };
      }
    } catch {
      return { success: false, message: 'Failed to apply coupon.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    addToast({
      type: 'info',
      title: 'Coupon Removed',
      message: 'Coupon was removed from your order.',
    });
  };

  // Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        addToast({
          type: 'info',
          title: 'Removed from Wishlist',
          message: `${product.name} removed from your saved items.`,
        });
        return prev.filter(p => p.id !== product.id);
      } else {
        addToast({
          type: 'success',
          title: 'Added to Wishlist',
          message: `${product.name} saved to your wishlist.`,
        });
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  const wishlistCount = wishlist.length;

  // Customer Login/Logout
  const loginCustomer = async (email: string) => {
    try {
      const res = await api.loginCustomer(email);
      setCustomer(res.customer);
      addToast({
        type: 'success',
        title: 'Welcome Back',
        message: `Signed in as ${res.customer.name || res.customer.email}.`,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Sign In Failed',
        message: 'Could not sign into account.',
      });
    }
  };

  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem('su_customer');
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been signed out successfully.',
    });
  };

  const toggleAdminMode = (enable?: boolean) => {
    const next = enable !== undefined ? enable : !isAdmin;
    setIsAdmin(next);
    if (next) {
      navigate('admin');
    } else {
      navigate('home');
    }
  };

  const formatPrice = (amount: number) => {
    return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        viewParams,
        navigate,
        cart,
        cartCount,
        subtotal,
        shippingFee,
        appliedCoupon,
        couponDiscount,
        total,
        freeShippingProgress,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        wishlist,
        wishlistCount,
        toggleWishlist,
        isInWishlist,
        customer,
        loginCustomer,
        logoutCustomer,
        isAdmin,
        adminRole,
        setAdminRole,
        toggleAdminMode,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        isAIStylistOpen,
        setIsAIStylistOpen,
        settings,
        categories,
        navItems,
        footerConfig,
        refreshSettings,
        refreshCategories,
        refreshNavItems,
        refreshFooterConfig,
        toasts,
        addToast,
        removeToast,
        formatPrice,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
