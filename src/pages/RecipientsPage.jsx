import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { RECIPIENTS } from '../constants/index.js';
import { 
  Heart, Sparkles, User, Users, Briefcase, Smile, 
  ArrowRight, Check, Star, Gift, ShieldCheck
} from 'lucide-react';

const EXTENDED_RECIPIENTS = [
  {
    id: "her",
    name: "Gifts for Her",
    subtitle: "Refined elegance, floral keepsakes & sensory luxury",
    recipientFilter: "Gifts for Her",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    personas: ["The Romantic", "The Connoisseur", "The Wellness Devotee"],
    topGifts: ["Grand Eternal Rose Dome", "18k Gold Vermeil Pendant", "Belgian Truffle Keepsake Box"],
    priceRange: "$45 - $320",
    badge: "Most Popular"
  },
  {
    id: "him",
    name: "Gifts for Him",
    subtitle: "Distinguished craftsmanship, fine Italian leather & barware",
    recipientFilter: "Gifts for Him",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop",
    personas: ["The Gentleman", "The Whiskey Enthusiast", "The Executive"],
    topGifts: ["Italian Leather Valet Tray", "Monogrammed Crystal Flutes", "Executive Truffle Hamper"],
    priceRange: "$55 - $280",
    badge: "Complimentary Engraving"
  },
  {
    id: "mom",
    name: "Gifts for Mom",
    subtitle: "Unconditional warmth, pure cashmere & botanical serenity",
    recipientFilter: "Gifts for Mom",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    personas: ["The Matriarch", "The Garden Lover", "The Heart of the Home"],
    topGifts: ["Mongolian Cashmere Sanctuary", "Preserved Rose Botanical Cloche", "Gourmet Honey & Tea Chest"],
    priceRange: "$65 - $350",
    badge: "Heartfelt Keepsakes"
  },
  {
    id: "dad",
    name: "Gifts for Dad",
    subtitle: "Heritage durability, leather accessories & distinguished tastes",
    recipientFilter: "Gifts for Dad",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=800&auto=format&fit=crop",
    personas: ["The Craftsman", "The Mentor", "The Classicist"],
    topGifts: ["Laser-Etched Leather Travel Roll", "Artisan Single-Malt Companions", "Solid Brass Monogram Keyring"],
    priceRange: "$48 - $240",
    badge: "Heritage Quality"
  },
  {
    id: "couples",
    name: "Gifts for Couples",
    subtitle: "Shared celebrations, milestone toasting flutes & royal hampers",
    recipientFilter: "Gifts for Couples",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop",
    personas: ["Newlyweds", "Anniversary Partners", "New Homeowners"],
    topGifts: ["Royal Blush & Champagne Hamper", "His & Hers Monogram Flutes", "Handmade Olive Wood Board"],
    priceRange: "$95 - $290",
    badge: "Celebration Sets"
  },
  {
    id: "friend",
    name: "Gifts for Best Friends",
    subtitle: "Joyful surprises, artisanal confectionery & custom charms",
    recipientFilter: "Gifts for Friend",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop",
    personas: ["The Confidante", "The Foodie", "The Creative Soul"],
    topGifts: ["Artisan Sweet Indulgence Box", "Personalized Travel Case", "Botanical Scented Soy Candle"],
    priceRange: "$35 - $150",
    badge: "Sweet Surprises"
  },
  {
    id: "executive",
    name: "Executive & VIP Clients",
    subtitle: "Prestigious corporate gifts that leave an enduring impression",
    recipientFilter: "Gifts for Him",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    personas: ["Board Leaders", "Key Partners", "Valued Clients"],
    topGifts: ["Haute Grand Cru Hamper", "Solid Brass Monogram Desk Chest", "Full-Grain Valet & Pen Case"],
    priceRange: "$150 - $450",
    badge: "VIP White Glove"
  },
  {
    id: "host",
    name: "Host & Hostess",
    subtitle: "Gracious hospitality tokens, organic olive oils & ambient aromas",
    recipientFilter: "Gifts for Couples",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
    personas: ["Dinner Hosts", "Party Organizers", "Weekend Retreat Hosts"],
    topGifts: ["Gourmet Reserve Olive Oil & Salt Set", "French Amber Candle Duo", "Belgian Artisan Praline Box"],
    priceRange: "$40 - $160",
    badge: "Gracious Touches"
  }
];

export default function RecipientsPage() {
  const { navigate, setFilters } = useStore();

  const handleSelectRecipient = (recipientName) => {
    setFilters(prev => ({
      ...prev,
      recipient: recipientName,
      category: 'all',
      occasion: 'all',
      budget: ''
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
            <span className="text-rose-600 dark:text-rose-400 font-semibold uppercase tracking-wider">Recipients</span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-widest">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            Gift Guides by Recipient
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white leading-tight">
            Find the Perfect Gift for Every Person in Your Life
          </h1>
          
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-light leading-relaxed">
            Every recipient has their own unique aesthetic, passions, and joys. Explore gift collections thoughtfully customized to celebrate who they are.
          </p>
        </div>

        {/* Recipients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {EXTENDED_RECIPIENTS.map((rec) => (
            <div
              key={rec.id}
              onClick={() => handleSelectRecipient(rec.recipientFilter)}
              className="group bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
            >
              {/* Photo Area */}
              <div className="relative h-60 overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={rec.image}
                  alt={rec.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                
                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                    {rec.badge}
                  </span>
                </div>

                <div className="absolute top-3.5 right-3.5">
                  <span className="px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-semibold">
                    {rec.priceRange}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-serif text-xl font-bold group-hover:text-rose-300 transition-colors">
                    {rec.name}
                  </h3>
                  <p className="text-[11px] text-stone-200 line-clamp-1 font-light opacity-90 mt-0.5">
                    {rec.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Top Gift Picks */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                    Curated Favorites
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                    {rec.topGifts.map((gift, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                        <span className="truncate">{gift}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Personas Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {rec.personas.map((persona, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px] text-stone-600 dark:text-stone-400"
                    >
                      {persona}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    Custom Laser Engraved
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRecipient(rec.recipientFilter);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:text-rose-500 transition-colors uppercase tracking-wider"
                  >
                    <span>Browse</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate VIP Bulk Inquiries Callout */}
        <div className="rounded-3xl bg-stone-900 text-white p-8 sm:p-10 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase tracking-widest font-bold text-rose-400">
              Corporate &amp; Multiple Recipient Orders
            </span>
            <h3 className="font-serif text-2xl font-bold">
              Gifting for 10 to 500+ Recipients?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Our Corporate Concierge makes executive gifting effortless. Upload a spreadsheet of recipient addresses, customize company logo foil debossing, and schedule individual dispatches.
            </p>
          </div>
          <button
            onClick={() => navigate('contact')}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex-shrink-0 cursor-pointer"
          >
            Inquire for Bulk Orders
          </button>
        </div>

      </div>
    </div>
  );
}
