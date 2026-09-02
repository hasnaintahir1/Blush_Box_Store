import React from 'react';
import { ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { RECIPIENTS } from '../../constants/index.js';

export default function RecipientGrid() {
  const { setFilters, navigate } = useStore();

  const handleRecipientClick = (recName) => {
    setFilters(prev => ({ ...prev, recipient: recName, category: 'all', occasion: 'all' }));
    navigate('shop');
  };

  return (
    <section className="py-20 bg-stone-50/70 dark:bg-stone-900/40 border-b border-stone-200/60 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Honoring the Recipient</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
            Tailored for Those Who Matter Most
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Every personality has a distinct luxury language. Explore our personalized collections crafted for her, for him, parents, and cherished couples.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECIPIENTS.map((rec) => (
            <div
              key={rec.id}
              onClick={() => handleRecipientClick(rec.name)}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 border border-stone-200 dark:border-stone-800 flex flex-col justify-end p-6"
            >
              {/* Image */}
              <img
                src={rec.image}
                alt={rec.name}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
                loading="lazy"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent group-hover:from-amber-950/90 transition-colors duration-300" />

              {/* Card Information */}
              <div className="relative z-10 space-y-1.5">
                <span className="text-[11px] uppercase tracking-widest text-amber-400 font-bold">
                  Bespoke Collection
                </span>
                <h3 className="font-serif text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  {rec.name}
                </h3>
                <p className="text-xs text-stone-300 font-light">
                  {rec.subtitle}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                  <span>Shop Gifts</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
