import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Gift, 
  Check, 
  ArrowRight, 
  MessageSquare, 
  ChevronRight, 
  Share2, 
  Award,
  Clock
} from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { GIFT_WRAPPING_OPTIONS } from '../constants/index.js';
import ProductCard from '../components/products/ProductCard.jsx';
import { LuxuryInlineLoader } from '../components/common/LuxuryLoader.jsx';

export default function ProductDetailsPage({ slug, id }) {
  const { 
    products, 
    addToCart, 
    isInWishlist, 
    toggleWishlist, 
    navigate,
    showToast,
    user 
  } = useStore();

  const [productData, setProductData] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customEngraving, setCustomEngraving] = useState('');
  const [giftCardMessage, setGiftCardMessage] = useState('');
  const [selectedWrapping, setSelectedWrapping] = useState(GIFT_WRAPPING_OPTIONS[0]);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'packaging' | 'specs' | 'shipping'
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const queryId = id || slug;
        const res = await fetch(`/api/products/${queryId}`);
        const data = await res.json();
        if (data.success) {
          setProductData(data.product);
          setRelatedProducts(data.related || []);
          setReviews(data.reviews || []);
        } else {
          // fallback to local store
          const found = products.find(p => p._id === queryId || p.slug === queryId);
          if (found) {
            setProductData(found);
            setRelatedProducts(products.filter(p => p._id !== found._id && p.category === found.category).slice(0, 4));
          }
        }
      } catch (e) {
        console.error("Failed to load product details:", e);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug, id, products]);

  if (loading) {
    return (
      <div className="min-h-screen py-32 flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <LuxuryInlineLoader text="Retrieving bespoke gift presentation & details..." />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen py-20 text-center bg-stone-50 dark:bg-stone-950 px-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">Product Not Found</h2>
        <button 
          onClick={() => navigate('shop')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-amber-600 text-white text-xs font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isLiked = isInWishlist(productData._id);
  const currentPrice = productData.discountPrice || productData.price;
  const discount = productData.discountPercentage > 0;

  const handleAddToCart = () => {
    addToCart(productData, quantity, {
      customText: customEngraving,
      giftMessage: giftCardMessage,
      wrappingOption: selectedWrapping
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Bespoke product link copied to clipboard.");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productData._id,
          userName: user?.name || "Verified Connoisseur",
          userEmail: user?.email || "guest@lumiere.com",
          rating: newRating,
          title: newTitle,
          comment: newComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => [data.review, ...prev]);
        setNewTitle('');
        setNewComment('');
        showToast("Thank you. Your review has been recorded.");
      }
    } catch (err) {
      showToast("Failed to submit review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb Bar */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-8">
          <div className="flex items-center gap-2 truncate">
            <button onClick={() => navigate('home')} className="hover:text-amber-600">Home</button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => navigate('shop')} className="hover:text-amber-600">{productData.category}</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-stone-900 dark:text-white font-semibold truncate max-w-[200px]">{productData.name}</span>
          </div>

          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 hover:text-amber-600"
          >
            <Share2 className="w-3.5 h-3.5" /> Share Gift
          </button>
        </div>

        {/* Top Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white dark:bg-stone-900 p-6 sm:p-10 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm">
          
          {/* Left: Gallery (5 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 relative shadow-inner">
              <img
                src={productData.images?.[selectedImgIdx] || productData.images?.[0]}
                alt={productData.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />

              {discount && (
                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase bg-amber-600 text-white rounded-full shadow-md">
                  {productData.discountPercentage}% OFF
                </span>
              )}

              <button
                onClick={() => toggleWishlist(productData)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                  isLiked 
                    ? 'bg-rose-50 text-rose-500 scale-105' 
                    : 'bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:text-rose-500'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {productData.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productData.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
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

          {/* Right: Customization & Actions (7 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & Tags */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-100/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
                  {productData.category}
                </span>
                {productData.occasions?.[0] && (
                  <span className="text-xs text-stone-400 font-medium">
                    Perfect for {productData.occasions[0]}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white leading-tight">
                {productData.name}
              </h1>

              {/* Star Rating & SKU */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(productData.rating || 5) ? 'fill-amber-400' : 'text-stone-300'}`} />
                  ))}
                  <span className="font-bold text-stone-900 dark:text-stone-100 ml-1">
                    {productData.rating?.toFixed(1) || "5.0"}
                  </span>
                  <span className="text-stone-400">
                    ({reviews.length} Client Testimonials)
                  </span>
                </div>
                <span className="text-stone-300">•</span>
                <span className="text-stone-400 font-mono">SKU: {productData.sku || "LUM-9842"}</span>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-4 py-2 border-y border-stone-100 dark:border-stone-800">
                <span className="text-4xl font-bold text-stone-900 dark:text-white">
                  ${currentPrice}
                </span>
                {discount && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-stone-400 line-through">
                      ${productData.price}
                    </span>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                      Save ${(productData.price - currentPrice).toFixed(2)}
                    </span>
                  </div>
                )}
                <span className="ml-auto text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Ready for Dispatch ({productData.stock} units)
                </span>
              </div>

              {/* Description summary */}
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-light">
                {productData.description}
              </p>

              {/* Laser Engraving / Monogram Simulator Input */}
              {productData.isPersonalized && (
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" /> Complimentary Master Laser Engraving
                    </span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">Included ($35 Value)</span>
                  </div>
                  <input
                    type="text"
                    maxLength={45}
                    value={customEngraving}
                    onChange={(e) => setCustomEngraving(e.target.value)}
                    placeholder={productData.personalizationPlaceholder || "Enter custom monogram, names or anniversary date"}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                  />
                  {customEngraving && (
                    <div className="p-2 rounded-lg bg-stone-900 text-amber-400 font-serif text-center text-xs tracking-widest border border-amber-500/40">
                      Engraving Preview: <span className="font-bold underline italic">{customEngraving}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Gift Presentation Box Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-amber-600" /> Signature Velvet Presentation Box:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GIFT_WRAPPING_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedWrapping(opt)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all flex items-center justify-between ${
                        selectedWrapping?.id === opt.id
                          ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 font-bold shadow-sm'
                          : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                      }`}
                    >
                      <span className="truncate pr-1">{opt.name}</span>
                      <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold flex-shrink-0">
                        {opt.price > 0 ? `+$${opt.price}` : 'Free'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Handwritten Card Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-600" /> Gold-Embossed Handwritten Note:
                </label>
                <textarea
                  rows={2}
                  maxLength={200}
                  value={giftCardMessage}
                  onChange={(e) => setGiftCardMessage(e.target.value)}
                  placeholder="Write your personal gift message to be inscribed in calligraphy on 300gsm cotton rag cardstock..."
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white placeholder-stone-400 resize-none"
                />
              </div>

            </div>

            {/* Actions: Quantity, Add to Cart, Buy Now */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800 px-3 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 text-sm font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-stone-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(productData.stock, quantity + 1))}
                    className="px-2 text-sm font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={productData.stock <= 0}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-stone-900 dark:bg-amber-600 hover:bg-rose-600 dark:hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Bespoke Cart
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(productData)}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer shadow-sm ${
                    isInWishlist(productData._id)
                      ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:border-rose-800'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-rose-500 hover:bg-rose-50/50'
                  }`}
                  title={isInWishlist(productData._id) ? "Remove from wishlist" : "Add to wishlist"}
                  aria-label="Toggle Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(productData._id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={productData.stock <= 0}
                  className="py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Delivery Assurance */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-amber-600" /> Complimentary 2-Day Priority</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Happiness Guarantee</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Specification & Unboxing Experience */}
        <div className="mt-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-6 sm:p-10 shadow-sm">
          
          {/* Tab Headers */}
          <div className="flex border-b border-stone-200 dark:border-stone-800 gap-4 sm:gap-8 overflow-x-auto pb-4">
            <button
              onClick={() => setActiveTab('description')}
              className={`text-sm font-bold uppercase tracking-wider transition-colors pb-2 relative whitespace-nowrap ${
                activeTab === 'description' 
                  ? 'text-amber-700 dark:text-amber-400' 
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Description &amp; Heritage
              {activeTab === 'description' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-600" />}
            </button>

            <button
              onClick={() => setActiveTab('packaging')}
              className={`text-sm font-bold uppercase tracking-wider transition-colors pb-2 relative whitespace-nowrap ${
                activeTab === 'packaging' 
                  ? 'text-amber-700 dark:text-amber-400' 
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              The Unboxing Ceremony
              {activeTab === 'packaging' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-600" />}
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`text-sm font-bold uppercase tracking-wider transition-colors pb-2 relative whitespace-nowrap ${
                activeTab === 'specs' 
                  ? 'text-amber-700 dark:text-amber-400' 
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Artisan Specifications
              {activeTab === 'specs' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-600" />}
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`text-sm font-bold uppercase tracking-wider transition-colors pb-2 relative whitespace-nowrap ${
                activeTab === 'shipping' 
                  ? 'text-amber-700 dark:text-amber-400' 
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Courier &amp; Guarantee
              {activeTab === 'shipping' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-600" />}
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-6 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-light">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p>{productData.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                    <h4 className="font-serif font-bold text-stone-900 dark:text-white mb-1">Recommended Occasions</h4>
                    <p className="text-xs text-stone-500">{(productData.occasions || ['Anniversaries', 'Milestones', 'Birthdays']).join(', ')}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                    <h4 className="font-serif font-bold text-stone-900 dark:text-white mb-1">Ideal Recipients</h4>
                    <p className="text-xs text-stone-500">{(productData.recipients || ['For Her', 'For Couples', 'Executive VIPs']).join(', ')}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'packaging' && (
              <div className="space-y-4">
                <p>
                  At Blush Box, the packaging is not merely wrapping—it is an indelible sensory overture. Each item is cradled in custom tissue paper, nested in our signature blush presentation keepsake box, wrapped in a double-faced satin ribbon, and finished with a gold-foiled monogram card.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 text-center space-y-1">
                    <Award className="w-5 h-5 text-rose-600 mx-auto" />
                    <h5 className="font-bold text-stone-900 dark:text-white">Gold Foil Crest</h5>
                    <p className="text-[11px] text-stone-400">Embossed with the Blush Box seal</p>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 text-center space-y-1">
                    <Gift className="w-5 h-5 text-rose-600 mx-auto" />
                    <h5 className="font-bold text-stone-900 dark:text-white">Blush Keepsake Box</h5>
                    <p className="text-[11px] text-stone-400">Re-usable luxury keepsake storage</p>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 text-center space-y-1">
                    <Sparkles className="w-5 h-5 text-rose-600 mx-auto" />
                    <h5 className="font-bold text-stone-900 dark:text-white">Calligraphy Note</h5>
                    <p className="text-[11px] text-stone-400">Hand-inscribed with your message</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                    <span className="font-semibold text-stone-900 dark:text-white">Artisan Category</span>
                    <span>{productData.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                    <span className="font-semibold text-stone-900 dark:text-white">SKU Identifier</span>
                    <span className="font-mono">{productData.sku || "LUM-9842"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                    <span className="font-semibold text-stone-900 dark:text-white">Personalization Support</span>
                    <span>{productData.isPersonalized ? "Yes (Fiber-Laser Precision)" : "Standard Curation"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                    <span className="font-semibold text-stone-900 dark:text-white">Inventory Status</span>
                    <span className="text-emerald-600 font-bold">{productData.stock} available</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                    <span className="font-semibold text-stone-900 dark:text-white">Packaging Dimensions</span>
                    <span>14" x 10" x 6" Custom Trunk</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                    <span className="font-semibold text-stone-900 dark:text-white">Craft Origin</span>
                    <span>European Master Workshops</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3">
                <p>
                  We provide guaranteed white-glove dispatch with real-time tracking links sent via email and SMS. Confectionery and delicate florals are shipped in insulated temperature-regulated transit boxes.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Complimentary Express shipping on all orders over $150.</li>
                  <li>Same-day courier dispatch for orders placed before 2:00 PM EST.</li>
                  <li>100% White-Glove Guarantee: If anything arrives less than flawless, we replace it immediately.</li>
                </ul>
              </div>
            )}
          </div>

        </div>

        {/* Customer Reviews & Write Review Section */}
        <div className="mt-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
                Client Testimonials &amp; Reviews
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Verified impressions from patrons who gifted this heirloom.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl font-bold text-stone-900 dark:text-white">
                  {productData.rating?.toFixed(1) || "5.0"}
                </span>
                <span className="text-xs text-stone-400"> / 5.0</span>
              </div>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Write a Review Form */}
          <form onSubmit={handleSubmitReview} className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-4">
            <h4 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              Share Your Gifting Experience
            </h4>

            {/* Rating Stars Input */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-600 dark:text-stone-400 font-semibold">Your Rating:</span>
              <div className="flex text-amber-400 gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-stone-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Review title (e.g., 'Exceeded every expectation for our anniversary')"
              className="w-full px-3.5 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
            />

            <textarea
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Describe the recipient's reaction, presentation quality, and unboxing delight..."
              className="w-full px-3.5 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
            />

            <button
              type="submit"
              disabled={submittingReview || !newComment.trim()}
              className="px-6 py-2.5 bg-stone-900 dark:bg-amber-600 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {submittingReview ? "Submitting..." : "Submit Testimonial"}
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-4 pt-2">
            {reviews.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No reviews recorded yet for this piece. Be the first to review!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-600/20 text-amber-600 font-bold text-xs flex items-center justify-center">
                        {rev.userName?.charAt(0) || "G"}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-900 dark:text-white">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="ml-2 text-[10px] text-emerald-600 font-medium">✓ Verified Gift Purchaser</span>
                        )}
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {rev.title && <h5 className="font-serif text-xs font-bold text-stone-900 dark:text-stone-100">{rev.title}</h5>}
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{rev.comment}</p>
                  <span className="text-[10px] text-stone-400 block pt-1">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Related Gifts Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
                  Frequently Gifted Together
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Complementary luxuries curated to accompany {productData.name}.
                </p>
              </div>
              <button 
                onClick={() => navigate('shop')}
                className="text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline"
              >
                View Full Catalog →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
