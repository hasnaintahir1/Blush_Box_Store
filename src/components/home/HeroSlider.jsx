import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { Sparkles, ArrowRight, Gift, ShieldCheck, Heart } from 'lucide-react';
import gsap from 'gsap';
import { useStore } from '../../context/StoreContext.jsx';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HERO_SLIDES = [
  {
    id: 1,
    tagline: "The Signature Blush Box Experience",
    title: "Unforgettable Gifting, Crafted with Love",
    description: "Bespoke gift hampers, personalized keepsakes, and preserved eternal florals packaged inside our signature luxury blush boxes with double-faced satin ribbon.",
    buttonText: "Explore Collection",
    buttonAction: "shop",
    secondaryText: "Custom Hampers",
    secondaryAction: "hampers",
    badge: "Valentine's & Celebration Season",
    bgImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1600&auto=format&fit=crop"
  },
  {
    id: 2,
    tagline: "Curated Gourmet & Celebration Hampers",
    title: "Moments Worth Celebrating",
    description: "Artisan Belgian chocolates, champagne flutes, single-origin teas, and fiber-laser personalized keepsake accessories inside heirloom Blush Box trunks.",
    buttonText: "Shop Luxury Hampers",
    buttonAction: "hampers",
    secondaryText: "Personalized Pieces",
    secondaryAction: "jewelry",
    badge: "Curated Reserves",
    bgImage: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1600&auto=format&fit=crop"
  },
  {
    id: 3,
    tagline: "Eternal Preserved Florals & Fine Jewelry",
    title: "Feelings That Last Forever",
    description: "Preserved Ecuadorian roses in glass domes paired with solid gold heirloom pendants, presented in hand-crafted velvet Blush Box packaging.",
    buttonText: "Discover Heirlooms",
    buttonAction: "jewelry",
    secondaryText: "Corporate Gifting",
    secondaryAction: "contact",
    badge: "Lifetime Keepsakes",
    bgImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop"
  }
];

export default function HeroSlider() {
  const { navigate, setFilters } = useStore();
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-content-anim", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleCTA = (action) => {
    if (action === 'hampers') {
      setFilters(prev => ({ ...prev, category: 'Gift Hampers' }));
      navigate('shop');
    } else if (action === 'jewelry') {
      setFilters(prev => ({ ...prev, category: 'Jewelry' }));
      navigate('shop');
    } else if (action === 'contact') {
      navigate('contact');
    } else {
      navigate('shop');
    }
  };

  return (
    <div ref={heroRef} className="relative w-full overflow-hidden bg-stone-950">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect={'fade'}
        speed={1000}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        className="w-full h-[580px] sm:h-[650px] lg:h-[720px]"
      >
        {HERO_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full flex items-center">
              
              {/* Background Image with Cinematic Dark Gradient */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 scale-105"
                style={{ backgroundImage: `url('${slide.bgImage}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30 backdrop-brightness-75" />
              </div>

              {/* Slide Content Box */}
              <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full z-10">
                <div className="max-w-2xl text-left space-y-5">
                  
                  {/* Category Pill Tag */}
                  <div className="hero-content-anim inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-semibold tracking-widest uppercase backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                    <span>{slide.badge}</span>
                  </div>

                  <p className="hero-content-anim text-xs uppercase tracking-[0.25em] text-rose-400 font-bold">
                    {slide.tagline}
                  </p>

                  <h1 className="hero-content-anim font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15]">
                    {slide.title}
                  </h1>

                  <p className="hero-content-anim text-sm sm:text-base text-stone-300 font-light leading-relaxed max-w-xl">
                    {slide.description}
                  </p>

                  {/* Dual Call to Actions */}
                  <div className="hero-content-anim pt-2 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => handleCTA(slide.buttonAction)}
                      className="px-7 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs uppercase tracking-widest transition-all duration-200 shadow-xl flex items-center gap-2 hover:translate-x-1 cursor-pointer"
                    >
                      <span>{slide.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleCTA(slide.secondaryAction || 'shop')}
                      className="px-6 py-3.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-100 border border-stone-700 font-semibold text-xs uppercase tracking-widest transition-all backdrop-blur-sm flex items-center gap-2 cursor-pointer"
                    >
                      <span>{slide.secondaryText}</span>
                    </button>
                  </div>

                  {/* Trust Signals */}
                  <div className="hero-content-anim pt-4 flex items-center gap-6 text-[11px] text-stone-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-rose-400" /> Complimentary Blush Box Packaging
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Delight Guarantee
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
