import React, { useState } from 'react';
import { SlidersHorizontal, Grid, List, Sparkles, X, Gift, Search } from 'lucide-react';
import ProductCard from '../components/products/ProductCard.jsx';
import ProductFilterSidebar from '../components/products/ProductFilterSidebar.jsx';
import { useStore } from '../context/StoreContext.jsx';

export default function ShopPage() {
  const { 
    products, 
    loading, 
    filters, 
    setFilters, 
    searchQuery, 
    setSearchQuery,
    setIsAIModalOpen 
  } = useStore();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sort: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Title & Breadcrumbs */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span>Home</span>
            <span>/</span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold uppercase tracking-wider">
              {filters.category !== 'all' ? filters.category : 'Bespoke Collections'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
                {filters.category !== 'all' ? filters.category : filters.occasion !== 'all' ? filters.occasion : 'The Complete Gift Collection'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                Showing <span className="font-semibold text-stone-900 dark:text-white">{products.length}</span> curated luxury gifts available for immediate dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {(searchQuery || filters.category !== 'all' || filters.occasion !== 'all' || filters.recipient !== 'all' || filters.budget) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 text-xs">
            <span className="text-stone-400 font-medium">Active Filters:</span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
              </span>
            )}

            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100/80 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-medium">
                Category: {filters.category}
                <button onClick={() => setFilters(p => ({ ...p, category: 'all' }))} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
              </span>
            )}

            {filters.occasion !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100/80 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-medium">
                Occasion: {filters.occasion}
                <button onClick={() => setFilters(p => ({ ...p, occasion: 'all' }))} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
              </span>
            )}

            {filters.recipient !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100/80 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-medium">
                Recipient: {filters.recipient}
                <button onClick={() => setFilters(p => ({ ...p, recipient: 'all' }))} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
              </span>
            )}

            {filters.budget && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100/80 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-medium">
                Budget: {filters.budget}
                <button onClick={() => setFilters(p => ({ ...p, budget: '' }))} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Control Bar: Mobile Filter Button, View Mode, Sorting */}
        <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-800 dark:text-stone-200 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>Filters</span>
          </button>

          {/* Desktop Product Count Indicator */}
          <div className="hidden lg:block text-xs font-medium text-stone-500 dark:text-stone-400">
            Displaying {products.length} exceptional gifts
          </div>

          {/* Sorting Dropdown & View Mode */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2">
              <label htmlFor="shop-sort" className="text-xs font-semibold text-stone-600 dark:text-stone-400 hidden sm:inline-block">
                Sort by:
              </label>
              <select
                id="shop-sort"
                value={filters.sort || 'featured'}
                onChange={handleSortChange}
                className="px-3 py-2 text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 dark:text-stone-200"
              >
                <option value="featured">Featured Curations</option>
                <option value="popular">Best Sellers &amp; Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-stone-700 text-amber-600 shadow-sm' : 'text-stone-400'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-stone-700 text-amber-600 shadow-sm' : 'text-stone-400'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="flex gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-28">
            <ProductFilterSidebar />
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-600 flex items-center justify-center mx-auto">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
                  No Matching Gifts Found
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                  Try broadening your search criteria or resetting filters to explore our full collection.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      category: 'all',
                      occasion: 'all',
                      recipient: 'all',
                      budget: '',
                      minPrice: '',
                      maxPrice: '',
                      rating: '',
                      inStock: false,
                      featured: false,
                      bestSeller: false,
                      newArrival: false,
                      sort: 'featured'
                    });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-amber-600 hover:bg-amber-600 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Slideout Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white dark:bg-stone-900 h-full overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-300">
            <ProductFilterSidebar isMobile onClose={() => setIsMobileFilterOpen(false)} />
          </div>
          <div className="flex-1" onClick={() => setIsMobileFilterOpen(false)} />
        </div>
      )}
    </div>
  );
}
