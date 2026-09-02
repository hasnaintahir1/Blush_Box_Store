import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Sparkles, ArrowRight, Award } from 'lucide-react';
import ProductCard from '../products/ProductCard.jsx';
import { useStore } from '../../context/StoreContext.jsx';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function FeaturedSlider({ title = "Masterpiece Gifts & Best Sellers", subtitle = "Hand-selected by our master curators for exceptional craftsmanship and presentation." }) {
  const { products, navigate, setFilters } = useStore();

  const featuredProducts = products.filter(p => p.isFeatured || p.isBestSeller).slice(0, 8);
  const displayItems = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);

  return (
    <section className="py-20 bg-white dark:bg-stone-900 border-b border-stone-200/60 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              <Award className="w-3.5 h-3.5" />
              <span>Curator's Choice</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl">
              {subtitle}
            </p>
          </div>

          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, bestSeller: true, category: 'all' }));
              navigate('shop');
            }}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 group"
          >
            <span>Explore All Featured</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Swiper Product Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1.2}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2.2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="pb-12"
          >
            {displayItems.map((prod) => (
              <SwiperSlide key={prod._id}>
                <ProductCard product={prod} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}
