import React, { useState } from 'react';
import {
  Menu,
  Plus,
  Trash2,
  Edit2,
  MoveUp,
  MoveDown,
  Save,
  RotateCcw,
  Check,
  X,
  ExternalLink,
  Flame,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  Package,
  Scissors,
  Tag,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { NavItem } from '../../types';

export const AdminNavigation: React.FC = () => {
  const { navItems, refreshNavItems, addToast } = useStore();

  const [items, setItems] = useState<NavItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<NavItem>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when context loads
  React.useEffect(() => {
    if (navItems && navItems.length > 0) {
      setItems(navItems);
    }
  }, [navItems]);

  const handleAddNew = () => {
    const newItem: NavItem = {
      id: 'nav-' + Date.now(),
      label: 'New Link',
      view: 'shop',
      sortOrder: items.length + 1,
      isActive: true,
      badge: '',
      isSale: false,
      isDropdown: false,
    };
    setItems([...items, newItem]);
    setEditingId(newItem.id);
    setEditForm(newItem);
  };

  const handleEdit = (item: NavItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = (id: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? ({ ...item, ...editForm } as NavItem) : item))
    );
    setEditingId(null);
    setEditForm({});
    addToast({
      type: 'info',
      title: 'Item Updated',
      message: 'Changes staged. Click "Save Navbar Changes" to persist.',
    });
  };

  const handleDelete = (id: string) => {
    if (items.length <= 1) {
      addToast({
        type: 'error',
        title: 'Cannot Delete All',
        message: 'You must maintain at least one navigation item.',
      });
      return;
    }
    setItems(prev => prev.filter(item => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
    addToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Navigation link removed. Click "Save Navbar Changes" to persist.',
    });
  };

  const handleToggleActive = (id: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // reassign order indices
    const reordered = updated.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    setItems(reordered);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // Re-assign order cleanly
      const payload = items.map((it, idx) => ({ ...it, sortOrder: idx + 1 }));
      await api.saveNavItems(payload);
      await refreshNavItems();
      addToast({
        type: 'success',
        title: 'Navbar Saved',
        message: 'Storefront navigation bar updated in real-time.',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save navigation structure.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    const defaultNav: NavItem[] = [
      { id: 'nav-1', label: 'Home', view: 'home', sortOrder: 1, isActive: true },
      { id: 'nav-2', label: 'All Collections', view: 'shop', sortOrder: 2, isDropdown: true, isActive: true },
      { id: 'nav-3', label: 'Stitched Pret', view: 'shop', params: { category: 'stitched' }, sortOrder: 3, isActive: true },
      { id: 'nav-4', label: 'Unstitched Luxury', view: 'shop', params: { category: 'unstitched' }, sortOrder: 4, isActive: true },
      { id: 'nav-5', label: 'Festive Velvet & Silk', view: 'shop', params: { tag: 'Festive' }, sortOrder: 5, badge: 'Hot', isActive: true },
      { id: 'nav-6', label: 'Karachi Menswear', view: 'shop', params: { category: 'men' }, sortOrder: 6, isActive: true },
      { id: 'nav-7', label: 'Bespoke Stitching', view: 'stitching', sortOrder: 7, isActive: true },
      { id: 'nav-8', label: 'Track Order', view: 'account', params: { tab: 'orders' }, sortOrder: 8, isActive: true },
      { id: 'nav-9', label: 'Sale & Clearance', view: 'shop', params: { isSale: true }, sortOrder: 9, isSale: true, badge: '50% OFF', isActive: true },
    ];
    setItems(defaultNav);
    setEditingId(null);
    addToast({
      type: 'info',
      title: 'Default Menu Restored',
      message: 'Preset links loaded. Click "Save Navbar Changes" to apply.',
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white flex items-center gap-2.5">
            <Menu className="w-6 h-6 text-[#ea580c]" />
            <span>NAVBAR MENU MANAGEMENT (CRUD)</span>
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Create, edit, reorder, and configure navigation links, drop-down triggers, badges, and routing targets for the storefront navbar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-xs font-semibold text-[#d4d4d8] rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-xs font-bold text-white rounded-xl transition-colors border border-[#3f3f46]"
          >
            <Plus className="w-4 h-4 text-[#ea580c]" />
            <span>Add Link</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Navbar'}</span>
          </button>
        </div>
      </div>

      {/* Live Navbar Simulation Banner */}
      <div className="bg-[#121214] p-5 rounded-3xl border border-[#27272a] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717a] flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Live Header Simulation</span>
          </span>
          <span className="text-[10px] text-[#a1a1aa]">
            {items.filter(i => i.isActive).length} Active Links Visible
          </span>
        </div>

        <div className="bg-[#18181b] p-3 rounded-2xl border border-[#27272a] overflow-x-auto no-scrollbar scrollbar-none flex items-center gap-2">
          {items
            .filter(i => i.isActive)
            .map(item => (
              <div
                key={item.id}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap ${
                  item.isSale
                    ? 'text-[#ea580c] bg-orange-950/40 border border-orange-800/60 font-bold'
                    : 'text-[#d4d4d8] bg-[#27272a]'
                }`}
              >
                {item.isSale && <Flame className="w-3 h-3 text-[#ea580c]" />}
                {item.isDropdown && <Layers className="w-3 h-3 text-[#ea580c]" />}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-[#ea580c] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ml-0.5">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Navigation Items List & CRUD Table */}
      <div className="bg-[#121214] p-6 rounded-3xl border border-[#27272a] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
          <h3 className="font-cinzel text-sm font-bold text-white flex items-center gap-2">
            <Menu className="w-4 h-4 text-[#ea580c]" />
            <span>Configured Navigation Items ({items.length})</span>
          </h3>
          <span className="text-[11px] text-[#a1a1aa]">
            Use arrows to reorder items.
          </span>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const isEditing = editingId === item.id;

            if (isEditing) {
              return (
                <div
                  key={item.id}
                  className="bg-[#18181b] p-5 rounded-2xl border-2 border-[#ea580c]/60 shadow-lg space-y-4 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Edit2 className="w-3.5 h-3.5 text-[#ea580c]" />
                      <span>Edit Link: &quot;{item.label}&quot;</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="p-1.5 text-[#a1a1aa] hover:text-white hover:bg-[#27272a] rounded-lg text-xs flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(item.id)}
                        className="px-3 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-lg flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    {/* Link Label */}
                    <div>
                      <label className="block font-semibold text-white mb-1">
                        Link Label <span className="text-[#ea580c]">*</span>
                      </label>
                      <input
                        type="text"
                        value={editForm.label || ''}
                        onChange={e => setEditForm({ ...editForm, label: e.target.value })}
                        placeholder="e.g. Lawn 2026"
                        className="w-full bg-[#121214] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>

                    {/* Target View */}
                    <div>
                      <label className="block font-semibold text-white mb-1">
                        Target Page / View
                      </label>
                      <select
                        value={editForm.view || 'shop'}
                        onChange={e => setEditForm({ ...editForm, view: e.target.value })}
                        className="w-full bg-[#121214] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                      >
                        <option value="home">Home Page</option>
                        <option value="shop">Shop Catalog</option>
                        <option value="stitching">Bespoke Stitching</option>
                        <option value="account">My Account / Orders</option>
                        <option value="cms">CMS Page</option>
                        <option value="cart">Shopping Cart</option>
                      </select>
                    </div>

                    {/* Badge Text */}
                    <div>
                      <label className="block font-semibold text-white mb-1">
                        Badge Text (Optional)
                      </label>
                      <input
                        type="text"
                        value={editForm.badge || ''}
                        onChange={e => setEditForm({ ...editForm, badge: e.target.value })}
                        placeholder="e.g. HOT, NEW, 50% OFF"
                        className="w-full bg-[#121214] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>

                    {/* External or Custom URL */}
                    <div>
                      <label className="block font-semibold text-white mb-1">
                        External URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={editForm.url || ''}
                        onChange={e => setEditForm({ ...editForm, url: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-[#121214] border border-[#27272a] text-white p-2.5 rounded-xl focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>
                  </div>

                  {/* Filter parameters when view is shop */}
                  {editForm.view === 'shop' && (
                    <div className="bg-[#121214] p-3 rounded-xl border border-[#27272a] space-y-2">
                      <span className="text-[11px] font-bold text-white block">
                        Catalog Filter Parameters (Pre-apply to Shop):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] text-[#a1a1aa] block mb-1">Category Filter</label>
                          <select
                            value={editForm.params?.category || ''}
                            onChange={e =>
                              setEditForm({
                                ...editForm,
                                params: { ...editForm.params, category: e.target.value || undefined },
                              })
                            }
                            className="w-full bg-[#18181b] border border-[#27272a] text-white text-xs p-2 rounded-lg"
                          >
                            <option value="">None (All Categories)</option>
                            <option value="stitched">Stitched Collection</option>
                            <option value="unstitched">Unstitched Fabrics</option>
                            <option value="men">Karachi Menswear</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-[#a1a1aa] block mb-1">Tag Filter</label>
                          <input
                            type="text"
                            value={editForm.params?.tag || ''}
                            onChange={e =>
                              setEditForm({
                                ...editForm,
                                params: { ...editForm.params, tag: e.target.value || undefined },
                              })
                            }
                            placeholder="e.g. Festive, Lawn, Velvet"
                            className="w-full bg-[#18181b] border border-[#27272a] text-white text-xs p-2 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-[#a1a1aa] block mb-1">Status Filter</label>
                          <select
                            value={
                              editForm.params?.isSale
                                ? 'sale'
                                : editForm.params?.isNew
                                ? 'new'
                                : editForm.params?.isBestSeller
                                ? 'bestseller'
                                : ''
                            }
                            onChange={e => {
                              const val = e.target.value;
                              setEditForm({
                                ...editForm,
                                params: {
                                  ...editForm.params,
                                  isSale: val === 'sale' ? true : undefined,
                                  isNew: val === 'new' ? true : undefined,
                                  isBestSeller: val === 'bestseller' ? true : undefined,
                                },
                              });
                            }}
                            className="w-full bg-[#18181b] border border-[#27272a] text-white text-xs p-2 rounded-lg"
                          >
                            <option value="">None</option>
                            <option value="sale">Flash Sale (Discounted)</option>
                            <option value="new">New Arrivals</option>
                            <option value="bestseller">Best Sellers</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Toggles */}
                  <div className="flex flex-wrap items-center gap-6 pt-1 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-white">
                      <input
                        type="checkbox"
                        checked={editForm.isSale || false}
                        onChange={e => setEditForm({ ...editForm, isSale: e.target.checked })}
                        className="rounded border-[#27272a] text-[#ea580c] focus:ring-[#ea580c]"
                      />
                      <span className="flex items-center gap-1 font-medium">
                        <Flame className="w-3.5 h-3.5 text-[#ea580c]" />
                        <span>Highlight as Flame/Sale Style</span>
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-white">
                      <input
                        type="checkbox"
                        checked={editForm.isDropdown || false}
                        onChange={e => setEditForm({ ...editForm, isDropdown: e.target.checked })}
                        className="rounded border-[#27272a] text-[#ea580c] focus:ring-[#ea580c]"
                      />
                      <span className="flex items-center gap-1 font-medium">
                        <Layers className="w-3.5 h-3.5 text-[#ea580c]" />
                        <span>Trigger Categories Mega Dropdown</span>
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-white">
                      <input
                        type="checkbox"
                        checked={editForm.openInNewTab || false}
                        onChange={e => setEditForm({ ...editForm, openInNewTab: e.target.checked })}
                        className="rounded border-[#27272a] text-[#ea580c] focus:ring-[#ea580c]"
                      />
                      <span>Open in New Tab</span>
                    </label>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className={`bg-[#18181b] p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.isActive ? 'border-[#27272a]' : 'border-[#27272a]/40 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Order indicator */}
                  <span className="w-6 h-6 rounded-full bg-[#27272a] flex items-center justify-center text-[10px] font-bold text-[#a1a1aa] shrink-0">
                    {index + 1}
                  </span>

                  {/* Label and attributes */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{item.label}</span>
                      {item.badge && (
                        <span className="bg-[#ea580c] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {item.badge}
                        </span>
                      )}
                      {item.isSale && (
                        <span className="bg-orange-950/60 text-[#ea580c] border border-orange-800/40 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                          <Flame className="w-3 h-3" /> Sale Highlight
                        </span>
                      )}
                      {item.isDropdown && (
                        <span className="bg-[#27272a] text-zinc-300 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                          <Layers className="w-3 h-3 text-[#ea580c]" /> Dropdown
                        </span>
                      )}
                      {!item.isActive && (
                        <span className="bg-zinc-800 text-zinc-400 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                          Hidden
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-[#71717a] flex items-center gap-2 flex-wrap">
                      <span>Target: <strong className="text-[#a1a1aa]">{item.view || 'shop'}</strong></span>
                      {item.params && Object.keys(item.params).length > 0 && (
                        <span>&bull; Params: <strong className="text-[#a1a1aa]">{JSON.stringify(item.params)}</strong></span>
                      )}
                      {item.url && (
                        <span className="flex items-center gap-1 text-zinc-400">
                          &bull; URL: {item.url} <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions & Reordering */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  {/* Reorder Buttons */}
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    title="Move Up"
                    className="p-2 bg-[#27272a] hover:bg-[#3f3f46] text-[#d4d4d8] rounded-xl transition-colors disabled:opacity-30"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === items.length - 1}
                    title="Move Down"
                    className="p-2 bg-[#27272a] hover:bg-[#3f3f46] text-[#d4d4d8] rounded-xl transition-colors disabled:opacity-30"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item.id)}
                    title={item.isActive ? 'Hide from navbar' : 'Show in navbar'}
                    className={`p-2 rounded-xl transition-colors ${
                      item.isActive
                        ? 'bg-[#27272a] text-emerald-400 hover:bg-[#3f3f46]'
                        : 'bg-[#27272a] text-zinc-500 hover:bg-[#3f3f46]'
                    }`}
                  >
                    {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    title="Edit Item"
                    className="p-2 bg-[#27272a] hover:bg-[#3f3f46] text-[#d4d4d8] rounded-xl transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    title="Delete Link"
                    className="p-2 bg-[#27272a] hover:bg-rose-950/60 text-rose-400 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[#27272a]">
          <button
            type="button"
            onClick={handleAddNew}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#ea580c] hover:text-[#fed7aa] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Nav Link</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save All Navbar Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
