import fs from 'fs';
import path from 'path';
import {
  Product,
  Category,
  Banner,
  FlashSale,
  Order,
  Customer,
  AdminUser,
  Coupon,
  Review,
  InventoryLog,
  CMSPage,
  StoreSettings,
  HomepageConfig,
  NavItem,
  FooterTrustBadge,
  FooterLink,
  FooterSection,
  FooterConfig,
  Subscriber,
  CuratedSection,
  AboutUsConfig,
  ContactUsConfig,
  ContactInquiry,
} from '../src/types';

// High-quality Pakistani fashion photography URLs
const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Gul-e-Noor Embroidered Lawn 3-Piece',
    slug: 'gul-e-noor-embroidered-lawn-3-piece',
    sku: 'SU-LWN-001',
    description: 'Immerse yourself in timeless elegance with our Gul-e-Noor 3-piece luxury embroidered lawn collection. Featuring intricate floral tilla embroidery on the neckline and daman, paired with a featherlight digital printed pure silk chiffon dupatta and dyed cambric trousers. Ideal for warm Karachi days and festive gatherings.',
    shortDescription: 'Luxury 3-piece lawn with intricate neckline tilla embroidery and pure silk chiffon dupatta.',
    category: 'Lawn',
    subcategory: '3 Piece',
    gender: 'women',
    brand: 'Stitch & Unstitched',
    fabric: 'Lawn',
    collection: 'Summer Lawn 2026',
    price: 6850,
    salePrice: 5480,
    costPrice: 3200,
    stockQuantity: 45,
    lowStockThreshold: 10,
    sizes: ['Unstitched', 'XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Burnt Ochre', hex: '#ea580c' },
      { name: 'Ivory Cream', hex: '#fdfbf7' },
      { name: 'Sage Green', hex: '#84a98c' }
    ],
    images: [
      { id: 'img-1-1', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85', alt: 'Gul-e-Noor Embroidered Lawn Front', isMain: true, order: 1 },
      { id: 'img-1-2', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85', alt: 'Gul-e-Noor Embroidered Lawn Detail', isMain: false, order: 2 },
      { id: 'img-1-3', url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=85', alt: 'Gul-e-Noor Dupatta Close-up', isMain: false, order: 3 }
    ],
    tags: ['Lawn', '3 Piece', 'Summer 2026', 'Embroidered', 'Festive', 'Chiffon Dupatta'],
    pieces: '3 Piece',
    stitchType: 'both',
    customStitchingFee: 1500,
    isFeatured: true,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isActive: true,
    soldCount: 142,
    rating: 4.9,
    reviewCount: 28,
    seoTitle: 'Gul-e-Noor Embroidered Lawn 3-Piece | Stitch & Unstitched Karachi',
    seoDescription: 'Buy luxury embroidered Pakistani 3-piece lawn suits online in Karachi with silk chiffon dupatta. Fast delivery across Pakistan.',
    careInstructions: ['Dry clean recommended for first wash', 'Do not bleach or stain remover', 'Iron at moderate temperature', 'Dry in shade to maintain color brilliance'],
    fabricDetails: 'Shirt: Pure Pima Lawn (3.0m) with Schiffli Daman | Dupatta: Silk Chiffon (2.5m) | Trouser: Dyed Cambric Cotton (2.5m)',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'prod-2',
    name: 'Zeenat Ready-To-Wear Digital Print Kurti',
    slug: 'zeenat-ready-to-wear-digital-print-kurti',
    sku: 'SU-RTW-002',
    description: 'A contemporary tailored A-line lawn kurti styled with subtle pearl embellishments along the placket and bell sleeves with scalloped organza lace. Cut for effortless daily comfort in the Karachi climate.',
    shortDescription: 'Tailored stitched A-line lawn kurti with pearl accents and scalloped organza lace sleeves.',
    category: 'Stitched',
    subcategory: 'Kurti',
    gender: 'women',
    brand: 'Stitch & Unstitched',
    fabric: 'Lawn',
    collection: 'Ready-to-Wear',
    price: 3450,
    salePrice: 2890,
    costPrice: 1600,
    stockQuantity: 28,
    lowStockThreshold: 8,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Rust Orange', hex: '#c2410c' },
      { name: 'Mustard Yellow', hex: '#d97706' }
    ],
    images: [
      { id: 'img-2-1', url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85', alt: 'Zeenat Stitched Kurti Front', isMain: true, order: 1 },
      { id: 'img-2-2', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85', alt: 'Zeenat Stitched Kurti Model', isMain: false, order: 2 }
    ],
    tags: ['Stitched', 'Kurti', 'Ready to Wear', 'Casual', 'Lawn'],
    pieces: '1 Piece',
    stitchType: 'stitched',
    isFeatured: true,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    isActive: true,
    soldCount: 88,
    rating: 4.8,
    reviewCount: 16,
    seoTitle: 'Zeenat Ready to Wear Kurti | Women Stitched Fashion',
    seoDescription: 'Designer stitched Pakistani lawn kurti with pearl accents. Shop online with nationwide delivery.',
    careInstructions: ['Gentle machine wash cold', 'Wash with similar colors', 'Warm iron on reverse side'],
    fabricDetails: '100% Breathable Fine Lawn with organza sleeve borders.',
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    id: 'prod-3',
    name: 'Shahkaar Men\'s Egyptian Cotton Kurta',
    slug: 'shahkaar-mens-egyptian-cotton-kurta',
    sku: 'SU-MEN-003',
    description: 'Precision-tailored from premium long-staple Egyptian cotton with a soft sheen. Accented with subtle tonal thread embroidery around the mandarin band collar and branded metallic buttons.',
    shortDescription: 'Premium Egyptian cotton men\'s designer kurta with embroidered band collar.',
    category: 'Men\'s Kurta',
    subcategory: 'Kurta',
    gender: 'men',
    brand: 'Stitch & Unstitched',
    fabric: 'Cotton',
    collection: 'Festive Men',
    price: 4950,
    costPrice: 2400,
    stockQuantity: 32,
    lowStockThreshold: 10,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Midnight Charcoal', hex: '#27272a' },
      { name: 'Warm Off-White', hex: '#f4efe6' },
      { name: 'Burnt Amber', hex: '#b45309' }
    ],
    images: [
      { id: 'img-3-1', url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=85', alt: 'Shahkaar Men Kurta Charcoal', isMain: true, order: 1 },
      { id: 'img-3-2', url: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=85', alt: 'Shahkaar Men Kurta Detail', isMain: false, order: 2 }
    ],
    tags: ['Men', 'Kurta', 'Cotton', 'Festive', 'Karachi Men Fashion'],
    pieces: '1 Piece',
    stitchType: 'stitched',
    isFeatured: true,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isActive: true,
    soldCount: 210,
    rating: 4.95,
    reviewCount: 42,
    seoTitle: 'Men\'s Egyptian Cotton Kurta | Stitch & Unstitched Men',
    seoDescription: 'Shop premium stitched men\'s cotton kurta online in Pakistan. Handcrafted collar styling and comfort fit.',
    careInstructions: ['Dry clean or delicate hand wash', 'Do not wring', 'Iron while slightly damp'],
    fabricDetails: '100% Giza Egyptian Long-Staple Cotton Fabric.',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 'prod-4',
    name: 'Mehtab Festive Unstitched Velvet 3-Piece',
    slug: 'mehtab-festive-unstitched-velvet-3-piece',
    sku: 'SU-VLT-004',
    description: 'Opulent micro-velvet 9000 unstitched 3-piece suit adorned with dense zari, sequins, and resham hand-embroidery. Complemented with a contrasting heavy banarsi jacquard shawl and dyed raw silk trousers for winter weddings.',
    shortDescription: 'Micro-velvet 9000 3-piece with heavy zari embroidery and banarsi jacquard shawl.',
    category: 'Unstitched',
    subcategory: '3 Piece',
    gender: 'women',
    brand: 'Stitch & Unstitched',
    fabric: 'Velvet',
    collection: 'Festive Eid',
    price: 14500,
    salePrice: 11900,
    costPrice: 7000,
    stockQuantity: 18,
    lowStockThreshold: 5,
    sizes: ['Unstitched', 'Custom Stitched'],
    colors: [
      { name: 'Deep Crimson', hex: '#881337' },
      { name: 'Royal Emerald', hex: '#064e3b' },
      { name: 'Burnt Copper', hex: '#7c2d12' }
    ],
    images: [
      { id: 'img-4-1', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=85', alt: 'Mehtab Velvet 3-Piece Front', isMain: true, order: 1 },
      { id: 'img-4-2', url: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=1000&q=85', alt: 'Mehtab Velvet 3-Piece Embroidery', isMain: false, order: 2 }
    ],
    tags: ['Velvet', 'Unstitched', 'Festive', 'Wedding', '3 Piece', 'Luxury'],
    pieces: '3 Piece',
    stitchType: 'both',
    customStitchingFee: 2200,
    isFeatured: true,
    isNew: true,
    isTrending: false,
    isBestSeller: true,
    isActive: true,
    soldCount: 95,
    rating: 5.0,
    reviewCount: 31,
    seoTitle: 'Mehtab Luxury Unstitched Velvet 3-Piece Suit',
    seoDescription: 'Buy luxury unstitched Pakistani velvet suits with heavy zari embroidery. Karachi express delivery.',
    careInstructions: ['Strictly dry clean only', 'Store in breathable garment bag', 'Steam iron only'],
    fabricDetails: 'Shirt: Micro-velvet 9000 (3.25m) | Shawl: Woven Banarsi Jacquard (2.5m) | Trouser: Korean Raw Silk (2.5m)',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'prod-5',
    name: 'Darya Printed Linen 2-Piece Suit',
    slug: 'darya-printed-linen-2-piece-suit',
    sku: 'SU-LNN-005',
    description: 'A breathable everyday 2-piece printed linen shirt and trouser set with contemporary block-print inspired geometric motifs. Comfortable for office wear, university, and casual outings.',
    shortDescription: 'Modern block-print style printed linen shirt & trouser 2-piece co-ord suit.',
    category: 'Stitched',
    subcategory: '2 Piece',
    gender: 'women',
    brand: 'Stitch & Unstitched',
    fabric: 'Linen',
    collection: 'Ready-to-Wear',
    price: 4200,
    salePrice: 3570,
    costPrice: 1900,
    stockQuantity: 34,
    lowStockThreshold: 10,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Oatmeal Beige', hex: '#d6cfc4' },
      { name: 'Terracotta', hex: '#9a3412' }
    ],
    images: [
      { id: 'img-5-1', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85', alt: 'Darya Linen 2-Piece Front', isMain: true, order: 1 },
      { id: 'img-5-2', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85', alt: 'Darya Linen 2-Piece Pose', isMain: false, order: 2 }
    ],
    tags: ['Stitched', '2 Piece', 'Linen', 'Casual', 'Printed'],
    pieces: '2 Piece',
    stitchType: 'stitched',
    isFeatured: false,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    isActive: true,
    soldCount: 64,
    rating: 4.7,
    reviewCount: 14,
    seoTitle: 'Darya Printed Linen 2-Piece Stitched Suit',
    seoDescription: 'Buy stylish 2-piece linen stitched suits online in Karachi. Affordable designer casuals.',
    careInstructions: ['Hand wash cold with gentle detergent', 'Avoid harsh scrubbing', 'Medium iron'],
    fabricDetails: 'Pure Blended Slub Linen (Shirt + Trouser).',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    id: 'prod-6',
    name: 'Aramis Men\'s Classic Shalwar Kameez Suit',
    slug: 'aramis-mens-classic-shalwar-kameez-suit',
    sku: 'SU-MSK-006',
    description: 'Traditional Pakistani craftsmanship meets modern tailoring. Made with soft-finish latha cotton with fine single-needle lockstitch seams, crisp collar, and roomy pleated shalwar.',
    shortDescription: 'Complete stitched men\'s shalwar kameez suit in premium soft-finish cotton latha.',
    category: 'Men\'s Shalwar Kameez',
    subcategory: 'Shalwar Kameez',
    gender: 'men',
    brand: 'Stitch & Unstitched',
    fabric: 'Cotton',
    collection: 'Festive Men',
    price: 6450,
    costPrice: 3100,
    stockQuantity: 24,
    lowStockThreshold: 6,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pristine White', hex: '#ffffff' },
      { name: 'Jet Black', hex: '#18181b' },
      { name: 'Sky Slate', hex: '#94a3b8' }
    ],
    images: [
      { id: 'img-6-1', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85', alt: 'Aramis Men Shalwar Kameez Front', isMain: true, order: 1 },
      { id: 'img-6-2', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1000&q=85', alt: 'Aramis Men Shalwar Kameez Full', isMain: false, order: 2 }
    ],
    tags: ['Men', 'Shalwar Kameez', 'Traditional', 'Cotton Latha', 'Eid Collection'],
    pieces: '2 Piece',
    stitchType: 'stitched',
    isFeatured: true,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isActive: true,
    soldCount: 178,
    rating: 4.9,
    reviewCount: 39,
    seoTitle: 'Men\'s Stitched Shalwar Kameez Suit | Karachi Fashion',
    seoDescription: 'Buy premium stitched men\'s shalwar kameez suits in Karachi. Classic fit, authentic cotton.',
    careInstructions: ['Wash dark and light colors separately', 'Starch as desired', 'Warm steam iron'],
    fabricDetails: '100% Premium Combed Cotton Latha (Shirt & Shalwar).',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 'prod-7',
    name: 'Noor-e-Chaman Embroidered Chiffon Festive 3-Piece',
    slug: 'noor-e-chaman-embroidered-chiffon-festive-3-piece',
    sku: 'SU-CHF-007',
    description: 'An ethereal ensemble in pure crinkle chiffon with delicate thread embroidery, hand-placed pearls, and cutwork lace borders. Accompanied by an embroidered net dupatta and raw silk cigarette pants.',
    shortDescription: 'Pure crinkle chiffon 3-piece festive suit with hand-embellished pearl work and cutwork border.',
    category: 'Unstitched',
    subcategory: '3 Piece',
    gender: 'women',
    brand: 'Stitch & Unstitched',
    fabric: 'Chiffon',
    collection: 'Festive Eid',
    price: 11200,
    salePrice: 9520,
    costPrice: 5300,
    stockQuantity: 15,
    lowStockThreshold: 4,
    sizes: ['Unstitched', 'Custom Stitched'],
    colors: [
      { name: 'Peach Coral', hex: '#fb923c' },
      { name: 'Lilac Lavender', hex: '#c084fc' },
      { name: 'Champagne Gold', hex: '#d4af37' }
    ],
    images: [
      { id: 'img-7-1', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85', alt: 'Noor-e-Chaman Chiffon Front', isMain: true, order: 1 },
      { id: 'img-7-2', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85', alt: 'Noor-e-Chaman Chiffon Detail', isMain: false, order: 2 }
    ],
    tags: ['Chiffon', 'Unstitched', 'Festive', 'Party Wear', '3 Piece', 'Cutwork'],
    pieces: '3 Piece',
    stitchType: 'both',
    customStitchingFee: 1800,
    isFeatured: true,
    isNew: true,
    isTrending: false,
    isBestSeller: false,
    isActive: true,
    soldCount: 52,
    rating: 4.85,
    reviewCount: 11,
    seoTitle: 'Noor-e-Chaman Festive Embroidered Chiffon 3-Piece',
    seoDescription: 'Pakistani luxury chiffon suits for weddings and Eid. Order in Karachi with secure cash on delivery.',
    careInstructions: ['Dry clean only', 'Do not hand wring or squeeze', 'Steam press on low'],
    fabricDetails: 'Shirt: Embroidered Crinkle Chiffon (3.0m) | Dupatta: Embroidered Soft Net (2.5m) | Trouser: Korean Raw Silk (2.5m)',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 'prod-8',
    name: 'Sultan Hand-Embroidered Velvet Waistcoat',
    slug: 'sultan-hand-embroidered-velvet-waistcoat',
    sku: 'SU-WST-008',
    description: 'Elevate festive menswear with this tailored bespoke velvet waistcoat. Features subtle thread and gold wire border detailing on the ban collar and welt pockets.',
    shortDescription: 'Tailored micro-velvet men\'s waistcoat with gold wire embroidery along collar and pockets.',
    category: 'Men\'s Waistcoat',
    subcategory: 'Waistcoat',
    gender: 'men',
    brand: 'Stitch & Unstitched',
    fabric: 'Velvet',
    collection: 'Festive Men',
    price: 5800,
    costPrice: 2800,
    stockQuantity: 19,
    lowStockThreshold: 5,
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)'],
    colors: [
      { name: 'Midnight Black', hex: '#18181b' },
      { name: 'Royal Navy', hex: '#1e3a8a' },
      { name: 'Deep Maroon', hex: '#831843' }
    ],
    images: [
      { id: 'img-8-1', url: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=85', alt: 'Sultan Velvet Waistcoat Front', isMain: true, order: 1 },
      { id: 'img-8-2', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85', alt: 'Sultan Velvet Waistcoat Styling', isMain: false, order: 2 }
    ],
    tags: ['Men', 'Waistcoat', 'Velvet', 'Wedding', 'Festive', 'Gents'],
    pieces: '1 Piece',
    stitchType: 'stitched',
    isFeatured: false,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isActive: true,
    soldCount: 115,
    rating: 4.9,
    reviewCount: 22,
    seoTitle: 'Men\'s Hand-Embroidered Velvet Waistcoat | Stitch & Unstitched',
    seoDescription: 'Designer men\'s festive waistcoats in Karachi. Perfect for Eid and weddings.',
    careInstructions: ['Dry clean only', 'Keep on padded hanger'],
    fabricDetails: 'Premium Micro Velvet with Italian Satin Inner Lining.',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 'prod-9',
    name: 'Gul-e-Rana Kids Mustard Festive Gharara Set',
    slug: 'gul-e-rana-kids-mustard-festive-gharara-set',
    sku: 'SU-KID-009',
    description: 'Vibrant mustard yellow festive kurti and flared gharara set for young girls with delicate golden gota kinari borders, floral zari embroidery, and lightweight organza dupatta. Includes matching miniature khussa shoes styling.',
    shortDescription: 'Festive mustard yellow girls kurti and flared tiered gharara with golden gota lace.',
    category: 'KIDS',
    subcategory: 'Girls Gharara & Kurti Sets',
    gender: 'kids',
    brand: 'Stitch & Unstitched Kids',
    fabric: 'Chiffon & Lawn',
    collection: 'Festive Kids Eid',
    price: 5200,
    salePrice: 4420,
    costPrice: 2200,
    stockQuantity: 26,
    lowStockThreshold: 5,
    sizes: ['2-3 Y', '4-5 Y', '6-7 Y', '8-9 Y', '10-12 Y'],
    colors: [
      { name: 'Mustard Gold', hex: '#d97706' },
      { name: 'Rani Pink', hex: '#db2777' }
    ],
    images: [
      { id: 'img-9-1', url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=85', alt: 'Kids Yellow Gharara Outfit', isMain: true, order: 1 },
      { id: 'img-9-2', url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85', alt: 'Kids Festive Model', isMain: false, order: 2 }
    ],
    tags: ['Kids', 'Gharara', 'Girls', 'Festive', 'Eid', 'Yellow'],
    pieces: '3 Piece',
    stitchType: 'stitched',
    isFeatured: true,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isActive: true,
    soldCount: 84,
    rating: 4.95,
    reviewCount: 20,
    careInstructions: ['Dry clean or gentle hand wash', 'Low heat iron with cloth barrier'],
    fabricDetails: 'Pure Cotton Lawn & Soft Chiffon with Golden Gota Kinari.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'prod-10',
    name: 'Chote Nawab Boys Embroidered Kurta Shalwar',
    slug: 'chote-nawab-boys-embroidered-kurta-shalwar',
    sku: 'SU-KID-010',
    description: 'Crisp, lightweight festive kurta shalwar suit for young boys with delicate thread embroidery on collar and placket. Crafted from breathable cotton to keep kids comfortable throughout celebrations.',
    shortDescription: 'Traditional boys embroidered cotton kurta with comfortable matching shalwar.',
    category: 'KIDS',
    subcategory: 'Boys Kurta Shalwar',
    gender: 'kids',
    brand: 'Stitch & Unstitched Kids',
    fabric: 'Cotton',
    collection: 'Festive Kids Eid',
    price: 3800,
    costPrice: 1700,
    stockQuantity: 30,
    lowStockThreshold: 6,
    sizes: ['2-3 Y', '4-5 Y', '6-7 Y', '8-9 Y', '10-12 Y'],
    colors: [
      { name: 'Ivory Cream', hex: '#fdfbf7' },
      { name: 'Royal Navy', hex: '#1e3a8a' },
      { name: 'Sage Mint', hex: '#6ee7b7' }
    ],
    images: [
      { id: 'img-10-1', url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=85', alt: 'Boys Kurta Shalwar Front', isMain: true, order: 1 }
    ],
    tags: ['Kids', 'Boys', 'Kurta Shalwar', 'Cotton', 'Eid'],
    pieces: '2 Piece',
    stitchType: 'stitched',
    isFeatured: true,
    isNew: true,
    isTrending: false,
    isBestSeller: true,
    isActive: true,
    soldCount: 65,
    rating: 4.8,
    reviewCount: 15,
    careInstructions: ['Machine wash gentle cold', 'Medium iron'],
    fabricDetails: '100% Combed Cotton Breathable Fabric.',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    id: 'prod-11',
    name: 'Shahi Mahal Embroidered Luxury Bed Quilt Set',
    slug: 'shahi-mahal-embroidered-luxury-bed-quilt-set',
    sku: 'SU-HME-011',
    description: 'Transform your bedroom into a regal sanctuary with this hand-finished luxury bed set. Features rich crimson and antique gold brocade bed runner, two quilted pillow shams, two bolster covers, and a 400-thread count Egyptian cotton fitted sheet.',
    shortDescription: 'Regal bridal & master bedroom bedding set with embroidered crimson/gold runner and shams.',
    category: 'HOME APPAREL',
    subcategory: 'Luxury Bed Sheet & Quilt Sets',
    gender: 'both',
    brand: 'Stitch & Unstitched Living',
    fabric: 'Silk Brocade & Egyptian Cotton',
    collection: 'Royal Living 2026',
    price: 18500,
    salePrice: 15725,
    costPrice: 9200,
    stockQuantity: 14,
    lowStockThreshold: 4,
    sizes: ['King (95" x 100")', 'Queen (90" x 95")'],
    colors: [
      { name: 'Crimson & Antique Gold', hex: '#881337' },
      { name: 'Emerald & Champagne', hex: '#064e3b' }
    ],
    images: [
      { id: 'img-11-1', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=85', alt: 'Shahi Mahal Bed Set Full View', isMain: true, order: 1 },
      { id: 'img-11-2', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85', alt: 'Shahi Mahal Bed Set Detail', isMain: false, order: 2 }
    ],
    tags: ['Home Apparel', 'Bedding', 'Quilt Set', 'Luxury Living', 'Bridal Home'],
    pieces: '6 Piece Set',
    stitchType: 'stitched',
    isFeatured: true,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isActive: true,
    soldCount: 42,
    rating: 5.0,
    reviewCount: 18,
    careInstructions: ['Dry clean runner & shams', 'Machine wash cotton fitted sheet cold'],
    fabricDetails: 'Brocade Velvet Runner with Poly-Satin Lining & 400TC Cotton Sheet.',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'prod-12',
    name: 'Zardozi Velvet Hand-Embroidered Cushion Covers (Set of 4)',
    slug: 'zardozi-velvet-hand-embroidered-cushion-covers',
    sku: 'SU-HME-012',
    description: 'Set of 4 opulent 16x16 inch micro-velvet cushion covers adorned with traditional Mughal floral jaal embroidery in tilla, sequins, and metallic bullion wire. Hidden zipper closure.',
    shortDescription: 'Set of 4 luxury micro-velvet cushion covers with traditional Mughal gold tilla embroidery.',
    category: 'HOME APPAREL',
    subcategory: 'Embroidered Cushion Covers',
    gender: 'both',
    brand: 'Stitch & Unstitched Living',
    fabric: 'Velvet',
    collection: 'Royal Living 2026',
    price: 4800,
    costPrice: 2100,
    stockQuantity: 25,
    lowStockThreshold: 5,
    sizes: ['16" x 16" (Set of 4)', '18" x 18" (Set of 4)'],
    colors: [
      { name: 'Royal Maroon', hex: '#831843' },
      { name: 'Midnight Navy', hex: '#1e3a8a' },
      { name: 'Burnished Gold', hex: '#d97706' }
    ],
    images: [
      { id: 'img-12-1', url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=85', alt: 'Embroidered Velvet Cushion Covers', isMain: true, order: 1 }
    ],
    tags: ['Home Apparel', 'Cushions', 'Velvet', 'Zardozi', 'Living Room'],
    pieces: '4 Piece Set',
    stitchType: 'stitched',
    isFeatured: true,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    isActive: true,
    soldCount: 56,
    rating: 4.9,
    reviewCount: 14,
    careInstructions: ['Dry clean only', 'Do not bleach'],
    fabricDetails: '100% Micro Velvet 9000 with heavy zari wire.',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 'prod-13',
    name: 'Ferozi Royal Navy Velvet Embroidered Clutch',
    slug: 'ferozi-royal-navy-velvet-embroidered-clutch',
    sku: 'SU-BAG-013',
    description: 'A masterpiece of Pakistani artisanal craftsmanship. Deep navy blue micro-velvet evening clutch covered in intricate 3D gold zardozi floral motifs, pearls, and crystals. Finished with a jeweled push-lock clasp and a detachable gold link shoulder chain.',
    shortDescription: 'Regal navy blue micro-velvet evening clutch with intricate gold zardozi floral embroidery.',
    category: 'BAGS',
    subcategory: 'Luxury Velvet Clutches',
    gender: 'women',
    brand: 'Stitch & Unstitched Bags',
    fabric: 'Velvet & Metallic Wire',
    collection: 'Bridal & Festive Accessories',
    price: 7800,
    salePrice: 6630,
    costPrice: 3400,
    stockQuantity: 20,
    lowStockThreshold: 4,
    sizes: ['One Size (8" x 5" x 2")'],
    colors: [
      { name: 'Royal Navy Blue', hex: '#1e3a8a' },
      { name: 'Emerald Velvet', hex: '#064e3b' },
      { name: 'Ruby Wine', hex: '#881337' }
    ],
    images: [
      { id: 'img-13-1', url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=85', alt: 'Navy Velvet Embroidered Clutch Front', isMain: true, order: 1 },
      { id: 'img-13-2', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85', alt: 'Luxury Evening Clutch Detail', isMain: false, order: 2 }
    ],
    tags: ['Bags', 'Clutch', 'Velvet', 'Zardozi', 'Festive', 'Wedding', 'Accessories'],
    pieces: '1 Piece',
    stitchType: 'stitched',
    isFeatured: true,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isActive: true,
    soldCount: 92,
    rating: 5.0,
    reviewCount: 26,
    careInstructions: ['Store in dust bag with silica pouch', 'Spot clean with dry microfiber cloth'],
    fabricDetails: 'Micro Velvet over reinforced brass frame with gold finish chain.',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'prod-14',
    name: 'Noor Handcrafted Pearls & Zari Potli Bag',
    slug: 'noor-handcrafted-pearls-zari-potli-bag',
    sku: 'SU-BAG-014',
    description: 'Traditional Pakistani festive drawstring potli bag accented with dense clusters of seed pearls, golden zari tassels, and a braided silk wristlet handle. Perfect companion for weddings, mehendi, and Eid ensembles.',
    shortDescription: 'Festive golden potli bag with seed pearls, zari embroidery, and silk tassel drawstring.',
    category: 'BAGS',
    subcategory: 'Embroidered Potli Pouches',
    gender: 'women',
    brand: 'Stitch & Unstitched Bags',
    fabric: 'Raw Silk & Pearls',
    collection: 'Bridal & Festive Accessories',
    price: 4200,
    costPrice: 1900,
    stockQuantity: 28,
    lowStockThreshold: 6,
    sizes: ['One Size (7" x 8")'],
    colors: [
      { name: 'Champagne Gold', hex: '#d4af37' },
      { name: 'Ivory Pearl', hex: '#fdfbf7' },
      { name: 'Blush Rose', hex: '#f43f5e' }
    ],
    images: [
      { id: 'img-14-1', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85', alt: 'Embroidered Potli Bag Front', isMain: true, order: 1 }
    ],
    tags: ['Bags', 'Potli', 'Pearls', 'Festive', 'Wedding', 'Accessories'],
    pieces: '1 Piece',
    stitchType: 'stitched',
    isFeatured: true,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isActive: true,
    soldCount: 77,
    rating: 4.9,
    reviewCount: 19,
    careInstructions: ['Keep away from moisture', 'Store in cotton pouch'],
    fabricDetails: 'Korean Raw Silk with glass beads and silk tassels.',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 'prod-15',
    name: 'Noor-e-Chaman Girls Embroidered Gharara Set',
    slug: 'noor-e-chaman-girls-embroidered-gharara-set',
    sku: 'SU-KID-015',
    description: 'A dazzling 2-piece festive ensemble for young girls. Includes a golden gota-worked peplum kurti paired with a voluminous crushed chiffon gharara and net dupatta with tilla fringes. Specially crafted for wedding functions and Eid in Karachi.',
    shortDescription: 'Festive girls peplum kurti with flared gota gharara and soft net dupatta.',
    category: 'KIDS',
    subcategory: 'Girls Collection',
    gender: 'kids',
    brand: 'Stitch & Unstitched Kids',
    fabric: 'Chiffon & Silk',
    collection: 'Festive Kids Eid 2026',
    price: 4950,
    salePrice: 4200,
    costPrice: 2200,
    stockQuantity: 28,
    lowStockThreshold: 5,
    sizes: ['3-4 Y', '5-6 Y', '7-8 Y', '9-10 Y', '11-12 Y'],
    colors: [
      { name: 'Peach Rose', hex: '#fbcfe8' },
      { name: 'Mint Green', hex: '#a7f3d0' },
      { name: 'Mustard Gold', hex: '#fbbf24' }
    ],
    images: [
      { id: 'img-15-1', url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=85', alt: 'Girls Gharara Set Front', isMain: true, order: 1 }
    ],
    tags: ['Kids', 'Girls', 'Gharara', 'Festive', 'Eid', 'Stitched'],
    pieces: '3 Piece',
    stitchType: 'stitched',
    isFeatured: true,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isActive: true,
    soldCount: 52,
    rating: 5.0,
    reviewCount: 16,
    careInstructions: ['Dry clean only', 'Low iron over protective cloth'],
    fabricDetails: 'Pure Chiffon with Golden Gota & Pure Cotton Lining.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'prod-16',
    name: 'Shaandar Boys Kurta & Embroidered Jacquard Waistcoat',
    slug: 'shaandar-boys-kurta-embroidered-jacquard-waistcoat',
    sku: 'SU-KID-016',
    description: 'Regal 3-piece boys suit consisting of an ivory cotton kurta, tailored shalwar, and a rich navy blue jacquard waistcoat adorned with metal engraved buttons and pocket square.',
    shortDescription: 'Boys classic ivory cotton kurta shalwar with royal jacquard waistcoat.',
    category: 'KIDS',
    subcategory: 'Boys Collection',
    gender: 'kids',
    brand: 'Stitch & Unstitched Kids',
    fabric: 'Cotton & Jacquard',
    collection: 'Festive Kids Eid 2026',
    price: 5200,
    costPrice: 2400,
    stockQuantity: 24,
    lowStockThreshold: 4,
    sizes: ['2-3 Y', '4-5 Y', '6-7 Y', '8-9 Y', '10-12 Y'],
    colors: [
      { name: 'Navy & Ivory', hex: '#1e3a8a' },
      { name: 'Maroon & Cream', hex: '#881337' }
    ],
    images: [
      { id: 'img-16-1', url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=85', alt: 'Boys Kurta Waistcoat Set', isMain: true, order: 1 }
    ],
    tags: ['Kids', 'Boys', 'Waistcoat', 'Kurta Shalwar', 'Eid', 'Stitched'],
    pieces: '3 Piece',
    stitchType: 'stitched',
    isFeatured: true,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isActive: true,
    soldCount: 39,
    rating: 4.9,
    reviewCount: 11,
    careInstructions: ['Dry clean waistcoat', 'Hand wash kurta cold'],
    fabricDetails: '100% Breathable Egyptian Cotton with Poly-Jacquard Waistcoat.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'prod-17',
    name: 'Gul-e-Khaas Kids Soft Pima Lawn Unstitched 2-Piece',
    slug: 'gul-e-khaas-kids-soft-pima-lawn-unstitched-2-piece',
    sku: 'SU-KID-017',
    description: 'Ultra-soft unstitched 100% Pima cotton lawn fabric for boys and girls. Generous 2.5 meter cut ideal for custom tailoring of mini shalwar kameez, frocks, or kurtas with hypoallergenic non-fade botanical print.',
    shortDescription: 'Hypoallergenic unstitched pure soft lawn fabric for kids custom tailoring.',
    category: 'KIDS',
    subcategory: 'Unstitched Fabric',
    gender: 'kids',
    brand: 'Stitch & Unstitched Kids',
    fabric: 'Lawn',
    collection: 'Summer Lawn 2026',
    price: 2450,
    costPrice: 1100,
    stockQuantity: 35,
    lowStockThreshold: 6,
    sizes: ['2.5 Meters Fabric Cut', '3.0 Meters Fabric Cut'],
    colors: [
      { name: 'Soft Sunshine Yellow', hex: '#fef08a' },
      { name: 'Baby Sky Blue', hex: '#bae6fd' },
      { name: 'Blush Pink', hex: '#fbcfe8' }
    ],
    images: [
      { id: 'img-17-1', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=85', alt: 'Kids Unstitched Lawn Fabric', isMain: true, order: 1 }
    ],
    tags: ['Kids', 'Unstitched', 'Fabric', 'Lawn', 'Boys', 'Girls'],
    pieces: 'Unstitched Fabric',
    stitchType: 'unstitched',
    isFeatured: false,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    isActive: true,
    soldCount: 44,
    rating: 4.9,
    reviewCount: 9,
    careInstructions: ['Wash in cold water before stitching', 'Do not bleach'],
    fabricDetails: '100% Pure Pima Soft Lawn 80s count.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-ladies',
    name: 'LADIES',
    slug: 'ladies',
    gender: 'women',
    description: 'Exquisite unstitched lawn, luxury ready-to-wear pret, festive formal wear, and designer kurtis.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    productCount: 48,
    sortOrder: 1,
    isActive: true,
    subcategories: [
      'Stitched Pret',
      'Unstitched Luxury',
      '3-Piece Luxury Suits',
      'Kurtis & Tops',
      'Chiffon & Festive Formals',
      'Bottoms & Trousers'
    ]
  },
  {
    id: 'cat-gents',
    name: 'GENTS',
    slug: 'gents',
    gender: 'men',
    description: 'Sophisticated men\'s kurtas in Egyptian cotton, classic shalwar kameez, and tailored waistcoats.',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    productCount: 28,
    sortOrder: 2,
    isActive: true,
    subcategories: [
      'Stitched Kurtas & Shalwar Kameez',
      'Unstitched Latha & Egyptian Cotton',
      'Festive Waistcoats & Prince Coats',
      'Trousers & Pajamas'
    ]
  },
  {
    id: 'cat-kids',
    name: 'KIDS',
    slug: 'kids',
    gender: 'kids',
    description: 'Festive ghararas, miniature kurtas, and traditional Eid & party ensembles for boys and girls.',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
    productCount: 22,
    sortOrder: 3,
    isActive: true,
    subcategories: [
      'Stitched Pret',
      'Unstitched Fabric',
      'Boys Collection',
      'Girls Collection',
      'Festive Eid Wear',
      'Baby Traditional'
    ]
  },
  {
    id: 'cat-home-apparel',
    name: 'HOME APPAREL',
    slug: 'home-apparel',
    gender: 'home',
    description: 'Opulent bed linen, embroidered cushion covers, luxury table runners, and velvet throws.',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    productCount: 18,
    sortOrder: 4,
    isActive: true,
    subcategories: [
      'Luxury Bed Sheet & Quilt Sets',
      'Embroidered Cushion Covers',
      'Table Runners & Placemats',
      'Velvet & Silk Throws'
    ]
  },
  {
    id: 'cat-bags',
    name: 'BAGS',
    slug: 'bags',
    gender: 'accessories',
    description: 'Handcrafted luxury velvet clutches, embroidered potli pouches, and designer evening bags.',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
    productCount: 16,
    sortOrder: 5,
    isActive: true,
    subcategories: [
      'Luxury Velvet Clutches',
      'Embroidered Potli Pouches',
      'Festive Box Clutches',
      'Evening Minaudières'
    ]
  }
];

const SEED_SUBSCRIBERS: Subscriber[] = [
  {
    id: 'sub-1',
    name: 'Zainab Bilgrami',
    email: 'zainab.bilgrami@gmail.com',
    whatsapp: '+92 300 8271190',
    city: 'Karachi (Clifton)',
    status: 'active',
    source: 'Website Newsletter Footer',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 'sub-2',
    name: 'Dr. Shahzad Merchant',
    email: 'shahzad.merchant@yahoo.com',
    whatsapp: '+92 321 9988123',
    city: 'Karachi (DHA Phase 6)',
    status: 'active',
    source: 'VIP WhatsApp Drop',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    id: 'sub-3',
    name: 'Mahnoor Khan',
    email: 'mahnoor.khan@outlook.com',
    whatsapp: '+92 333 4455667',
    city: 'Lahore (Gulberg)',
    status: 'active',
    source: 'Checkout Subscription',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'sub-4',
    name: 'Farhan Qureshi',
    whatsapp: '+92 345 1238900',
    city: 'Karachi (Gulshan-e-Iqbal)',
    status: 'active',
    source: 'WhatsApp Broadcast Opt-in',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

const SEED_BANNERS: Banner[] = [
  {
    id: 'ban-hero-1',
    title: 'STYLE THAT SPEAKS FOR YOU',
    subtitle: 'Discover our latest luxury stitched & unstitched collections, tailored for the modern Pakistani wardrobe.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1920&q=90',
    mobileImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
    ctaText: 'SHOP STITCHED',
    ctaUrl: '/shop?category=stitched',
    position: 'hero',
    sortOrder: 1,
    isActive: true
  },
  {
    id: 'ban-promo-1',
    title: 'NEW SEASON LAWN COLLECTION',
    subtitle: 'Vibrant hues, delicate tilla embroideries & pure silk dupattas.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    ctaText: 'EXPLORE LAWN',
    ctaUrl: '/shop?category=lawn',
    position: 'promo-1',
    sortOrder: 1,
    isActive: true
  },
  {
    id: 'ban-promo-2',
    title: 'PREMIUM UNSTITCHED FABRICS',
    subtitle: 'Quality fabrics. Timeless style. Tailor it your way.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=85',
    ctaText: 'EXPLORE UNSTITCHED',
    ctaUrl: '/shop?category=unstitched',
    position: 'promo-2',
    sortOrder: 2,
    isActive: true
  },
  {
    id: 'ban-promo-3',
    title: 'GENTLEMEN\'S FESTIVE APPAREL',
    subtitle: 'Crisp Egyptian cotton kurtas and bespoke waistcoats.',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85',
    ctaText: 'SHOP MEN\'S',
    ctaUrl: '/shop?gender=men',
    position: 'promo-3',
    sortOrder: 3,
    isActive: true
  }
];

const SEED_FLASH_SALE: FlashSale = {
  id: 'fs-eid-2026',
  title: 'KARACHI EXCLUSIVE FLASH SALE',
  description: 'Limited-time discounts on our top summer lawn and festive edit. Free express dispatch across Karachi on orders above Rs. 3,000.',
  discountPercentage: 25,
  bannerImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=85',
  startDate: new Date(Date.now() - 12 * 3600000).toISOString(),
  endDate: new Date(Date.now() + (2 * 86400000 + 8 * 3600000 + 35 * 60000)).toISOString(),
  isActive: true,
  productIds: ['prod-1', 'prod-2', 'prod-4', 'prod-7']
};

const SEED_COUPONS: Coupon[] = [
  {
    id: 'c-karachi10',
    code: 'KARACHI10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 3000,
    maxDiscount: 1500,
    usageLimit: 500,
    usedCount: 84,
    perUserLimit: 2,
    startDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 60 * 86400000).toISOString(),
    isActive: true
  },
  {
    id: 'c-welcome500',
    code: 'WELCOME500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderValue: 4000,
    usageLimit: 1000,
    usedCount: 142,
    perUserLimit: 1,
    startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 90 * 86400000).toISOString(),
    isActive: true
  },
  {
    id: 'c-eidvip20',
    code: 'EIDVIP20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 8000,
    maxDiscount: 3000,
    usageLimit: 200,
    usedCount: 31,
    perUserLimit: 1,
    startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 15 * 86400000).toISOString(),
    isActive: true
  }
];

const SEED_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'SU-2026-1001',
    customerId: 'cust-1',
    customerName: 'Ayesha Siddiqui',
    email: 'ayesha.siddiqui@gmail.com',
    phone: '+92 321 8472910',
    customerPhone: '+92 321 8472910',
    customerEmail: 'ayesha.siddiqui@gmail.com',
    address: 'Apartment 4B, Creek Vistas, Phase 8',
    area: 'DHA Phase 8',
    city: 'Karachi',
    postalCode: '75500',
    orderNotes: 'Please ring bell twice upon arrival',
    shippingAddress: {
      fullName: 'Ayesha Siddiqui',
      phone: '+92 321 8472910',
      address: 'Apartment 4B, Creek Vistas, Phase 8',
      area: 'DHA Phase 8',
      city: 'Karachi',
      province: 'Sindh',
      postalCode: '75500',
      landmark: 'Near Creek Club'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Gul-e-Noor Embroidered Lawn 3-Piece',
        productImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
        sku: 'SU-LWN-001',
        size: 'M',
        color: 'Burnt Ochre',
        stitchChoice: 'stitched',
        quantity: 1,
        unitPrice: 5480,
        totalPrice: 5480
      }
    ],
    subtotal: 5480,
    discount: 548,
    couponCode: 'KARACHI10',
    shippingFee: 0,
    total: 4932,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'shipped',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    trackingHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), note: 'Order placed via online checkout' },
      { status: 'confirmed', timestamp: new Date(Date.now() - 1.8 * 86400000).toISOString(), note: 'Order verified via customer phone confirmation' },
      { status: 'processing', timestamp: new Date(Date.now() - 1.5 * 86400000).toISOString(), note: 'Fabric dispatched to Karachi fulfillment center' },
      { status: 'shipped', timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), note: 'Dispatched with Karachi Express Courier (Tracking: KHI-78219)' }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'SU-2026-1002',
    customerId: 'cust-2',
    customerName: 'Bilal Farooqui',
    email: 'bilal.farooqui@yahoo.com',
    phone: '+92 300 2938471',
    customerPhone: '+92 300 2938471',
    customerEmail: 'bilal.farooqui@yahoo.com',
    address: 'House 142, Block 13-D, Gulshan-e-Iqbal',
    area: 'Gulshan-e-Iqbal',
    city: 'Karachi',
    postalCode: '75300',
    orderNotes: 'Call before delivery',
    shippingAddress: {
      fullName: 'Bilal Farooqui',
      phone: '+92 300 2938471',
      address: 'House 142, Block 13-D, Gulshan-e-Iqbal',
      area: 'Gulshan-e-Iqbal',
      city: 'Karachi',
      province: 'Sindh',
      postalCode: '75300',
      landmark: 'Behind Disco Bakery'
    },
    items: [
      {
        productId: 'prod-3',
        productName: 'Shahkaar Men\'s Egyptian Cotton Kurta',
        productImage: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
        sku: 'SU-MEN-003',
        size: 'L',
        color: 'Midnight Charcoal',
        stitchChoice: 'stitched',
        quantity: 1,
        unitPrice: 4950,
        totalPrice: 4950
      },
      {
        productId: 'prod-8',
        productName: 'Sultan Hand-Embroidered Velvet Waistcoat',
        productImage: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=400&q=80',
        sku: 'SU-WST-008',
        size: '42 (L)',
        color: 'Midnight Black',
        stitchChoice: 'stitched',
        quantity: 1,
        unitPrice: 5800,
        totalPrice: 5800
      }
    ],
    subtotal: 10750,
    discount: 500,
    couponCode: 'WELCOME500',
    shippingFee: 0,
    total: 10250,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    trackingHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 6 * 86400000).toISOString(), note: 'Order placed' },
      { status: 'confirmed', timestamp: new Date(Date.now() - 5.8 * 86400000).toISOString(), note: 'Bank transfer receipt approved' },
      { status: 'processing', timestamp: new Date(Date.now() - 5.5 * 86400000).toISOString(), note: 'Quality inspect passed' },
      { status: 'shipped', timestamp: new Date(Date.now() - 5 * 86400000).toISOString(), note: 'Rider assigned' },
      { status: 'delivered', timestamp: new Date(Date.now() - 4 * 86400000).toISOString(), note: 'Received by customer' }
    ]
  }
];

const SEED_CUSTOMERS: Customer[] = [
  {
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
    wishlistProductIds: ['prod-4', 'prod-7'],
    totalSpent: 16800,
    ordersCount: 3,
    isActive: true,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString()
  },
  {
    id: 'cust-2',
    name: 'Bilal Farooqui',
    email: 'bilal.farooqui@yahoo.com',
    phone: '+92 300 2938471',
    addresses: [
      {
        id: 'addr-2',
        title: 'Residence (Gulshan)',
        fullName: 'Bilal Farooqui',
        phone: '+92 300 2938471',
        address: 'House 142, Block 13-D, Gulshan-e-Iqbal',
        area: 'Gulshan-e-Iqbal',
        city: 'Karachi',
        isDefault: true
      }
    ],
    wishlistProductIds: ['prod-6'],
    totalSpent: 10250,
    ordersCount: 1,
    isActive: true,
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString()
  },
  {
    id: 'cust-3',
    name: 'Zoya Khan',
    email: 'zoya.k@hotmail.com',
    phone: '+92 333 4819203',
    addresses: [
      {
        id: 'addr-3',
        title: 'Clifton Residence',
        fullName: 'Zoya Khan',
        phone: '+92 333 4819203',
        address: 'Villa 12, Block 4, Clifton',
        area: 'Clifton',
        city: 'Karachi',
        isDefault: true
      }
    ],
    wishlistProductIds: ['prod-1', 'prod-2', 'prod-5'],
    totalSpent: 24500,
    ordersCount: 4,
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
  }
];

const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    productName: 'Gul-e-Noor Embroidered Lawn 3-Piece',
    customerName: 'Samina Tariq',
    customerEmail: 'samina.tariq@gmail.com',
    rating: 5,
    title: 'Exquisite lawn quality and fast Karachi delivery!',
    comment: 'The fabric feels so luxurious and breathable in Karachi summer heat. The tilla work on the neckline is so neat and not itchy at all. Came in a gorgeous branded box in just 24 hours!',
    verifiedPurchase: true,
    status: 'approved',
    isFeatured: true,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 'rev-2',
    productId: 'prod-3',
    productName: 'Shahkaar Men\'s Egyptian Cotton Kurta',
    customerName: 'Hamza Alvi',
    customerEmail: 'hamza.alvi@outlook.com',
    rating: 5,
    title: 'Top notch cotton and crisp fitting',
    comment: 'Ordered size Large and it fits like a glove. Collar stitch is sharp and color did not bleed after 3 washes. Will order in other colors too.',
    verifiedPurchase: true,
    status: 'approved',
    isFeatured: true,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'rev-3',
    productId: 'prod-4',
    productName: 'Mehtab Festive Unstitched Velvet 3-Piece',
    customerName: 'Fatima Zubair',
    customerEmail: 'f.zubair@gmail.com',
    rating: 5,
    title: 'Royal feel for winter wedding function',
    comment: 'The zari embroidery is dense and high quality. The banarsi shawl completes the royal look. Stitching by their team was also on point.',
    verifiedPurchase: true,
    status: 'approved',
    isFeatured: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

const SEED_CMS_PAGES: CMSPage[] = [
  {
    slug: 'about-us',
    title: 'About Stitch & Unstitched',
    subtitle: 'Celebrating Modern Pakistani Sartorial Heritage from the Heart of Karachi',
    content: `
# Crafting Modern Pakistani Fashion

Born in the vibrant cultural hub of Karachi, **STITCH & UNSTITCHED** was founded with a single mission: to celebrate the timeless beauty of Pakistani textile heritage while designing for the modern, confident individual.

From the purest Pima lawn woven for breezy Arabian Sea summers to opulent hand-embroidered velvets and raw silks crafted for festive soirees, every collection is a testament to meticulous craftsmanship, authentic fabrics, and refined aesthetics.

### Our Two Philosophies

1. **Unstitched Luxury**: For those who appreciate custom tailoring, bespoke cuts, and personal styling. We curate premium 2-piece and 3-piece fabrics with artisanal embroidery patches, pure silk chiffon dupattas, and luxury embellishments.
2. **Ready-to-Wear Excellence**: Modern silhouettes, precise sizing, clean hemlines, and elevated stitching details ready to wear straight out of the box.

### The Karachi Atelier
Our dedicated master cutters and embroiderers in Karachi ensure every seam, neckline, and buttonhole adheres to international luxury benchmarks. With 24–48 hour priority delivery across Karachi and rapid nationwide dispatch, we bridge traditional artistry with world-class convenience.
    `,
    metaTitle: 'About Us | Stitch & Unstitched Karachi',
    metaDescription: 'Learn about Stitch & Unstitched, Karachi\'s premier destination for luxury stitched and unstitched Pakistani fashion.',
    updatedAt: new Date().toISOString()
  },
  {
    slug: 'contact-us',
    title: 'Contact Us',
    subtitle: 'We are here to assist with styling advice, orders, and stitching queries.',
    content: `
### Customer Concierge

Have questions regarding your order, fabric specifications, custom stitching measurements, or wholesale inquiries? Our Karachi concierge team is available 7 days a week.

- **Head Office & Atelier**: Plot 24-C, Main Khayaban-e-Shahbaz, Phase 6, DHA, Karachi, Pakistan
- **WhatsApp Concierge**: +92 300 1234567 (Mon–Sat, 10:00 AM – 9:00 PM PKT)
- **Direct Phone**: +92 21 35870000
- **Email**: care@stitchandunstitched.com
- **Customer Care Hours**: Monday – Saturday: 10:00 AM – 8:00 PM | Sunday: 12:00 PM – 6:00 PM
    `,
    metaTitle: 'Contact Us | Stitch & Unstitched Karachi',
    metaDescription: 'Get in touch with Stitch & Unstitched customer support in Karachi, Pakistan.',
    updatedAt: new Date().toISOString()
  },
  {
    slug: 'shipping-policy',
    title: 'Shipping & Delivery Policy',
    subtitle: 'Fast, secure, and reliable shipping across Karachi and Pakistan.',
    content: `
### Delivery Timelines & Charges

* **Karachi Express Delivery**: 24 – 48 business hours (Standard Fee: Rs. 150 | **FREE on orders above Rs. 3,000**).
* **Major Cities (Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar)**: 2 – 4 business days (Standard Fee: Rs. 250 | **FREE on orders above Rs. 3,000**).
* **Rest of Pakistan**: 3 – 5 business days.

### Order Tracking
Upon dispatch, you will receive an SMS and Email with a live courier tracking link (TCS / Leopards / Karachi Express).

### Cash on Delivery (COD)
COD is available across all serviceable postal codes in Pakistan. Please ensure the exact cash amount is ready upon delivery.
    `,
    metaTitle: 'Shipping Policy | Stitch & Unstitched',
    metaDescription: 'Shipping rates and delivery timelines for Karachi and Pakistan.',
    updatedAt: new Date().toISOString()
  },
  {
    slug: 'return-policy',
    title: 'Return & Exchange Policy',
    subtitle: 'Hassle-free 7-day exchange guarantee.',
    content: `
### 7-Day Exchange Window
We want you to love your purchase. If you are not completely satisfied with the size or fabric, you may request an exchange within **7 days of delivery**.

### Eligibility Conditions
1. Items must be unwashed, unworn, and unaltered with all original brand tags, hangers, and packaging intact.
2. Unstitched fabrics must not be cut or altered.
3. Sale / Clearance items are eligible for size exchange only (subject to availability).

### Process
Contact our WhatsApp support at **+92 300 1234567** with your Order ID. For Karachi customers, we offer doorstep exchange rider service in selected areas.
    `,
    metaTitle: 'Return & Exchange Policy | Stitch & Unstitched',
    metaDescription: '7-day return and exchange policy for Pakistani fashion purchases.',
    updatedAt: new Date().toISOString()
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    subtitle: 'Your privacy and data security are our highest priority.',
    content: `
STITCH & UNSTITCHED respects your privacy. We strictly protect your personal information, phone numbers, and addresses. We never sell or lease customer information to third-party advertisers. All transaction data and communications are encrypted.
    `,
    metaTitle: 'Privacy Policy | Stitch & Unstitched',
    metaDescription: 'Privacy policy and user data security guidelines.',
    updatedAt: new Date().toISOString()
  },
  {
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    subtitle: 'General terms of online shopping at Stitch & Unstitched.',
    content: `
By accessing or using this website, you agree to be bound by these terms. All prices listed are in Pakistan Rupees (PKR) and include applicable sales taxes. We reserve the right to modify prices or discontinue items without prior notice.
    `,
    metaTitle: 'Terms & Conditions | Stitch & Unstitched',
    metaDescription: 'Terms and conditions for online apparel purchases.',
    updatedAt: new Date().toISOString()
  }
];

const SEED_SETTINGS: StoreSettings = {
  storeName: 'STITCH & UNSTITCHED',
  tagline: 'Modern Pakistani Sartorial Luxury',
  logo: '',
  logoUrl: '',
  favicon: '',
  faviconUrl: '',
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
  deliveryFee: 150,
  shippingFee: 150,
  customDeliveryAreas: [
    'DHA Phase 1 - 8 (All Sectors)',
    'Clifton Blocks 1 - 9 & Sea View',
    'Gulshan-e-Iqbal (Blocks 1 - 19)',
    'Gulistan-e-Johar (Blocks 1 - 20)',
    'PECHS Blocks 2, 3 & 6',
    'Bahria Town Karachi (All Precincts)',
    'North Nazimabad & Buffer Zone',
    'Federal B Area & Nazimabad',
    'KDA Scheme 1, Karsaz & Navy Housing',
    'Saddar, Cantt & Civil Lines',
    'Malir Cantt & Model Colony',
    'Karachi Admin Society & Baloch Colony',
    'Scheme 33 & Gulshan-e-Maymar',
    'Custom Delivery Area (Enter Below)'
  ],
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  tiktokUrl: 'https://tiktok.com',
  youtubeUrl: 'https://youtube.com',
  announcementText: 'FREE DELIVERY ON ORDERS ABOVE RS. 3,000 | KARACHI SAME-DAY & 24H DISPATCH AVAILABLE',
  enableCod: true,
  enableBankTransfer: true,
  bankDetails: {
    bankName: 'Meezan Bank Limited',
    accountTitle: 'STITCH AND UNSTITCHED (PVT) LTD',
    accountNumber: '01020304050607',
    iban: 'PK45MEZN0001020304050607'
  },
  seoTitle: 'Stitch & Unstitched | Luxury Pakistani Stitched & Unstitched Fashion Karachi',
  seoDescription: 'Discover luxury Pakistani lawn, unstitched festive fabrics, ready-to-wear kurtis, and men\'s shalwar kameez. Shop online in Karachi with fast delivery.'
};

const SEED_HOMEPAGE_CONFIG: HomepageConfig = {
  showHero: true,
  showFlashSale: true,
  showCategories: true,
  showNewArrivals: true,
  showPromoBanners: true,
  showTopTrends: true,
  showBestSellers: true,
  showBrandFeatures: true,
  sectionOrder: [
    'hero',
    'flash-sale',
    'categories',
    'new-arrivals',
    'promo-banners',
    'top-trends',
    'best-sellers',
    'brand-features'
  ]
};

const SEED_NAV_ITEMS: NavItem[] = [
  { id: 'nav-1', label: 'HOME', view: 'home', sortOrder: 1, isActive: true },
  { id: 'nav-2', label: 'LADIES', view: 'shop', params: { category: 'ladies' }, sortOrder: 2, isActive: true },
  { id: 'nav-3', label: 'GENTS', view: 'shop', params: { category: 'gents' }, sortOrder: 3, isActive: true },
  { id: 'nav-4', label: 'KIDS', view: 'shop', params: { category: 'kids' }, sortOrder: 4, isActive: true },
  { id: 'nav-5', label: 'HOME APPAREL', view: 'shop', params: { category: 'home-apparel' }, sortOrder: 5, isActive: true },
  { id: 'nav-6', label: 'BAGS', view: 'shop', params: { category: 'bags' }, sortOrder: 6, isActive: true },
  { id: 'nav-7', label: 'UNSTITCHED', view: 'shop', params: { stitchType: 'unstitched' }, sortOrder: 7, isActive: true },
  { id: 'nav-8', label: 'READY-TO-WEAR', view: 'shop', params: { stitchType: 'stitched' }, badge: 'HOT', sortOrder: 8, isActive: true },
  { id: 'nav-9', label: 'ALL CATEGORIES', view: 'shop', isDropdown: true, sortOrder: 9, isActive: true },
  { id: 'nav-10', label: '⚡ FLASH SALE', view: 'shop', params: { isSale: true }, isSale: true, badge: '50% OFF', sortOrder: 10, isActive: true },
  { id: 'nav-11', label: 'TRACK ORDER', view: 'account', params: { tab: 'orders' }, sortOrder: 11, isActive: true },
];

const SEED_FOOTER_CONFIG: FooterConfig = {
  aboutText: "Karachi's premier fashion atelier offering bespoke stitched kurtis, pure Pima lawn, festive velvet ensembles, and contemporary Pakistani menswear.",
  newsletterTitle: "Join Our Newsletter",
  newsletterSubtitle: "Get the latest seasonal lawn drops, Eid collections, and exclusive discounts.",
  copyrightText: "© 2026 STITCH & UNSTITCHED. All Rights Reserved. Crafted for Karachi & Pakistan.",
  showTrustBadges: true,
  showNewsletter: true,
  showSocialLinks: true,
  trustBadges: [
    { id: 'tb-1', title: 'Karachi Express', subtitle: 'Priority 24–48h Dispatch', icon: 'truck', isActive: true, sortOrder: 1 },
    { id: 'tb-2', title: '100% Authentic Fabric', subtitle: 'Pure Pima Lawn & Silk', icon: 'shield', isActive: true, sortOrder: 2 },
    { id: 'tb-3', title: 'Custom Stitching', subtitle: 'Karachi Master Tailors', icon: 'sparkles', isActive: true, sortOrder: 3 },
    { id: 'tb-4', title: '7-Day Easy Exchange', subtitle: 'Hassle-free doorstep service', icon: 'rotate', isActive: true, sortOrder: 4 },
  ],
  sections: [
    {
      id: 'sec-1',
      title: 'Shop',
      sortOrder: 1,
      isActive: true,
      links: [
        { id: 'fl-1-1', label: 'Stitched Collection', view: 'shop', params: { category: 'stitched' }, isActive: true, sortOrder: 1 },
        { id: 'fl-1-2', label: 'Unstitched Fabrics', view: 'shop', params: { category: 'unstitched' }, isActive: true, sortOrder: 2 },
        { id: 'fl-1-3', label: 'New Arrivals', view: 'shop', params: { isNew: true }, isActive: true, sortOrder: 3 },
        { id: 'fl-1-4', label: 'Best Sellers', view: 'shop', params: { isBestSeller: true }, isActive: true, sortOrder: 4 },
        { id: 'fl-1-5', label: 'Flash Sale & Offers', view: 'shop', params: { isSale: true }, highlight: true, isActive: true, sortOrder: 5 },
      ]
    },
    {
      id: 'sec-2',
      title: 'Customer Care',
      sortOrder: 2,
      isActive: true,
      links: [
        { id: 'fl-2-1', label: 'Contact Concierge', view: 'cms', params: { slug: 'contact-us' }, isActive: true, sortOrder: 1 },
        { id: 'fl-2-2', label: 'Shipping & Karachi Dispatch', view: 'cms', params: { slug: 'shipping-policy' }, isActive: true, sortOrder: 2 },
        { id: 'fl-2-3', label: 'Returns & Exchange', view: 'cms', params: { slug: 'return-policy' }, isActive: true, sortOrder: 3 },
        { id: 'fl-2-4', label: 'Track Order', view: 'account', params: { tab: 'orders' }, isActive: true, sortOrder: 4 },
        { id: 'fl-2-5', label: 'My Account', view: 'account', isActive: true, sortOrder: 5 },
      ]
    }
  ],
  bottomLinks: [
    { id: 'bl-1', label: 'Privacy Policy', view: 'cms', params: { slug: 'privacy-policy' }, isActive: true, sortOrder: 1 },
    { id: 'bl-2', label: 'Terms & Conditions', view: 'cms', params: { slug: 'terms-and-conditions' }, isActive: true, sortOrder: 2 },
  ]
};

const SEED_CURATED_SECTIONS: CuratedSection[] = [
  {
    id: 'top-trends',
    title: 'Top Trends of the Season',
    subtitle: 'Curated Pakistani summer lawn, festive chiffons & bespoke artisanal kurtas.',
    badge: 'TRENDING ATELIER',
    isActive: true,
    productIds: ['prod-1', 'prod-2', 'prod-4', 'prod-6', 'prod-7', 'prod-8']
  },
  {
    id: 'best-sellers',
    title: 'Best Sellers in Karachi',
    subtitle: 'Most coveted designs trending across Clifton, DHA & Gulshan wardrobes.',
    badge: 'KARACHI FAVORITE',
    isActive: true,
    productIds: ['prod-1', 'prod-3', 'prod-5', 'prod-7', 'prod-2', 'prod-4']
  }
];

const SEED_ABOUT_US: AboutUsConfig = {
  heroTitle: 'CRAFTING TIMELESS SARTORIAL LUXURY',
  heroSubtitle: 'From the heart of Karachi to wardrobes across the globe, Stitch & Unstitched redefines contemporary Pakistani couture.',
  heroImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1400&q=85',
  heroImageAlt: 'Stitch & Unstitched Karachi Master Atelier',
  storyTitle: 'Our Heritage & Philosophy',
  storyParagraph1: 'Founded in Karachi, Pakistan, Stitch & Unstitched was born from a deep reverence for subcontinental textile heritage and the modern woman\'s desire for effortless elegance. We bridge centuries-old artisanal techniques—intricate zardozi, hand-guided tilla, delicate resham embroidery—with contemporary silhouettes designed for the discerning global Pakistani.',
  storyParagraph2: 'Every collection starts with ethically sourced pure fibers: 100% Egyptian Giza and Pakistani Pima cotton, micro-velvet 9000, and featherlight pure silk chiffons. Whether you choose our ready-to-wear tailored ensembles or unstitched fabric to customize with our master tailors, we guarantee an experience of genuine sartorial refinement.',
  storyImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
  storyImageAlt: 'Master artisans crafting hand-embroidered tilla work',
  craftsmanshipTitle: 'The Karachi Master Craftsmanship',
  craftsmanshipDescription: 'We believe true luxury lies in the details that often go unnoticed: French seams, hand-finished borders, and breathable weaves designed for our coastal climate.',
  craftsmanshipPoints: [
    {
      title: '100% Authentic Pure Fibers',
      description: 'Zero polyester blends in our premium lawn and cotton collections. Maximum breathability and colorfast vibrancy.',
      icon: 'shield'
    },
    {
      title: 'Master Tailoring & Custom Stitching',
      description: 'Our Karachi atelier offers custom tailoring according to your exact body measurements, with doorstep delivery.',
      icon: 'scissors'
    },
    {
      title: 'Ethical Artisan Wages',
      description: 'Supporting over 200 craftspeople and master embroiderers across Sindh and Punjab with dignified fair wages.',
      icon: 'heart'
    },
    {
      title: 'Express Karachi Dispatch',
      description: 'Same-day and next-day express delivery across DHA, Clifton, Gulshan, PECHS, and all Karachi zones.',
      icon: 'truck'
    }
  ],
  stats: [
    { value: '25,000+', label: 'Delighted Customers' },
    { value: '100%', label: 'Pure Pima Lawn & Silk' },
    { value: '24-48h', label: 'Express Karachi Dispatch' },
    { value: '4.9/5', label: 'Verified Customer Rating' }
  ],
  seoTitle: 'About Us | Stitch & Unstitched | Luxury Pakistani Couture Karachi',
  seoDescription: 'Learn about Stitch & Unstitched, Karachi\'s premier sartorial atelier for luxury lawn, festive chiffons, and bespoke tailoring.',
  ogImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85'
};

const SEED_CONTACT_US: ContactUsConfig = {
  pageTitle: 'CONNECT WITH OUR KARACHI CONCIERGE',
  pageSubtitle: 'Visit our flagship atelier in Phase 6 DHA, or connect directly with our fashion consultants via WhatsApp.',
  phone: '+92 21 35870000',
  whatsapp: '+92 300 1234567',
  email: 'care@stitchandunstitched.com',
  address: 'Plot 24-C, Khayaban-e-Shahbaz, Phase 6, DHA',
  city: 'Karachi, Sindh 75500, Pakistan',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14486.299580797305!2d67.05436655!3d24.8100115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33c5770000001%3A0x7d6f519391090547!2sKhayaban-e-Shahbaz%2C%20DHA%20Phase%206%2C%20Karachi!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s',
  businessHours: [
    { days: 'Monday – Saturday', hours: '11:00 AM – 09:30 PM PKT' },
    { days: 'Sunday', hours: '02:00 PM – 09:00 PM PKT' },
    { days: 'WhatsApp Concierge', hours: '24/7 Priority Support' }
  ],
  socialLinks: [
    { platform: 'Instagram', url: 'https://instagram.com' },
    { platform: 'Facebook', url: 'https://facebook.com' },
    { platform: 'TikTok', url: 'https://tiktok.com' },
    { platform: 'YouTube', url: 'https://youtube.com' }
  ],
  seoTitle: 'Contact Us | Stitch & Unstitched Flagship Boutique Karachi',
  seoDescription: 'Get in touch with Stitch & Unstitched. Visit our DHA Karachi boutique, chat on WhatsApp, or send a custom tailoring inquiry.'
};

const SEED_CONTACT_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq-1',
    name: 'Rabia Tariq',
    email: 'rabia.t@gmail.com',
    phone: '+92 321 9081234',
    subject: 'Custom Stitching Inquiry',
    message: 'I would like to get 3 unstitched lawn suits stitched with organza laces for an upcoming wedding in Clifton. Can I share custom chest/waist measurements?',
    status: 'new',
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString()
  }
];

// Persistent File-backed Database Class
class Database {
  private dataFilePath = path.join(process.cwd(), 'data', 'store_db.json');

  products: Product[] = [...SEED_PRODUCTS];
  categories: Category[] = [...SEED_CATEGORIES];
  banners: Banner[] = [...SEED_BANNERS];
  flashSale: FlashSale = { ...SEED_FLASH_SALE };
  orders: Order[] = [...SEED_ORDERS];
  customers: Customer[] = [...SEED_CUSTOMERS];
  coupons: Coupon[] = [...SEED_COUPONS];
  reviews: Review[] = [...SEED_REVIEWS];
  inventoryLogs: InventoryLog[] = [];
  cmsPages: CMSPage[] = [...SEED_CMS_PAGES];
  settings: StoreSettings = { ...SEED_SETTINGS };
  homepageConfig: HomepageConfig = { ...SEED_HOMEPAGE_CONFIG };
  navItems: NavItem[] = [...SEED_NAV_ITEMS];
  footerConfig: FooterConfig = JSON.parse(JSON.stringify(SEED_FOOTER_CONFIG));
  subscribers: Subscriber[] = [...SEED_SUBSCRIBERS];
  curatedSections: CuratedSection[] = [...SEED_CURATED_SECTIONS];
  aboutUsConfig: AboutUsConfig = { ...SEED_ABOUT_US };
  contactUsConfig: ContactUsConfig = { ...SEED_CONTACT_US };
  contactInquiries: ContactInquiry[] = [...SEED_CONTACT_INQUIRIES];

  constructor() {
    this.initPersistence();
  }

  private initPersistence() {
    try {
      const dataDir = path.dirname(this.dataFilePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(this.dataFilePath)) {
        const raw = fs.readFileSync(this.dataFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed) {
          if (Array.isArray(parsed.products) && parsed.products.length > 0) this.products = parsed.products;
          if (Array.isArray(parsed.categories) && parsed.categories.length > 0) this.categories = parsed.categories;
          if (Array.isArray(parsed.banners) && parsed.banners.length > 0) this.banners = parsed.banners;
          if (parsed.flashSale) this.flashSale = parsed.flashSale;
          if (Array.isArray(parsed.orders)) this.orders = parsed.orders;
          if (Array.isArray(parsed.customers)) this.customers = parsed.customers;
          if (Array.isArray(parsed.coupons)) this.coupons = parsed.coupons;
          if (Array.isArray(parsed.reviews)) this.reviews = parsed.reviews;
          if (Array.isArray(parsed.inventoryLogs)) this.inventoryLogs = parsed.inventoryLogs;
          if (Array.isArray(parsed.cmsPages)) this.cmsPages = parsed.cmsPages;
          if (parsed.settings && parsed.settings.storeName) this.settings = parsed.settings;
          if (parsed.homepageConfig) this.homepageConfig = parsed.homepageConfig;
          if (Array.isArray(parsed.navItems) && parsed.navItems.length > 0) this.navItems = parsed.navItems;
          if (parsed.footerConfig && parsed.footerConfig.sections) this.footerConfig = parsed.footerConfig;
          if (Array.isArray(parsed.subscribers)) this.subscribers = parsed.subscribers;
          if (Array.isArray(parsed.curatedSections) && parsed.curatedSections.length > 0) this.curatedSections = parsed.curatedSections;
          if (parsed.aboutUsConfig) this.aboutUsConfig = parsed.aboutUsConfig;
          if (parsed.contactUsConfig) this.contactUsConfig = parsed.contactUsConfig;
          if (Array.isArray(parsed.contactInquiries)) this.contactInquiries = parsed.contactInquiries;
          console.log('[DB] Loaded state successfully from persistent file:', this.dataFilePath);
          return;
        }
      }
      this.persist();
    } catch (err) {
      console.warn('[DB] Could not load from persistent file, initialized with SEED data:', err);
    }
  }

  public persist() {
    try {
      const dataDir = path.dirname(this.dataFilePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const state = {
        products: this.products,
        categories: this.categories,
        banners: this.banners,
        flashSale: this.flashSale,
        orders: this.orders,
        customers: this.customers,
        coupons: this.coupons,
        reviews: this.reviews,
        inventoryLogs: this.inventoryLogs,
        cmsPages: this.cmsPages,
        settings: this.settings,
        homepageConfig: this.homepageConfig,
        navItems: this.navItems,
        footerConfig: this.footerConfig,
        subscribers: this.subscribers,
        curatedSections: this.curatedSections,
        aboutUsConfig: this.aboutUsConfig,
        contactUsConfig: this.contactUsConfig,
        contactInquiries: this.contactInquiries
      };
      fs.writeFileSync(this.dataFilePath, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Failed to persist data to file:', err);
    }
  }

  // Products CRUD
  getProducts(query?: {
    category?: string;
    subcategory?: string;
    gender?: string;
    fabric?: string;
    stitchType?: string;
    isFeatured?: boolean;
    isNew?: boolean;
    isTrending?: boolean;
    isBestSeller?: boolean;
    isActive?: boolean;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    limit?: number;
    offset?: number;
  }) {
    let list = this.products.filter(p => query?.isActive !== undefined ? p.isActive === query.isActive : true);

    if (query?.category && query.category !== 'all') {
      const catLower = query.category.toLowerCase();
      list = list.filter(p => {
        const pCat = (p.category || '').toLowerCase();
        const pSub = (p.subcategory || '').toLowerCase();
        const pSlug = (p.slug || '').toLowerCase();
        const pGender = (p.gender || '').toLowerCase();

        if (catLower === 'ladies' || catLower === 'women') {
          return pGender === 'women' || pCat.includes('lawn') || pCat.includes('stitched') || pCat.includes('unstitched') || pCat.includes('ladies');
        }
        if (catLower === 'gents' || catLower === 'men') {
          return pGender === 'men' || pCat.includes('men') || pCat.includes('kurta') || pCat.includes('gents');
        }
        if (catLower === 'kids') {
          return pGender === 'kids' || pCat.includes('kids') || pCat.includes('children');
        }
        if (catLower === 'home-apparel' || catLower === 'home apparel' || catLower === 'home') {
          return pGender === 'home' || pCat.includes('home') || pCat.includes('bed') || pCat.includes('cushion');
        }
        if (catLower === 'bags') {
          return pGender === 'accessories' || pCat.includes('bag') || pCat.includes('clutch') || pCat.includes('potli');
        }

        return pCat.includes(catLower) || pSub.includes(catLower) || pSlug.includes(catLower);
      });
    }

    if (query?.subcategory && query.subcategory !== 'all') {
      const subLower = query.subcategory.toLowerCase();
      list = list.filter(p => (p.subcategory || '').toLowerCase().includes(subLower));
    }
    if (query?.gender && query.gender !== 'all') {
      list = list.filter(p => p.gender === query.gender || p.gender === 'unisex');
    }
    if (query?.fabric && query.fabric !== 'all') {
      list = list.filter(p => p.fabric.toLowerCase() === query.fabric!.toLowerCase());
    }
    if (query?.stitchType && query.stitchType !== 'all') {
      list = list.filter(p => p.stitchType === query.stitchType || p.stitchType === 'both');
    }
    if (query?.isNew) {
      list = list.filter(p => p.isNew);
    }
    if (query?.isFeatured) {
      list = list.filter(p => p.isFeatured);
    }
    if (query?.isTrending) {
      list = list.filter(p => p.isTrending);
    }
    if (query?.isBestSeller) {
      list = list.filter(p => p.isBestSeller);
    }
    if (query?.minPrice !== undefined) {
      list = list.filter(p => (p.salePrice || p.price) >= query.minPrice!);
    }
    if (query?.maxPrice !== undefined) {
      list = list.filter(p => (p.salePrice || p.price) <= query.maxPrice!);
    }
    if (query?.search) {
      const s = query.search.toLowerCase();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(s) ||
          p.sku.toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s) ||
          p.fabric.toLowerCase().includes(s) ||
          p.tags.some(t => t.toLowerCase().includes(s)) ||
          p.description.toLowerCase().includes(s)
      );
    }

    // Sort
    if (query?.sort) {
      switch (query.sort) {
        case 'newest':
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'price-low':
          list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
          break;
        case 'price-high':
          list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
          break;
        case 'best-selling':
          list.sort((a, b) => b.soldCount - a.soldCount);
          break;
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        default:
          // Featured / Default
          list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    const total = list.length;
    if (query?.offset !== undefined || query?.limit !== undefined) {
      const offset = query?.offset || 0;
      const limit = query?.limit || 20;
      list = list.slice(offset, offset + limit);
    }

    return { products: list, total };
  }

  getProductByIdOrSlug(idOrSlug: string): Product | undefined {
    return this.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  }

  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'soldCount' | 'rating' | 'reviewCount'>): Product {
    const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct: Product = {
      ...product,
      slug,
      id: `prod-${Date.now()}`,
      soldCount: 0,
      rating: 5.0,
      reviewCount: 0,
      isActive: product.isActive !== undefined ? product.isActive : true,
      images: product.images && product.images.length > 0 ? product.images : [
        { id: 'img-1', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: product.name }
      ],
      colors: product.colors && product.colors.length > 0 ? product.colors : [{ name: 'Karachi Classic', hex: '#ea580c' }],
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : ['Standard'],
      createdAt: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    this.products[index] = { ...this.products[index], ...updates };
    this.persist();
    return this.products[index];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    this.curatedSections.forEach(sec => {
      sec.productIds = sec.productIds.filter(pid => pid !== id);
    });
    this.persist();
    return this.products.length < initialLen;
  }

  duplicateProduct(id: string): Product | undefined {
    const existing = this.products.find(p => p.id === id);
    if (!existing) return undefined;
    const duplicated: Product = {
      ...existing,
      id: `prod-${Date.now()}`,
      name: `${existing.name} (Copy)`,
      slug: `${existing.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      sku: `${existing.sku}-CPY`,
      soldCount: 0,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    };
    this.products.unshift(duplicated);
    this.persist();
    return duplicated;
  }

  // Categories CRUD
  getCategories(): Category[] {
    return this.categories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  createCategory(category: Omit<Category, 'id'>): Category {
    const slug = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat: Category = {
      ...category,
      slug,
      id: `cat-${Date.now()}`,
      isActive: category.isActive !== undefined ? category.isActive : true,
      sortOrder: category.sortOrder || this.categories.length + 1
    };
    this.categories.push(newCat);
    this.persist();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | undefined {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.categories[idx] = { ...this.categories[idx], ...updates };
    this.persist();
    return this.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const len = this.categories.length;
    this.categories = this.categories.filter(c => c.id !== id);
    this.persist();
    return this.categories.length < len;
  }

  // Curated Merchandising Sections (Top Trends & Best Sellers)
  getCuratedSections(): CuratedSection[] {
    return this.curatedSections;
  }

  getCuratedSection(id: string): CuratedSection | undefined {
    return this.curatedSections.find(s => s.id === id);
  }

  updateCuratedSection(id: string, updates: Partial<CuratedSection>): CuratedSection | undefined {
    const idx = this.curatedSections.findIndex(s => s.id === id);
    if (idx === -1) {
      const newSec: CuratedSection = {
        id,
        title: updates.title || 'Curated Collection',
        subtitle: updates.subtitle || '',
        badge: updates.badge || 'FEATURED',
        isActive: updates.isActive !== undefined ? updates.isActive : true,
        productIds: updates.productIds || []
      };
      this.curatedSections.push(newSec);
      this.persist();
      return newSec;
    }
    this.curatedSections[idx] = { ...this.curatedSections[idx], ...updates };
    this.persist();
    return this.curatedSections[idx];
  }

  getCuratedProducts(sectionId: string): Product[] {
    const sec = this.getCuratedSection(sectionId);
    if (!sec || !sec.isActive) return [];
    const productsMap = new Map(this.products.map(p => [p.id, p]));
    const result: Product[] = [];
    sec.productIds.forEach(pid => {
      const prod = productsMap.get(pid);
      if (prod && prod.isActive !== false) {
        result.push(prod);
      }
    });
    return result;
  }

  // About Us & Contact Us CMS
  getAboutUsConfig(): AboutUsConfig {
    return this.aboutUsConfig;
  }

  updateAboutUsConfig(updates: Partial<AboutUsConfig>): AboutUsConfig {
    this.aboutUsConfig = {
      ...this.aboutUsConfig,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.aboutUsConfig;
  }

  getContactUsConfig(): ContactUsConfig {
    return this.contactUsConfig;
  }

  updateContactUsConfig(updates: Partial<ContactUsConfig>): ContactUsConfig {
    this.contactUsConfig = {
      ...this.contactUsConfig,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.contactUsConfig;
  }

  // Contact Inquiries
  getContactInquiries(): ContactInquiry[] {
    return this.contactInquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createContactInquiry(data: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>): ContactInquiry {
    const inquiry: ContactInquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    this.contactInquiries.unshift(inquiry);
    this.persist();
    return inquiry;
  }

  updateContactInquiry(id: string, updates: Partial<ContactInquiry>): ContactInquiry | undefined {
    const idx = this.contactInquiries.findIndex(i => i.id === id);
    if (idx === -1) return undefined;
    this.contactInquiries[idx] = { ...this.contactInquiries[idx], ...updates };
    this.persist();
    return this.contactInquiries[idx];
  }

  deleteContactInquiry(id: string): boolean {
    const len = this.contactInquiries.length;
    this.contactInquiries = this.contactInquiries.filter(i => i.id !== id);
    this.persist();
    return this.contactInquiries.length < len;
  }

  // Orders CRUD
  getOrders(): Order[] {
    return this.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderByIdOrNumber(idOrNumber: string): Order | undefined {
    return this.orders.find(o => o.id === idOrNumber || o.orderNumber === idOrNumber);
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'trackingHistory'>): Order {
    const orderNumber = `SU-${new Date().getFullYear()}-${1000 + this.orders.length + 1}`;
    
    const shippingAddress = orderData.shippingAddress || {
      fullName: orderData.customerName,
      phone: orderData.customerPhone || orderData.phone || '',
      address: orderData.address || '',
      area: orderData.area || 'Karachi Central',
      city: orderData.city || 'Karachi',
      province: 'Sindh',
      postalCode: orderData.postalCode || '75500'
    };

    const newOrder: Order = {
      ...orderData,
      customerEmail: orderData.customerEmail || orderData.email,
      customerPhone: orderData.customerPhone || orderData.phone,
      email: orderData.email || orderData.customerEmail,
      phone: orderData.phone || orderData.customerPhone,
      address: orderData.address || shippingAddress.address,
      area: orderData.area || shippingAddress.area,
      city: orderData.city || shippingAddress.city,
      shippingAddress,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: 'Order successfully placed via Stitch & Unstitched Online Checkout'
        }
      ]
    };

    this.orders.unshift(newOrder);

    // Increment product soldCount and decrement stock
    if (Array.isArray(newOrder.items)) {
      newOrder.items.forEach(item => {
        const prod = this.products.find(p => p.id === item.productId);
        if (prod) {
          prod.soldCount = (prod.soldCount || 0) + (item.quantity || 1);
          prod.stockQuantity = Math.max(0, prod.stockQuantity - (item.quantity || 1));
        }
      });
    }

    this.persist();
    return newOrder;
  }

  updateOrderStatus(id: string, status: Order['orderStatus'] | string, note?: string): Order | undefined {
    const order = this.orders.find(o => o.id === id);
    if (!order) return undefined;
    order.orderStatus = status as any;
    order.status = status as any;
    order.updatedAt = new Date().toISOString();
    if (!order.trackingHistory) order.trackingHistory = [];
    order.trackingHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${status.toUpperCase()} by Karachi Dispatch Operations`
    });
    this.persist();
    return order;
  }

  // Reviews CRUD with Admin Approval Workflow
  getReviews(productId?: string, status?: string): Review[] {
    let list = this.reviews;
    if (productId) {
      list = list.filter(r => r.productId === productId);
    }
    if (status) {
      list = list.filter(r => r.status === status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getApprovedReviewsForProduct(productId: string): Review[] {
    return this.reviews
      .filter(r => r.productId === productId && r.status === 'approved')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createReview(data: {
    productId: string;
    productName?: string;
    customerName: string;
    customerEmail?: string;
    rating: number;
    title?: string;
    comment: string;
    imageUrl?: string;
    verifiedPurchase?: boolean;
    status?: 'pending' | 'approved' | 'rejected';
  }): Review {
    const prod = this.products.find(p => p.id === data.productId);
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: data.productId,
      productName: data.productName || prod?.name || 'Exclusive Design',
      customerName: data.customerName,
      customerEmail: data.customerEmail || 'customer@gmail.com',
      rating: Number(data.rating) || 5,
      title: data.title || 'Verified Karachi Customer Review',
      comment: data.comment,
      imageUrl: data.imageUrl,
      verifiedPurchase: data.verifiedPurchase !== undefined ? data.verifiedPurchase : true,
      status: data.status || 'pending',
      isFeatured: false,
      createdAt: new Date().toISOString()
    };
    this.reviews.unshift(newReview);

    // Recalculate product rating from approved reviews
    this.recalculateProductRating(data.productId);
    this.persist();
    return newReview;
  }

  updateReviewStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Review | undefined {
    const review = this.reviews.find(r => r.id === id);
    if (!review) return undefined;
    review.status = status;
    this.recalculateProductRating(review.productId);
    this.persist();
    return review;
  }

  deleteReview(id: string): boolean {
    const review = this.reviews.find(r => r.id === id);
    if (!review) return false;
    const productId = review.productId;
    this.reviews = this.reviews.filter(r => r.id !== id);
    this.recalculateProductRating(productId);
    this.persist();
    return true;
  }

  private recalculateProductRating(productId: string) {
    const prod = this.products.find(p => p.id === productId);
    if (!prod) return;
    const approvedRevs = this.reviews.filter(r => r.productId === productId && r.status === 'approved');
    prod.reviewCount = approvedRevs.length;
    if (approvedRevs.length === 0) {
      prod.rating = 5.0;
    } else {
      const sum = approvedRevs.reduce((acc, r) => acc + r.rating, 0);
      prod.rating = Number((sum / approvedRevs.length).toFixed(1));
    }
  }

  // Coupons CRUD
  getCoupons(): Coupon[] {
    return this.coupons;
  }

  validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; discount?: number; message?: string } {
    const coupon = this.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!coupon) return { valid: false, message: 'Invalid or expired promo code.' };
    if (subtotal < coupon.minOrderValue) {
      return { valid: false, message: `Minimum order value for code ${coupon.code} is Rs. ${coupon.minOrderValue.toLocaleString()}` };
    }
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }
    return { valid: true, coupon, discount, message: `Coupon applied: Rs. ${discount.toLocaleString()} discount` };
  }

  createCoupon(couponData: Omit<Coupon, 'id' | 'usedCount'>): Coupon {
    const newCoupon: Coupon = {
      ...couponData,
      id: `c-${Date.now()}`,
      usedCount: 0
    };
    this.coupons.push(newCoupon);
    this.persist();
    return newCoupon;
  }

  updateCoupon(id: string, updates: Partial<Coupon>): Coupon | undefined {
    const idx = this.coupons.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.coupons[idx] = { ...this.coupons[idx], ...updates };
    this.persist();
    return this.coupons[idx];
  }

  deleteCoupon(id: string): boolean {
    const len = this.coupons.length;
    this.coupons = this.coupons.filter(c => c.id !== id);
    this.persist();
    return this.coupons.length < len;
  }

  // Flash Sale & Banners
  getFlashSale(): FlashSale {
    return this.flashSale;
  }

  updateFlashSale(updates: Partial<FlashSale>): FlashSale {
    this.flashSale = { ...this.flashSale, ...updates };
    this.persist();
    return this.flashSale;
  }

  getBanners(): Banner[] {
    return this.banners.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  createBanner(banner: Omit<Banner, 'id'>): Banner {
    const newBanner: Banner = {
      ...banner,
      id: `ban-${Date.now()}`
    };
    this.banners.push(newBanner);
    this.persist();
    return newBanner;
  }

  updateBanner(id: string, updates: Partial<Banner>): Banner | undefined {
    const idx = this.banners.findIndex(b => b.id === id);
    if (idx === -1) return undefined;
    this.banners[idx] = { ...this.banners[idx], ...updates };
    this.persist();
    return this.banners[idx];
  }

  deleteBanner(id: string): boolean {
    const len = this.banners.length;
    this.banners = this.banners.filter(b => b.id !== id);
    this.persist();
    return this.banners.length < len;
  }

  // Customers
  getCustomers(): Customer[] {
    return this.customers;
  }

  getCustomerByEmail(email: string): Customer | undefined {
    return this.customers.find(c => c.email.toLowerCase() === email.toLowerCase());
  }

  createCustomer(data: Omit<Customer, 'id' | 'totalSpent' | 'ordersCount' | 'isActive' | 'createdAt'>): Customer {
    const newCustomer: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      totalSpent: 0,
      ordersCount: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    this.customers.push(newCustomer);
    this.persist();
    return newCustomer;
  }

  // Newsletter & Subscribers
  getSubscribers(): Subscriber[] {
    return this.subscribers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addSubscriber(data: { email?: string; whatsapp?: string; name?: string; city?: string; source?: string }): Subscriber {
    const existing = this.subscribers.find(s =>
      (data.email && s.email && s.email.toLowerCase() === data.email.toLowerCase()) ||
      (data.whatsapp && s.whatsapp && s.whatsapp === data.whatsapp)
    );
    if (existing) {
      existing.status = 'active';
      this.persist();
      return existing;
    }
    const newSub: Subscriber = {
      id: `sub-${Date.now()}`,
      email: data.email,
      whatsapp: data.whatsapp,
      name: data.name,
      city: data.city || 'Karachi',
      status: 'active',
      source: data.source || 'Website Popup/Footer',
      createdAt: new Date().toISOString()
    };
    this.subscribers.unshift(newSub);
    this.persist();
    return newSub;
  }

  deleteSubscriber(id: string): boolean {
    const len = this.subscribers.length;
    this.subscribers = this.subscribers.filter(s => s.id !== id);
    this.persist();
    return this.subscribers.length < len;
  }

  broadcastNewsletter(message: string, channel: 'whatsapp' | 'email' | 'both') {
    const activeSubscribers = this.subscribers.filter(s => s.status === 'active');
    const emailRecipients = activeSubscribers.filter(s => s.email).map(s => s.email!);
    const whatsappRecipients = activeSubscribers.filter(s => s.whatsapp).map(s => s.whatsapp!);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      channel,
      sentCount: channel === 'both' ? activeSubscribers.length : channel === 'email' ? emailRecipients.length : whatsappRecipients.length,
      emailsCount: emailRecipients.length,
      whatsappCount: whatsappRecipients.length,
      messagePreview: message.slice(0, 100) + '...'
    };
  }

  // CMS Pages
  getCMSPage(slug: string): CMSPage | undefined {
    return this.cmsPages.find(p => p.slug === slug);
  }

  getAllCMSPages(): CMSPage[] {
    return this.cmsPages;
  }

  updateCMSPage(slug: string, updates: Partial<CMSPage>): CMSPage | undefined {
    const idx = this.cmsPages.findIndex(p => p.slug === slug);
    if (idx === -1) {
      const newPage: CMSPage = {
        slug,
        title: updates.title || slug.toUpperCase(),
        subtitle: updates.subtitle,
        content: updates.content || '',
        metaTitle: updates.metaTitle || `${updates.title || slug} | Stitch & Unstitched`,
        metaDescription: updates.metaDescription || '',
        updatedAt: new Date().toISOString()
      };
      this.cmsPages.push(newPage);
      this.persist();
      return newPage;
    }
    this.cmsPages[idx] = {
      ...this.cmsPages[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.cmsPages[idx];
  }

  // Store Settings & Branding
  getSettings(): StoreSettings {
    return this.settings;
  }

  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    const fee = updates.karachiShippingFee !== undefined 
      ? Number(updates.karachiShippingFee) 
      : (updates.shippingFee !== undefined 
          ? Number(updates.shippingFee) 
          : (updates.deliveryFee !== undefined 
              ? Number(updates.deliveryFee) 
              : undefined));

    const nationwide = updates.nationwideShippingFee !== undefined ? Number(updates.nationwideShippingFee) : undefined;
    const threshold = updates.freeShippingThreshold !== undefined ? Number(updates.freeShippingThreshold) : undefined;

    this.settings = {
      ...this.settings,
      ...updates,
      ...(fee !== undefined ? {
        karachiShippingFee: fee,
        shippingFee: fee,
        deliveryFee: fee,
      } : {}),
      ...(nationwide !== undefined ? { nationwideShippingFee: nationwide } : {}),
      ...(threshold !== undefined ? { freeShippingThreshold: threshold } : {}),
    };
    this.persist();
    return this.settings;
  }

  // Navigation Menu CRUD
  getNavItems(onlyActive = false): NavItem[] {
    let items = this.navItems;
    if (onlyActive) items = items.filter(i => i.isActive);
    return items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  saveNavItems(items: NavItem[]): NavItem[] {
    this.navItems = items.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    this.persist();
    return this.navItems;
  }

  createNavItem(item: Omit<NavItem, 'id'>): NavItem {
    const maxOrder = this.navItems.reduce((max, i) => Math.max(max, i.sortOrder || 0), 0);
    const newItem: NavItem = {
      ...item,
      id: `nav-${Date.now()}`,
      sortOrder: item.sortOrder !== undefined ? item.sortOrder : maxOrder + 1,
      isActive: item.isActive !== undefined ? item.isActive : true
    };
    this.navItems.push(newItem);
    this.persist();
    return newItem;
  }

  updateNavItem(id: string, updates: Partial<NavItem>): NavItem | undefined {
    const idx = this.navItems.findIndex(i => i.id === id);
    if (idx === -1) return undefined;
    this.navItems[idx] = { ...this.navItems[idx], ...updates };
    this.persist();
    return this.navItems[idx];
  }

  deleteNavItem(id: string): boolean {
    const len = this.navItems.length;
    this.navItems = this.navItems.filter(i => i.id !== id);
    this.persist();
    return this.navItems.length < len;
  }

  reorderNavItems(ids: string[]): NavItem[] {
    const itemMap = new Map(this.navItems.map(i => [i.id, i]));
    const reordered: NavItem[] = [];
    ids.forEach((id, idx) => {
      const item = itemMap.get(id);
      if (item) {
        item.sortOrder = idx + 1;
        reordered.push(item);
        itemMap.delete(id);
      }
    });
    itemMap.forEach(remaining => {
      remaining.sortOrder = reordered.length + 1;
      reordered.push(remaining);
    });
    this.navItems = reordered;
    this.persist();
    return this.navItems;
  }

  // Footer Configuration
  getFooterConfig(): FooterConfig {
    return this.footerConfig;
  }

  updateFooterConfig(updates: Partial<FooterConfig>): FooterConfig {
    this.footerConfig = { ...this.footerConfig, ...updates };
    this.persist();
    return this.footerConfig;
  }

  createFooterSection(section: { title: string; sortOrder?: number; isActive?: boolean; links?: FooterLink[] }): FooterSection {
    const maxOrder = this.footerConfig.sections.reduce((max, s) => Math.max(max, s.sortOrder || 0), 0);
    const newSection: FooterSection = {
      id: `sec-${Date.now()}`,
      title: section.title,
      sortOrder: section.sortOrder !== undefined ? section.sortOrder : maxOrder + 1,
      isActive: section.isActive !== undefined ? section.isActive : true,
      links: section.links || []
    };
    this.footerConfig.sections.push(newSection);
    this.persist();
    return newSection;
  }

  updateFooterSection(id: string, updates: Partial<FooterSection>): FooterSection | undefined {
    const idx = this.footerConfig.sections.findIndex(s => s.id === id);
    if (idx === -1) return undefined;
    this.footerConfig.sections[idx] = { ...this.footerConfig.sections[idx], ...updates };
    this.persist();
    return this.footerConfig.sections[idx];
  }

  deleteFooterSection(id: string): boolean {
    const len = this.footerConfig.sections.length;
    this.footerConfig.sections = this.footerConfig.sections.filter(s => s.id !== id);
    this.persist();
    return this.footerConfig.sections.length < len;
  }

  createFooterLink(sectionId: string, link: Omit<FooterLink, 'id'>): FooterLink | undefined {
    const sec = this.footerConfig.sections.find(s => s.id === sectionId);
    if (!sec) return undefined;
    const maxOrder = sec.links.reduce((max, l) => Math.max(max, l.sortOrder || 0), 0);
    const newLink: FooterLink = {
      ...link,
      id: `fl-${Date.now()}`,
      sortOrder: link.sortOrder !== undefined ? link.sortOrder : maxOrder + 1,
      isActive: link.isActive !== undefined ? link.isActive : true
    };
    sec.links.push(newLink);
    this.persist();
    return newLink;
  }

  updateFooterLink(sectionId: string, linkId: string, updates: Partial<FooterLink>): FooterLink | undefined {
    const sec = this.footerConfig.sections.find(s => s.id === sectionId);
    if (!sec) return undefined;
    const idx = sec.links.findIndex(l => l.id === linkId);
    if (idx === -1) return undefined;
    sec.links[idx] = { ...sec.links[idx], ...updates };
    this.persist();
    return sec.links[idx];
  }

  deleteFooterLink(sectionId: string, linkId: string): boolean {
    const sec = this.footerConfig.sections.find(s => s.id === sectionId);
    if (!sec) return false;
    const len = sec.links.length;
    sec.links = sec.links.filter(l => l.id !== linkId);
    this.persist();
    return sec.links.length < len;
  }

  // Analytics / Stats
  getStats() {
    const totalSales = this.orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = this.orders.length;
    const pendingOrders = this.orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'processing').length;
    const deliveredOrders = this.orders.filter(o => o.orderStatus === 'delivered').length;
    const totalCustomers = this.customers.length;
    const totalProducts = this.products.length;
    const lowStockProducts = this.products.filter(p => p.stockQuantity <= (p.lowStockThreshold || 5)).length;

    return {
      totalSales,
      todaySales: Math.round(totalSales * 0.35),
      monthlySales: Math.round(totalSales * 0.8),
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      recentOrders: this.orders.slice(0, 5),
      topSelling: this.products.slice().sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 5)
    };
  }
}

export const db = new Database();
