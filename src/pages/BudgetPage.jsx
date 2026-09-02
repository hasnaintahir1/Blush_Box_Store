import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { BUDGETS } from '../constants/index.js';
import { 
  DollarSign, Sparkles, ArrowRight, Check, Tag, Gift, 
  TrendingUp, Star, Filter, Heart
} from 'lucide-react';

const BUDGET_TIERS = [
  {
    id: "under-25",
    name: "Under $25",
    subtitle: "Charming Tokens & Sweet Surprises",
    description: "Thoughtful mini luxuries, artisanal gourmet chocolate bars, scented travel tins, and personalized key rings.",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop",
    priceText: "Under $25",
    minPrice: 0,
    maxPrice: 25,
    sampleGifts: ["Artisan Single-Origin Dark Chocolate Bar", "Botanical Travel Soy Candle", "Engraved Brass Bookmark", "Organic Honey Dipper Set"],
    badge: "Budget Friendly"
  },
  {
    id: "25-50",
    name: "From $25 – $50",
    subtitle: "Curated Delights & Daily Luxuries",
    description: "Handcrafted full-grain leather keychains, loose-leaf organic botanical tea collections, and mini preserved floral charms.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
    priceText: "$25 to $50",
    minPrice: 25,
    maxPrice: 50,
    sampleGifts: ["Artisan Belgian Praline Gift Box", "Aromatic Reed Diffuser & Glass Bottle", "Personalized Leather Key Fob", "Organic Bath Ritual Box"],
    badge: "Popular Value"
  },
  {
    id: "50-100",
    name: "From $50 – $100",
    subtitle: "Signature Elegance & Heirlooms",
    description: "Laser-engraved crystal champagne flutes, 18k gold vermeil pendants, preserved rose bell jars, and curated culinary sets.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    priceText: "$50 to $100",
    minPrice: 50,
    maxPrice: 100,
    sampleGifts: ["Personalized Italian Leather Valet Tray", "Eternal Rose Single Bell Cloche", "18k Gold Vermeil Initial Necklace", "Artisan Balsamic & Olive Oil Reserve"],
    badge: "Bestseller Tier"
  },
  {
    id: "100-200",
    name: "From $100 – $200",
    subtitle: "Grand Keepsakes & Celebration Trunks",
    description: "Grand preserved rose conservatory domes, vintage champagne celebration hampers, pure silk eye masks, and whiskey decanters.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
    priceText: "$100 to $200",
    minPrice: 100,
    maxPrice: 200,
    sampleGifts: ["Grand Eternal Rose Conservatory Dome", "Royal Blush Champagne & Truffle Hamper", "Mouth-Blown Crystal Decanter & Glasses", "Silk Pillowcase & Eye Mask Sanctuary"],
    badge: "Grand Milestones"
  },
  {
    id: "luxury",
    name: "Luxury $150+ & Haute Curations",
    subtitle: "Masterpiece Tier & Prestige Keepsakes",
    description: "100% Grade-A Mongolian cashmere wraps, vintage grand cru champagnes, solid brass monogram locks, and bespoke executive trunks.",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop",
    priceText: "$150 and above",
    minPrice: 150,
    maxPrice: 1000,
    sampleGifts: ["Mongolian Cashmere Silk Sanctuary Wrap", "Grand Cru Vintage Prestige Truffle Chest", "Bespoke Royal Double Velvet Hamper", "18k Solid Gold Milestone Keepsake"],
    badge: "Haute Luxury"
  }
];

export default function BudgetPage() {
  const { navigate, setFilters, products } = useStore();
  const [customMin, setCustomMin] = useState('');
  const [customMax, setCustomMax] = useState('');

  const handleSelectTier = (tier) => {
    setFilters(prev => ({
      ...prev,
      budget: tier.id,
      minPrice: tier.minPrice ? tier.minPrice.toString() : '',
      maxPrice: tier.maxPrice && tier.maxPrice < 1000 ? tier.maxPrice.toString() : '',
      category: 'all',
      occasion: 'all',
      recipient: 'all'
    }));
    navigate('shop');
  };

  const handleApplyCustomPrice = (e) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      budget: '',
      minPrice: customMin,
      maxPrice: customMax,
      category: 'all',
      occasion: 'all',
      recipient: 'all'
    }));
    navigate('shop');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header & Breadcrumbs */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <button onClick={() => navigate('home')} className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">Home</button>
            <span>/</span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold uppercase tracking-wider">Gift by Budget</span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-widest">
            <DollarSign className="w-3.5 h-3.5 text-rose-500" />
            Curated by Price Point
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white leading-tight">
            Exceptional Luxury at Every Price Tier
          </h1>
          
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-light leading-relaxed">
            Every Blush Box arrives in our signature soft-touch presentation packaging with personalized gold-foiled stationery, regardless of price.
          </p>

          {/* Custom Price Range Filter Bar */}
          <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm max-w-xl mx-auto">
            <form onSubmit={handleApplyCustomPrice} className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[11px]">
                Custom Price Range:
              </span>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-stone-400">$</span>
                  <input
                    type="number"
                    value={customMin}
                    onChange={(e) => setCustomMin(e.target.value)}
                    placeholder="Min"
                    className="w-20 pl-6 pr-2 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <span className="text-stone-400">–</span>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-stone-400">$</span>
                  <input
                    type="number"
                    value={customMax}
                    onChange={(e) => setCustomMax(e.target.value)}
                    placeholder="Max"
                    className="w-20 pl-6 pr-2 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold tracking-wider uppercase text-[10px] transition-colors cursor-pointer"
              >
                Filter
              </button>
            </form>
          </div>
        </div>

        {/* Budget Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {BUDGET_TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => handleSelectTier(tier)}
              className="group bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
            >
              {/* Image Area */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={tier.image}
                  alt={tier.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                    {tier.badge}
                  </span>
                </div>

                <div className="absolute top-3.5 right-3.5">
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md">
                    {tier.priceText}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold group-hover:text-rose-300 transition-colors">
                    {tier.name}
                  </h3>
                  <p className="text-[11px] text-stone-200 font-light opacity-90">
                    {tier.subtitle}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                  {tier.description}
                </p>

                {/* Sample Gifts List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                    Featured in This Range
                  </span>
                  <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                    {tier.sampleGifts.map((sample, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-rose-500 flex-shrink-0" />
                        <span className="truncate">{sample}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    Free Gift Packaging Included
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTier(tier);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:text-rose-500 transition-colors uppercase tracking-wider"
                  >
                    <span>Shop Tier</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Free Shipping & Packaging Assurance */}
        <div className="rounded-3xl bg-stone-900 text-white p-8 sm:p-10 border border-stone-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-center shadow-xl">
          <div className="space-y-2">
            <Gift className="w-6 h-6 text-rose-400 mx-auto" />
            <h4 className="font-serif text-base font-bold">Signature Keepsake Box</h4>
            <p className="text-xs text-stone-400 leading-relaxed">Every item, at every price, is wrapped in our luxury blush box with satin ribbon.</p>
          </div>
          <div className="space-y-2">
            <Tag className="w-6 h-6 text-rose-400 mx-auto" />
            <h4 className="font-serif text-base font-bold">Complimentary Shipping $150+</h4>
            <p className="text-xs text-stone-400 leading-relaxed">Orders over $150 automatically receive free priority white-glove temperature dispatch.</p>
          </div>
          <div className="space-y-2">
            <Sparkles className="w-6 h-6 text-rose-400 mx-auto" />
            <h4 className="font-serif text-base font-bold">Complimentary Engraving</h4>
            <p className="text-xs text-stone-400 leading-relaxed">Laser monograms, initials, and dates included with zero hidden upgrade fees.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
