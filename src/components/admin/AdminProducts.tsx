import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Scissors,
  Check,
  X,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Palette,
  Globe,
  Upload,
  Star,
  Eye,
  Info,
} from 'lucide-react';
import { Product } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

interface ProductImageForm {
  id: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

interface ProductColorForm {
  name: string;
  hex: string;
}

const PRESET_LUXURY_COLORS = [
  { name: 'Karachi Terracotta', hex: '#ea580c' },
  { name: 'Emerald Royale', hex: '#047857' },
  { name: 'Midnight Navy', hex: '#1e1b4b' },
  { name: 'Ruby Velvet', hex: '#881337' },
  { name: 'Ivory Gold', hex: '#fef08a' },
  { name: 'Blush Rose', hex: '#fda4af' },
  { name: 'Onyx Noir', hex: '#18181b' },
  { name: 'Sage Green', hex: '#84cc16' },
  { name: 'Dusty Lilac', hex: '#c084fc' },
];

export const AdminProducts: React.FC = () => {
  const { formatPrice, addToast, categories } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStitch, setFilterStitch] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    category: 'LADIES',
    subcategory: 'Unstitched Lawn',
    gender: 'women' as 'women' | 'men' | 'kids' | 'unisex',
    stitchType: 'both' as 'unstitched' | 'stitched' | 'both',
    customStitchingFee: 1500,
    price: 8500,
    salePrice: 6800,
    fabric: 'Pure Cotton Satin & Embroidered Organza',
    pieces: '3 Piece',
    season: 'Spring/Summer 2026',
    description: '',
    stockQuantity: 25,
    isFeatured: true,
    isNew: true,
    isTrending: false,
    seoTitle: '',
    seoDescription: '',
    tags: [] as string[],
    newTagInput: '',
  });

  const [imagesList, setImagesList] = useState<ProductImageForm[]>([
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000',
      alt: 'Luxury Embroidered Lawn Ensemble',
      isPrimary: true,
    },
  ]);

  const [newImageUrl, setNewImageUrl] = useState('');
  const [colorsList, setColorsList] = useState<ProductColorForm[]>([
    { name: 'Karachi Terracotta', hex: '#ea580c' },
  ]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({ limit: 100 });
      if (res && res.products) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      sku: `SU-2026-${Math.floor(100 + Math.random() * 900)}`,
      category: categories[0]?.name || 'LADIES',
      subcategory: categories[0]?.subcategories?.[0] || 'Unstitched Lawn',
      gender: 'women',
      stitchType: 'both',
      customStitchingFee: 1500,
      price: 8500,
      salePrice: 6800,
      fabric: 'Pure Pima Lawn & Embroidered Chiffon Dupatta',
      pieces: '3 Piece',
      season: 'Summer 2026',
      description: 'Exclusive Karachi handcrafted luxury lawn with fine tilla embroidery, dyed cambric trousers, and printed chiffon dupatta.',
      stockQuantity: 30,
      isFeatured: true,
      isNew: true,
      isTrending: false,
      seoTitle: '',
      seoDescription: '',
      tags: ['Karachi Lawn', 'Luxury Pret', 'Summer 2026'],
      newTagInput: '',
    });
    setImagesList([
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000',
        alt: 'Primary Front View',
        isPrimary: true,
      },
    ]);
    setColorsList([{ name: 'Karachi Terracotta', hex: '#ea580c' }]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      slug: prod.slug,
      sku: prod.sku,
      category: prod.category,
      subcategory: prod.subcategory || '',
      gender: prod.gender as any,
      stitchType: prod.stitchType,
      customStitchingFee: prod.customStitchingFee || 1500,
      price: prod.price,
      salePrice: prod.salePrice || 0,
      fabric: prod.fabric,
      pieces: prod.pieces,
      season: prod.season || '2026',
      description: prod.description,
      stockQuantity: prod.stockQuantity,
      isFeatured: !!prod.isFeatured,
      isNew: !!prod.isNew,
      isTrending: !!prod.isTrending,
      seoTitle: prod.seoTitle || '',
      seoDescription: prod.seoDescription || '',
      tags: prod.tags || ['Karachi Couture', 'Luxury Collection'],
      newTagInput: '',
    });

    const parsedImages: ProductImageForm[] = (prod.images && prod.images.length > 0)
      ? prod.images.map((img, idx) => ({
          id: img.id || `img-${idx}`,
          url: img.url,
          alt: img.alt || prod.name,
          isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
        }))
      : [
          {
            id: 'img-1',
            url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000',
            alt: prod.name,
            isPrimary: true,
          },
        ];

    setImagesList(parsedImages);

    const parsedColors: ProductColorForm[] = (prod.colors && prod.colors.length > 0)
      ? prod.colors.map(c => ({ name: c.name, hex: c.hex }))
      : [{ name: 'Karachi Terracotta', hex: '#ea580c' }];

    setColorsList(parsedColors);
    setIsModalOpen(true);
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    const newImg: ProductImageForm = {
      id: `img-${Date.now()}`,
      url: newImageUrl.trim(),
      alt: `${formData.name || 'Product'} Image ${imagesList.length + 1}`,
      isPrimary: imagesList.length === 0,
    };
    setImagesList([...imagesList, newImg]);
    setNewImageUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'File Too Large',
        message: 'Please choose an image under 3MB.',
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = event => {
      const dataUri = event.target?.result as string;
      const newImg: ProductImageForm = {
        id: `img-${Date.now()}`,
        url: dataUri,
        alt: `${formData.name || 'Product'} uploaded view`,
        isPrimary: imagesList.length === 0,
      };
      setImagesList(prev => [...prev, newImg]);
      addToast({
        type: 'success',
        title: 'Image Uploaded',
        message: 'Image added to product gallery.',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSetPrimaryImage = (id: string) => {
    setImagesList(prev =>
      prev.map(img => ({
        ...img,
        isPrimary: img.id === id,
      }))
    );
  };

  const handleRemoveImage = (id: string) => {
    if (imagesList.length <= 1) {
      addToast({
        type: 'info',
        title: 'At Least One Image Required',
        message: 'Product must maintain at least 1 image.',
      });
      return;
    }
    const filtered = imagesList.filter(img => img.id !== id);
    if (!filtered.some(img => img.isPrimary) && filtered.length > 0) {
      filtered[0].isPrimary = true;
    }
    setImagesList(filtered);
  };

  const handleAddColor = (preset: { name: string; hex: string }) => {
    if (colorsList.some(c => c.hex.toLowerCase() === preset.hex.toLowerCase())) return;
    setColorsList([...colorsList, preset]);
  };

  const handleRemoveColor = (hex: string) => {
    if (colorsList.length <= 1) return;
    setColorsList(colorsList.filter(c => c.hex !== hex));
  };

  const handleAISuggest = async () => {
    if (!formData.name.trim()) {
      addToast({
        type: 'info',
        title: 'Enter Product Name First',
        message: 'Please enter a product title (e.g., "Zari Embroidered Lawn Suit") for AI to suggest details.',
      });
      return;
    }

    setIsGeneratingAI(true);
    try {
      const suggestions = await api.suggestProductDetails({
        name: formData.name,
        category: formData.category,
        fabric: formData.fabric,
        colors: colorsList.map(c => c.name),
        gender: formData.gender,
        stitchType: formData.stitchType,
      });

      setFormData(prev => ({
        ...prev,
        description: suggestions.description || prev.description,
        fabric: suggestions.fabric || prev.fabric,
        seoTitle: suggestions.seoTitle || prev.seoTitle,
        seoDescription: suggestions.seoDescription || prev.seoDescription,
        tags: suggestions.tags && suggestions.tags.length > 0 ? suggestions.tags : prev.tags,
      }));

      // Update image alt texts
      if (suggestions.imageAltText) {
        setImagesList(prev =>
          prev.map((img, idx) => ({
            ...img,
            alt: idx === 0 ? suggestions.imageAltText! : `${suggestions.imageAltText!} View ${idx + 1}`,
          }))
        );
      }

      addToast({
        type: 'success',
        title: 'AI Suggestions Applied! ✨',
        message: 'High-converting luxury description, fabric specs, and SEO meta tags filled automatically.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'AI Generation Failed',
        message: 'Could not fetch AI suggestions. Fallback data applied.',
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const generatedSlug =
        formData.slug.trim() ||
        formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const payload: Partial<Product> = {
        name: formData.name,
        slug: generatedSlug,
        sku: formData.sku,
        brand: 'Stitch & Unstitched',
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        gender: formData.gender,
        stitchType: formData.stitchType,
        customStitchingFee: Number(formData.customStitchingFee),
        price: Number(formData.price),
        salePrice: Number(formData.salePrice) || undefined,
        fabric: formData.fabric,
        pieces: formData.pieces,
        season: formData.season,
        description: formData.description,
        stockQuantity: Number(formData.stockQuantity),
        isFeatured: formData.isFeatured,
        isNew: formData.isNew,
        isTrending: formData.isTrending,
        seoTitle: formData.seoTitle || `${formData.name} | Karachi Luxury Fashion`,
        seoDescription: formData.seoDescription || formData.description.slice(0, 155),
        tags: formData.tags,
        images: imagesList.map((img, idx) => ({
          id: img.id,
          url: img.url,
          alt: img.alt || formData.name,
          isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
        })),
        colors: colorsList,
        sizes:
          formData.stitchType === 'unstitched'
            ? ['Unstitched']
            : ['XS', 'S', 'M', 'L', 'XL'],
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        addToast({
          type: 'success',
          title: 'Product Updated',
          message: `${formData.name} updated in catalog.`,
        });
      } else {
        await api.createProduct(payload as any);
        addToast({
          type: 'success',
          title: 'Product Created',
          message: `${formData.name} added to Karachi catalog with multi-images and SEO tags.`,
        });
      }

      setIsModalOpen(false);
      loadProducts();
    } catch {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save product details.',
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api.deleteProduct(id);
      addToast({
        type: 'info',
        title: 'Product Deleted',
        message: `${name} has been removed from inventory.`,
      });
      loadProducts();
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not delete product.',
      });
    }
  };

  const filtered = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.fabric && p.fabric.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = filterCategory === 'all' || p.category === filterCategory;
    const matchStitch =
      filterStitch === 'all' || p.stitchType === filterStitch || p.stitchType === 'both';
    return matchSearch && matchCat && matchStitch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[#ea580c]" />
            PRODUCT INVENTORY &amp; CATALOG (CRUD)
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Manage your Karachi stitched pret, unstitched lawn, multiple image galleries, fabric specs, and AI suggestions.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Fashion SKU</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-[#121214] p-4 rounded-2xl border border-[#27272a] flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, SKU, fabric (e.g. Lawn, Velvet)..."
            className="w-full bg-[#18181b] border border-[#27272a] text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
          />
        </div>

        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="bg-[#18181b] border border-[#27272a] text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={filterStitch}
          onChange={e => setFilterStitch(e.target.value)}
          className="bg-[#18181b] border border-[#27272a] text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
        >
          <option value="all">All Stitch Types</option>
          <option value="unstitched">Unstitched Fabric</option>
          <option value="stitched">Pre-Stitched Pret</option>
          <option value="both">Both Options</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-[#121214] rounded-2xl border border-[#27272a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#d4d4d8]">
            <thead className="bg-[#18181b] text-[10px] uppercase font-bold text-[#a1a1aa] border-b border-[#27272a]">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Category &amp; Fabric</th>
                <th className="p-3.5">Stitch Type</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Gallery</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#a1a1aa]">
                    Loading products...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#71717a]">
                    No fashion SKUs found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(prod => {
                  const primaryImg =
                    prod.images?.find(i => i.isPrimary)?.url ||
                    prod.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1610030469983-98e550d6193c';

                  return (
                    <tr key={prod.id} className="hover:bg-[#18181b]/50 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={primaryImg}
                            alt={prod.name}
                            className="w-12 h-14 object-cover rounded-lg shrink-0 border border-[#27272a]"
                          />
                          <div>
                            <h4 className="font-bold text-white text-sm">{prod.name}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-[#71717a] mt-0.5">
                              <span>SKU: {prod.sku}</span>
                              <span>•</span>
                              <span className="font-mono text-[#ea580c]">/{prod.slug}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-medium text-white">{prod.category}</div>
                        <div className="text-[10px] text-[#a1a1aa] truncate max-w-[180px]">
                          {prod.fabric || 'Luxury Fabric'}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="bg-[#27272a] text-[#fed7aa] text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                          {prod.stitchType}
                        </span>
                      </td>

                      <td className="p-3.5 font-bold">
                        <div className="text-white">{formatPrice(prod.salePrice || prod.price)}</div>
                        {prod.salePrice && (
                          <div className="text-[10px] text-[#71717a] line-through">
                            {formatPrice(prod.price)}
                          </div>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            prod.stockQuantity <= 10
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}
                        >
                          {prod.stockQuantity} pcs
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1">
                          {prod.images?.slice(0, 3).map((img, i) => (
                            <img
                              key={i}
                              src={img.url}
                              alt=""
                              className="w-6 h-7 object-cover rounded border border-[#27272a]"
                            />
                          ))}
                          {(prod.images?.length || 0) > 3 && (
                            <span className="text-[10px] text-[#a1a1aa]">
                              +{(prod.images?.length || 0) - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#121214] border border-[#27272a] rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl z-10 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#27272a] mb-4">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  {editingProduct ? 'Edit Catalog SKU' : 'Add New Fashion SKU'}
                </h3>
                <p className="text-[11px] text-[#a1a1aa]">
                  Configure multi-image gallery, fabric specs, color swatches, and SEO tags.
                </p>
              </div>

              {/* AI Auto-Suggest Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAISuggest}
                  disabled={isGeneratingAI}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-[#ea580c] to-amber-600 hover:from-amber-600 hover:to-[#ea580c] text-white px-3.5 py-2 rounded-xl font-bold shadow-md transition-all disabled:opacity-50"
                  title="Generate high-converting description, fabric care instructions, and SEO tags"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAI ? 'AI Generating...' : 'AI Auto-Suggest Details'}</span>
                </button>
                <button onClick={() => setIsModalOpen(false)} className="text-[#a1a1aa] hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5 max-h-[75vh] overflow-y-auto pr-2">
              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-white mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => {
                      const val = e.target.value;
                      const slugAuto = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setFormData({ ...formData, name: val, slug: formData.slug || slugAuto });
                    }}
                    placeholder="e.g. Zari Embroidered Chiffon Suit"
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">SEO URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. zari-embroidered-chiffon-suit"
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl font-mono text-[11px] focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => {
                      const selectedCat = categories.find(
                        c => c.name === e.target.value || c.slug === e.target.value
                      );
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        subcategory: selectedCat?.subcategories?.[0] || '',
                      });
                    }}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="e.g. Unstitched Lawn, 3-Piece"
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Stitching Choice</label>
                  <select
                    value={formData.stitchType}
                    onChange={e => setFormData({ ...formData, stitchType: e.target.value as any })}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  >
                    <option value="both">Both (Unstitched + Custom Tailoring Option)</option>
                    <option value="unstitched">Unstitched Fabric Only</option>
                    <option value="stitched">Pre-Stitched Ready-to-Wear</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Regular Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Sale Price (PKR)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={e => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={e => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Custom Stitching Tailoring Fee (PKR)</label>
                  <input
                    type="number"
                    value={formData.customStitchingFee}
                    onChange={e => setFormData({ ...formData, customStitchingFee: Number(e.target.value) })}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              {/* Fabric & Color Specification */}
              <div className="p-4 bg-[#18181b] rounded-2xl border border-[#27272a] space-y-4">
                <h4 className="font-cinzel text-xs font-bold text-white flex items-center gap-2">
                  <Scissors className="w-3.5 h-3.5 text-[#ea580c]" />
                  FABRIC &amp; COLOR SWATCHES
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-white mb-1">Fabric Composition &amp; Craft</label>
                    <input
                      type="text"
                      value={formData.fabric}
                      onChange={e => setFormData({ ...formData, fabric: e.target.value })}
                      placeholder="e.g. Pure Cotton Satin, Organza Inserts"
                      className="w-full bg-[#121214] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-white mb-1">Pieces Count / Cut</label>
                    <input
                      type="text"
                      value={formData.pieces}
                      onChange={e => setFormData({ ...formData, pieces: e.target.value })}
                      placeholder="e.g. 3 Piece (Shirt, Trouser, Dupatta)"
                      className="w-full bg-[#121214] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>
                </div>

                {/* Color Swatches Management */}
                <div>
                  <label className="block font-bold text-white mb-1">Color Palette Swatches</label>
                  <div className="flex flex-wrap gap-2 items-center mb-2">
                    {colorsList.map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#27272a] border border-[#3f3f46] text-xs text-white"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/40"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                        {colorsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(c.hex)}
                            className="text-[#a1a1aa] hover:text-red-400 ml-1"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 items-center pt-1">
                    <span className="text-[10px] text-[#a1a1aa] mr-1">Quick Add Preset:</span>
                    {PRESET_LUXURY_COLORS.map(p => (
                      <button
                        key={p.hex}
                        type="button"
                        onClick={() => handleAddColor(p)}
                        className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#121214] hover:bg-[#27272a] text-[#d4d4d8] border border-[#27272a]"
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.hex }} />
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Multi-Image Gallery & Dimension Guides */}
              <div className="p-4 bg-[#18181b] rounded-2xl border border-[#27272a] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-cinzel text-xs font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5 text-[#ea580c]" />
                      PRODUCT IMAGE GALLERY &amp; THUMBNAILS ({imagesList.length})
                    </h4>
                    <p className="text-[10px] text-[#fed7aa]">
                      📐 Required Dimensions: <strong>1000 × 1333 px</strong> (3:4 Portrait Ratio) for ultra-sharp mobile &amp; desktop catalog display.
                    </p>
                  </div>

                  {/* File Upload Trigger */}
                  <label className="flex items-center gap-1 bg-[#27272a] hover:bg-[#3f3f46] text-white px-3 py-1.5 rounded-xl cursor-pointer text-xs font-bold transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Add Image by URL Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL (https://...)..."
                    className="flex-1 bg-[#121214] border border-[#27272a] text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#ea580c]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    Add URL
                  </button>
                </div>

                {/* Thumbnails List */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {imagesList.map((img, idx) => (
                    <div
                      key={img.id}
                      className={`relative p-2 rounded-xl border transition-all ${
                        img.isPrimary
                          ? 'bg-[#ea580c]/10 border-[#ea580c]'
                          : 'bg-[#121214] border-[#27272a]'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt || ''}
                        className="w-full h-28 object-cover rounded-lg border border-[#27272a]"
                      />

                      <div className="mt-2 space-y-1">
                        <input
                          type="text"
                          value={img.alt || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setImagesList(prev =>
                              prev.map(item => (item.id === img.id ? { ...item, alt: val } : item))
                            );
                          }}
                          placeholder="Image Alt Text (SEO)"
                          className="w-full bg-[#18181b] border border-[#27272a] text-[10px] text-white px-1.5 py-1 rounded"
                        />

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(img.id)}
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                              img.isPrimary
                                ? 'bg-[#ea580c] text-white'
                                : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
                            }`}
                          >
                            {img.isPrimary ? '★ Primary' : 'Make Primary'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img.id)}
                            className="text-[#71717a] hover:text-red-400 p-0.5"
                            title="Delete Image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Description */}
              <div>
                <label className="block font-bold text-white mb-1">
                  Product Description &amp; Care Details
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the fabric, embroidery, embellishments, cut, and care instructions..."
                  className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              {/* SEO Meta Fields */}
              <div className="p-4 bg-[#18181b] rounded-2xl border border-[#27272a] space-y-3">
                <h4 className="font-cinzel text-xs font-bold text-white flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#ea580c]" />
                  SEO &amp; OPEN GRAPH (OG) METADATA
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#a1a1aa] text-[11px] mb-1">
                      Meta Title Tag (Google &amp; Social)
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder="e.g. Zari Embroidered Lawn | Stitch & Unstitched Karachi"
                      className="w-full bg-[#121214] border border-[#27272a] text-white p-2.5 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#a1a1aa] text-[11px] mb-1">
                      Meta Description (Search Snippet)
                    </label>
                    <input
                      type="text"
                      value={formData.seoDescription}
                      onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                      placeholder="e.g. Buy authentic Pakistani designer unstitched lawn..."
                      className="w-full bg-[#121214] border border-[#27272a] text-white p-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Badges & Checkboxes */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-[#ea580c]"
                  />
                  <span>Featured Collection</span>
                </label>

                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={e => setFormData({ ...formData, isNew: e.target.checked })}
                    className="accent-[#ea580c]"
                  />
                  <span>New 2026 Arrival</span>
                </label>

                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={e => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="accent-[#ea580c]"
                  />
                  <span>Trending in Karachi</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#27272a] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-4 py-2.5 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
