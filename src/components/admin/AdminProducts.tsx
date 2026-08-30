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
} from 'lucide-react';
import { Product } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

export const AdminProducts: React.FC = () => {
  const { formatPrice, addToast, categories } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStitch, setFilterStitch] = useState('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    category: 'LADIES',
    subcategory: 'Unstitched Lawn',
    gender: 'women' as any,
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
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
  });

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
      category: 'Luxury Lawn',
      gender: 'women',
      stitchType: 'both',
      customStitchingFee: 1500,
      price: 8500,
      salePrice: 6800,
      fabric: 'Pure Lawn / Chiffon Dupatta',
      pieces: '3 Piece',
      season: 'Summer 2026',
      description: 'Exclusive Pakistani embroidered collection with intricate tilla thread embroidery and dyed trousers.',
      stockQuantity: 30,
      isFeatured: true,
      isNew: true,
      isTrending: false,
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    });
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
      imageUrl: prod.images[0]?.url || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const generatedSlug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
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
        images: [
          { id: 'img-1', url: formData.imageUrl, isPrimary: true },
        ],
        sizes: formData.stitchType === 'unstitched' ? ['Unstitched'] : ['XS', 'S', 'M', 'L', 'XL'],
        colors: [{ name: 'Karachi Edition', hex: '#ea580c' }],
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
          message: `${formData.name} added to Karachi catalog.`,
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
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'all' || p.category === filterCategory;
    const matchStitch = filterStitch === 'all' || p.stitchType === filterStitch || p.stitchType === 'both';
    return matchSearch && matchCat && matchStitch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white">
            PRODUCT INVENTORY &amp; CATALOG
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Manage your Karachi luxury stitched and unstitched collections.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
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
            placeholder="Search by product title or SKU..."
            className="w-full bg-[#18181b] border border-[#27272a] text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
          />
        </div>

        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="bg-[#18181b] border border-[#27272a] text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
        >
          <option value="all">All Categories</option>
          <option value="Unstitched Luxury">Unstitched Luxury</option>
          <option value="Ready-to-Wear">Ready-to-Wear</option>
          <option value="Luxury Lawn">Luxury Lawn</option>
          <option value="Festive & Chiffon">Festive &amp; Chiffon</option>
          <option value="Men's Kurta & Kameez">Men&apos;s Kurta &amp; Kameez</option>
        </select>

        <select
          value={filterStitch}
          onChange={e => setFilterStitch(e.target.value)}
          className="bg-[#18181b] border border-[#27272a] text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
        >
          <option value="all">All Stitch Types</option>
          <option value="unstitched">Unstitched Only</option>
          <option value="stitched">Stitched Only</option>
          <option value="both">Both (Custom Tailoring)</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#121214] rounded-2xl border border-[#27272a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#d4d4d8]">
            <thead className="bg-[#18181b] text-[#a1a1aa] font-bold uppercase tracking-wider border-b border-[#27272a]">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Stitch Type</th>
                <th className="p-3.5">Price / Sale</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#71717a]">Loading products...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#71717a]">No products found.</td>
                </tr>
              ) : (
                filtered.map(prod => (
                  <tr key={prod.id} className="hover:bg-[#18181b]/50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]?.url}
                          alt=""
                          className="w-10 h-14 object-cover rounded-lg border border-[#27272a] shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-white">{prod.name}</h4>
                          <span className="text-[10px] text-[#71717a]">SKU: {prod.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-[#a1a1aa]">{prod.category}</td>
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
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#121214] border border-[#27272a] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl z-10 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#27272a] mb-4">
              <h3 className="font-cinzel text-lg font-bold text-white">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Fashion SKU'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#a1a1aa] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-white mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">SKU Number</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => {
                      const selectedCat = categories.find(c => c.name === e.target.value || c.slug === e.target.value);
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        subcategory: selectedCat?.subcategories?.[0] || '',
                        gender: (selectedCat?.gender || formData.gender) as any,
                      });
                    }}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                  >
                    {categories.length > 0 ? (
                      categories.map(c => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="LADIES">LADIES</option>
                        <option value="GENTS">GENTS</option>
                        <option value="KIDS">KIDS</option>
                        <option value="HOME APPAREL">HOME APPAREL</option>
                        <option value="BAGS">BAGS</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Subcategory</label>
                  {(() => {
                    const currentCatObj = categories.find(
                      c => c.name.toLowerCase() === formData.category.toLowerCase() || c.slug.toLowerCase() === formData.category.toLowerCase()
                    );
                    const subList = currentCatObj?.subcategories || [];

                    if (subList.length > 0) {
                      return (
                        <select
                          value={formData.subcategory}
                          onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                          className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                        >
                          <option value="">-- Select Subcategory --</option>
                          {subList.map((sub, sIdx) => (
                            <option key={sIdx} value={sub}>
                              {sub}
                            </option>
                          ))}
                        </select>
                      );
                    }

                    return (
                      <input
                        type="text"
                        placeholder="e.g. Unstitched Lawn, 3-Piece"
                        value={formData.subcategory}
                        onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                        className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                      />
                    );
                  })()}
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Stitching Choice</label>
                  <select
                    value={formData.stitchType}
                    onChange={e => setFormData({ ...formData, stitchType: e.target.value as any })}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
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
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Sale Price (PKR)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={e => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={e => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Custom Stitching Fee (PKR)</label>
                  <input
                    type="number"
                    value={formData.customStitchingFee}
                    onChange={e => setFormData({ ...formData, customStitchingFee: Number(e.target.value) })}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-white mb-1">High-Res Product Image URL</label>
                <input
                  type="text"
                  required
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-white mb-1">Fabric &amp; Piece Composition</label>
                <input
                  type="text"
                  value={formData.fabric}
                  onChange={e => setFormData({ ...formData, fabric: e.target.value })}
                  className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-white mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-[#ea580c]"
                  />
                  <span>Featured Collection</span>
                </label>

                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={e => setFormData({ ...formData, isNew: e.target.checked })}
                    className="accent-[#ea580c]"
                  />
                  <span>New 2026 Arrival</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#27272a] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-4 py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-6 py-2.5 rounded-xl shadow-md"
                >
                  Save Product to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
