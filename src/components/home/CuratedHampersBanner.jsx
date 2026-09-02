import React from 'react';
import { Gift, Sparkles, Check, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function CuratedHampersBanner() {
  const { navigate, setFilters } = useStore();

  const handleShopHampers = () => {
    setFilters(prev => ({ ...prev, category: 'Gift Hampers' }));
    navigate('shop');
  };

  return (
    <section className="py-20 bg-stone-950 text-white relative overflow-hidden">
      {/* Background Subtle Luxury Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Signature Keepsake Box Series</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Bespoke Gift Boxes &amp; Curated Hampers
            </h2>

            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              Curated for grand milestones and cherished toasts. Every Blush Box is hand-assembled with artisan Belgian chocolates, organic botanical preserves, floral essences, and custom engraved keepsakes.
            </p>

            {/* Pillar Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Handmade Soft-Touch Blush Box Presentation</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Gold Foil Handwritten Calligraphy Card</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Temperature-Controlled Express Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Corporate VIP &amp; Custom Event Curation</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={handleShopHampers}
                className="px-7 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Curated Hampers</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('contact')}
                className="px-6 py-3.5 rounded-xl bg-stone-900 border border-stone-700 hover:bg-stone-800 text-stone-200 font-semibold text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                Corporate Concierge
              </button>
            </div>
          </div>

          {/* Right Imagery Collage */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop"
                alt="Luxury Curated Trunk"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Floating Luxury Callout Card */}
            <div className="absolute -bottom-6 -left-6 bg-stone-900/95 border border-amber-500/40 p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-md max-w-xs space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">Signature Edition</span>
              <h4 className="font-serif text-sm font-bold text-white">The Royal Reserve Trunk</h4>
              <p className="text-[11px] text-stone-400">Moët Vintage, Truffles, Caviar &amp; Engraved Flutes</p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-amber-400">
                <span>$280.00</span>
                <button 
                  onClick={handleShopHampers}
                  className="text-stone-300 hover:text-white underline text-[11px]"
                >
                  View Trunk →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
