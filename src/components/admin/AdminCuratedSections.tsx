import React, { useState, useEffect } from 'react';
import {
  Flame,
  TrendingUp,
  Sparkles,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Check,
  Search,
  Eye,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { CuratedSection, Product } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

export const AdminCuratedSections: React.FC = () => {
  const { formatPrice, addToast } = useStore();
  const [sections, setSections] = useState<CuratedSection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('top-trends');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [secData, prodData] = await Promise.all([
        api.getCuratedSections(),
        api.getProducts({ limit: 100 }),
      ]);
      if (Array.isArray(secData)) {
        setSections(secData);
        if (secData.length > 0 && !selectedSectionId) {
          setSelectedSectionId(secData[0].id);
        }
      }
      if (prodData && prodData.products) {
        setProducts(prodData.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentSection = sections.find(s => s.id === selectedSectionId) || sections[0];

  const handleUpdateCurrentSection = (updates: Partial<CuratedSection>) => {
    setSections(prev =>
      prev.map(s => (s.id === currentSection?.id ? { ...s, ...updates } : s))
    );
  };

  const handleSaveSection = async () => {
    if (!currentSection) return;
    setIsSaving(true);
    try {
      await api.updateCuratedSection(currentSection.id, currentSection);
      addToast({
        type: 'success',
        title: 'Section Saved',
        message: `"${currentSection.title}" updated successfully and is live on the storefront.`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not update curated merchandising section.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveProduct = (index: number, direction: 'up' | 'down') => {
    if (!currentSection) return;
    const newIds = [...currentSection.productIds];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newIds.length) return;

    const temp = newIds[index];
    newIds[index] = newIds[targetIndex];
    newIds[targetIndex] = temp;

    handleUpdateCurrentSection({ productIds: newIds });
  };

  const handleRemoveProduct = (productId: string) => {
    if (!currentSection) return;
    const newIds = currentSection.productIds.filter(id => id !== productId);
    handleUpdateCurrentSection({ productIds: newIds });
  };

  const handleAddProductToSection = (productId: string) => {
    if (!currentSection) return;
    if (currentSection.productIds.includes(productId)) {
      addToast({
        type: 'info',
        title: 'Already Added',
        message: 'This product is already in this curated collection.',
      });
      return;
    }
    const newIds = [...currentSection.productIds, productId];
    handleUpdateCurrentSection({ productIds: newIds });
    setIsAddProductModalOpen(false);
  };

  const productsMap = new Map(products.map(p => [p.id, p]));
  const sectionProducts = (currentSection?.productIds || [])
    .map(id => productsMap.get(id))
    .filter(Boolean) as Product[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-[#ea580c]" />
            CURATED HOMEPAGE SECTIONS (CRUD)
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Customize &ldquo;Top Trends of the Season&rdquo; and &ldquo;Best Sellers in Karachi&rdquo; merchandising collections.
          </p>
        </div>

        <button
          onClick={handleSaveSection}
          disabled={isSaving}
          className="flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#27272a] pb-3">
        {sections.map(sec => {
          const isSelected = sec.id === selectedSectionId;
          return (
            <button
              key={sec.id}
              onClick={() => setSelectedSectionId(sec.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-[#ea580c] text-white shadow-md'
                  : 'bg-[#18181b] text-[#a1a1aa] hover:bg-[#27272a] hover:text-white border border-[#27272a]'
              }`}
            >
              {sec.id === 'top-trends' ? (
                <Flame className="w-3.5 h-3.5" />
              ) : (
                <TrendingUp className="w-3.5 h-3.5" />
              )}
              <span>{sec.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/30 text-white/90">
                {sec.productIds.length} items
              </span>
            </button>
          );
        })}
      </div>

      {currentSection && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section Configuration Panel */}
          <div className="bg-[#121214] p-5 rounded-2xl border border-[#27272a] space-y-4">
            <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#ea580c]" />
              Section Settings
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">
                Section Heading Title
              </label>
              <input
                type="text"
                value={currentSection.title}
                onChange={e => handleUpdateCurrentSection({ title: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={currentSection.subtitle || ''}
                onChange={e => handleUpdateCurrentSection({ subtitle: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] mb-1">
                Featured Badge Tag
              </label>
              <input
                type="text"
                value={currentSection.badge || ''}
                onChange={e => handleUpdateCurrentSection({ badge: e.target.value })}
                placeholder="e.g. LUXURY 2026, BEST SELLER"
                className="w-full bg-[#18181b] border border-[#27272a] text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentSection.isActive}
                  onChange={e => handleUpdateCurrentSection({ isActive: e.target.checked })}
                  className="rounded text-[#ea580c] focus:ring-0 bg-[#18181b] border-[#27272a]"
                />
                <span className="text-xs text-[#d4d4d8]">Display this section on Homepage</span>
              </label>
            </div>

            <div className="p-3 bg-[#18181b] rounded-xl border border-[#27272a] text-[11px] text-[#a1a1aa]">
              💡 <strong>Merchandising Tip:</strong> Keep 4 to 8 featured products in this section for optimum visual balance on desktop and mobile carousels.
            </div>
          </div>

          {/* Curated Products List with Reorder & Remove */}
          <div className="lg:col-span-2 bg-[#121214] p-5 rounded-2xl border border-[#27272a] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#ea580c]" />
                  Curated Products ({sectionProducts.length})
                </h3>
                <p className="text-[11px] text-[#a1a1aa]">
                  Reorder products or add new items to display in this collection.
                </p>
              </div>

              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="flex items-center gap-1 bg-[#ea580c] hover:bg-[#c2410c] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            {sectionProducts.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[#27272a] rounded-xl">
                <p className="text-xs text-[#71717a]">No products added to this collection yet.</p>
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="mt-3 text-xs text-[#ea580c] hover:underline font-bold"
                >
                  + Add Products Now
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {sectionProducts.map((prod, index) => {
                  const img = prod.images[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';
                  return (
                    <div
                      key={prod.id}
                      className="flex items-center justify-between p-3 bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-5 text-center text-xs font-bold text-[#71717a]">
                          {index + 1}
                        </span>
                        <img
                          src={img}
                          alt={prod.name}
                          className="w-12 h-14 object-cover rounded-lg shrink-0 border border-[#27272a]"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                          <p className="text-[10px] text-[#a1a1aa]">
                            SKU: {prod.sku} • {prod.fabric || 'Luxury Fabric'}
                          </p>
                          <p className="text-[11px] font-bold text-[#ea580c] mt-0.5">
                            {formatPrice(prod.salePrice || prod.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Reorder Buttons */}
                        <button
                          onClick={() => handleMoveProduct(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 text-[#a1a1aa] hover:text-white hover:bg-[#27272a] rounded-lg transition-colors disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveProduct(index, 'down')}
                          disabled={index === sectionProducts.length - 1}
                          className="p-1.5 text-[#a1a1aa] hover:text-white hover:bg-[#27272a] rounded-lg transition-colors disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveProduct(prod.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors ml-1"
                          title="Remove from Section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#121214] border border-[#27272a] w-full max-w-xl rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h3 className="font-cinzel text-sm font-bold text-white">
                SELECT PRODUCT FOR {currentSection?.title.toUpperCase()}
              </h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-[#a1a1aa] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Search products by title, SKU or fabric..."
                className="w-full bg-[#18181b] border border-[#27272a] text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {products
                .filter(p => {
                  const q = productSearch.toLowerCase();
                  return (
                    p.name.toLowerCase().includes(q) ||
                    p.sku.toLowerCase().includes(q) ||
                    (p.fabric && p.fabric.toLowerCase().includes(q))
                  );
                })
                .map(prod => {
                  const isAlreadyAdded = currentSection?.productIds.includes(prod.id);
                  const img = prod.images[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';
                  return (
                    <div
                      key={prod.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                        isAlreadyAdded
                          ? 'bg-[#18181b]/50 border-[#27272a] opacity-60'
                          : 'bg-[#18181b] border-[#27272a] hover:border-[#ea580c]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={img}
                          alt={prod.name}
                          className="w-10 h-12 object-cover rounded-lg border border-[#27272a]"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                          <p className="text-[10px] text-[#a1a1aa]">
                            SKU: {prod.sku} • {formatPrice(prod.salePrice || prod.price)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddProductToSection(prod.id)}
                        disabled={isAlreadyAdded}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isAlreadyAdded
                            ? 'bg-[#27272a] text-[#71717a] cursor-not-allowed'
                            : 'bg-[#ea580c] hover:bg-[#c2410c] text-white'
                        }`}
                      >
                        {isAlreadyAdded ? 'Added' : '+ Add'}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
