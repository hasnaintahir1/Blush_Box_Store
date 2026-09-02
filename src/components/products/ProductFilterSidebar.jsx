import React from 'react';
import { Filter, X, RotateCcw, Star, Sparkles, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { OCCASIONS, RECIPIENTS, BUDGETS } from '../../constants/index.js';

export default function ProductFilterSidebar({ isMobile = false, onClose = () => {} }) {
  const { filters, setFilters, categories, fetchProducts } = useStore();

  const handleCategoryChange = (catName) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === catName ? 'all' : catName
    }));
  };

  const handleOccasionChange = (occName) => {
    setFilters(prev => ({
      ...prev,
      occasion: prev.occasion === occName ? 'all' : occName
    }));
  };

  const handleRecipientChange = (recName) => {
    setFilters(prev => ({
      ...prev,
      recipient: prev.recipient === recName ? 'all' : recName
    }));
  };

  const handleBudgetChange = (budgetId) => {
    setFilters(prev => ({
      ...prev,
      budget: prev.budget === budgetId ? '' : budgetId
    }));
  };

  const handleClearAll = () => {
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
  };

  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.occasion !== 'all' || 
    filters.recipient !== 'all' || 
    filters.budget !== '' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.rating !== '' ||
    filters.inStock ||
    filters.featured ||
    filters.bestSeller ||
    filters.newArrival;

  return (
    <div className={`space-y-6 ${isMobile ? 'p-6' : 'p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm'}`}>
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h3 className="font-serif text-base font-bold text-stone-900 dark:text-white">
            Filter Collection
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}

        {isMobile && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 1. Categories */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
          Gift Categories
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
              filters.category === 'all'
                ? 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span>All Categories</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryChange(cat.name)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                filters.category === cat.name
                  ? 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              {cat.productCount !== undefined && (
                <span className="text-[10px] text-stone-400">({cat.productCount})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Occasions */}
      <div className="space-y-2 pt-3 border-t border-stone-100 dark:border-stone-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
          Occasion
        </h4>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
          {OCCASIONS.map((occ) => (
            <button
              key={occ.id}
              onClick={() => handleOccasionChange(occ.name)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                filters.occasion === occ.name
                  ? 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <span className="truncate">{occ.name}</span>
              {filters.occasion === occ.name && <Check className="w-3.5 h-3.5 text-amber-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Recipients */}
      <div className="space-y-2 pt-3 border-t border-stone-100 dark:border-stone-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
          Recipient
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {RECIPIENTS.map((rec) => (
            <button
              key={rec.id}
              onClick={() => handleRecipientChange(rec.name)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-center truncate border transition-colors ${
                filters.recipient === rec.name
                  ? 'bg-amber-600 text-white border-amber-600 font-bold'
                  : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {rec.name.replace('Gifts ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Budget Quick Tiers */}
      <div className="space-y-2 pt-3 border-t border-stone-100 dark:border-stone-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
          Budget Tier
        </h4>
        <div className="space-y-1">
          {BUDGETS.map((b) => (
            <button
              key={b.id}
              onClick={() => handleBudgetChange(b.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                filters.budget === b.id
                  ? 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <span>{b.name}</span>
              <span className="text-[10px] text-stone-400">{b.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Custom Price Range Inputs */}
      <div className="space-y-2 pt-3 border-t border-stone-100 dark:border-stone-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
          Custom Price ($)
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value, budget: '' }))}
            className="w-1/2 px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 dark:text-white"
          />
          <span className="text-stone-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value, budget: '' }))}
            className="w-1/2 px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 dark:text-white"
          />
        </div>
      </div>

      {/* 6. Rating Filter */}
      <div className="space-y-2 pt-3 border-t border-stone-100 dark:border-stone-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
          Minimum Rating
        </h4>
        <div className="flex gap-1.5">
          {[4.5, 4.0, 3.5].map((r) => (
            <button
              key={r}
              onClick={() => setFilters(prev => ({ ...prev, rating: prev.rating === String(r) ? '' : String(r) }))}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition-colors ${
                filters.rating === String(r)
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{r}+</span>
            </button>
          ))}
        </div>
      </div>

      {/* 7. Special Toggles */}
      <div className="space-y-2 pt-3 border-t border-stone-100 dark:border-stone-800">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 dark:text-stone-300">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
            className="rounded text-amber-600 focus:ring-amber-500"
          />
          <span>In Stock Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 dark:text-stone-300">
          <input
            type="checkbox"
            checked={filters.bestSeller}
            onChange={(e) => setFilters(prev => ({ ...prev, bestSeller: e.target.checked }))}
            className="rounded text-amber-600 focus:ring-amber-500"
          />
          <span>Best Sellers Only</span>
        </label>
      </div>

    </div>
  );
}
