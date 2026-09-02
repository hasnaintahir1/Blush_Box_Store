import React from 'react';
import { Sparkles, ArrowRight, DollarSign, Gift, Crown, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { BUDGETS } from '../../constants/index.js';

export default function BudgetExplorer() {
  const { setFilters, navigate } = useStore();

  const handleBudgetClick = (budgetId) => {
    setFilters(prev => ({ ...prev, budget: budgetId, category: 'all', occasion: 'all' }));
    navigate('shop');
  };

  return (
    <section className="py-20 bg-white dark:bg-stone-900 border-b border-stone-200/60 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              <Gift className="w-3.5 h-3.5" />
              <span>Thoughtful Price Curation</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
              Shop by Thoughtful Budget
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl">
              Luxury is defined by the intention and presentation, not merely the price tag. Discover exquisite gifts for every planned budget.
            </p>
          </div>

          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, budget: '' }));
              navigate('shop');
            }}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 group"
          >
            <span>All Price Ranges</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 5 Budget Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {BUDGETS.map((b, index) => (
            <div
              key={b.id}
              onClick={() => handleBudgetClick(b.id)}
              className="group p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-lg hover:-translate-y-1"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm shadow-sm mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  {index === 4 ? <Crown className="w-5 h-5" /> : `$${index === 0 ? '25' : index === 1 ? '50' : index === 2 ? '100' : '200'}`}
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
                  {b.label}
                </span>

                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white mt-1">
                  {b.name}
                </h3>

                <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                  {b.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-stone-200/60 dark:border-stone-700 flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                <span>Explore Tier</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
