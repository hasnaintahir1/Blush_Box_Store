import React, { useEffect } from 'react';
import { CheckCircle2, Gift, Truck, Calendar, ArrowRight, Printer, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import confetti from 'canvas-confetti';

export default function OrderConfirmationPage({ order }) {
  const { navigate } = useStore();

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  }, []);

  const orderData = order || {
    orderNumber: "BB-984321",
    createdAt: new Date().toISOString(),
    customer: { name: "Lady Penelope Ashworth", email: "penelope@luxurygifts.com" },
    shippingAddress: { street: "740 Park Avenue, Apt 14B", city: "New York", state: "NY", zipCode: "10021", country: "United States" },
    items: [
      { name: "Royal Blush & Champagne Celebration Hamper", price: 280, quantity: 1, customText: "To Penelope & Arthur, Forever" }
    ],
    grandTotal: 302.40,
    trackingNumber: "TRK-BB-8921094"
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Top Success Banner */}
        <div className="bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-3xl border border-stone-200/80 dark:border-stone-800 text-center space-y-4 shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[10px] uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">
            Bespoke Order Confirmed
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
            Thank You for Entrusting Your Moment to Blush Box
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto">
            Order <span className="font-mono font-bold text-stone-900 dark:text-white">#{orderData.orderNumber}</span> has been transferred to our studio for signature keepsake packaging and custom presentation.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
            <button
              onClick={() => navigate('shop')}
              className="px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-rose-600 hover:bg-rose-600 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Continue Exploring</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-Time Courier Journey Status */}
        <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-6 shadow-sm">
          <h3 className="font-serif text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-rose-600" />
            <span>White-Glove Milestone Dispatch</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 space-y-1">
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase">Step 1 • Completed</span>
              <h4 className="text-xs font-bold text-stone-900 dark:text-white">Order Received</h4>
              <p className="text-[10px] text-stone-500">Engraving specs verified</p>
            </div>

            <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-md space-y-1 animate-pulse">
              <span className="text-[10px] font-bold uppercase">Step 2 • In Progress</span>
              <h4 className="text-xs font-bold">Studio Assembly</h4>
              <p className="text-[10px] opacity-90">Ribbon tie &amp; gift boxing</p>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1 opacity-70">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Step 3 • Upcoming</span>
              <h4 className="text-xs font-bold text-stone-900 dark:text-white">Courier Dispatch</h4>
              <p className="text-[10px] text-stone-500">Tracking: {orderData.trackingNumber || "Assigned shortly"}</p>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1 opacity-70">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Step 4</span>
              <h4 className="text-xs font-bold text-stone-900 dark:text-white">Delightful Handover</h4>
              <p className="text-[10px] text-stone-500">Recipient unboxing</p>
            </div>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-4 shadow-sm">
          <h3 className="font-serif text-base font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-3">
            Gift Curation Summary
          </h3>

          <div className="space-y-3">
            {orderData.items?.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs py-2 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <p className="font-bold text-stone-900 dark:text-white">{it.name}</p>
                  <p className="text-[11px] text-stone-500">Quantity: {it.quantity}</p>
                  {it.customText && (
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
                      Laser Engraving: "{it.customText}"
                    </p>
                  )}
                </div>
                <span className="font-bold text-stone-900 dark:text-white">${(it.price * it.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
            <div>
              <span className="font-bold text-stone-900 dark:text-white block mb-1">Destination Address</span>
              <p className="text-stone-500">{orderData.customer?.name}</p>
              <p className="text-stone-500">{orderData.shippingAddress?.street}</p>
              <p className="text-stone-500">{orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} {orderData.shippingAddress?.zipCode}</p>
            </div>
            <div>
              <span className="font-bold text-stone-900 dark:text-white block mb-1">Payment &amp; Confirmation</span>
              <p className="text-stone-500">Confirmation sent to: {orderData.customer?.email}</p>
              <p className="text-stone-500">Total Settled: <strong className="text-rose-600 dark:text-rose-400">${orderData.grandTotal?.toFixed(2)}</strong></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
