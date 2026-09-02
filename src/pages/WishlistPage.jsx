import React from 'react';
import { 
  Heart, 
  ShoppingBag, 
  ArrowRight, 
  Trash2, 
  Sparkles, 
  Eye, 
  Star, 
  PackageCheck,
  PackageX
} from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function WishlistPage() {
  const { 
    wishlist, 
    products, 
    clearWishlist, 
    removeFromWishlist, 
    addToCart, 
    setQuickViewProduct,
    navigate 
  } = useStore();

  // Resolve wishlist items to full product objects
  const resolvedWishlistProducts = wishlist.map(item => {
    if (typeof item === 'object' && item !== null && item.name && item.price !== undefined) {
      return item;
    }
    const id = typeof item === 'object' ? (item._id || item.id) : item;
    return products.find(p => p._id === id || p.id === id || p.slug === id);
  }).filter(Boolean);

  const totalWishlistValue = resolvedWishlistProducts.reduce((sum, p) => {
    const price = p.discountPrice || p.price || 0;
    return sum + price;
  }, 0);

  if (resolvedWishlistProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50/50 dark:bg-stone-950 py-16 px-4 transition-colors">
        <div className="max-w-md w-full text-center bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto border border-rose-100 dark:border-rose-900 shadow-xs">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              You have not saved any bespoke gifts or luxury keepsakes yet. Browse our curated collection to save your favorite treasures.
            </p>
          </div>
          <button
            onClick={() => navigate('shop')}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-stone-900 hover:bg-rose-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const handleAddAllToCart = () => {
    resolvedWishlistProducts.forEach(product => {
      if (product.stock > 0) {
        addToCart(product, 1);
      }
    });
  };

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header with Title & Action Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-amber-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Vault</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
              Saved Gifts &amp; Heirlooms ({resolvedWishlistProducts.length})
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Total Wishlist Value: <span className="font-bold text-stone-900 dark:text-white font-mono">${totalWishlistValue.toFixed(2)}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Clear All Wishlist Button */}
            <button
              onClick={clearWishlist}
              className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Remove all items from wishlist"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Wishlist</span>
            </button>

            {/* Move All in Stock to Cart */}
            <button
              onClick={handleAddAllToCart}
              className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Add All to Cart</span>
            </button>

            {/* Explore Shop */}
            <button
              onClick={() => navigate('shop')}
              className="px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-amber-600 hover:bg-rose-600 dark:hover:bg-amber-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Shop More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Grid of Wishlist Items with Clear Price & Delete Action on Every Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resolvedWishlistProducts.map((product) => {
            const hasDiscount = product.discountPercentage > 0 && product.discountPrice;
            const currentPrice = hasDiscount ? product.discountPrice : product.price;
            const inStock = product.stock > 0;

            return (
              <div 
                key={product._id || product.id || product.slug}
                className="group relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-amber-400/40 dark:hover:border-amber-500/40"
              >
                {/* Image Section */}
                <div className="relative aspect-square w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop"}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 cursor-pointer"
                    onClick={() => navigate('product-details', { slug: product.slug, id: product._id })}
                    loading="lazy"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
                    {hasDiscount && (
                      <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-amber-600 text-white rounded-full shadow-sm">
                        {product.discountPercentage}% OFF
                      </span>
                    )}
                    {product.isPersonalized && (
                      <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-stone-900/85 text-amber-300 backdrop-blur-sm rounded-full shadow-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Engravable
                      </span>
                    )}
                  </div>

                  {/* Individual Delete / Remove Button on image */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(product._id || product.id);
                    }}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 dark:bg-stone-900/90 text-stone-600 dark:text-stone-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-400 shadow-md transition-all duration-200 z-20 cursor-pointer"
                    title="Remove from wishlist"
                    aria-label="Remove item from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
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

                {/* Product Info & Price */}
                <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    {/* Category & Stock */}
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400">
                        {product.category || 'Luxury Gift'}
                      </span>
                      <span className={`flex items-center gap-1 text-[10px] font-medium ${inStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                        {inStock ? (
                          <>
                            <PackageCheck className="w-3 h-3" /> In Stock
                          </>
                        ) : (
                          <>
                            <PackageX className="w-3 h-3" /> Out of Stock
                          </>
                        )}
                      </span>
                    </div>

                    {/* Product Title */}
                    <h3 
                      onClick={() => navigate('product-details', { slug: product.slug, id: product._id })}
                      className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 line-clamp-1 hover:text-rose-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
                    >
                      {product.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                      {product.shortDescription || product.description}
                    </p>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </div>
                      <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
                        {product.rating?.toFixed(1) || "5.0"}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        ({product.reviewsCount || product.reviews?.length || 0})
                      </span>
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3">
                    
                    {/* Price Display */}
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">
                        Price
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-stone-900 dark:text-stone-100 font-mono">
                          ${Number(currentPrice).toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-stone-400 line-through font-mono">
                            ${Number(product.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Delete from Wishlist & Add to Cart */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Delete Button */}
                      <button
                        onClick={() => removeFromWishlist(product._id || product.id)}
                        className="w-full py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Delete product from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => addToCart(product, 1)}
                        disabled={!inStock}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          !inStock
                            ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                            : 'bg-stone-900 dark:bg-amber-600 text-white hover:bg-amber-600 dark:hover:bg-amber-500 active:scale-95'
                        }`}
                        title={inStock ? "Add to cart" : "Out of stock"}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

