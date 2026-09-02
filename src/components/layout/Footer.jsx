import React, { useState } from 'react';
import { Gift, Sparkles, Mail, Send, Phone, MapPin, ShieldCheck, Truck, RefreshCw, Award, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function Footer() {
  const { navigate, setFilters, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    showToast("Welcome to the Blush Box Club! Your $20 voucher code: BLUSH20");
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-stone-900 text-stone-300 dark:bg-stone-950 dark:text-stone-400 border-t border-stone-800 transition-colors duration-200">
      
      {/* Brand Value Pillars */}
      <div className="border-b border-stone-800 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-rose-950/60 text-rose-400 border border-rose-800/40">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-stone-100">Signature Blush Packaging</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">Each gift is hand-nested inside our iconic soft-touch blush keepsake box with satin ribbon.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-rose-950/60 text-rose-400 border border-rose-800/40">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-stone-100">White-Glove Delivery</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">Temperature-controlled priority dispatch with live milestone notifications.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-rose-950/60 text-rose-400 border border-rose-800/40">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-stone-100">Artisan Engraving &amp; Cards</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">Custom precision monograms, heirlooms, and gold foil embossed handwritten cards.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-rose-950/60 text-rose-400 border border-rose-800/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-stone-100">100% Delight Guarantee</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">If their heart doesn't skip a beat upon opening, our concierge makes it right immediately.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Gift className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-serif tracking-widest text-white">
                BLUSH <span className="text-rose-500 font-light">BOX</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Curators of heartfelt moments and unforgettable gift experiences. At Blush Box, we believe gifting is the purest language of love, celebration, and connection.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs uppercase tracking-wider text-rose-400 font-semibold mb-2">Join the Blush Box Circle</p>
              <p className="text-[11px] text-stone-400 mb-3">Receive early access to seasonal limited editions and bespoke gifting inspirations.</p>
              
              {subscribed ? (
                <div className="p-3 bg-rose-950/40 border border-rose-800/40 rounded-xl text-xs text-rose-200">
                  ✨ Welcome. Use code <span className="font-bold underline text-rose-400">BLUSH20</span> for $20 off your inaugural order.
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex max-w-md">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 px-4 py-2.5 bg-stone-800/80 border border-stone-700 rounded-l-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-r-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Join</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Gifting Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-stone-100 font-semibold mb-4">Gifting Collections</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setFilters(prev => ({ ...prev, category: 'Gift Hampers' })); navigate('shop'); }} className="hover:text-rose-400 transition-colors">
                  Curated Hampers
                </button>
              </li>
              <li>
                <button onClick={() => { setFilters(prev => ({ ...prev, category: 'Personalized Gifts' })); navigate('shop'); }} className="hover:text-rose-400 transition-colors">
                  Personalized Keepsakes
                </button>
              </li>
              <li>
                <button onClick={() => { setFilters(prev => ({ ...prev, category: 'Flowers & Bouquets' })); navigate('shop'); }} className="hover:text-rose-400 transition-colors">
                  Eternal Roses &amp; Florals
                </button>
              </li>
              <li>
                <button onClick={() => { setFilters(prev => ({ ...prev, category: 'Jewelry' })); navigate('shop'); }} className="hover:text-rose-400 transition-colors">
                  Fine Heirloom Jewelry
                </button>
              </li>
              <li>
                <button onClick={() => { setFilters(prev => ({ ...prev, category: 'Chocolates' })); navigate('shop'); }} className="hover:text-rose-400 transition-colors">
                  Belgian Artisan Chocolates
                </button>
              </li>
              <li>
                <button onClick={() => { setFilters(prev => ({ ...prev, category: 'Luxury Gifts' })); navigate('shop'); }} className="hover:text-rose-400 transition-colors">
                  Mongolian Cashmere
                </button>
              </li>
            </ul>
          </div>

          {/* Occasions */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-stone-100 font-semibold mb-4">Special Occasions</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setFilters(prev => ({ ...prev, occasion: 'Wedding Gifts' })); navigate('shop'); }} className="hover:text-rose-400 transition-colors">
                  Wedding Celebrations
                </button>
              </li>
              <li>
                <button onClick={() => { setFilters(prev => ({ ...prev, occasion: 'Anniversary Gifts' })); navigate('shop'); }} className="hover:text-rose-400 transition-colors">
                  Milestone Anniversaries
                </button>
              </li>
              <li>
                <button onClick={() => { setFilters(prev => ({ ...prev, occasion: 'Birthday Gifts' })); navigate('shop'); }} className="hover:text-rose-400 transition-colors">
                  Birthday Treasures
                </button>
              </li>
              <li>
                <button onClick={() => { setFilters(prev => ({ ...prev, occasion: 'Corporate Gifts' })); navigate('shop'); }} className="hover:text-rose-400 transition-colors">
                  Executive Corporate VIP
                </button>
              </li>
              <li>
                <button onClick={() => { setFilters(prev => ({ ...prev, occasion: 'New Home Gifts' })); navigate('shop'); }} className="hover:text-rose-400 transition-colors">
                  Housewarming Gifts
                </button>
              </li>
            </ul>
          </div>

          {/* Concierge & Support */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-stone-100 font-semibold mb-4">Concierge &amp; Care</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-rose-400 transition-colors">
                  Bespoke Inquiries
                </button>
              </li>
              <li>
                <button onClick={() => navigate('profile', { tab: 'orders' })} className="hover:text-rose-400 transition-colors">
                  Order Status &amp; Tracking
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-rose-400 transition-colors">
                  Corporate Bulk Orders
                </button>
              </li>
              <li>
                <button onClick={() => navigate('wishlist')} className="hover:text-rose-400 transition-colors">
                  Saved Wishlist
                </button>
              </li>
              <li className="pt-2 text-[11px] text-stone-400">
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-rose-400" /> +1 (800) 555-BLUSH</p>
                <p className="flex items-center gap-1.5 mt-1"><Mail className="w-3.5 h-3.5 text-rose-400" /> concierge@blushbox.com</p>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Blush Box Luxury Gifting Inc. All Rights Reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Delight Guarantee</span>
            <span>Security Certified (256-Bit SSL)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
