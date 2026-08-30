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
  const { productId, status } = req.query;
  res.json(db.getReviews(productId as string, status as string));
});

app.get('/api/products/:idOrSlug/reviews', (req, res) => {
  const product = db.getProductByIdOrSlug(req.params.idOrSlug);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(db.getApprovedReviewsForProduct(product.id));
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

// 6b. Curated Merchandising Sections (Top Trends, Best Sellers)
app.get('/api/curated-sections', (req, res) => {
  res.json(db.getCuratedSections());
});

app.get('/api/curated-sections/:id', (req, res) => {
  const sec = db.getCuratedSection(req.params.id);
  if (!sec) return res.status(404).json({ error: 'Section not found' });
  res.json(sec);
});

app.put('/api/curated-sections/:id', (req, res) => {
  const updated = db.updateCuratedSection(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Failed to update section' });
  res.json(updated);
});

app.get('/api/curated-sections/:id/products', (req, res) => {
  res.json(db.getCuratedProducts(req.params.id));
});

// 6c. About Us CMS
app.get('/api/about-us', (req, res) => {
  res.json(db.getAboutUsConfig());
});

app.put('/api/about-us', (req, res) => {
  res.json(db.updateAboutUsConfig(req.body));
});

// 6d. Contact Us CMS & Inquiries
app.get('/api/contact-us', (req, res) => {
  res.json(db.getContactUsConfig());
});

app.put('/api/contact-us', (req, res) => {
  res.json(db.updateContactUsConfig(req.body));
});

app.get('/api/contact/inquiries', (req, res) => {
  res.json(db.getContactInquiries());
});

app.post('/api/contact/inquiries', (req, res) => {
  try {
    const inq = db.createContactInquiry(req.body);
    res.status(201).json(inq);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/contact/inquiries/:id', (req, res) => {
  const updated = db.updateContactInquiry(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Inquiry not found' });
  res.json(updated);
});

app.delete('/api/contact/inquiries/:id', (req, res) => {
  const ok = db.deleteContactInquiry(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Inquiry not found' });
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

// 9b. AI Product Suggestions (Description, SEO Meta, Fabric Care, Slug)
app.post('/api/ai/suggest-product-details', async (req, res) => {
  const { name, category, fabric, color, gender, stitchType } = req.body;
  const productName = name || 'Luxury Pakistani Ensemble';
  const productFabric = fabric || 'Pure Pima Lawn';
  const productCategory = category || 'Ladies Lawn';
  const productColor = color || 'Emerald & Gold';

  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
You are a luxury e-commerce catalog copywriter for "STITCH & UNSTITCHED", Karachi's premier Pakistani fashion atelier.
Generate high-converting, opulent product copywriting and SEO metadata in valid JSON format for the following product:
- Product Name: ${productName}
- Category: ${productCategory}
- Fabric: ${productFabric}
- Color: ${productColor}
- Gender: ${gender || 'Women'}
- Stitch Type: ${stitchType || 'Unstitched / Stitched'}

Output MUST be a single raw JSON object (NO markdown backticks, NO markdown formatting) with these exact keys:
{
  "description": "Rich 2-3 paragraph couture description highlighting threadwork, Pakistani heritage, Karachi climate suitability, silhouette drape, and styling cues.",
  "fabricCare": "Precise garment care instructions (dry clean / hand wash in cold water, dry in shade, warm iron).",
  "metaTitle": "SEO meta title under 60 chars including Karachi brand and fabric keywords",
  "metaDescription": "Compelling SEO meta description under 155 chars with high click-through appeal and free Karachi delivery mention",
  "tags": ["array", "of", "6-8", "relevant", "fashion", "keywords"],
  "suggestedAlt": "Descriptive image alt text for SEO accessibility"
}
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      let rawText = response.text || '';
      rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(rawText);
      return res.json(parsed);
    } catch (err: any) {
      console.warn('Gemini product suggestion fallback:', err);
    }
  }

  // Graceful rule-based smart generator
  const baseSlug = (productName + '-' + productFabric).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return res.json({
    description: `Immerse yourself in authentic Karachi couture with ${productName}. Rendered on featherlight ${productFabric} with opulent artisanal motifs, this ensemble captures the vibrant spirit of modern Pakistani celebrations. Tailored for comfort in warm climates while exuding effortless luxury, it features intricate borders and a graceful silhouette suitable for both day festivities and intimate evening soirees.`,
    fabricCare: `Dry clean recommended for first wash. For subsequent washes, hand wash gently in cold water with mild detergent. Line dry in shade to preserve digital print vibrancy. Iron on reverse side on medium heat.`,
    metaTitle: `${productName} | ${productFabric} Luxury Karachi Couture`,
    metaDescription: `Shop authentic ${productName} in ${productFabric}. Premium Pakistani craftsmanship with express delivery across Karachi, Clifton, DHA, and nationwide.`,
    tags: [
      productFabric.toLowerCase(),
      productCategory.toLowerCase(),
      'karachi fashion',
      'pakistani couture',
      'luxury lawn',
      'festive collection',
      'stitched unstitched'
    ],
    suggestedAlt: `${productName} in ${productFabric} - Luxury Pakistani Couture`
  });
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
