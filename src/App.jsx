import React, { useEffect } from 'react';
import { useStore } from './context/StoreContext.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import CartDrawer from './components/cart/CartDrawer.jsx';
import QuickViewModal from './components/products/QuickViewModal.jsx';
import AIGiftingAssistant from './components/ai/AIGiftingAssistant.jsx';
import AuthModal from './pages/AuthModal.jsx';
import { LuxurySplashLoader, LuxuryTopBarLoader } from './components/common/LuxuryLoader.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import OccasionsPage from './pages/OccasionsPage.jsx';
import RecipientsPage from './pages/RecipientsPage.jsx';
import BudgetPage from './pages/BudgetPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import CustomerProfilePage from './pages/CustomerProfilePage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

export default function App() {
  const { 
    currentRoute, 
    routeParams, 
    toast, 
    initialAppLoading, 
    setInitialAppLoading, 
    isNavigating, 
    loading 
  } = useStore();

  const routePath = typeof currentRoute === 'string' ? currentRoute : (currentRoute?.path || 'home');
  const params = currentRoute?.params || routeParams || {};

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute, routeParams]);

  const renderCurrentPage = () => {
    switch (routePath) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'occasions':
        return <OccasionsPage />;
      case 'recipients':
        return <RecipientsPage />;
      case 'budget':
      case 'budgets':
      case 'price':
        return <BudgetPage />;
      case 'product':
      case 'product-details':
        return <ProductDetailsPage slug={params?.slug} id={params?.id} />;
      case 'checkout':
        return <CheckoutPage />;
      case 'confirmation':
        return <OrderConfirmationPage order={params?.order} />;
      case 'wishlist':
        return <WishlistPage />;
      case 'profile':
        return <CustomerProfilePage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminDashboardPage />;
      default:
        return <HomePage />;
    }
  };

  const isDedicatedAdmin = routePath === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-amber-700 selection:text-white transition-colors duration-200">
      
      {/* Opening / Splash Luxury Loader */}
      {initialAppLoading && (
        <LuxurySplashLoader onFinished={() => setInitialAppLoading(false)} />
      )}

      {/* Top Bar Progress Indicator for Seamless Navigation */}
      <LuxuryTopBarLoader active={isNavigating} />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className={`px-4 py-3 rounded-2xl text-xs font-semibold shadow-2xl flex items-center gap-2 border ${
            toast.type === 'error'
              ? 'bg-rose-900 text-rose-100 border-rose-700'
              : toast.type === 'warning'
              ? 'bg-amber-900 text-amber-100 border-amber-700'
              : 'bg-stone-900 dark:bg-stone-800 text-amber-300 border-amber-500/40'
          }`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Luxury Navigation Bar */}
      <Navbar />

      {/* Dynamic Main View */}
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>

      {/* Footer (Rendered on all client storefront views) */}
      <Footer />

      {/* Slideout Cart Drawer */}
      <CartDrawer />

      {/* Quick View Modal */}
      <QuickViewModal />

      {/* Auth Modal */}
      <AuthModal />

      {/* AI Gifting Concierge Widget & Modal */}
      <AIGiftingAssistant />

    </div>
  );
}
