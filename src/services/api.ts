import {
  Product,
  Category,
  Banner,
  FlashSale,
  Order,
  Customer,
  Coupon,
  Review,
  CMSPage,
  StoreSettings,
  NavItem,
  FooterConfig,
  FooterSection,
  FooterLink,
  Subscriber,
  AboutUsConfig,
  ContactUsConfig,
  ContactInquiry,
  CuratedSection,
} from '../types';

export const api = {
  // Products
  async getProducts(params?: Record<string, any>): Promise<{ products: Product[]; total: number }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          query.append(k, String(v));
        }
      });
    }
    const res = await fetch(`/api/products?${query.toString()}`);
    return res.json();
  },

  async getProduct(idOrSlug: string): Promise<Product> {
    const res = await fetch(`/api/products/${idOrSlug}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async createProduct(data: any): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateProduct(id: string, data: any): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async duplicateProduct(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}/duplicate`, { method: 'POST' });
    return res.json();
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch('/api/categories');
    return res.json();
  },

  async createCategory(data: any): Promise<Category> {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateCategory(id: string, data: any): Promise<Category> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteCategory(id: string): Promise<boolean> {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // Curated Merchandising Sections (Top Trends, Best Sellers)
  async getCuratedSections(): Promise<CuratedSection[]> {
    const res = await fetch('/api/curated-sections');
    return res.json();
  },

  async getCuratedSection(id: string): Promise<CuratedSection> {
    const res = await fetch(`/api/curated-sections/${id}`);
    return res.json();
  },

  async updateCuratedSection(id: string, data: Partial<CuratedSection>): Promise<CuratedSection> {
    const res = await fetch(`/api/curated-sections/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getCuratedProducts(id: string): Promise<Product[]> {
    const res = await fetch(`/api/curated-sections/${id}/products`);
    return res.json();
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const res = await fetch('/api/orders');
    return res.json();
  },

  async getOrder(idOrNumber: string): Promise<Order> {
    const res = await fetch(`/api/orders/${idOrNumber}`);
    return res.json();
  },

  async createOrder(data: any): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateOrderStatus(id: string, status: string, note?: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    return res.json();
  },

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    const res = await fetch('/api/coupons');
    return res.json();
  },

  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; coupon?: Coupon; discount?: number; message?: string }> {
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    });
    return res.json();
  },

  async createCoupon(data: any): Promise<Coupon> {
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateCoupon(id: string, data: any): Promise<Coupon> {
    const res = await fetch(`/api/coupons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteCoupon(id: string): Promise<boolean> {
    const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // Flash Sale & Banners
  async getFlashSale(): Promise<FlashSale> {
    const res = await fetch('/api/flash-sale');
    return res.json();
  },

  async updateFlashSale(data: any): Promise<FlashSale> {
    const res = await fetch('/api/flash-sale', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getBanners(): Promise<Banner[]> {
    const res = await fetch('/api/banners');
    return res.json();
  },

  async createBanner(data: any): Promise<Banner> {
    const res = await fetch('/api/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateBanner(id: string, data: any): Promise<Banner> {
    const res = await fetch(`/api/banners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteBanner(id: string): Promise<boolean> {
    const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // Reviews
  async getReviews(productId?: string, status?: string): Promise<Review[]> {
    const params = new URLSearchParams();
    if (productId) params.append('productId', productId);
    if (status) params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`/api/reviews${query}`);
    return res.json();
  },

  async getProductReviews(idOrSlug: string): Promise<Review[]> {
    const res = await fetch(`/api/products/${idOrSlug}/reviews`);
    return res.json();
  },

  async createReview(data: any): Promise<Review> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateReviewStatus(id: string, status: string): Promise<Review> {
    const res = await fetch(`/api/reviews/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async deleteReview(id: string): Promise<boolean> {
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // Customers
  async getCustomers(): Promise<Customer[]> {
    const res = await fetch('/api/customers');
    return res.json();
  },

  async loginCustomer(email: string): Promise<{ customer: Customer; token: string }> {
    const res = await fetch('/api/customers/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  // CMS About Us & Contact Us
  async getAboutUsConfig(): Promise<AboutUsConfig> {
    const res = await fetch('/api/about-us');
    return res.json();
  },

  async updateAboutUsConfig(data: Partial<AboutUsConfig>): Promise<AboutUsConfig> {
    const res = await fetch('/api/about-us', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getContactUsConfig(): Promise<ContactUsConfig> {
    const res = await fetch('/api/contact-us');
    return res.json();
  },

  async updateContactUsConfig(data: Partial<ContactUsConfig>): Promise<ContactUsConfig> {
    const res = await fetch('/api/contact-us', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getContactInquiries(): Promise<ContactInquiry[]> {
    const res = await fetch('/api/contact/inquiries');
    return res.json();
  },

  async createContactInquiry(data: Partial<ContactInquiry>): Promise<ContactInquiry> {
    const res = await fetch('/api/contact/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateContactInquiry(id: string, data: Partial<ContactInquiry>): Promise<ContactInquiry> {
    const res = await fetch(`/api/contact/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteContactInquiry(id: string): Promise<boolean> {
    const res = await fetch(`/api/contact/inquiries/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // CMS Generic Pages
  async getCMSPage(slug: string): Promise<CMSPage> {
    const res = await fetch(`/api/cms/${slug}`);
    return res.json();
  },

  async updateCMSPage(slug: string, data: any): Promise<CMSPage> {
    const res = await fetch(`/api/cms/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Settings & Stats
  async getSettings(): Promise<StoreSettings> {
    const res = await fetch('/api/settings');
    return res.json();
  },

  async updateSettings(data: any): Promise<StoreSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getStats(): Promise<any> {
    const res = await fetch('/api/stats');
    return res.json();
  },

  // AI Stylist
  async askAIStylist(query: string): Promise<string> {
    const res = await fetch('/api/ai/stylist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    return data.reply;
  },

  // AI Product Suggestion Details
  async suggestProductDetails(data: {
    name?: string;
    category?: string;
    fabric?: string;
    color?: string;
    gender?: string;
    stitchType?: string;
  }): Promise<{
    description: string;
    fabricCare: string;
    metaTitle: string;
    metaDescription: string;
    tags: string[];
    suggestedAlt: string;
  }> {
    const res = await fetch('/api/ai/suggest-product-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Navigation (Navbar)
  async getNavItems(onlyActive = false): Promise<NavItem[]> {
    const res = await fetch(`/api/nav?active=${onlyActive}`);
    return res.json();
  },

  async saveNavItems(items: NavItem[]): Promise<NavItem[]> {
    const res = await fetch('/api/nav', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    });
    return res.json();
  },

  async createNavItem(data: Partial<NavItem>): Promise<NavItem> {
    const res = await fetch('/api/nav', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateNavItem(id: string, data: Partial<NavItem>): Promise<NavItem> {
    const res = await fetch(`/api/nav/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteNavItem(id: string): Promise<boolean> {
    const res = await fetch(`/api/nav/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async reorderNavItems(ids: string[]): Promise<NavItem[]> {
    const res = await fetch('/api/nav/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    return res.json();
  },

  // Footer Config & Sections
  async getFooterConfig(): Promise<FooterConfig> {
    const res = await fetch('/api/footer');
    return res.json();
  },

  async updateFooterConfig(data: Partial<FooterConfig>): Promise<FooterConfig> {
    const res = await fetch('/api/footer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async saveFooterConfig(data: Partial<FooterConfig>): Promise<FooterConfig> {
    return this.updateFooterConfig(data);
  },

  async createFooterSection(data: Partial<FooterSection>): Promise<FooterSection> {
    const res = await fetch('/api/footer/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateFooterSection(id: string, data: Partial<FooterSection>): Promise<FooterSection> {
    const res = await fetch(`/api/footer/sections/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteFooterSection(id: string): Promise<boolean> {
    const res = await fetch(`/api/footer/sections/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async createFooterLink(sectionId: string, data: Partial<FooterLink>): Promise<FooterLink> {
    const res = await fetch(`/api/footer/sections/${sectionId}/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateFooterLink(sectionId: string, linkId: string, data: Partial<FooterLink>): Promise<FooterLink> {
    const res = await fetch(`/api/footer/sections/${sectionId}/links/${linkId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteFooterLink(sectionId: string, linkId: string): Promise<boolean> {
    const res = await fetch(`/api/footer/sections/${sectionId}/links/${linkId}`, { method: 'DELETE' });
    return res.ok;
  },

  // Newsletter & WhatsApp Broadcasts
  async getSubscribers(): Promise<Subscriber[]> {
    const res = await fetch('/api/newsletter/subscribers');
    return res.json();
  },

  async subscribeNewsletter(data: { email?: string; whatsapp?: string; name?: string; city?: string; source?: string }): Promise<{ success: boolean; subscriber: Subscriber; message: string }> {
    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteSubscriber(id: string): Promise<boolean> {
    const res = await fetch(`/api/newsletter/subscribers/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async broadcastNewsletter(data: { message: string; channel: 'whatsapp' | 'email' | 'both' }): Promise<{ success: boolean; count: number; message: string }> {
    const res = await fetch('/api/newsletter/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }
};
