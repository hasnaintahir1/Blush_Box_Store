import React from 'react';
import { Gift, ShieldCheck, Sparkles, Truck, Clock, HeartHandshake } from 'lucide-react';

export default function BrandValues() {
  return (
    <section className="py-20 bg-white dark:bg-stone-900 border-b border-stone-200/60 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            The Blush Box Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
            Uncompromising Elegance in Every Detail
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            We craft every box, bow, personalized card, and artisan treat to evoke a true sense of luxury, warmth, and memorable joy.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="p-8 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 space-y-4 hover:border-rose-400/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
              Signature Blush Unboxing
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Every parcel arrives encased in custom heavy blush keepsake boxes, double-faced satin ribbon, and gold-foiled stationery.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 space-y-4 hover:border-rose-400/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
              Fiber-Laser Monograms
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Personalized initials, family crests, dates, and sentiment messages engraved with sub-millimeter precision into metal, crystal, and leather.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 space-y-4 hover:border-rose-400/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
              White-Glove Delivery
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Real-time milestone notifications with exact delivery window scheduling and temperature-controlled insulated packaging.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 space-y-4 hover:border-rose-400/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
              The 100% Delight Promise
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              If your gift does not invoke authentic smiles and joy, our private concierge will replace or refund it immediately with zero friction.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
