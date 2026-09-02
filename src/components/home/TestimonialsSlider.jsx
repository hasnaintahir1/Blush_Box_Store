import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star, Quote, CheckCircle2, Heart } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Lady Penelope Ashworth",
    role: "Art Collector & Philanthropist",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    giftOrdered: "Royal Blush & Champagne Celebration Box",
    text: "Blush Box transformed my sister's 40th birthday into pure wonder. The signature blush packaging was so luxurious, and the custom engraved flutes were breathtaking. Simply peerless."
  },
  {
    id: 2,
    name: "Jonathan Vance, Esq.",
    role: "Managing Director, Global Capital",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    giftOrdered: "Personalized Italian Full-Grain Leather Valet Tray",
    text: "We ordered 45 custom monogrammed leather boxes for our executive retreat. Every single partner was amazed at the leather aroma, the gold foil presentation, and the pristine handwritten cards."
  },
  {
    id: 3,
    name: "Elena Rostova",
    role: "Interior Architect",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    giftOrdered: "Grand Eternal Rose Conservatory Dome",
    text: "My fiancé gave me the Eternal Rose Dome for our anniversary, and months later it still looks as if it was hand-plucked this morning. The Blush Box unboxing is unforgettable."
  },
  {
    id: 4,
    name: "Dr. Marcus Sterling",
    role: "Chief of Surgery",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    giftOrdered: "Artisan Belgian Truffles & Keepsake Set",
    text: "The concierge team helped me pick this for my mentor's retirement. Delivered in a pristine temperature-controlled package right to his estate. Truly white-glove service."
  }
];

export default function TestimonialsSlider() {
  return (
    <section className="py-20 bg-stone-50/80 dark:bg-stone-900/50 border-b border-stone-200/60 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            <Quote className="w-3.5 h-3.5" />
            <span>Words of Delight</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
            Celebrated by Discerning Givers
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Read reflections from clients who have delighted partners, mentors, and loved ones with Blush Box keepsakes.
          </p>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="pb-12"
        >
          {TESTIMONIALS.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="h-full p-8 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 shadow-sm flex flex-col justify-between space-y-6">
                
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Recipient
                    </span>
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-light leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-stone-100 dark:border-stone-700 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border border-amber-500/40"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-white truncate">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                      {t.role}
                    </p>
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium truncate mt-0.5">
                      Gifting: {t.giftOrdered}
                    </p>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}
