import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Sparkles, Check, Gift, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { GIFT_WRAPPING_OPTIONS } from '../../constants/index.js';

export default function QuickViewModal() {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    isInWishlist, 
    toggleWishlist,
    navigate 
  } = useStore();

  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');
  const [selectedWrapping, setSelectedWrapping] = useState(GIFT_WRAPPING_OPTIONS[0]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isLiked = isInWishlist(product._id);
  const currentPrice = product.discountPrice || product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, {
      customText,
      wrappingOption: selectedWrapping
    });
    setQuickViewProduct(null);
  };

  const handleFullDetails = () => {
    setQuickViewProduct(null);
    navigate('product-details', { slug: product.slug, id: product._id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[90vh] flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 z-30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Media Gallery */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-stone-50 dark:bg-stone-950/40 border-b md:border-b-0 md:border-r border-stone-100 dark:border-stone-800">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 relative shadow-inner">
            <img
              src={product.images?.[selectedImgIdx] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold uppercase bg-amber-600 text-white rounded-full">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImgIdx === idx 
                      ? 'border-amber-600 scale-105 shadow-md' 
                      : 'border-stone-200 dark:border-stone-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Customization & Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto max-h-[80vh] flex flex-col justify-between">
          <div>
            {/* Header tags */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
              <span>{product.category}</span>
              <span>•</span>
              <span className="text-stone-400">{product.subcategory || "Haute Edition"}</span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white leading-tight">
              {product.name}
            </h2>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400' : 'text-stone-300'}`} />
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                {product.rating?.toFixed(1) || "5.0"}
              </span>
              <span className="text-xs text-stone-400">
                ({product.reviewsCount || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold text-stone-900 dark:text-white">
                ${currentPrice}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-lg text-stone-400 line-through">
                  ${product.price}
                </span>
              )}
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold ml-auto flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units ready)
              </span>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
              {product.description}
            </p>

            {/* Custom Engraving / Personalization option */}
            {product.isPersonalized && (
              <div className="mt-5 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    Complimentary Custom Engraving / Monogram
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={40}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={product.personalizationPlaceholder || "Enter initials, name, or custom date (e.g., 'E & J • 10.14.26')"}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white placeholder-stone-400"
                />
                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                  Precision fiber-laser engraving with gold foil inlay by our master jewelers.
                </p>
              </div>
            )}

            {/* Gift Box Selection */}
            <div className="mt-4">
              <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block mb-2 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-600" /> Select Bespoke Presentation Box:
              </label>
              <select
                value={selectedWrapping?.id}
                onChange={(e) => {
                  const opt = GIFT_WRAPPING_OPTIONS.find(o => o.id === e.target.value);
                  setSelectedWrapping(opt);
                }}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 dark:text-stone-200"
              >
                {GIFT_WRAPPING_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name} {opt.price > 0 ? `(+$${opt.price})` : '(Complimentary)'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
            <div className="flex items-center gap-3">
              
              {/* Quantity Selector */}
              <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800 px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-1 text-sm font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-stone-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-2 py-1 text-sm font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3 px-4 rounded-xl bg-stone-900 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Bespoke Cart
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border border-stone-200 dark:border-stone-700 transition-colors ${
                  isLiked ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-500' : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* View Full Product Link */}
            <button
              onClick={handleFullDetails}
              className="w-full text-center text-xs text-amber-700 dark:text-amber-400 hover:underline font-semibold"
            >
              View Full Details, Artisan Specs &amp; Customer Reviews →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
