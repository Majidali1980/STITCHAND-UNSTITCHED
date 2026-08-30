import React, { useState, useEffect } from 'react';
import {
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  Sparkles,
  Grid3X3,
  Grid2X2,
  RotateCcw,
  Search,
} from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';

export const ShopPage: React.FC = () => {
  const { viewParams, formatPrice, categories } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState<'3' | '4'>('4');

  // Filter States initialized from viewParams
  const [selectedCategory, setSelectedCategory] = useState<string>(viewParams.category || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(viewParams.subcategory || '');
  const [selectedGender, setSelectedGender] = useState<string>(viewParams.gender || '');
  const [selectedStitchType, setSelectedStitchType] = useState<string>(viewParams.stitchType || '');
  const [selectedFabric, setSelectedFabric] = useState<string>(viewParams.fabric || '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(30000);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>(viewParams.search || '');
  const [onlySale, setOnlySale] = useState<boolean>(viewParams.isSale || false);
  const [onlyNew, setOnlyNew] = useState<boolean>(viewParams.isNew || false);

  // Sync when viewParams change
  useEffect(() => {
    if (viewParams.category !== undefined) setSelectedCategory(viewParams.category || '');
    if (viewParams.subcategory !== undefined) setSelectedSubcategory(viewParams.subcategory || '');
    if (viewParams.gender !== undefined) setSelectedGender(viewParams.gender || '');
    if (viewParams.stitchType !== undefined) setSelectedStitchType(viewParams.stitchType || '');
    if (viewParams.search !== undefined) setSearchQuery(viewParams.search || '');
    if (viewParams.isSale) setOnlySale(true);
    if (viewParams.isNew) setOnlyNew(true);
  }, [viewParams]);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const res = await api.getProducts({
          category: selectedCategory || undefined,
          subcategory: selectedSubcategory || undefined,
          gender: selectedGender || undefined,
          stitchType: selectedStitchType || undefined,
          fabric: selectedFabric || undefined,
          size: selectedSize || undefined,
          maxPrice: priceRange < 30000 ? priceRange : undefined,
          isSale: onlySale ? true : undefined,
          isNew: onlyNew ? true : undefined,
          search: searchQuery || undefined,
          sort: sortBy,
        });

        if (res && res.products) {
          setProducts(res.products);
          setTotalCount(res.total || res.products.length);
        }
      } catch (err) {
        console.error('Failed to load shop products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [
    selectedCategory,
    selectedSubcategory,
    selectedGender,
    selectedStitchType,
    selectedFabric,
    selectedSize,
    priceRange,
    sortBy,
    searchQuery,
    onlySale,
    onlyNew,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedGender('');
    setSelectedStitchType('');
    setSelectedFabric('');
    setSelectedSize('');
    setPriceRange(30000);
    setSearchQuery('');
    setOnlySale(false);
    setOnlyNew(false);
    setSortBy('newest');
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedSubcategory) ||
    Boolean(selectedGender) ||
    Boolean(selectedStitchType) ||
    Boolean(selectedFabric) ||
    Boolean(selectedSize) ||
    priceRange < 30000 ||
    Boolean(searchQuery) ||
    onlySale ||
    onlyNew;

  const categoriesList = categories.length > 0
    ? categories.map(c => ({
        id: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: c.name,
        subcategories: c.subcategories || [],
      }))
    : [
        { id: 'ladies', name: 'LADIES', subcategories: ['Unstitched Lawn', 'Ready-to-Wear', '3-Piece Suits', 'Kurtis & Tops'] },
        { id: 'gents', name: 'GENTS', subcategories: ['Cotton Kurtas', 'Shalwar Kameez', 'Festive Waistcoats'] },
        { id: 'kids', name: 'KIDS', subcategories: ['Girls Gharara Sets', 'Boys Kurta Shalwar', 'Festive Eid Wear'] },
        { id: 'home-apparel', name: 'HOME APPAREL', subcategories: ['Luxury Bedding', 'Embroidered Cushions', 'Table Runners'] },
        { id: 'bags', name: 'BAGS', subcategories: ['Velvet Clutches', 'Potli Pouches', 'Evening Minaudières'] },
      ];

  const currentCategoryData = categoriesList.find(
    c => c.id.toLowerCase() === selectedCategory.toLowerCase() || c.name.toLowerCase() === selectedCategory.toLowerCase()
  );

  const fabricsList = [
    'Pima Lawn',
    'Egyptian Cotton',
    'Cotton Latha',
    'Raw Silk',
    'Micro Velvet',
    'Organza Net',
    'Chiffon',
    'Linen',
  ];

  const sizesList = ['XS', 'S', 'M', 'L', 'XL', 'Unstitched'];

  return (
    <div className="min-h-screen bg-[#faf8f5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumbs */}
        <div className="mb-6">
          <div className="text-xs text-[#78716c] uppercase tracking-wider mb-1">
            <span>Home</span> &bull; <span>Shop Collection</span>
            {selectedCategory && <span> &bull; <span className="text-[#ea580c] font-semibold">{selectedCategory}</span></span>}
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#1c1917]">
            {selectedCategory ? `${selectedCategory.toUpperCase()} COLLECTION` : 'ALL FASHION COLLECTIONS'}
          </h1>
          <p className="text-xs text-[#78716c] mt-1">
            Showing {products.length} of {totalCount} authentic Pakistani stitched &amp; unstitched designs.
          </p>
        </div>

        {/* Top Filter & Sort Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#f0ece1] shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-[#1c1917] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            {/* Quick Search in Shop */}
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#a8a29e] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="w-full bg-[#faf8f5] border border-[#d6cfc4] text-xs pl-8 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-[#a8a29e] hover:text-black"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="hidden sm:flex items-center gap-1 text-xs text-red-600 hover:underline font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#78716c] hidden sm:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-[#faf8f5] border border-[#d6cfc4] text-xs font-semibold text-[#292524] px-3 py-2 rounded-xl focus:outline-none focus:border-[#ea580c]"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Grid Switcher (Desktop) */}
            <div className="hidden sm:flex items-center border border-[#d6cfc4] rounded-xl p-0.5 bg-[#faf8f5]">
              <button
                onClick={() => setGridCols('3')}
                className={`p-1.5 rounded-lg ${gridCols === '3' ? 'bg-white shadow-xs text-[#ea580c]' : 'text-[#78716c]'}`}
                title="3 Columns"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols('4')}
                className={`p-1.5 rounded-lg ${gridCols === '4' ? 'bg-white shadow-xs text-[#ea580c]' : 'text-[#78716c]'}`}
                title="4 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716c]">Active:</span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#d6cfc4] text-[#292524] text-xs px-2.5 py-1 rounded-full">
                Category: {selectedCategory}
                <button onClick={() => { setSelectedCategory(''); setSelectedSubcategory(''); }}><X className="w-3 h-3 hover:text-red-500" /></button>
              </span>
            )}
            {selectedSubcategory && (
              <span className="inline-flex items-center gap-1 bg-orange-100 border border-orange-200 text-[#c2410c] text-xs px-2.5 py-1 rounded-full font-bold">
                Subcategory: {selectedSubcategory}
                <button onClick={() => setSelectedSubcategory('')}><X className="w-3 h-3 hover:text-red-500" /></button>
              </span>
            )}
            {selectedGender && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#d6cfc4] text-[#292524] text-xs px-2.5 py-1 rounded-full">
                Gender: {selectedGender}
                <button onClick={() => setSelectedGender('')}><X className="w-3 h-3 hover:text-red-500" /></button>
              </span>
            )}
            {selectedStitchType && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#d6cfc4] text-[#292524] text-xs px-2.5 py-1 rounded-full">
                Stitch: {selectedStitchType}
                <button onClick={() => setSelectedStitchType('')}><X className="w-3 h-3 hover:text-red-500" /></button>
              </span>
            )}
            {selectedFabric && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#d6cfc4] text-[#292524] text-xs px-2.5 py-1 rounded-full">
                Fabric: {selectedFabric}
                <button onClick={() => setSelectedFabric('')}><X className="w-3 h-3 hover:text-red-500" /></button>
              </span>
            )}
            {selectedSize && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#d6cfc4] text-[#292524] text-xs px-2.5 py-1 rounded-full">
                Size: {selectedSize}
                <button onClick={() => setSelectedSize('')}><X className="w-3 h-3 hover:text-red-500" /></button>
              </span>
            )}
            {priceRange < 30000 && (
              <span className="inline-flex items-center gap-1 bg-white border border-[#d6cfc4] text-[#292524] text-xs px-2.5 py-1 rounded-full">
                Under {formatPrice(priceRange)}
                <button onClick={() => setPriceRange(30000)}><X className="w-3 h-3 hover:text-red-500" /></button>
              </span>
            )}
            {onlySale && (
              <span className="inline-flex items-center gap-1 bg-orange-100 border border-orange-200 text-[#c2410c] text-xs px-2.5 py-1 rounded-full font-bold">
                Sale Items Only
                <button onClick={() => setOnlySale(false)}><X className="w-3 h-3 hover:text-red-500" /></button>
              </span>
            )}
            {onlyNew && (
              <span className="inline-flex items-center gap-1 bg-[#1c1917] text-white text-xs px-2.5 py-1 rounded-full font-bold">
                New Drops Only
                <button onClick={() => setOnlyNew(false)}><X className="w-3 h-3 text-white" /></button>
              </span>
            )}
          </div>
        )}

        {/* Subcategories Horizontal Bar if Category selected */}
        {currentCategoryData && currentCategoryData.subcategories && currentCategoryData.subcategories.length > 0 && (
          <div className="mb-6 bg-white p-3.5 rounded-2xl border border-[#f0ece1] shadow-2xs flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716c] whitespace-nowrap pl-2">
              {currentCategoryData.name} Collections:
            </span>
            <button
              onClick={() => setSelectedSubcategory('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                !selectedSubcategory
                  ? 'bg-[#ea580c] text-white shadow-xs'
                  : 'bg-[#faf8f5] text-[#57534e] hover:bg-[#f0ece1]'
              }`}
            >
              All {currentCategoryData.name}
            </button>
            {currentCategoryData.subcategories.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? '' : sub)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSubcategory === sub
                    ? 'bg-[#ea580c] text-white shadow-xs'
                    : 'bg-[#faf8f5] text-[#57534e] hover:bg-[#f0ece1]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#f0ece1] shadow-2xs space-y-6">
              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#1c1917] mb-3">
                  Categories
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => { setSelectedCategory(''); setSelectedSubcategory(''); }}
                    className={`w-full text-left text-xs px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      !selectedCategory ? 'bg-orange-50 text-[#ea580c] font-bold' : 'text-[#57534e] hover:bg-[#faf8f5]'
                    }`}
                  >
                    <span>All Products</span>
                  </button>
                  {categoriesList.map(cat => (
                    <div key={cat.id} className="space-y-1">
                      <button
                        onClick={() => {
                          if (selectedCategory === cat.id || selectedCategory === cat.name) {
                            setSelectedCategory('');
                            setSelectedSubcategory('');
                          } else {
                            setSelectedCategory(cat.name);
                            setSelectedSubcategory('');
                          }
                        }}
                        className={`w-full text-left text-xs px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between ${
                          selectedCategory.toLowerCase() === cat.id.toLowerCase() || selectedCategory.toLowerCase() === cat.name.toLowerCase()
                            ? 'bg-orange-50 text-[#ea580c] font-bold'
                            : 'text-[#57534e] hover:bg-[#faf8f5]'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <span className="text-[10px] text-[#a8a29e]">({cat.subcategories.length})</span>
                        )}
                      </button>
                      
                      {/* Nested subcategories in sidebar if active */}
                      {(selectedCategory.toLowerCase() === cat.id.toLowerCase() || selectedCategory.toLowerCase() === cat.name.toLowerCase()) &&
                        cat.subcategories && cat.subcategories.length > 0 && (
                          <div className="pl-4 space-y-1 py-1 border-l-2 border-orange-200 ml-2">
                            {cat.subcategories.map((sub, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? '' : sub)}
                                className={`w-full text-left text-[11px] px-2 py-1 rounded-md transition-colors block ${
                                  selectedSubcategory === sub
                                    ? 'text-[#ea580c] font-bold bg-orange-50/50'
                                    : 'text-[#78716c] hover:text-[#1c1917]'
                                }`}
                              >
                                &bull; {sub}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stitch Type Filter */}
              <div className="pt-4 border-t border-[#f0ece1]">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#1c1917] mb-3">
                  Stitch Option
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedStitchType(selectedStitchType === 'unstitched' ? '' : 'unstitched')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                      selectedStitchType === 'unstitched'
                        ? 'border-[#ea580c] bg-orange-50 text-[#c2410c]'
                        : 'border-[#d6cfc4] hover:bg-[#faf8f5] text-[#57534e]'
                    }`}
                  >
                    Unstitched
                  </button>
                  <button
                    onClick={() => setSelectedStitchType(selectedStitchType === 'stitched' ? '' : 'stitched')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                      selectedStitchType === 'stitched'
                        ? 'border-[#ea580c] bg-orange-50 text-[#c2410c]'
                        : 'border-[#d6cfc4] hover:bg-[#faf8f5] text-[#57534e]'
                    }`}
                  >
                    Ready / Stitched
                  </button>
                </div>
              </div>

              {/* Gender Filter */}
              <div className="pt-4 border-t border-[#f0ece1]">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#1c1917] mb-3">
                  Gender / Department
                </h4>
                <div className="flex gap-2">
                  {['women', 'men'].map(g => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(selectedGender === g ? '' : g)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all text-center ${
                        selectedGender === g
                          ? 'border-[#ea580c] bg-[#1c1917] text-white'
                          : 'border-[#d6cfc4] hover:bg-[#faf8f5] text-[#57534e]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-4 border-t border-[#f0ece1]">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#1c1917] mb-2">
                  <span>Price Range</span>
                  <span className="text-[#ea580c]">{formatPrice(priceRange)}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="30000"
                  step="500"
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#ea580c]"
                />
                <div className="flex justify-between text-[10px] text-[#a8a29e] mt-1 font-semibold">
                  <span>Rs. 2,000</span>
                  <span>Rs. 30,000+</span>
                </div>
              </div>

              {/* Fabric Filter */}
              <div className="pt-4 border-t border-[#f0ece1]">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#1c1917] mb-3">
                  Fabric Type
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {fabricsList.map(fab => (
                    <button
                      key={fab}
                      onClick={() => setSelectedFabric(selectedFabric === fab ? '' : fab)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                        selectedFabric === fab
                          ? 'border-[#ea580c] bg-orange-50 text-[#ea580c] font-bold'
                          : 'border-[#d6cfc4] hover:bg-[#faf8f5] text-[#57534e]'
                      }`}
                    >
                      {fab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes Filter */}
              <div className="pt-4 border-t border-[#f0ece1]">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#1c1917] mb-3">
                  Sizes
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {sizesList.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                        selectedSize === sz
                          ? 'border-[#ea580c] bg-[#1c1917] text-white font-bold'
                          : 'border-[#d6cfc4] hover:bg-[#faf8f5] text-[#57534e]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Sale / New Checkboxes */}
              <div className="pt-4 border-t border-[#f0ece1] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#292524]">
                  <input
                    type="checkbox"
                    checked={onlySale}
                    onChange={e => setOnlySale(e.target.checked)}
                    className="rounded text-[#ea580c] focus:ring-[#ea580c] accent-[#ea580c]"
                  />
                  <span className="font-semibold text-[#c2410c]">On Sale Markdowns</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#292524]">
                  <input
                    type="checkbox"
                    checked={onlyNew}
                    onChange={e => setOnlyNew(e.target.checked)}
                    className="rounded text-[#ea580c] focus:ring-[#ea580c] accent-[#ea580c]"
                  />
                  <span className="font-semibold">New 2026 Collection</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-[#f0ece1] animate-pulse h-80">
                    <div className="bg-[#f5f2eb] h-52 rounded-xl mb-3" />
                    <div className="bg-[#f5f2eb] h-4 w-3/4 rounded mb-2" />
                    <div className="bg-[#f5f2eb] h-4 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#f0ece1] space-y-4">
                <div className="w-16 h-16 bg-[#faf8f5] rounded-full flex items-center justify-center mx-auto text-[#a8a29e]">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#1c1917]">
                  No products matched your filters
                </h3>
                <p className="text-xs text-[#78716c] max-w-sm mx-auto">
                  Try adjusting your price slider or clearing specific category/fabric filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full hover:bg-[#c2410c] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-2 gap-4 sm:gap-6 ${
                  gridCols === '4' ? 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3' : 'sm:grid-cols-2 md:grid-cols-3'
                }`}
              >
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl z-50 p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#f0ece1] pb-3">
                <h3 className="font-cinzel text-lg font-bold text-[#1c1917]">Refine Catalog</h3>
                <button onClick={() => setMobileFilterOpen(false)}><X className="w-5 h-5" /></button>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#1c1917] mb-2">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedCategory(''); setSelectedSubcategory(''); }}
                    className={`w-full text-left text-xs px-2 py-1.5 rounded-lg ${
                      !selectedCategory ? 'bg-orange-50 text-[#ea580c] font-bold' : 'text-[#57534e]'
                    }`}
                  >
                    All Products
                  </button>
                  {categoriesList.map(cat => (
                    <div key={cat.id} className="space-y-1">
                      <button
                        onClick={() => {
                          if (selectedCategory === cat.name || selectedCategory === cat.id) {
                            setSelectedCategory('');
                            setSelectedSubcategory('');
                          } else {
                            setSelectedCategory(cat.name);
                            setSelectedSubcategory('');
                          }
                        }}
                        className={`w-full text-left text-xs px-2 py-1.5 rounded-lg flex items-center justify-between ${
                          selectedCategory.toLowerCase() === cat.id.toLowerCase() || selectedCategory.toLowerCase() === cat.name.toLowerCase()
                            ? 'bg-orange-50 text-[#ea580c] font-bold'
                            : 'text-[#57534e]'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <span className="text-[10px] text-[#a8a29e]">({cat.subcategories.length})</span>
                        )}
                      </button>

                      {/* Subcategories if active */}
                      {(selectedCategory.toLowerCase() === cat.id.toLowerCase() || selectedCategory.toLowerCase() === cat.name.toLowerCase()) &&
                        cat.subcategories && cat.subcategories.length > 0 && (
                          <div className="pl-3 space-y-1 py-1 border-l-2 border-orange-300 ml-1">
                            {cat.subcategories.map((sub, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? '' : sub)}
                                className={`w-full text-left text-[11px] px-2 py-1 rounded-md transition-colors block ${
                                  selectedSubcategory === sub
                                    ? 'text-[#ea580c] font-bold bg-orange-50/70'
                                    : 'text-[#78716c]'
                                }`}
                              >
                                &bull; {sub}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stitching */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#1c1917] mb-2">Stitch Type</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedStitchType(selectedStitchType === 'unstitched' ? '' : 'unstitched')}
                    className={`py-1.5 text-xs rounded-lg border ${selectedStitchType === 'unstitched' ? 'border-[#ea580c] bg-orange-50 text-[#ea580c]' : 'border-[#d6cfc4]'}`}
                  >
                    Unstitched
                  </button>
                  <button
                    onClick={() => setSelectedStitchType(selectedStitchType === 'stitched' ? '' : 'stitched')}
                    className={`py-1.5 text-xs rounded-lg border ${selectedStitchType === 'stitched' ? 'border-[#ea580c] bg-orange-50 text-[#ea580c]' : 'border-[#d6cfc4]'}`}
                  >
                    Stitched
                  </button>
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-1">
                  <span>Price</span>
                  <span className="text-[#ea580c]">{formatPrice(priceRange)}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="30000"
                  step="500"
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#ea580c]"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[#f0ece1] space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#ea580c] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Apply Filters ({products.length})
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full bg-[#faf8f5] text-[#57534e] py-2 rounded-xl text-xs font-semibold"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
