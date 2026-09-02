import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { OCCASIONS } from '../constants/index.js';
import { 
  Cake, HeartHandshake, Sparkles, Heart, Smile, Briefcase, 
  Building2, GraduationCap, Home, Award, Baby, Crown,
  ArrowRight, Calendar, Gift, Check, Clock
} from 'lucide-react';

const OCCASION_ICONS = {
  Cake, HeartHandshake, Sparkles, Heart, Smile, Briefcase,
  Building2, GraduationCap, Home, Award, Baby, Crown
};

const OCCASION_DETAILS = {
  "Birthday Gifts": {
    tag: "Celebration",
    description: "Make milestone birthdays truly unforgettable with artisan champagne, gold foil cards, and personalized treats.",
    popularGift: "Royal Blush & Champagne Hamper",
    leadTime: "Same-Day Dispatch"
  },
  "Wedding Gifts": {
    tag: "Eternal Love",
    description: "Honour the bride & groom with customized monogrammed crystal champagne flutes and keepsake trunks.",
    popularGift: "Monogrammed Crystal Flute Set",
    leadTime: "Complimentary Engraving"
  },
  "Anniversary Gifts": {
    tag: "Milestone",
    description: "Celebrate cherished years together with long-lasting preserved roses and Italian leather accessories.",
    popularGift: "Grand Eternal Rose Conservatory Dome",
    leadTime: "Lasts 365+ Days"
  },
  "Valentine's Gifts": {
    tag: "Romantic",
    description: "Intimate sensory gestures, Belgian dark chocolate truffles, and sensual French candle essences.",
    popularGift: "Sweet Indulgence Blush Truffle Chest",
    leadTime: "Temperature-Controlled"
  },
  "Mother's Day Gifts": {
    tag: "Cherished Mom",
    description: "Give her the serenity she deserves with pure Mongolian cashmere and organic botanical bath rituals.",
    popularGift: "Mongolian Cashmere Silk Sanctuary",
    leadTime: "Signature Keepsake Box"
  },
  "Father's Day Gifts": {
    tag: "Distinguished",
    description: "Handcrafted Italian leather valet trays, solid brass hardware, and single malt tasting companions.",
    popularGift: "Personalized Italian Leather Valet Tray",
    leadTime: "Laser Monogrammed"
  },
  "Corporate Gifts": {
    tag: "VIP Executive",
    description: "Premium corporate gifts for valued clients, executive retreats, board promotions, and partnership milestones.",
    popularGift: "Executive Cognac & Truffle Keepsake",
    leadTime: "Bulk Custom Branding"
  },
  "Graduation Gifts": {
    tag: "Achievement",
    description: "Commemorate hard work and academic triumph with heirloom desk accessories and celebration toasts.",
    popularGift: "Heirloom Brass Desk Organizer",
    leadTime: "Express Delivery"
  },
  "New Home Gifts": {
    tag: "Housewarming",
    description: "Warm their new sanctuary with artisanal soy candles, organic olive oil reserves, and linen throws.",
    popularGift: "Sanctuary Botanicals & Home Diffuser Set",
    leadTime: "Gift Wrapped"
  },
  "Thank You Gifts": {
    tag: "Gratitude",
    description: "Express your deepest gratitude with curated gourmet delicacies and handwritten calligraphy notes.",
    popularGift: "Gourmet Artisan Preserve & Honey Set",
    leadTime: "Hand-Inscribed Note"
  },
  "Baby Gifts": {
    tag: "New Arrival",
    description: "Welcome the precious new arrival with organic cotton heirlooms and cherished memory boxes.",
    popularGift: "Organic Cashmere Baby Keepsake Box",
    leadTime: "Hypoallergenic"
  },
  "Luxury Gifts": {
    tag: "Masterpiece",
    description: "Unparalleled grandeur featuring limited-edition vintages, 24k gold leaf accents, and velvet trunks.",
    popularGift: "Haute Prestige Gold & Truffle Trunk",
    leadTime: "White-Glove Courier"
  }
};

export default function OccasionsPage() {
  const { navigate, setFilters } = useStore();
  const [selectedTag, setSelectedTag] = useState('All');

  const tags = ['All', 'Romantic', 'Celebration', 'Milestone', 'VIP Executive', 'Cherished Mom', 'Distinguished'];

  const handleSelectOccasion = (occasionName) => {
    setFilters(prev => ({
      ...prev,
      occasion: occasionName,
      category: 'all',
      recipient: 'all',
      budget: ''
    }));
    navigate('shop');
  };

  const filteredOccasions = selectedTag === 'All' 
    ? OCCASIONS 
    : OCCASIONS.filter(occ => OCCASION_DETAILS[occ.name]?.tag === selectedTag);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header & Breadcrumbs */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <button onClick={() => navigate('home')} className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">Home</button>
            <span>/</span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold uppercase tracking-wider">Occasions</span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            Milestones &amp; Life Celebrations
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white leading-tight">
            Gifts for Every Special Occasion
          </h1>
          
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-light leading-relaxed">
            Whether toasting a diamond anniversary, welcoming a new life, or celebrating executive milestones, find gifts curated with emotional intention.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-rose-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Occasions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredOccasions.map((occ) => {
            const IconComponent = OCCASION_ICONS[occ.icon] || Gift;
            const details = OCCASION_DETAILS[occ.name] || {
              tag: "Celebration",
              description: "Curated gift box crafted for this wonderful milestone.",
              popularGift: "Signature Blush Gift Set",
              leadTime: "Next-Day Delivery"
            };

            return (
              <div
                key={occ.id}
                onClick={() => handleSelectOccasion(occ.name)}
                className="group bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
              >
                {/* Visual Header */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={occ.image}
                    alt={occ.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Floating Icon & Tag */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-rose-600 flex items-center justify-center shadow-md">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                      {details.tag}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {details.leadTime}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold group-hover:text-rose-300 transition-colors">
                      {occ.name}
                    </h3>
                  </div>
                </div>

                {/* Description & Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                    {details.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                      Curator's Top Pick
                    </span>
                    <p className="text-xs font-semibold text-stone-900 dark:text-white truncate">
                      {details.popularGift}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-stone-100 dark:border-stone-800">
                    <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                      Personalized Delivery Date Ready
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectOccasion(occ.name);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:text-rose-500 transition-colors uppercase tracking-wider"
                    >
                      <span>Shop Gifts</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestone Date Scheduling Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-rose-900 via-stone-900 to-stone-950 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-rose-900/40">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-rose-300">
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>Future Milestone Booking</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
              Order Today, Dispatch on Their Exact Big Day
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Never miss a birthday or anniversary again. During checkout, select any future calendar date and our concierge will ensure hand-delivery exactly when it matters most.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, category: 'all', occasion: 'all', recipient: 'all', budget: '' }));
                  navigate('shop');
                }}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <span>Browse All Gifts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
