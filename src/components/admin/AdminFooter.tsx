import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Check,
  X,
  ShieldCheck,
  Truck,
  RotateCw,
  Sparkles,
  Tag,
  Phone,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  MoveUp,
  MoveDown,
  Building,
  Mail,
  Share2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { FooterConfig, FooterSection, FooterLink, FooterTrustBadge } from '../../types';

export const AdminFooter: React.FC = () => {
  const { footerConfig, refreshFooterConfig, addToast } = useStore();

  const [config, setConfig] = useState<FooterConfig>({
    aboutText: "Karachi's premier fashion atelier offering bespoke stitched kurtis, pure Pima lawn, festive velvet ensembles, and contemporary Pakistani menswear.",
    copyrightText: `© ${new Date().getFullYear()} STITCH & UNSTITCHED. All Rights Reserved. Crafted for Karachi & Pakistan.`,
    showNewsletter: true,
    newsletterTitle: 'Join Our Newsletter',
    newsletterSubtitle: 'Get the latest seasonal lawn drops, Eid collections, and exclusive discounts.',
    showTrustBadges: true,
    showSocialLinks: true,
    trustBadges: [],
    sections: [],
    bottomLinks: [],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'badges' | 'general' | 'bottom'>('sections');
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);

  // Edit state for section
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionForm, setSectionForm] = useState<Partial<FooterSection>>({});

  // Edit state for link
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [linkForm, setLinkForm] = useState<Partial<FooterLink>>({});
  const [currentSectionForLink, setCurrentSectionForLink] = useState<string | null>(null);

  // Edit state for trust badge
  const [editingBadgeId, setEditingBadgeId] = useState<string | null>(null);
  const [badgeForm, setBadgeForm] = useState<Partial<FooterTrustBadge>>({});

  // Sync state from context
  useEffect(() => {
    if (footerConfig) {
      setConfig(footerConfig);
      if (footerConfig.sections && footerConfig.sections.length > 0 && !expandedSectionId) {
        setExpandedSectionId(footerConfig.sections[0].id);
      }
    }
  }, [footerConfig]);

  // =========================================================================
  // TRUST BADGES HANDLERS
  // =========================================================================
  const handleAddBadge = () => {
    const newBadge: FooterTrustBadge = {
      id: 'tb-' + Date.now(),
      title: 'New Guarantee',
      subtitle: 'Karachi Doorstep Service',
      icon: 'sparkles',
      sortOrder: (config.trustBadges || []).length + 1,
      isActive: true,
    };
    setConfig(prev => ({
      ...prev,
      trustBadges: [...(prev.trustBadges || []), newBadge],
    }));
    setEditingBadgeId(newBadge.id);
    setBadgeForm(newBadge);
  };

  const handleSaveBadge = (id: string) => {
    setConfig(prev => ({
      ...prev,
      trustBadges: (prev.trustBadges || []).map(b => (b.id === id ? ({ ...b, ...badgeForm } as FooterTrustBadge) : b)),
    }));
    setEditingBadgeId(null);
    setBadgeForm({});
  };

  const handleDeleteBadge = (id: string) => {
    setConfig(prev => ({
      ...prev,
      trustBadges: (prev.trustBadges || []).filter(b => b.id !== id),
    }));
    if (editingBadgeId === id) setEditingBadgeId(null);
  };

  // =========================================================================
  // SECTIONS & COLUMNS HANDLERS
  // =========================================================================
  const handleAddSection = () => {
    const newSec: FooterSection = {
      id: 'sec-' + Date.now(),
      title: 'New Column',
      sortOrder: (config.sections || []).length + 1,
      isActive: true,
      links: [],
    };
    setConfig(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSec],
    }));
    setExpandedSectionId(newSec.id);
    setEditingSectionId(newSec.id);
    setSectionForm(newSec);
  };

  const handleSaveSection = (id: string) => {
    setConfig(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s => (s.id === id ? ({ ...s, ...sectionForm } as FooterSection) : s)),
    }));
    setEditingSectionId(null);
    setSectionForm({});
  };

  const handleDeleteSection = (id: string) => {
    setConfig(prev => ({
      ...prev,
      sections: (prev.sections || []).filter(s => s.id !== id),
    }));
    if (expandedSectionId === id) setExpandedSectionId(null);
    if (editingSectionId === id) setEditingSectionId(null);
  };

  // =========================================================================
  // SECTION LINKS HANDLERS
  // =========================================================================
  const handleAddLink = (sectionId: string) => {
    const newLink: FooterLink = {
      id: 'fl-' + Date.now(),
      label: 'New Link',
      view: 'shop',
      isActive: true,
    };
    setConfig(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s => {
        if (s.id === sectionId) {
          return { ...s, links: [...(s.links || []), newLink] };
        }
        return s;
      }),
    }));
    setCurrentSectionForLink(sectionId);
    setEditingLinkId(newLink.id);
    setLinkForm(newLink);
  };

  const handleSaveLink = (sectionId: string, linkId: string) => {
    setConfig(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s => {
        if (s.id === sectionId) {
          return {
            ...s,
            links: (s.links || []).map(l => (l.id === linkId ? ({ ...l, ...linkForm } as FooterLink) : l)),
          };
        }
        return s;
      }),
    }));
    setEditingLinkId(null);
    setLinkForm({});
    setCurrentSectionForLink(null);
  };

  const handleDeleteLink = (sectionId: string, linkId: string) => {
    setConfig(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s => {
        if (s.id === sectionId) {
          return {
            ...s,
            links: (s.links || []).filter(l => l.id !== linkId),
          };
        }
        return s;
      }),
    }));
    if (editingLinkId === linkId) setEditingLinkId(null);
  };

  // =========================================================================
  // BOTTOM LINKS HANDLERS
  // =========================================================================
  const handleAddBottomLink = () => {
    const newBl: FooterLink = {
      id: 'bl-' + Date.now(),
      label: 'Custom Policy',
      view: 'cms',
      isActive: true,
    };
    setConfig(prev => ({
      ...prev,
      bottomLinks: [...(prev.bottomLinks || []), newBl],
    }));
  };

  const handleDeleteBottomLink = (id: string) => {
    setConfig(prev => ({
      ...prev,
      bottomLinks: (prev.bottomLinks || []).filter(bl => bl.id !== id),
    }));
  };

  const handleUpdateBottomLink = (id: string, updates: Partial<FooterLink>) => {
    setConfig(prev => ({
      ...prev,
      bottomLinks: (prev.bottomLinks || []).map(bl => (bl.id === id ? { ...bl, ...updates } : bl)),
    }));
  };

  // =========================================================================
  // SAVE & PRESET RESTORE
  // =========================================================================
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await api.saveFooterConfig(config);
      await refreshFooterConfig();
      addToast({
        type: 'success',
        title: 'Footer Config Saved',
        message: 'Footer columns, trust badges, about narrative, and bottom links updated.',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save footer configuration.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    const defaultFooter: FooterConfig = {
      aboutText: "Karachi's premier fashion atelier offering bespoke stitched kurtis, pure Pima lawn, festive velvet ensembles, and contemporary Pakistani menswear.",
      copyrightText: `© 2026 STITCH & UNSTITCHED. All Rights Reserved. Crafted for Karachi & Pakistan.`,
      showNewsletter: true,
      newsletterTitle: 'Join Our Newsletter',
      newsletterSubtitle: 'Get the latest seasonal lawn drops, Eid collections, and exclusive discounts.',
      showTrustBadges: true,
      showSocialLinks: true,
      trustBadges: [
        { id: 'tb-1', title: 'Karachi Express', subtitle: 'Priority 24–48h Dispatch', icon: 'truck', sortOrder: 1, isActive: true },
        { id: 'tb-2', title: '100% Authentic Fabric', subtitle: 'Pure Pima Lawn & Silk', icon: 'shield', sortOrder: 2, isActive: true },
        { id: 'tb-3', title: 'Custom Stitching', subtitle: 'Karachi Master Tailors', icon: 'sparkles', sortOrder: 3, isActive: true },
        { id: 'tb-4', title: '7-Day Easy Exchange', subtitle: 'Hassle-free doorstep service', icon: 'rotate', sortOrder: 4, isActive: true },
      ],
      sections: [
        {
          id: 'sec-shop',
          title: 'Shop',
          sortOrder: 1,
          isActive: true,
          links: [
            { id: 'l-1', label: 'Stitched Collection', view: 'shop', params: { category: 'stitched' }, isActive: true },
            { id: 'l-2', label: 'Unstitched Fabrics', view: 'shop', params: { category: 'unstitched' }, isActive: true },
            { id: 'l-3', label: 'New Arrivals', view: 'shop', params: { isNew: true }, isActive: true },
            { id: 'l-4', label: 'Best Sellers', view: 'shop', params: { isBestSeller: true }, isActive: true },
            { id: 'l-5', label: 'Flash Sale & Offers', view: 'shop', params: { isSale: true }, highlight: true, isActive: true },
          ],
        },
        {
          id: 'sec-care',
          title: 'Customer Care',
          sortOrder: 2,
          isActive: true,
          links: [
            { id: 'l-6', label: 'Contact Concierge', view: 'cms', params: { slug: 'contact-us' }, isActive: true },
            { id: 'l-7', label: 'Shipping & Karachi Dispatch', view: 'cms', params: { slug: 'shipping-policy' }, isActive: true },
            { id: 'l-8', label: 'Returns & Exchange', view: 'cms', params: { slug: 'return-policy' }, isActive: true },
            { id: 'l-9', label: 'Track Order', view: 'account', params: { tab: 'orders' }, isActive: true },
            { id: 'l-10', label: 'My Account', view: 'account', isActive: true },
          ],
        },
      ],
      bottomLinks: [
        { id: 'bl-1', label: 'Privacy Policy', view: 'cms', params: { slug: 'privacy-policy' }, isActive: true },
        { id: 'bl-2', label: 'Terms & Conditions', view: 'cms', params: { slug: 'terms-and-conditions' }, isActive: true },
      ],
    };
    setConfig(defaultFooter);
    addToast({
      type: 'info',
      title: 'Footer Defaults Restored',
      message: 'Atelier footer presets loaded. Click "Save Footer Changes" to apply.',
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[#ea580c]" />
            <span>FOOTER &amp; TRUST BADGES (CRUD)</span>
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Manage footer link columns, trust guarantee badges, brand story narrative, newsletter text, and bottom legal links.
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
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Footer'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#27272a] pb-3 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'sections'
              ? 'bg-[#ea580c] text-white shadow-md'
              : 'bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a]'
          }`}
        >
          Footer Columns &amp; Links ({config.sections?.length || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'badges'
              ? 'bg-[#ea580c] text-white shadow-md'
              : 'bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a]'
          }`}
        >
          Trust Badges Strip ({config.trustBadges?.length || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'general'
              ? 'bg-[#ea580c] text-white shadow-md'
              : 'bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a]'
          }`}
        >
          About Narrative &amp; Newsletter
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bottom')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'bottom'
              ? 'bg-[#ea580c] text-white shadow-md'
              : 'bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a]'
          }`}
        >
          Bottom Bar &amp; Copyright
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FOOTER SECTIONS & LINKS CRUD                                       */}
      {/* ========================================================================= */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-cinzel text-sm font-bold text-white">Footer Link Columns</h3>
              <p className="text-[11px] text-[#a1a1aa]">
                Each section renders as a vertical column of links in the customer footer.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddSection}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-xs font-bold text-white rounded-xl transition-colors border border-[#3f3f46]"
            >
              <Plus className="w-4 h-4 text-[#ea580c]" />
              <span>Add Column</span>
            </button>
          </div>

          <div className="space-y-4">
            {(config.sections || []).map(section => {
              const isExpanded = expandedSectionId === section.id;
              const isEditingSection = editingSectionId === section.id;

              return (
                <div
                  key={section.id}
                  className="bg-[#121214] rounded-3xl border border-[#27272a] overflow-hidden shadow-xs"
                >
                  {/* Column Header */}
                  <div className="p-4 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between gap-4">
                    {isEditingSection ? (
                      <div className="flex items-center gap-2 flex-1 max-w-md">
                        <input
                          type="text"
                          value={sectionForm.title || ''}
                          onChange={e => setSectionForm({ ...sectionForm, title: e.target.value })}
                          className="w-full bg-[#121214] border border-[#ea580c] text-white text-xs p-2 rounded-xl"
                          placeholder="Column Title"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveSection(section.id)}
                          className="p-2 bg-[#ea580c] text-white rounded-xl"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSectionId(null)}
                          className="p-2 bg-[#27272a] text-[#a1a1aa] rounded-xl"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setExpandedSectionId(isExpanded ? null : section.id)}
                        className="flex items-center gap-2.5 text-left flex-1"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[#ea580c]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#a1a1aa]" />
                        )}
                        <span className="font-bold text-white text-sm">{section.title}</span>
                        <span className="text-[10px] text-[#71717a] bg-[#27272a] px-2 py-0.5 rounded-full">
                          {(section.links || []).length} Links
                        </span>
                      </button>
                    )}

                    <div className="flex items-center gap-1.5">
                      {!isEditingSection && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSectionId(section.id);
                            setSectionForm(section);
                          }}
                          className="p-2 bg-[#27272a] hover:bg-[#3f3f46] text-[#d4d4d8] rounded-xl transition-colors"
                          title="Rename Column"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-2 bg-[#27272a] hover:bg-rose-950/60 text-rose-400 rounded-xl transition-colors"
                        title="Delete Column"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Column Links List (Accordion Body) */}
                  {isExpanded && (
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
                        <span className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider">
                          Links inside &quot;{section.title}&quot;
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddLink(section.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-[#ea580c] hover:text-[#fed7aa]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Link to Column</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(section.links || []).map(link => {
                          const isEditingLink = editingLinkId === link.id && currentSectionForLink === section.id;

                          if (isEditingLink) {
                            return (
                              <div
                                key={link.id}
                                className="bg-[#18181b] p-4 rounded-2xl border-2 border-[#ea580c]/60 space-y-3"
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                  <div>
                                    <label className="block text-[10px] text-[#a1a1aa] mb-1">Link Title</label>
                                    <input
                                      type="text"
                                      value={linkForm.label || ''}
                                      onChange={e => setLinkForm({ ...linkForm, label: e.target.value })}
                                      className="w-full bg-[#121214] border border-[#27272a] text-white p-2 rounded-xl"
                                      placeholder="e.g. Lawn Ensembles"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10px] text-[#a1a1aa] mb-1">Target Page</label>
                                    <select
                                      value={linkForm.view || 'shop'}
                                      onChange={e => setLinkForm({ ...linkForm, view: e.target.value })}
                                      className="w-full bg-[#121214] border border-[#27272a] text-white p-2 rounded-xl"
                                    >
                                      <option value="shop">Shop Catalog</option>
                                      <option value="home">Home</option>
                                      <option value="stitching">Stitching</option>
                                      <option value="account">Account / Orders</option>
                                      <option value="cms">CMS Page</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] text-[#a1a1aa] mb-1">External URL</label>
                                    <input
                                      type="text"
                                      value={linkForm.url || ''}
                                      onChange={e => setLinkForm({ ...linkForm, url: e.target.value })}
                                      className="w-full bg-[#121214] border border-[#27272a] text-white p-2 rounded-xl"
                                      placeholder="https://..."
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={linkForm.highlight || false}
                                      onChange={e => setLinkForm({ ...linkForm, highlight: e.target.checked })}
                                      className="rounded border-[#27272a] text-[#ea580c]"
                                    />
                                    <span>Highlight in Orange (Sale/Special)</span>
                                  </label>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setEditingLinkId(null)}
                                      className="px-3 py-1.5 bg-[#27272a] text-[#a1a1aa] text-xs font-semibold rounded-lg"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveLink(section.id, link.id)}
                                      className="px-3 py-1.5 bg-[#ea580c] text-white text-xs font-bold rounded-lg"
                                    >
                                      Save Link
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={link.id}
                              className="bg-[#18181b] p-3 rounded-xl border border-[#27272a] flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold ${link.highlight ? 'text-orange-400' : 'text-white'}`}>
                                  {link.label}
                                </span>
                                {link.view && (
                                  <span className="text-[10px] text-[#71717a] bg-[#27272a] px-1.5 py-0.5 rounded">
                                    {link.view}
                                  </span>
                                )}
                                {link.url && (
                                  <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                                    <ExternalLink className="w-2.5 h-2.5" /> URL
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCurrentSectionForLink(section.id);
                                    setEditingLinkId(link.id);
                                    setLinkForm(link);
                                  }}
                                  className="p-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-[#d4d4d8] rounded-lg"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLink(section.id, link.id)}
                                  className="p-1.5 bg-[#27272a] hover:bg-rose-950/60 text-rose-400 rounded-lg"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TRUST BADGES STRIP CRUD                                            */}
      {/* ========================================================================= */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-cinzel text-sm font-bold text-white">Trust Guarantee Badges</h3>
              <p className="text-[11px] text-[#a1a1aa]">
                Display authentic assurances (Karachi Express, Silk Purity, Master Tailor Stitching) above footer columns.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddBadge}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-xs font-bold text-white rounded-xl transition-colors border border-[#3f3f46]"
            >
              <Plus className="w-4 h-4 text-[#ea580c]" />
              <span>Add Badge</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(config.trustBadges || []).map(badge => {
              const isEditing = editingBadgeId === badge.id;

              if (isEditing) {
                return (
                  <div
                    key={badge.id}
                    className="bg-[#18181b] p-5 rounded-2xl border-2 border-[#ea580c]/60 shadow-lg space-y-4"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
                      <span className="text-xs font-bold text-white">Edit Trust Badge</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingBadgeId(null)}
                          className="text-[10px] text-[#a1a1aa] hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveBadge(badge.id)}
                          className="px-3 py-1 bg-[#ea580c] text-white text-xs font-bold rounded-lg"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[10px] text-[#a1a1aa] mb-1">Headline</label>
                        <input
                          type="text"
                          value={badgeForm.title || ''}
                          onChange={e => setBadgeForm({ ...badgeForm, title: e.target.value })}
                          className="w-full bg-[#121214] border border-[#27272a] text-white p-2 rounded-xl"
                          placeholder="e.g. Karachi Express"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#a1a1aa] mb-1">Subtitle / Details</label>
                        <input
                          type="text"
                          value={badgeForm.subtitle || ''}
                          onChange={e => setBadgeForm({ ...badgeForm, subtitle: e.target.value })}
                          className="w-full bg-[#121214] border border-[#27272a] text-white p-2 rounded-xl"
                          placeholder="e.g. Priority 24–48h Dispatch"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#a1a1aa] mb-1">Icon Symbol</label>
                        <select
                          value={badgeForm.icon || 'truck'}
                          onChange={e => setBadgeForm({ ...badgeForm, icon: e.target.value })}
                          className="w-full bg-[#121214] border border-[#27272a] text-white p-2 rounded-xl"
                        >
                          <option value="truck">🚚 Truck / Delivery</option>
                          <option value="shield">🛡️ Shield / Authentic</option>
                          <option value="sparkles">✨ Sparkles / Craftsmanship</option>
                          <option value="rotate">🔄 Rotate / Returns &amp; Exchange</option>
                          <option value="tag">🏷️ Tag / Best Price</option>
                          <option value="phone">📞 Phone / 24/7 Concierge</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={badge.id}
                  className="bg-[#18181b] p-4 rounded-2xl border border-[#27272a] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#27272a] flex items-center justify-center text-[#ea580c] shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{badge.title}</h4>
                      <p className="text-[11px] text-[#a1a1aa]">{badge.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBadgeId(badge.id);
                        setBadgeForm(badge);
                      }}
                      className="p-2 bg-[#27272a] hover:bg-[#3f3f46] text-[#d4d4d8] rounded-xl"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBadge(badge.id)}
                      className="p-2 bg-[#27272a] hover:bg-rose-950/60 text-rose-400 rounded-xl"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ABOUT STORY & NEWSLETTER CONFIG                                    */}
      {/* ========================================================================= */}
      {activeTab === 'general' && (
        <div className="bg-[#121214] p-6 rounded-3xl border border-[#27272a] shadow-xs space-y-6 text-xs">
          <div>
            <label className="block font-bold text-white mb-1.5">
              Footer Brand Story / About Summary
            </label>
            <textarea
              rows={4}
              value={config.aboutText || ''}
              onChange={e => setConfig({ ...config, aboutText: e.target.value })}
              className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl focus:outline-none focus:border-[#ea580c] leading-relaxed"
              placeholder="Karachi's premier fashion atelier offering bespoke stitched kurtis, pure Pima lawn..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-bold text-white mb-1.5">
                Newsletter Header Title
              </label>
              <input
                type="text"
                value={config.newsletterTitle || ''}
                onChange={e => setConfig({ ...config, newsletterTitle: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                placeholder="Join Our Newsletter"
              />
            </div>

            <div>
              <label className="block font-bold text-white mb-1.5">
                Newsletter Subtitle
              </label>
              <input
                type="text"
                value={config.newsletterSubtitle || ''}
                onChange={e => setConfig({ ...config, newsletterSubtitle: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] text-white p-2.5 rounded-xl"
                placeholder="Get the latest seasonal lawn drops, Eid collections..."
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#27272a]">
            <label className="flex items-center gap-2 text-white cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={config.showTrustBadges !== false}
                onChange={e => setConfig({ ...config, showTrustBadges: e.target.checked })}
                className="rounded border-[#27272a] text-[#ea580c]"
              />
              <span>Enable Trust Badges Strip</span>
            </label>

            <label className="flex items-center gap-2 text-white cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={config.showNewsletter !== false}
                onChange={e => setConfig({ ...config, showNewsletter: e.target.checked })}
                className="rounded border-[#27272a] text-[#ea580c]"
              />
              <span>Enable Newsletter Subscription Box</span>
            </label>

            <label className="flex items-center gap-2 text-white cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={config.showSocialLinks !== false}
                onChange={e => setConfig({ ...config, showSocialLinks: e.target.checked })}
                className="rounded border-[#27272a] text-[#ea580c]"
              />
              <span>Enable Social Media Links</span>
            </label>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: BOTTOM BAR & COPYRIGHT CRUD                                        */}
      {/* ========================================================================= */}
      {activeTab === 'bottom' && (
        <div className="bg-[#121214] p-6 rounded-3xl border border-[#27272a] shadow-xs space-y-6 text-xs">
          <div>
            <label className="block font-bold text-white mb-1.5">
              Copyright Notice Text
            </label>
            <input
              type="text"
              value={config.copyrightText || ''}
              onChange={e => setConfig({ ...config, copyrightText: e.target.value })}
              className="w-full bg-[#18181b] border border-[#27272a] text-white p-3 rounded-xl font-medium"
              placeholder="© 2026 STITCH & UNSTITCHED. All Rights Reserved. Crafted for Karachi & Pakistan."
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
              <span className="font-bold text-white">Bottom Legal Links</span>
              <button
                type="button"
                onClick={handleAddBottomLink}
                className="text-xs font-semibold text-[#ea580c] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Legal Link</span>
              </button>
            </div>

            <div className="space-y-2">
              {(config.bottomLinks || []).map(bl => (
                <div
                  key={bl.id}
                  className="bg-[#18181b] p-3 rounded-xl border border-[#27272a] flex items-center justify-between gap-4"
                >
                  <input
                    type="text"
                    value={bl.label}
                    onChange={e => handleUpdateBottomLink(bl.id, { label: e.target.value })}
                    className="bg-[#121214] border border-[#27272a] text-white p-1.5 rounded-lg text-xs flex-1"
                  />
                  <input
                    type="text"
                    value={bl.params?.slug || ''}
                    onChange={e =>
                      handleUpdateBottomLink(bl.id, {
                        params: { ...bl.params, slug: e.target.value },
                      })
                    }
                    placeholder="CMS slug (e.g. privacy-policy)"
                    className="bg-[#121214] border border-[#27272a] text-white p-1.5 rounded-lg text-xs w-48"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteBottomLink(bl.id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Save Button Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272a]">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save All Footer Changes'}</span>
        </button>
      </div>
    </div>
  );
};
