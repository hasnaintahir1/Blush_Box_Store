import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { OCCASIONS } from '../../constants/index.js';

export default function OccasionsSection() {
  const { setFilters, navigate } = useStore();

  const handleOccasionClick = (occName) => {
    setFilters(prev => ({ ...prev, occasion: occName, category: 'all', recipient: 'all' }));
    navigate('shop');
  };

  return (
    <section className="py-20 bg-stone-50/70 dark:bg-stone-900/40 border-b border-stone-200/60 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated by Milestone</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
              Gifts for Life's Significant Moments
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl">
              From intimate anniversaries and grand weddings to executive milestone celebrations, discover gifts engineered to create lasting memories.
            </p>
          </div>

          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'all', occasion: 'all' }));
              navigate('shop');
            }}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 group"
          >
            <span>View All Occasions</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Occasions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {OCCASIONS.slice(0, 6).map((occ) => (
            <div
              key={occ.id}
              onClick={() => handleOccasionClick(occ.name)}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200 dark:border-stone-800"
            >
              {/* Background Image */}
              <img
                src={occ.image}
                alt={occ.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-amber-950/90 transition-colors duration-300" />

              {/* Content text */}
              <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                <h3 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {occ.name}
                </h3>
                <span className="inline-block mt-1 text-[11px] text-stone-300 font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                  Shop Collection →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
