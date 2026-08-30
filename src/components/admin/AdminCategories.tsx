import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  FolderTree,
  X,
  Check,
  Layers,
  Sparkles,
  Tag,
  ArrowUpDown,
  Search,
  Eye,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

const PRESET_SUGGESTIONS = [
  {
    name: 'LADIES',
    gender: 'women',
    slug: 'ladies',
    description: 'Exquisite unstitched lawn, luxury ready-to-wear pret, festive formal wear, and designer kurtis.',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      'Unstitched Lawn',
      'Ready-to-Wear (Stitched)',
      '3-Piece Luxury Suits',
      'Kurtis & Tops',
      'Chiffon & Festive Formals',
      'Dupattas & Shawls',
      'Bottoms & Trousers',
    ],
  },
  {
    name: 'GENTS',
    gender: 'men',
    slug: 'gents',
    description: "Sophisticated men's kurtas in Egyptian cotton, classic shalwar kameez, and tailored waistcoats.",
    imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      'Cotton Kurtas',
      'Shalwar Kameez Sets',
      'Festive Waistcoats',
      'Unstitched Latha & Fabric',
      'Trousers & Pajamas',
    ],
  },
  {
    name: 'KIDS',
    gender: 'kids',
    slug: 'kids',
    description: 'Festive ghararas, miniature kurtas, and traditional Eid & party ensembles for boys and girls.',
    imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      'Girls Gharara & Kurti Sets',
      'Boys Kurta Shalwar',
      'Festive Eid & Wedding Wear',
      'Casual Kurtis',
      'Baby Traditional',
    ],
  },
  {
    name: 'HOME APPAREL',
    gender: 'home',
    slug: 'home-apparel',
    description: 'Opulent bed linen, embroidered cushion covers, luxury table runners, and velvet throws.',
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      'Luxury Bed Sheet & Quilt Sets',
      'Embroidered Cushion Covers',
      'Table Runners & Placemats',
      'Velvet & Silk Throws',
      'Festive Drapes',
    ],
  },
  {
    name: 'BAGS',
    gender: 'accessories',
    slug: 'bags',
    description: 'Handcrafted luxury velvet clutches, embroidered potli pouches, and designer evening bags.',
    imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      'Luxury Velvet Clutches',
      'Embroidered Potli Pouches',
      'Festive Box Clutches',
      'Evening Minaudières',
      'Contemporary Crossbody Bags',
    ],
  },
];

export const AdminCategories: React.FC = () => {
  const { addToast, refreshCategories } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories'>('categories');

  // Modal State for Category CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Category Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [gender, setGender] = useState<string>('women');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcatInput, setNewSubcatInput] = useState('');

  // Inline subcategory input on category cards
  const [inlineSubcatInputs, setInlineSubcatInputs] = useState<Record<string, string>>({});
  const [editingSubcatState, setEditingSubcatState] = useState<{ catId: string; oldName: string; newName: string } | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setGender('women');
    setImageUrl('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800');
    setDescription('');
    setSortOrder(categories.length + 1);
    setIsActive(true);
    setSubcategories(['Unstitched Luxury', 'Ready-to-Wear', 'Festive Special']);
    setNewSubcatInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setGender(cat.gender || 'women');
    setImageUrl(cat.imageUrl || cat.image || '');
    setDescription(cat.description || '');
    setSortOrder(cat.sortOrder ?? 1);
    setIsActive(cat.isActive ?? true);
    setSubcategories(Array.isArray(cat.subcategories) ? [...cat.subcategories] : []);
    setNewSubcatInput('');
    setIsModalOpen(true);
  };

  const handleAddSubcategoryInModal = () => {
    const trimmed = newSubcatInput.trim();
    if (!trimmed) return;
    if (subcategories.includes(trimmed)) {
      addToast({ type: 'warning', title: 'Already Exists', message: `Subcategory "${trimmed}" is already in this list.` });
      return;
    }
    setSubcategories(prev => [...prev, trimmed]);
    setNewSubcatInput('');
  };

  const handleRemoveSubcategoryInModal = (indexToRemove: number) => {
    setSubcategories(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleApplyPreset = (preset: typeof PRESET_SUGGESTIONS[0]) => {
    setName(preset.name);
    setSlug(preset.slug);
    setGender(preset.gender);
    setImageUrl(preset.imageUrl);
    setDescription(preset.description);
    setSubcategories([...preset.subcategories]);
    addToast({
      type: 'info',
      title: 'Preset Applied',
      message: `Populated ${preset.name} template with ${preset.subcategories.length} subcategories.`,
    });
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = (slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const finalImg = imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800';

    try {
      const payload: Partial<Category> = {
        name: name.trim(),
        slug: finalSlug,
        gender,
        imageUrl: finalImg,
        image: finalImg,
        description: description.trim(),
        sortOrder: Number(sortOrder) || 1,
        isActive,
        subcategories: subcategories.filter(Boolean),
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, payload);
        addToast({
          type: 'success',
          title: 'Category Updated',
          message: `${name} and its subcategories were updated successfully.`,
        });
      } else {
        await api.createCategory(payload as any);
        addToast({
          type: 'success',
          title: 'Category Created',
          message: `${name} has been added to the catalog structure.`,
        });
      }

      setIsModalOpen(false);
      await loadCategories();
      await refreshCategories();
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not save category. Please check connection.',
      });
    }
  };

  const handleDeleteCategory = async (id: string, catName: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}" and all its subcategories?`)) return;
    try {
      await api.deleteCategory(id);
      addToast({
        type: 'info',
        title: 'Category Deleted',
        message: `Category "${catName}" removed.`,
      });
      await loadCategories();
      await refreshCategories();
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not delete category.',
      });
    }
  };

  // Quick inline subcategory addition on Category Card
  const handleInlineAddSubcat = async (category: Category) => {
    const currentInput = (inlineSubcatInputs[category.id] || '').trim();
    if (!currentInput) return;

    const existingSubs = Array.isArray(category.subcategories) ? category.subcategories : [];
    if (existingSubs.includes(currentInput)) {
      addToast({ type: 'warning', title: 'Duplicate', message: `Subcategory "${currentInput}" already exists.` });
      return;
    }

    const updatedSubs = [...existingSubs, currentInput];
    try {
      await api.updateCategory(category.id, { subcategories: updatedSubs });
      setInlineSubcatInputs(prev => ({ ...prev, [category.id]: '' }));
      addToast({
        type: 'success',
        title: 'Subcategory Added',
        message: `Added "${currentInput}" to ${category.name}.`,
      });
      await loadCategories();
      await refreshCategories();
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Failed to add subcategory.' });
    }
  };

  // Quick inline subcategory removal from Category Card
  const handleInlineRemoveSubcat = async (category: Category, subcatToRemove: string) => {
    if (!window.confirm(`Remove subcategory "${subcatToRemove}" from ${category.name}?`)) return;
    const existingSubs = Array.isArray(category.subcategories) ? category.subcategories : [];
    const updatedSubs = existingSubs.filter(s => s !== subcatToRemove);

    try {
      await api.updateCategory(category.id, { subcategories: updatedSubs });
      addToast({
        type: 'info',
        title: 'Subcategory Removed',
        message: `Removed "${subcatToRemove}" from ${category.name}.`,
      });
      await loadCategories();
      await refreshCategories();
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Failed to remove subcategory.' });
    }
  };

  // Quick inline subcategory rename
  const handleInlineSaveSubcatEdit = async () => {
    if (!editingSubcatState) return;
    const { catId, oldName, newName } = editingSubcatState;
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) {
      setEditingSubcatState(null);
      return;
    }

    const cat = categories.find(c => c.id === catId);
    if (!cat) return;

    const existingSubs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
    const updatedSubs = existingSubs.map(s => (s === oldName ? trimmed : s));

    try {
      await api.updateCategory(cat.id, { subcategories: updatedSubs });
      addToast({
        type: 'success',
        title: 'Subcategory Updated',
        message: `Renamed to "${trimmed}".`,
      });
      setEditingSubcatState(null);
      await loadCategories();
      await refreshCategories();
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Failed to update subcategory.' });
    }
  };

  // Quick toggle category active status
  const handleToggleActive = async (cat: Category) => {
    try {
      const nextActive = !(cat.isActive ?? true);
      await api.updateCategory(cat.id, { isActive: nextActive });
      addToast({
        type: 'success',
        title: nextActive ? 'Category Activated' : 'Category Hidden',
        message: `${cat.name} is now ${nextActive ? 'visible' : 'hidden'} on the storefront.`,
      });
      await loadCategories();
      await refreshCategories();
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Failed to toggle status.' });
    }
  };

  // Filtered categories
  const filteredCategories = categories.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const matchName = (c.name || '').toLowerCase().includes(q);
    const matchSlug = (c.slug || '').toLowerCase().includes(q);
    const matchSub = (c.subcategories || []).some(s => s.toLowerCase().includes(q));
    return matchName || matchSlug || matchSub;
  });

  const totalSubcategories = categories.reduce((acc, cat) => acc + (cat.subcategories?.length || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-1">
            <FolderTree className="w-4 h-4" />
            <span>CATALOG ARCHITECTURE &amp; TAXONOMY</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
            CATEGORIES &amp; SUBCATEGORIES
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1 max-w-2xl">
            Manage primary store categories (LADIES, GENTS, KIDS, HOME APPAREL, BAGS) and their respective subcategories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#a1a1aa] uppercase font-semibold">Total Categories</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{categories.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#ea580c] flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#a1a1aa] uppercase font-semibold">Active On Store</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-0.5">
              {categories.filter(c => c.isActive !== false).length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#a1a1aa] uppercase font-semibold">Total Subcategories</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-0.5">{totalSubcategories}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#a1a1aa] uppercase font-semibold">Average Sub/Cat</p>
            <h3 className="text-2xl font-bold text-blue-400 mt-0.5">
              {categories.length > 0 ? (totalSubcategories / categories.length).toFixed(1) : 0}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Search Controls */}
      <div className="bg-[#121214] border border-[#27272a] p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'categories'
                ? 'bg-[#ea580c] text-white shadow-md'
                : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categories Matrix ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subcategories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'subcategories'
                ? 'bg-[#ea580c] text-white shadow-md'
                : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Subcategory Directory ({totalSubcategories})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter category or subcategory..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#18181b] border border-[#27272a] text-white text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
          />
        </div>
      </div>

      {/* TAB 1: Categories Matrix */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16 text-[#a1a1aa]">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#ea580c] mb-2" />
              <p className="text-xs">Loading categories and taxonomy...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="bg-[#121214] border border-[#27272a] rounded-3xl p-12 text-center text-[#a1a1aa]">
              <FolderTree className="w-12 h-12 mx-auto text-[#71717a] mb-3" />
              <h3 className="font-cinzel text-lg font-bold text-white">No Categories Found</h3>
              <p className="text-xs mt-1">Try adjusting your search filter or click &ldquo;Add New Category&rdquo;.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCategories.map(cat => {
                const subList = Array.isArray(cat.subcategories) ? cat.subcategories : [];
                const img = cat.imageUrl || cat.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';

                return (
                  <div
                    key={cat.id}
                    className={`bg-[#121214] border rounded-3xl p-5 shadow-lg flex flex-col justify-between transition-all duration-300 ${
                      cat.isActive === false
                        ? 'border-red-900/40 opacity-75'
                        : 'border-[#27272a] hover:border-[#3f3f46]'
                    }`}
                  >
                    {/* Top Row: Circular Image Preview + Category Info */}
                    <div className="flex items-start gap-4">
                      {/* Signature Circular Image matching user screenshot */}
                      <div className="relative group shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#ea580c]/60 shadow-md bg-stone-900">
                          <img
                            src={img}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-[#18181b] border border-[#27272a] text-[10px] font-bold text-[#fed7aa] px-2 py-0.5 rounded-full shadow-xs">
                          #{cat.sortOrder ?? 1}
                        </span>
                      </div>

                      {/* Details & Actions */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide">
                                {cat.name}
                              </h3>
                              <span
                                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                  cat.isActive === false
                                    ? 'bg-red-950/60 border-red-800 text-red-300'
                                    : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                                }`}
                              >
                                {cat.isActive === false ? 'Hidden' : 'Active'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-[#a1a1aa] mt-0.5">
                              <span className="font-mono text-orange-400">/{cat.slug}</span>
                              <span>&bull;</span>
                              <span className="uppercase text-[#fed7aa] font-semibold">{cat.gender || 'unisex'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleActive(cat)}
                              title={cat.isActive === false ? 'Activate on Store' : 'Hide from Store'}
                              className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                                cat.isActive === false
                                  ? 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300'
                                  : 'bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa]'
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleOpenEdit(cat)}
                              title="Edit Category & Subcategories"
                              className="p-2 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-xl transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              title="Delete Category"
                              className="p-2 bg-red-950/60 hover:bg-red-900 text-red-400 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-[#a1a1aa] line-clamp-2 mt-2 leading-relaxed">
                          {cat.description || 'Curated luxury Pakistani fashion and home apparel collection.'}
                        </p>
                      </div>
                    </div>

                    {/* Subcategories Management Section inside Card */}
                    <div className="mt-5 pt-4 border-t border-[#27272a] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                          <Tag className="w-3.5 h-3.5 text-[#ea580c]" />
                          <span>Subcategories ({subList.length})</span>
                        </div>
                        <span className="text-[11px] text-[#71717a]">Click subcategory to edit</span>
                      </div>

                      {/* Subcategory Badges */}
                      <div className="flex flex-wrap gap-2">
                        {subList.map((sub, idx) => {
                          const isEditingThis =
                            editingSubcatState?.catId === cat.id && editingSubcatState.oldName === sub;

                          if (isEditingThis) {
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-1 bg-[#18181b] border border-[#ea580c] px-2 py-1 rounded-xl"
                              >
                                <input
                                  type="text"
                                  autoFocus
                                  value={editingSubcatState.newName}
                                  onChange={e =>
                                    setEditingSubcatState({
                                      ...editingSubcatState,
                                      newName: e.target.value,
                                    })
                                  }
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') handleInlineSaveSubcatEdit();
                                    if (e.key === 'Escape') setEditingSubcatState(null);
                                  }}
                                  className="bg-transparent text-white text-xs font-medium focus:outline-none w-28"
                                />
                                <button
                                  onClick={handleInlineSaveSubcatEdit}
                                  className="text-emerald-400 hover:text-emerald-300 p-0.5"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingSubcatState(null)}
                                  className="text-red-400 hover:text-red-300 p-0.5"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          }

                          return (
                            <span
                              key={idx}
                              className="group/badge inline-flex items-center gap-1.5 bg-[#18181b] hover:bg-[#27272a] text-[#e4e4e7] border border-[#27272a] hover:border-[#ea580c]/50 text-xs px-3 py-1.5 rounded-xl transition-all"
                            >
                              <span
                                onClick={() =>
                                  setEditingSubcatState({
                                    catId: cat.id,
                                    oldName: sub,
                                    newName: sub,
                                  })
                                }
                                className="cursor-pointer font-medium hover:text-[#ea580c]"
                                title="Click to rename"
                              >
                                {sub}
                              </span>
                              <button
                                onClick={() => handleInlineRemoveSubcat(cat, sub)}
                                className="text-[#71717a] hover:text-red-400 p-0.5 rounded transition-colors"
                                title={`Delete ${sub}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          );
                        })}

                        {subList.length === 0 && (
                          <span className="text-xs text-[#71717a] italic">No subcategories defined yet.</span>
                        )}
                      </div>

                      {/* Fast Inline Add Subcategory */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Type new subcategory name..."
                          value={inlineSubcatInputs[cat.id] || ''}
                          onChange={e =>
                            setInlineSubcatInputs({
                              ...inlineSubcatInputs,
                              [cat.id]: e.target.value,
                            })
                          }
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleInlineAddSubcat(cat);
                            }
                          }}
                          className="flex-1 bg-[#18181b] border border-[#27272a] text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
                        />
                        <button
                          onClick={() => handleInlineAddSubcat(cat)}
                          className="bg-[#27272a] hover:bg-[#ea580c] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shrink-0 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Subcategory Directory Table */}
      {activeTab === 'subcategories' && (
        <div className="bg-[#121214] border border-[#27272a] rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#18181b]/50">
            <div>
              <h3 className="font-cinzel text-base font-bold text-white">All Subcategories Taxonomy</h3>
              <p className="text-xs text-[#a1a1aa]">
                Complete hierarchy listing all subcategories mapped to parent departments.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#18181b] text-[#a1a1aa] uppercase font-bold border-b border-[#27272a]">
                <tr>
                  <th className="p-4">Parent Category</th>
                  <th className="p-4">Subcategory Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Direct Shop Link</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]">
                {categories.flatMap(cat =>
                  (cat.subcategories || []).map((sub, sIdx) => (
                    <tr key={`${cat.id}-${sIdx}`} className="hover:bg-[#18181b]/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={cat.imageUrl || cat.image}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-[#27272a]"
                          />
                          <span className="font-bold text-white">{cat.name}</span>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-[#fed7aa]">{sub}</td>

                      <td className="p-4">
                        <span className="bg-[#27272a] text-[#e4e4e7] px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                          {cat.gender || 'Unisex'}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-[#71717a] text-[11px]">
                        /shop?category={cat.slug}&amp;subcategory={encodeURIComponent(sub)}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              const newName = window.prompt(`Rename subcategory "${sub}" in ${cat.name}:`, sub);
                              if (newName && newName.trim() && newName.trim() !== sub) {
                                setEditingSubcatState({ catId: cat.id, oldName: sub, newName: newName.trim() });
                                setTimeout(() => handleInlineSaveSubcatEdit(), 50);
                              }
                            }}
                            className="p-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg"
                            title="Rename Subcategory"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleInlineRemoveSubcat(cat, sub)}
                            className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 rounded-lg"
                            title="Delete Subcategory"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Create & Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#121214] border border-[#27272a] rounded-3xl p-6 max-w-2xl w-full shadow-2xl z-10 text-xs text-stone-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#27272a] mb-5">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-white">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
                </h3>
                <p className="text-xs text-[#a1a1aa] mt-0.5">
                  Configure title, department, circular cover image, and subcategory taxonomy.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#a1a1aa] hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Preset Picker for Pakistani Fashion */}
            {!editingCategory && (
              <div className="mb-5 p-3.5 bg-[#18181b] border border-[#27272a] rounded-2xl">
                <p className="text-[11px] font-bold text-[#fed7aa] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span>Quick Presets (Match Attached Reference)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_SUGGESTIONS.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="bg-[#27272a] hover:bg-[#ea580c] text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-white mb-1">Category Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LADIES, GENTS, KIDS, HOME APPAREL, BAGS"
                    value={name}
                    onChange={e => {
                      setName(e.target.value);
                      if (!editingCategory) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ladies, gents, kids, home-apparel, bags"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-white mb-1">Department / Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  >
                    <option value="women">Ladies / Women</option>
                    <option value="men">Gents / Men</option>
                    <option value="kids">Kids &amp; Children</option>
                    <option value="home">Home Apparel &amp; Living</option>
                    <option value="accessories">Bags &amp; Accessories</option>
                    <option value="both">Unisex / Both</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    min="1"
                    value={sortOrder}
                    onChange={e => setSortOrder(Number(e.target.value))}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white mb-1">Store Visibility</label>
                  <select
                    value={isActive ? 'true' : 'false'}
                    onChange={e => setIsActive(e.target.value === 'true')}
                    className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-white mb-1">Circular Cover Image URL *</label>
                <div className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#ea580c] shrink-0 bg-stone-900">
                    <img
                      src={imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    className="flex-1 bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-white mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Provide a concise, elegant description for marketing and SEO..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              {/* Subcategories Management in Modal */}
              <div className="p-4 bg-[#18181b] border border-[#27272a] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-white flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#ea580c]" />
                    <span>Subcategories ({subcategories.length})</span>
                  </label>
                  <span className="text-[11px] text-[#a1a1aa]">Type subcategory and click Add</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add subcategory (e.g. Unstitched Lawn, 3-Piece, Clutches)..."
                    value={newSubcatInput}
                    onChange={e => setNewSubcatInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubcategoryInModal();
                      }
                    }}
                    className="flex-1 bg-[#121214] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategoryInModal}
                    className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
                  {subcategories.map((sub, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-[#27272a] text-white px-3 py-1.5 rounded-xl text-xs"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubcategoryInModal(idx)}
                        className="text-[#a1a1aa] hover:text-red-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {subcategories.length === 0 && (
                    <p className="text-xs text-[#71717a] italic">No subcategories added yet.</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#27272a] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-5 py-2.5 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-lg"
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
