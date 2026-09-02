import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { Gift, Sparkles, ArrowRight, Star, Heart, Check, Search } from 'lucide-react';

export const CATEGORIES_DATA = [
  {
    id: "gift-hampers",
    name: "Curated Gift Hampers",
    tagline: "Epicurean delights, vintage champagne & confectionery",
    categoryFilter: "Gift Hampers",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
    priceRange: "$95 - $280",
    itemCount: 8,
    badge: "Bestseller",
    features: ["Handcrafted soft-touch blush box", "Imported Belgian chocolates", "Gold-foiled message card"]
  },
  {
    id: "personalized-gifts",
    name: "Personalized Keepsakes",
    tagline: "Laser-engraved crystal, monogrammed leather & custom brass",
    categoryFilter: "Personalized Gifts",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
    priceRange: "$45 - $185",
    itemCount: 6,
    badge: "Complimentary Monogram",
    features: ["Precision laser etching", "Custom initials or dates", "Keepsake velvet pouch"]
  },
  {
    id: "flowers-bouquets",
    name: "Botanical & Floral Domes",
    tagline: "Preserved Ecuadorian roses lasting over 365 days",
    categoryFilter: "Flowers & Bouquets",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    priceRange: "$65 - $195",
    itemCount: 5,
    badge: "Lasts 1-3 Years",
    features: ["Zero water required", "Hand-blown glass cloche", "Solid walnut or brass base"]
  },
  {
    id: "luxury-gifts",
    name: "Prestige & Cashmere",
    tagline: "Pure Mongolian cashmere, silk sanctuaries & heirloom goods",
    categoryFilter: "Luxury Gifts",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop",
    priceRange: "$120 - $350",
    itemCount: 6,
    badge: "Haute Tier",
    features: ["100% Grade-A Cashmere", "Double-faced satin trims", "Artisan atelier certificate"]
  },
  {
    id: "jewelry",
    name: "Fine Heirloom Jewelry",
    tagline: "18k gold vermeil pendants, freshwater pearls & timeless sparkle",
    categoryFilter: "Jewelry",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    priceRange: "$75 - $220",
    itemCount: 4,
    badge: "New Release",
    features: ["Hypoallergenic 18k gold", "Gift-ready jewelry chest", "Certificate of authenticity"]
  },
  {
    id: "chocolates",
    name: "Artisan Belgian Chocolates",
    tagline: "Single-origin truffles, praline ganaches & gold-dusted treats",
    categoryFilter: "Chocolates",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop",
    priceRange: "$35 - $95",
    itemCount: 5,
    badge: "Master Chocolatier",
    features: ["Imported from Brussels", "Temperature-controlled shipping", "Gold embossed tier box"]
  },
  {
    id: "leather-goods",
    name: "Full-Grain Italian Leather",
    tagline: "Personalized valet trays, travel wallets & desk organizers",
    categoryFilter: "Personalized Gifts",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop",
    priceRange: "$55 - $160",
    itemCount: 4,
    badge: "Vegetable Tanned",
    features: ["Tuscan full-grain leather", "Hand-stitched perimeter", "Solid brass corner snaps"]
  },
  {
    id: "crystal-barware",
    name: "Hand-Cut Crystal & Barware",
    tagline: "Lead-free crystal champagne flutes, decanters & whiskey stones",
    categoryFilter: "Personalized Gifts",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop",
    priceRange: "$68 - $190",
    itemCount: 5,
    badge: "Mouth-Blown",
    features: ["Laser-engraved flutes", "Ultra-clarity acoustic crystal", "Heavy weighted base"]
  }
];

export default function CategoriesPage() {
  const { navigate, setFilters, products } = useStore();
  const [search, setSearch] = useState('');

  const filteredCategories = CATEGORIES_DATA.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.tagline.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCategory = (categoryName) => {
    setFilters(prev => ({
      ...prev,
      category: categoryName,
      occasion: 'all',
      recipient: 'all',
      budget: ''
    }));
    navigate('shop');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumbs & Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <button onClick={() => navigate('home')} className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">Home</button>
            <span>/</span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold uppercase tracking-wider">Categories</span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            Curated Gift Categories
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white leading-tight">
            Explore Every Gift Collection
          </h1>
          
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-light leading-relaxed">
            From signature celebration hampers to custom laser-engraved keepsakes and everlasting florals, discover masterfully crafted gifts organized by artisanal discipline.
          </p>

          {/* Quick Search */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories (e.g. Hampers, Florals, Leather)..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white shadow-xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.categoryFilter)}
              className="group bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-56 sm:h-64 overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/10 shadow-sm">
                    {cat.badge}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[11px] font-semibold">
                    {cat.priceRange}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold group-hover:text-rose-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-200 line-clamp-1 mt-1 font-light opacity-90">
                    {cat.tagline}
                  </p>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                    Signature Highlights
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                    {cat.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    {cat.itemCount}+ Hand-Crafted Gifts
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory(cat.categoryFilter);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:text-rose-500 transition-colors uppercase tracking-wider"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Box Banner Callout */}
        <div className="rounded-3xl bg-stone-900 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-stone-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold text-rose-400">
              Personalized Presentation
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
              Can't Decide on a Single Category?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Combine artisan chocolates, custom engraved glassware, and preserved botanical roses into one single bespoke Blush Box. Inquire with our concierge for custom combinations.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, category: 'all', occasion: 'all', recipient: 'all', budget: '' }));
                  navigate('shop');
                }}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer"
              >
                Browse Complete Catalog
              </button>
              <button
                onClick={() => navigate('contact')}
                className="px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold uppercase tracking-widest transition-all border border-stone-700 cursor-pointer"
              >
                Contact Concierge
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
