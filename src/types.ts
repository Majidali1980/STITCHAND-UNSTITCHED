export type StitchOption = 'unstitched' | 'stitched' | 'both';

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isMain?: boolean;
  isPrimary?: boolean;
  order?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  category: string;
  subcategory?: string;
  gender: 'women' | 'men' | 'kids' | 'unisex' | 'both' | 'all';
  brand: string;
  fabric: string; // Lawn, Cotton, Linen, Khaddar, Silk, Chiffon, Velvet, Jacquard
  collection?: string; // Summer Lawn 2026, Festive Eid, Winter Khaddar, Ready-to-Wear
  season?: string;
  price: number; // PKR
  salePrice?: number; // PKR
  costPrice?: number; // PKR
  stockQuantity: number;
  lowStockThreshold?: number;
  sizes: string[]; // XS, S, M, L, XL, Free Size, 2.5m, 3.0m
  colors: { name: string; hex: string }[];
  images: ProductImage[];
  tags?: string[];
  pieces: '1 Piece' | '2 Piece' | '3 Piece' | 'Unstitched Fabric' | string;
  stitchType: StitchOption;
  customStitchingFee?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isActive?: boolean;
  soldCount?: number;
  rating: number;
  reviewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  careInstructions?: string[] | string;
  fabricDetails?: string;
  includes?: string[];
  createdAt?: string;
}

export interface SubCategory {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  productCount?: number;
  imageUrl?: string;
  sortOrder?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  gender: 'women' | 'men' | 'kids' | 'home' | 'accessories' | 'both' | string;
  description?: string;
  image?: string;
  imageUrl?: string;
  productCount?: number;
  sortOrder?: number;
  isActive?: boolean;
  subcategories?: string[];
  subCategoryItems?: SubCategory[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  mobileImage?: string;
  ctaText: string;
  ctaUrl: string;
  position: 'hero' | 'promo-1' | 'promo-2' | 'promo-3' | 'sale-bar';
  sortOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface FlashSale {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  discountBadge?: string;
  discountPercentage?: number;
  bannerImage?: string;
  startDate?: string;
  endDate?: string;
  endTime?: string;
  isActive: boolean;
  productIds?: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  stitchChoice: 'unstitched' | 'stitched';
  customMeasurements?: {
    chest?: string;
    waist?: string;
    hips?: string;
    shirtLength?: string;
    trouserLength?: string;
    shoulder?: string;
    sleeveLength?: string;
    notes?: string;
  };
  quantity: number;
  price: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  sku?: string;
  productSku?: string;
  size?: string;
  selectedSize?: string;
  color?: string;
  selectedColor?: string;
  stitchChoice?: 'unstitched' | 'stitched' | string;
  customMeasurements?: any;
  customNotes?: string;
  quantity: number;
  price?: number;
  unitPrice?: number;
  total?: number;
  totalPrice?: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | string;

export type PaymentMethod =
  | 'cod'
  | 'jazzcash'
  | 'easypaisa'
  | 'bank_transfer'
  | 'card'
  | string;
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | string;

export interface Subscriber {
  id: string;
  email?: string;
  whatsapp?: string;
  name?: string;
  city?: string;
  status: 'active' | 'unsubscribed';
  source?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  email?: string;
  phone?: string;
  address?: string;
  area?: string; // Karachi area e.g. Clifton, Gulshan
  city?: string; // Karachi, Lahore, Islamabad, etc.
  postalCode?: string;
  orderNotes?: string;
  notes?: string;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    address?: string;
    area?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    landmark?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus?: OrderStatus;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  trackingHistory?: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface CustomerAddress {
  id: string;
  title: string; // Home, Office
  fullName: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: CustomerAddress[];
  wishlistProductIds: string[];
  totalSpent: number;
  ordersCount: number;
  isActive: boolean;
  createdAt: string;
}

export type AdminRole = 'super_admin' | 'admin' | 'editor';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  lastLogin?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  imageUrl?: string;
  verifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
  createdAt: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'in' | 'out' | 'adjustment' | 'sale' | 'return';
  quantityChange: number;
  newStock: number;
  reason: string;
  date: string;
  adjustedBy: string;
}

export interface CMSPage {
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logo: string;
  logoUrl?: string;
  favicon?: string;
  faviconUrl?: string;
  brandDescription?: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  karachiShippingFee: number;
  nationwideShippingFee: number;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  announcementText: string;
  enableCod: boolean;
  enableBankTransfer: boolean;
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
  };
  seoTitle: string;
  seoDescription: string;
}

export interface HomepageConfig {
  showHero: boolean;
  showFlashSale: boolean;
  showCategories: boolean;
  showNewArrivals: boolean;
  showPromoBanners: boolean;
  showTopTrends: boolean;
  showBestSellers: boolean;
  showBrandFeatures: boolean;
  sectionOrder: string[];
}

export interface NavItem {
  id: string;
  label: string;
  view: string;
  params?: Record<string, any>;
  url?: string;
  isDropdown?: boolean;
  isSale?: boolean;
  badge?: string; // 'HOT', 'NEW', 'SALE', etc.
  sortOrder: number;
  isActive: boolean;
  openInNewTab?: boolean;
}

export interface FooterTrustBadge {
  id: string;
  title: string;
  subtitle: string;
  icon: 'truck' | 'shield' | 'sparkles' | 'rotate' | 'phone' | 'tag' | string;
  isActive: boolean;
  sortOrder: number;
}

export interface FooterLink {
  id: string;
  label: string;
  view?: string;
  params?: Record<string, any>;
  url?: string;
  openInNewTab?: boolean;
  isActive: boolean;
  highlight?: boolean;
  sortOrder?: number;
}

export interface FooterSection {
  id: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
  links: FooterLink[];
}

export interface FooterConfig {
  aboutText: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  copyrightText: string;
  showTrustBadges: boolean;
  showNewsletter: boolean;
  showSocialLinks: boolean;
  trustBadges: FooterTrustBadge[];
  sections: FooterSection[];
  bottomLinks: FooterLink[];
}
