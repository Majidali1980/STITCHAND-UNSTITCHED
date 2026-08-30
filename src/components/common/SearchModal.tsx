import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { api } from '../../services/api';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, navigate, setQuickViewProduct, formatPrice } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularSearches = [
    'Lawn 3 Piece',
    'Chiffon Dupatta',
    'Men\'s Kurta',
    'Embroidered Velvet',
    'Ready-to-Wear Kurti',
    'Shalwar Kameez',
    'Egyptian Cotton',
    'Summer 2026',
  ];

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.getProducts({ search: searchTerm.trim(), limit: 6 });
        setResults(res.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (product: Product) => {
    setIsSearchOpen(false);
    setQuickViewProduct(product);
  };

  const handleFullSearch = (term: string) => {
    setIsSearchOpen(false);
    navigate('shop', { search: term });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative mx-auto max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#e5dfd3] z-10 animate-fadeIn">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#f0ece1] flex items-center gap-3 bg-[#faf8f5]">
          <Search className="w-5 h-5 text-[#ea580c] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && searchTerm) {
                handleFullSearch(searchTerm);
              }
            }}
            placeholder="Search Pakistani lawn, stitched kurtis, men's wear, SKU..."
            className="w-full bg-transparent text-sm md:text-base text-[#1c1917] placeholder-[#a8a29e] focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-[#78716c] hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs bg-[#e5dfd3] hover:bg-[#d6cfc4] text-[#44403c] px-2.5 py-1 rounded-md font-medium transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 max-h-[65vh] overflow-y-auto">
          {/* Quick Search Chips */}
          {!searchTerm && (
            <div className="space-y-4 py-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716c] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" /> Popular Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearchTerm(tag);
                        handleFullSearch(tag);
                      }}
                      className="bg-[#faf8f5] hover:bg-[#ffedd5] hover:text-[#ea580c] text-[#44403c] text-xs px-3 py-1.5 rounded-full border border-[#e5dfd3] transition-colors flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-[#ea580c]" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#fff7ed] p-3 rounded-xl border border-[#fed7aa] text-xs text-[#9a3412]">
                <span className="font-bold">Karachi Tip:</span> Looking for breathable summer fabrics? Try searching &ldquo;Pima Lawn&rdquo; or &ldquo;Egyptian Cotton&rdquo;.
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="py-8 text-center text-xs text-[#78716c]">
              Searching luxury catalog...
            </div>
          )}

          {/* Results List */}
          {searchTerm && !loading && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#78716c] mb-3 pb-2 border-b border-[#f0ece1]">
                <span>Matching Products ({results.length})</span>
                {results.length > 0 && (
                  <button
                    onClick={() => handleFullSearch(searchTerm)}
                    className="text-[#ea580c] hover:underline flex items-center gap-1"
                  >
                    View all results &rarr;
                  </button>
                )}
              </div>

              {results.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-sm font-semibold text-[#292524]">
                    No fashion products found for &ldquo;{searchTerm}&rdquo;
                  </p>
                  <p className="text-xs text-[#78716c]">
                    Try checking your spelling or search for lawn, kurti, unstitched, or men.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.map(prod => (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod)}
                      className="flex gap-3 p-2.5 rounded-xl border border-[#f0ece1] hover:border-[#fed7aa] hover:bg-[#fffbf5] cursor-pointer transition-all group"
                    >
                      <img
                        src={prod.images[0]?.url}
                        alt={prod.name}
                        className="w-16 h-20 object-cover rounded-lg shrink-0 border border-[#e5dfd3]"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-bold text-[#ea580c] tracking-wider">
                          {prod.category} &bull; {prod.fabric}
                        </span>
                        <h5 className="text-xs font-bold text-[#1c1917] group-hover:text-[#ea580c] transition-colors truncate">
                          {prod.name}
                        </h5>
                        <p className="text-[11px] text-[#78716c] truncate">
                          SKU: {prod.sku}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs font-bold text-[#ea580c]">
                            {formatPrice(prod.salePrice || prod.price)}
                          </span>
                          {prod.salePrice && (
                            <span className="text-[10px] line-through text-[#a8a29e]">
                              {formatPrice(prod.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {searchTerm && results.length > 0 && (
          <div className="p-3 bg-[#faf8f5] border-t border-[#f0ece1] text-center">
            <button
              onClick={() => handleFullSearch(searchTerm)}
              className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>See all {results.length}+ results for &ldquo;{searchTerm}&rdquo;</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
