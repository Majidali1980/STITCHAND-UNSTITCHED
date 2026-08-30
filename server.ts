import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Endpoints

// 1. Products
app.get('/api/products', (req, res) => {
  try {
    const {
      category,
      gender,
      fabric,
      stitchType,
      isNew,
      isFeatured,
      isTrending,
      isBestSeller,
      isActive,
      search,
      minPrice,
      maxPrice,
      sort,
      limit,
      offset
    } = req.query;

    const result = db.getProducts({
      category: category as string,
      gender: gender as string,
      fabric: fabric as string,
      stitchType: stitchType as string,
      isNew: isNew === 'true',
      isFeatured: isFeatured === 'true',
      isTrending: isTrending === 'true',
      isBestSeller: isBestSeller === 'true',
      isActive: isActive !== undefined ? isActive === 'true' : true,
      search: search as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: sort as string,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:idOrSlug', (req, res) => {
  const product = db.getProductByIdOrSlug(req.params.idOrSlug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', (req, res) => {
  try {
    const newProduct = db.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(updated);
});

app.post('/api/products/:id/duplicate', (req, res) => {
  const duplicated = db.duplicateProduct(req.params.id);
  if (!duplicated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.status(201).json(duplicated);
});

app.delete('/api/products/:id', (req, res) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted successfully' });
});

// 2. Categories
app.get('/api/categories', (req, res) => {
  res.json(db.getCategories());
});

app.post('/api/categories', (req, res) => {
  const created = db.createCategory(req.body);
  res.status(201).json(created);
});

app.put('/api/categories/:id', (req, res) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Category not found' });
  res.json(updated);
});

app.delete('/api/categories/:id', (req, res) => {
  const deleted = db.deleteCategory(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Category not found' });
  res.json({ success: true });
});

// 3. Orders
app.get('/api/orders', (req, res) => {
  res.json(db.getOrders());
});

app.get('/api/orders/:idOrNumber', (req, res) => {
  const order = db.getOrderByIdOrNumber(req.params.idOrNumber);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  try {
    const order = db.createOrder(req.body);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status, note } = req.body;
  const updated = db.updateOrderStatus(req.params.id, status, note);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(updated);
});

// 4. Coupons
app.get('/api/coupons', (req, res) => {
  res.json(db.getCoupons());
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ valid: false, message: 'Code required' });
  const result = db.validateCoupon(code, Number(subtotal) || 0);
  res.json(result);
});

app.post('/api/coupons', (req, res) => {
  const created = db.createCoupon(req.body);
  res.status(201).json(created);
});

app.put('/api/coupons/:id', (req, res) => {
  const updated = db.updateCoupon(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Coupon not found' });
  res.json(updated);
});

app.delete('/api/coupons/:id', (req, res) => {
  const deleted = db.deleteCoupon(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Coupon not found' });
  res.json({ success: true });
});

// 5. Flash Sale & Banners
app.get('/api/flash-sale', (req, res) => {
  res.json(db.getFlashSale());
});

app.put('/api/flash-sale', (req, res) => {
  res.json(db.updateFlashSale(req.body));
});

app.get('/api/banners', (req, res) => {
  res.json(db.getBanners());
});

app.post('/api/banners', (req, res) => {
  res.status(201).json(db.createBanner(req.body));
});

app.put('/api/banners/:id', (req, res) => {
  const updated = db.updateBanner(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Banner not found' });
  res.json(updated);
});

app.delete('/api/banners/:id', (req, res) => {
  const deleted = db.deleteBanner(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Banner not found' });
  res.json({ success: true });
});

// 6. Reviews
app.get('/api/reviews', (req, res) => {
  const { productId } = req.query;
  res.json(db.getReviews(productId as string));
});

app.post('/api/reviews', (req, res) => {
  const review = db.createReview(req.body);
  res.status(201).json(review);
});

app.put('/api/reviews/:id/status', (req, res) => {
  const updated = db.updateReviewStatus(req.params.id, req.body.status);
  if (!updated) return res.status(404).json({ error: 'Review not found' });
  res.json(updated);
});

app.delete('/api/reviews/:id', (req, res) => {
  const deleted = db.deleteReview(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Review not found' });
  res.json({ success: true });
});

// 7. Customers & Auth
app.get('/api/customers', (req, res) => {
  res.json(db.getCustomers());
});

// 7b. Newsletter & WhatsApp Broadcasts
app.get('/api/newsletter/subscribers', (req, res) => {
  res.json(db.getSubscribers());
});

app.post('/api/newsletter/subscribe', (req, res) => {
  try {
    const { email, whatsapp, name, city, source } = req.body;
    if (!email && !whatsapp) {
      return res.status(400).json({ error: 'Please provide either an email or a WhatsApp number.' });
    }
    const subscriber = db.addSubscriber({ email, whatsapp, name, city, source });
    res.status(201).json({
      success: true,
      subscriber,
      message: 'Successfully subscribed to VIP drops and exclusive broadcasts.'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/newsletter/subscribers/:id', (req, res) => {
  const ok = db.deleteSubscriber(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Subscriber not found' });
  res.json({ success: true });
});

app.post('/api/newsletter/broadcast', (req, res) => {
  const { message, channel } = req.body;
  if (!message) return res.status(400).json({ error: 'Broadcast message content is required.' });
  const result = db.broadcastNewsletter(message, channel || 'both');
  res.json(result);
});

app.post('/api/customers/login', (req, res) => {
  const { email } = req.body;
  const customer = db.getCustomerByEmail(email);
  if (customer) {
    return res.json({ customer, token: 'demo-token-' + customer.id });
  }
  // Auto-register demo customer
  const newCust = db.createCustomer({
    name: email.split('@')[0],
    email,
    phone: '+92 300 0000000',
    addresses: [],
    wishlistProductIds: []
  });
  res.json({ customer: newCust, token: 'demo-token-' + newCust.id });
});

// 8. CMS & Settings & Stats
app.get('/api/cms/:slug', (req, res) => {
  const page = db.getCMSPage(req.params.slug);
  if (!page) return res.status(404).json({ error: 'Page not found' });
  res.json(page);
});

app.put('/api/cms/:slug', (req, res) => {
  const updated = db.updateCMSPage(req.params.slug, req.body);
  if (!updated) return res.status(404).json({ error: 'Page not found' });
  res.json(updated);
});

app.get('/api/settings', (req, res) => {
  res.json(db.getSettings());
});

app.put('/api/settings', (req, res) => {
  res.json(db.updateSettings(req.body));
});

app.get('/api/stats', (req, res) => {
  res.json(db.getStats());
});

// 8b. Navigation Menu CRUD
app.get('/api/nav', (req, res) => {
  const onlyActive = req.query.active === 'true';
  res.json(db.getNavItems(onlyActive));
});

app.put('/api/nav', (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Array of nav items required' });
  res.json(db.saveNavItems(req.body));
});

app.post('/api/nav', (req, res) => {
  try {
    const newItem = db.createNavItem(req.body);
    res.status(201).json(newItem);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/nav/:id', (req, res) => {
  const updated = db.updateNavItem(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Nav item not found' });
  res.json(updated);
});

app.delete('/api/nav/:id', (req, res) => {
  const ok = db.deleteNavItem(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Nav item not found' });
  res.json({ success: true });
});

app.post('/api/nav/reorder', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids array required' });
  res.json(db.reorderNavItems(ids));
});

// 8c. Footer Configuration & Sections CRUD
app.get('/api/footer', (req, res) => {
  res.json(db.getFooterConfig());
});

app.put('/api/footer', (req, res) => {
  res.json(db.updateFooterConfig(req.body));
});

app.post('/api/footer/sections', (req, res) => {
  const section = db.createFooterSection(req.body);
  res.status(201).json(section);
});

app.put('/api/footer/sections/:id', (req, res) => {
  const updated = db.updateFooterSection(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Footer section not found' });
  res.json(updated);
});

app.delete('/api/footer/sections/:id', (req, res) => {
  const ok = db.deleteFooterSection(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Footer section not found' });
  res.json({ success: true });
});

app.post('/api/footer/sections/:id/links', (req, res) => {
  const link = db.createFooterLink(req.params.id, req.body);
  if (!link) return res.status(404).json({ error: 'Footer section not found' });
  res.status(201).json(link);
});

app.put('/api/footer/sections/:id/links/:linkId', (req, res) => {
  const updated = db.updateFooterLink(req.params.id, req.params.linkId, req.body);
  if (!updated) return res.status(404).json({ error: 'Link or section not found' });
  res.json(updated);
});

app.delete('/api/footer/sections/:id/links/:linkId', (req, res) => {
  const ok = db.deleteFooterLink(req.params.id, req.params.linkId);
  if (!ok) return res.status(404).json({ error: 'Link or section not found' });
  res.json({ success: true });
});

// 9. AI Fashion Stylist (Gemini API with fallback)
app.post('/api/ai/stylist', async (req, res) => {
  const { query, userContext } = req.body;
  
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
You are the Master Fashion Stylist and Textile Expert for "STITCH & UNSTITCHED", a luxury fashion brand based in Karachi, Pakistan.
Brand Specialty: Premium Stitched & Unstitched Lawn, Luxury Chiffon, Linen, Khaddar, Velvet, Men's Kurta & Shalwar Kameez, Waistcoats.
Karachi Climate Context: Warm, coastal, humid summers needing breathable Pima lawn, festive winter evenings needing velvet or jacquard.

Provide personalized, refined, and culturally authentic advice on:
1. Fabric selection & styling combinations (e.g. Lawn with silk chiffon dupatta, tailored trousers, accessories)
2. Stitching guidelines for unstitched suits (necklines, sleeve cuts, hemlines, lace placements)
3. Sizing and care tips for Karachi weather and Eid/festive occasions.

User question: "${query}"
Keep the tone welcoming, sophisticated, and distinctly Pakistani fashion-forward. Response should be concise and beautifully formatted with bullet points.
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({ reply: response.text });
    } catch (err: any) {
      console.error('Gemini error:', err);
    }
  }

  // Graceful smart fallback if key is not configured
  const fallbackAdvice = `**Stitch & Unstitched Stylist Recommendation:**

• **Fabric Recommendation**: For warm Karachi days, our Pure Pima Lawn with silk chiffon dupatta offers unmatched breathability and a natural fluid drape.
• **Stitching Cut**: Pair a straight-cut A-line kurta (42" length) with cigarette pants featuring subtle organza or lace cutwork at the hem.
• **Color Palette**: Burnt orange, soft ivory, and terracotta are the defining tones of our season.
• **Care Tip**: Always dry unstitched lawn in shade to preserve the vibrancy of the digital botanical print.

*For bespoke measurement consultations, connect with our Karachi Atelier concierge on WhatsApp at +92 300 1234567.*`;

  return res.json({ reply: fallbackAdvice });
});

// Vite Middleware Setup
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`STITCH & UNSTITCHED Server running at http://0.0.0.0:${PORT}`);
  });
}

start();
