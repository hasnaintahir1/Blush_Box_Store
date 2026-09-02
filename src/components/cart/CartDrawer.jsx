import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, CheckCircle2, ShieldCheck, Gift } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTax, 
    cartGrandTotal, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon,
    navigate 
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 150;
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput) return;
    setCouponLoading(true);
    await applyCoupon(couponInput);
    setCouponLoading(false);
    setCouponInput('');
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    navigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-stone-900 shadow-2xl border-l border-stone-200 dark:border-stone-800 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
                Bespoke Gift Cart
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-xs font-semibold text-stone-600 dark:text-stone-300">
                {cart.reduce((s, it) => s + it.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-amber-50/60 dark:bg-amber-950/20 border-b border-amber-200/50 dark:border-amber-900/30 text-xs">
            {remainingForFreeShipping === 0 ? (
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> You've unlocked Complimentary White-Glove Shipping!
              </p>
            ) : (
              <div>
                <p className="text-stone-700 dark:text-stone-300 mb-1.5">
                  Add <span className="font-bold text-amber-700 dark:text-amber-400">${remainingForFreeShipping.toFixed(2)}</span> more to unlock <span className="font-semibold">Free Express Shipping</span>.
                </p>
                <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-600 dark:bg-amber-500 rounded-full transition-all duration-500" 
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-600 flex items-center justify-center mx-auto">
                  <Gift className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">Your Cart is Empty</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs mx-auto">
                    Discover our handcrafted gift hampers, eternal roses, and bespoke personalized keepsakes.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('shop');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Explore Gift Collections
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const prod = item.product;
                const price = prod.discountPrice || prod.price;
                const wrapPrice = item.wrappingOption?.price || 0;
                const itemTotal = (price + wrapPrice) * item.quantity;

                return (
                  <div 
                    key={`${item.productId}-${index}`}
                    className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 flex gap-3.5"
                  >
                    {/* Item Image */}
                    <img
                      src={prod.images?.[0]}
                      alt={prod.name}
                      className="w-20 h-20 rounded-xl object-cover border border-stone-200 dark:border-stone-700 flex-shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-serif font-bold text-stone-900 dark:text-white line-clamp-1">
                            {prod.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-stone-400 hover:text-rose-500 transition-colors p-0.5"
                            title="Remove gift"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price Breakdown */}
                        <div className="text-xs text-stone-600 dark:text-stone-300 font-semibold mt-0.5">
                          ${price} {wrapPrice > 0 && <span className="text-[10px] text-amber-600 font-normal">(+${wrapPrice} box)</span>}
                        </div>

                        {/* Customization Details */}
                        {item.customText && (
                          <div className="text-[10px] text-amber-800 dark:text-amber-300 mt-1 flex items-center gap-1 font-medium truncate">
                            <Sparkles className="w-2.5 h-2.5 flex-shrink-0" />
                            <span>Engraving: "{item.customText}"</span>
                          </div>
                        )}

                        {item.wrappingOption && (
                          <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                            Box: {item.wrappingOption.name}
                          </div>
                        )}
                      </div>

                      {/* Quantity & Total */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/60 dark:border-stone-700">
                        <div className="flex items-center border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-900 px-1.5 py-0.5">
                          <button
                            onClick={() => updateCartQuantity(index, -1)}
                            className="px-1 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-stone-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(index, 1)}
                            className="px-1 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-bold text-stone-900 dark:text-white">
                          ${itemTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 space-y-4">
              
              {/* Coupon Code Section */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    <span>Coupon: <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discountPercentage}%)</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-stone-500 hover:text-rose-600 text-xs underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code (e.g. LUMIERE20)"
                    className="flex-1 px-3 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white uppercase placeholder-normal"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput}
                    className="px-4 py-2 bg-stone-900 dark:bg-stone-700 hover:bg-amber-600 dark:hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {couponLoading ? "Applying..." : "Apply"}
                  </button>
                </form>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 dark:text-white">${cartSubtotal.toFixed(2)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-${cartDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>White-Glove Shipping</span>
                  <span>{cartShipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${cartShipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>${cartTax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between text-base font-bold text-stone-900 dark:text-white">
                  <span>Total Investment</span>
                  <span className="text-amber-700 dark:text-amber-400">${cartGrandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Proceed to Bespoke Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-stone-400">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> 256-Bit SSL Encrypted</span>
                <span>•</span>
                <span>Signature Velvet Box Included</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
