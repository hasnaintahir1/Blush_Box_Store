import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Shield, LogOut, ChevronRight, Truck, Clock, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function CustomerProfilePage() {
  const { user, logout, navigate, setIsAuthModalOpen, showToast } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserOrders() {
      if (!user) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/user/${user.id || user._id || 'user-1'}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed to load user orders:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUserOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50/50 dark:bg-stone-950 py-16 px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
          <User className="w-12 h-12 text-amber-600 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
            Private Society Sign In
          </h2>
          <p className="text-xs text-stone-500">
            Sign in to view your bespoke orders, milestone delivery schedules, and concierge history.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-amber-600 text-white text-xs font-semibold uppercase tracking-wider"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Profile Summary */}
        <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-600/20 text-amber-600 dark:text-amber-400 font-serif font-bold text-2xl flex items-center justify-center border border-amber-500/30">
              {user.name?.charAt(0) || "P"}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  {user.role === 'admin' ? "Private Society Admin" : "Patron Member"}
                </span>
              </div>
              <p className="text-xs text-stone-500">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <button
                onClick={() => navigate('admin')}
                className="px-4 py-2.5 bg-amber-600 text-white hover:bg-amber-500 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
              >
                Open Admin Suite
              </button>
            )}
            <button
              onClick={logout}
              className="px-4 py-2.5 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-600" />
                <span>Bespoke Order History</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">Track your dispatched gifts and presentation milestones.</p>
            </div>
            <span className="text-xs font-bold text-stone-400">{orders.length} orders recorded</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-stone-500">Loading order history...</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-xs text-stone-400">No bespoke orders placed yet under this account.</p>
              <button
                onClick={() => navigate('shop')}
                className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-amber-600 text-white text-xs font-semibold"
              >
                Curate Your First Gift
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-stone-900 dark:text-white text-sm">#{ord.orderNumber}</span>
                      <span className="text-stone-400 ml-3">Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'Delivered' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : ord.status === 'Shipped' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {ord.status}
                      </span>
                      <span className="font-bold text-stone-900 dark:text-white text-sm">${ord.grandTotal?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Items Mini List */}
                  <div className="space-y-2 pt-2 border-t border-stone-200/60 dark:border-stone-700">
                    {ord.items?.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-stone-700 dark:text-stone-300 font-medium">
                          {it.quantity}x {it.name}
                        </span>
                        <span className="text-stone-500">${(it.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tracking info */}
                  {ord.trackingNumber && (
                    <div className="pt-2 text-[11px] text-stone-500 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-amber-600" />
                        Courier Reference: <strong className="font-mono text-stone-700 dark:text-stone-300">{ord.trackingNumber}</strong>
                      </span>
                      <span className="text-amber-600 font-semibold">Priority Delivery</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
