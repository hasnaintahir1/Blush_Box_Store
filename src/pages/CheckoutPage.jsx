import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Gift, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Calendar,
  Lock,
  Tag,
  Copy,
  Check,
  Smartphone
} from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const { 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTax, 
    cartGrandTotal, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon,
    clearCart, 
    navigate, 
    user,
    showToast 
  } = useStore();

  const [customer, setCustomer] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [shippingAddress, setShippingAddress] = useState({
    street: '740 Park Avenue, Apt 14B',
    city: 'New York',
    state: 'NY',
    zipCode: '10021',
    country: 'United States'
  });

  const [scheduledDate, setScheduledDate] = useState('');
  const [giftNote, setGiftNote] = useState('With all our love and deepest admiration on this special day. Cheers to many more.');
  const [paymentMethod, setPaymentMethod] = useState('EasyPaisa');
  const [easypaisaTxId, setEasypaisaTxId] = useState('');
  const [easypaisaSender, setEasypaisaSender] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('03113735804');
    setCopiedNumber(true);
    showToast("EasyPaisa Number copied: 03113735804", "success");
    setTimeout(() => setCopiedNumber(false), 3000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-24 text-center bg-stone-50 dark:bg-stone-950 px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
          <Gift className="w-12 h-12 text-amber-600 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">Your Cart is Empty</h2>
          <p className="text-xs text-stone-500">Please select bespoke heirlooms or curated gift boxes before checking out.</p>
          <button 
            onClick={() => navigate('shop')}
            className="px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-amber-600 text-white text-xs font-semibold"
          >
            Explore Catalog
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.email || !shippingAddress.street) {
      showToast("Please fill in recipient shipping details", "error");
      return;
    }

    setIsProcessing(true);

    try {
      const orderPayload = {
        customer,
        shippingAddress,
        items: cart.map(it => ({
          productId: it.productId,
          name: it.product.name,
          price: it.product.discountPrice || it.product.price,
          quantity: it.quantity,
          image: it.product.images?.[0],
          giftMessage: it.giftMessage || giftNote,
          customText: it.customText
        })),
        subtotal: cartSubtotal,
        discount: cartDiscount,
        couponCode: appliedCoupon?.code || null,
        shippingFee: cartShipping,
        tax: cartTax,
        grandTotal: cartGrandTotal,
        paymentMethod: paymentMethod === 'EasyPaisa' 
          ? `EasyPaisa (03113735804) ${easypaisaTxId ? `TRX: ${easypaisaTxId}` : ''} ${easypaisaSender ? `From: ${easypaisaSender}` : ''}`.trim()
          : paymentMethod,
        giftNote
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (data.success) {
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // Ignore if confetti not supported
        }

        clearCart();
        navigate('confirmation', { order: data.order });
      } else {
        showToast(data.error || "Failed to place order", "error");
      }
    } catch (err) {
      showToast("Network error placing order", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('shop')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-amber-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Form Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-amber-400">
                White-Glove Courier Checkout
              </span>
              <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white">
                Bespoke Order Dispatch
              </h1>
            </div>

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* 1. Recipient & Buyer Contact */}
              <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-4 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <span>1. Recipient &amp; Client Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="e.g. Lady Penelope Ashworth"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Confirmation Email</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="client@luxurygifts.com"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Courier Contact Phone (For Delivery Alerts)</label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="+1 (555) 019-2831"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Destination Address */}
              <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-4 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-600" />
                  <span>2. White-Glove Destination Address</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      placeholder="Estate Name, Street &amp; Suite"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="City"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">State / Province</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      placeholder="NY"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Zip / Postal Code</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      placeholder="10021"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      placeholder="United States"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Calligraphy Card Note & Scheduled Date */}
              <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-4 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>3. Inscribed Gift Note &amp; Delivery Window</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Gold-Foil Calligraphy Message Card
                    </label>
                    <textarea
                      rows={3}
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="Inscribed in gold calligraphy on handmade cotton rag paper..."
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" /> Scheduled Milestone Arrival Date (Optional):
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Payment Method */}
              <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-4 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-600" />
                  <span>4. Secure Payment Settlement</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['EasyPaisa', 'Credit Card', 'Apple Pay', 'Cash On Concierge'].map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPaymentMethod(pm)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        paymentMethod === pm
                          ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 shadow-sm ring-1 ring-emerald-500/30'
                          : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                      }`}
                    >
                      {pm === 'EasyPaisa' && <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      {pm === 'Credit Card' && <CreditCard className="w-4 h-4 text-amber-600" />}
                      {pm === 'Apple Pay' && <Lock className="w-4 h-4 text-stone-700 dark:text-stone-300" />}
                      {pm === 'Cash On Concierge' && <Truck className="w-4 h-4 text-rose-600" />}
                      <span>{pm}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'EasyPaisa' && (
                  <div className="space-y-4 pt-3 p-4.5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-stone-50 to-emerald-50/40 dark:from-emerald-950/30 dark:via-stone-900 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200/60 dark:border-emerald-800/40">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          EP
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-900 dark:text-white">EasyPaisa Mobile Account</p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">Account Title: <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">Hasnain Tahir</strong></p>
                        </div>
                      </div>

                      {/* Copy EasyPaisa Number Button */}
                      <button
                        type="button"
                        onClick={handleCopyNumber}
                        className="px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        {copiedNumber ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied 03113735804</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copy: 03113735804</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-[11px] text-stone-600 dark:text-stone-300 space-y-1.5 leading-relaxed bg-white/70 dark:bg-stone-800/70 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                      <p className="font-semibold text-stone-800 dark:text-stone-200">Payment Instructions:</p>
                      <p>1. Open your <strong>EasyPaisa App</strong> or dial <strong>*786#</strong>.</p>
                      <p>2. Send <strong>${cartGrandTotal.toFixed(2)}</strong> (or equivalent PKR) to <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">03113735804</span>.</p>
                      <p>3. Enter your Sender Number or EasyPaisa Transaction ID (TRX ID) below for instant automated confirmation.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                          EasyPaisa Transaction ID (TRX ID)
                        </label>
                        <input
                          type="text"
                          value={easypaisaTxId}
                          onChange={(e) => setEasypaisaTxId(e.target.value)}
                          placeholder="e.g. 29384729104"
                          className="w-full px-3.5 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                          Sender EasyPaisa Mobile Number
                        </label>
                        <input
                          type="text"
                          value={easypaisaSender}
                          onChange={(e) => setEasypaisaSender(e.target.value)}
                          placeholder="e.g. 0300 1234567"
                          className="w-full px-3.5 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Credit Card' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Card Number</label>
                      <input
                        type="text"
                        defaultValue="•••• •••• •••• 4242"
                        className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Expiry</label>
                        <input
                          type="text"
                          defaultValue="12/28"
                          className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">CVV Security Code</label>
                        <input
                          type="text"
                          defaultValue="894"
                          className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </form>

          </div>

          {/* Right Order Summary & Authorize Button (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm sticky top-28 space-y-6">
              
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-3">
                Bespoke Order Summary
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item, idx) => {
                  const price = item.product.discountPrice || item.product.price;
                  const wrapPrice = item.wrappingOption?.price || 0;
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs py-2 border-b border-stone-100 dark:border-stone-800">
                      <img src={item.product.images?.[0]} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-bold text-stone-900 dark:text-white truncate">{item.product.name}</p>
                        <p className="text-[11px] text-stone-500">Qty: {item.quantity} × ${price}</p>
                        {item.customText && <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">Engraving: "{item.customText}"</p>}
                      </div>
                      <span className="font-bold text-stone-900 dark:text-white">${((price + wrapPrice) * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Calculations */}
              <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 dark:text-white">${cartSubtotal.toFixed(2)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-amber-600 font-semibold">
                    <span>Voucher Discount ({appliedCoupon?.code})</span>
                    <span>-${cartDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>White-Glove Express Shipping</span>
                  <span>{cartShipping === 0 ? <strong className="text-emerald-600">COMPLIMENTARY</strong> : `$${cartShipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>${cartTax.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-between text-lg font-bold text-stone-900 dark:text-white">
                  <span>Grand Total</span>
                  <span className="text-amber-700 dark:text-amber-400">${cartGrandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Authorize & Place Order Submit Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isProcessing ? "Authorizing Vault Settlement..." : `Authorize & Place Order ($${cartGrandTotal.toFixed(2)})`}</span>
              </button>

              <div className="space-y-2 pt-2 text-[10px] text-stone-400 text-center">
                <p className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>256-Bit Encrypted Protocol • 100% Delight Guarantee</span>
                </p>
                <p>Complimentary signature presentation velvet box included with every piece.</p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
