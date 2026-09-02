import React from 'react';
import HeroSlider from '../components/home/HeroSlider.jsx';
import BrandValues from '../components/home/BrandValues.jsx';
import OccasionsSection from '../components/home/OccasionsSection.jsx';
import FeaturedSlider from '../components/home/FeaturedSlider.jsx';
import RecipientGrid from '../components/home/RecipientGrid.jsx';
import CuratedHampersBanner from '../components/home/CuratedHampersBanner.jsx';
import BudgetExplorer from '../components/home/BudgetExplorer.jsx';
import TestimonialsSlider from '../components/home/TestimonialsSlider.jsx';

export default function HomePage() {
  return (
    <div className="w-full bg-white dark:bg-stone-900 transition-colors duration-200">
      {/* 1. Hero Swiper with GSAP */}
      <HeroSlider />

      {/* 2. Brand Value Pillars */}
      <BrandValues />

      {/* 3. Shop by Occasion Carousel */}
      <OccasionsSection />

      {/* 4. Featured & Best Seller Gifts Swiper */}
      <FeaturedSlider 
        title="Curated Masterpieces & Best Sellers" 
        subtitle="Our most celebrated gift boxes, jewelry heirlooms, and eternal preserved florals."
      />

      {/* 5. Shop by Recipient Bento Grid */}
      <RecipientGrid />

      {/* 6. Curated Hampers & Trunks Editorial Showcase */}
      <CuratedHampersBanner />

      {/* 7. Shop by Budget Explorer (5 Tiers) */}
      <BudgetExplorer />

      {/* 8. Verified Luxury Customer Testimonials */}
      <TestimonialsSlider />
    </div>
  );
}
