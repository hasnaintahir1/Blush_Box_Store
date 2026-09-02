import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // Data State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialAppLoading, setInitialAppLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    occasion: 'all',
    recipient: 'all',
    budget: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    inStock: false,
    featured: false,
    bestSeller: false,
    newArrival: false,
    sort: 'featured'
  });

  // Current view / page state: 'home' | 'shop' | 'product-details' | 'cart' | 'checkout' | 'confirmation' | 'wishlist' | 'profile' | 'contact' | 'admin'
  const [currentRoute, setCurrentRoute] = useState({ path: 'home', params: {} });

  // Theme State: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('lumiere_theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // User & Auth State
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('lumiere_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('lumiere_token') || null;
    } catch {
      return null;
    }
  });

  // Cart State: array of items { productId, product, quantity, giftMessage, customText, wrappingOption }
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('lumiere_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State: array of productIds
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('lumiere_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Modals & Drawers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Toast Notification System
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Sync theme with HTML root
  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        document.body.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        document.body.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
      localStorage.setItem('lumiere_theme', theme);
    } catch (e) {
      console.warn("Could not save theme:", e);
    }
  }, [theme]);

  // Sync Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumiere_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart:", e);
    }
  }, [cart]);

  // Sync Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumiere_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Could not save wishlist:", e);
    }
  }, [wishlist]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch Products
  const fetchProducts = useCallback(async (customParams = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      const merged = { ...filters, ...customParams };

      if (searchQuery) queryParams.set('search', searchQuery);
      if (merged.category && merged.category !== 'all') queryParams.set('category', merged.category);
      if (merged.occasion && merged.occasion !== 'all') queryParams.set('occasion', merged.occasion);
      if (merged.recipient && merged.recipient !== 'all') queryParams.set('recipient', merged.recipient);
      if (merged.budget) queryParams.set('budget', merged.budget);
      if (merged.minPrice) queryParams.set('minPrice', merged.minPrice);
      if (merged.maxPrice) queryParams.set('maxPrice', merged.maxPrice);
      if (merged.rating) queryParams.set('rating', merged.rating);
      if (merged.inStock) queryParams.set('inStock', 'true');
      if (merged.featured) queryParams.set('featured', 'true');
      if (merged.bestSeller) queryParams.set('bestSeller', 'true');
      if (merged.newArrival) queryParams.set('newArrival', 'true');
      if (merged.sort) queryParams.set('sort', merged.sort);

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery]);

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Navigation router helper
  const navigate = (path, params = {}) => {
    setIsNavigating(true);
    setCurrentRoute({ path, params });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setIsNavigating(false);
    }, 350);
  };

  // Cart operations
  const addToCart = (product, quantity = 1, options = {}) => {
    if (!product) return;
    setCart(prev => {
      const existingIdx = prev.findIndex(item => 
        item.productId === product._id && 
        item.customText === (options.customText || '') &&
        item.wrappingOption?.id === (options.wrappingOption?.id || '')
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product._id,
            product,
            quantity,
            customText: options.customText || '',
            giftMessage: options.giftMessage || '',
            wrappingOption: options.wrappingOption || null
          }
        ];
      }
    });

    showToast(`"${product.name}" added to your bespoke cart.`);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
    showToast("Item removed from cart.", "info");
  };

  const updateCartQuantity = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, idx) => idx !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Apply discount coupon
  const applyCoupon = async (code) => {
    try {
      const subtotal = cartSubtotal;
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        showToast(`Coupon "${data.coupon.code}" applied: ${data.coupon.discountPercentage}% off!`);
        return { success: true };
      } else {
        showToast(data.error || "Invalid coupon", "error");
        return { success: false, error: data.error };
      }
    } catch (err) {
      showToast("Failed to validate coupon", "error");
      return { success: false, error: err.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon removed.", "info");
  };

  // Wishlist toggle & management
  const toggleWishlist = (product) => {
    if (!product) return;
    const prodId = typeof product === 'object' ? (product._id || product.id) : product;
    setWishlist(prev => {
      const exists = prev.includes(prodId);
      if (exists) {
        showToast("Removed from your wishlist.", "info");
        return prev.filter(id => id !== prodId);
      } else {
        showToast("Saved to your wishlist.");
        return [...prev, prodId];
      }
    });
  };

  const removeFromWishlist = (productOrId) => {
    if (!productOrId) return;
    const prodId = typeof productOrId === 'object' ? (productOrId._id || productOrId.id) : productOrId;
    setWishlist(prev => prev.filter(id => id !== prodId));
    showToast("Item removed from your wishlist.", "info");
  };

  const clearWishlist = () => {
    setWishlist([]);
    try {
      localStorage.setItem('lumiere_wishlist', JSON.stringify([]));
    } catch (e) {
      console.warn("Error clearing wishlist in localStorage:", e);
    }
    showToast("Wishlist has been cleared.", "info");
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    const id = typeof productId === 'object' ? (productId._id || productId.id) : productId;
    return wishlist.includes(id);
  };

  // Auth Operations
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('lumiere_user', JSON.stringify(data.user));
        localStorage.setItem('lumiere_token', data.token);
        setIsAuthModalOpen(false);
        showToast(`Welcome back, ${data.user.name}!`);
        if (data.user.role === 'admin') {
          navigate('admin');
        }
        return { success: true, user: data.user };
      } else {
        showToast(data.error || "Login failed", "error");
        return { success: false, error: data.error };
      }
    } catch (err) {
      showToast("Network error during login", "error");
      return { success: false, error: err.message };
    }
  };

  const register = async ({ name, email, password, phone }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('lumiere_user', JSON.stringify(data.user));
        localStorage.setItem('lumiere_token', data.token);
        setIsAuthModalOpen(false);
        showToast(`Welcome to Lumière & Co., ${data.user.name}!`);
        return { success: true, user: data.user };
      } else {
        showToast(data.error || "Registration failed", "error");
        return { success: false, error: data.error };
      }
    } catch (err) {
      showToast("Network error during registration", "error");
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('lumiere_user');
    localStorage.removeItem('lumiere_token');
    showToast("You have been signed out.", "info");
    if (currentRoute.path.startsWith('admin')) {
      navigate('home');
    }
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    const wrapPrice = item.wrappingOption?.price || 0;
    return sum + (price + wrapPrice) * item.quantity;
  }, 0);

  const cartDiscount = appliedCoupon
    ? Math.round(cartSubtotal * (appliedCoupon.discountPercentage / 100) * 100) / 100
    : 0;

  const cartShipping = cartSubtotal >= 150 || cart.length === 0 ? 0 : 15;
  const cartTax = Math.round((cartSubtotal - cartDiscount) * 0.08 * 100) / 100;
  const cartGrandTotal = Math.max(0, Math.round((cartSubtotal - cartDiscount + cartShipping + cartTax) * 100) / 100);
  const cartCount = cart.reduce((sum, it) => sum + it.quantity, 0);

  const value = {
    products,
    categories,
    loading,
    initialAppLoading,
    setInitialAppLoading,
    isNavigating,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    currentRoute,
    navigate,
    theme,
    toggleTheme,
    user,
    token,
    cart,
    wishlist,
    appliedCoupon,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    isCartOpen,
    setIsCartOpen,
    isAIModalOpen,
    setIsAIModalOpen,
    quickViewProduct,
    setQuickViewProduct,
    toast,
    showToast,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    login,
    register,
    logout,
    fetchProducts,
    fetchCategories,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartGrandTotal,
    cartCount
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
