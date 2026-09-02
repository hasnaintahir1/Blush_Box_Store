import React from 'react';
import { Heart, Eye, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function ProductCard({ product }) {
  const { 
    isInWishlist, 
    toggleWishlist, 
    addToCart, 
    setQuickViewProduct,
    navigate 
  } = useStore();

  if (!product) return null;

  const isLiked = isInWishlist(product._id);
  const discount = product.discountPercentage > 0;
  const currentPrice = product.discountPrice || product.price;

  const handleCardClick = () => {
    navigate('product-details', { slug: product.slug, id: product._id });
  };

  return (
    <div 
      className="group relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:border-amber-400/40 dark:hover:border-amber-500/40"
    >
      {/* Image Container with Badges & Hover Actions */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100 dark:bg-stone-800 cursor-pointer" onClick={handleCardClick}>
        <img
          src={product.images?.[0] || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop"}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Secondary hover image preview if available */}
        {product.images?.[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
            loading="lazy"
          />
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {discount && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-amber-600 text-white rounded-full shadow-sm">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isPersonalized && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-stone-900/85 text-amber-300 backdrop-blur-sm rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Engravable
            </span>
          )}
          {product.isBestSeller && !discount && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-emerald-700 text-white rounded-full shadow-sm">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-20 ${
            isLiked 
              ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-500 shadow-md scale-110' 
              : 'bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-800 hover:text-rose-500 shadow-sm'
          }`}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick View Button */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-full py-2 px-3 bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-white rounded-xl text-xs font-semibold shadow-lg hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 transition-colors flex items-center justify-center gap-1.5 backdrop-blur-sm cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Occasion tag */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
            <span className="uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400">
              {product.category}
            </span>
            {product.occasions?.[0] && (
              <span className="truncate max-w-[110px] text-stone-400">{product.occasions[0]}</span>
            )}
          </div>

          {/* Product Title */}
          <h3 
            onClick={handleCardClick}
            className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1 leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Price & Add to Cart footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-stone-900 dark:text-stone-100">
                ${currentPrice}
              </span>
              {discount && (
                <span className="text-xs text-stone-400 line-through">
                  ${product.price}
                </span>
              )}
            </div>
            
            {/* Star Rating */}
            <div className="flex items-center gap-1 mt-0.5">
              <div className="flex text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
              </div>
              <span className="text-[11px] font-medium text-stone-600 dark:text-stone-400">
                {product.rating?.toFixed(1) || "5.0"}
              </span>
              <span className="text-[10px] text-stone-400">
                ({product.reviewsCount || 0})
              </span>
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer ${
              product.stock <= 0
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                : 'bg-stone-900 dark:bg-amber-600 text-white hover:bg-amber-600 dark:hover:bg-amber-500 shadow-sm active:scale-95'
            }`}
            aria-label="Add to cart"
            title="Add to bespoke cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
