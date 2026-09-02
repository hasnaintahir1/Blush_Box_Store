import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Sun, 
  Moon, 
  Sparkles, 
  Menu, 
  X, 
  ChevronDown, 
  SlidersHorizontal,
  Gift,
  ShieldCheck,
  Truck,
  LogOut,
  Settings,
  Package
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { OCCASIONS, RECIPIENTS, BUDGETS } from '../../constants/index.js';

export default function Navbar() {
  const { 
    theme, 
    toggleTheme, 
    cartCount, 
    cartSubtotal,
    wishlist, 
    user, 
    logout, 
    setIsAuthModalOpen, 
    setAuthModalMode,
    setIsCartOpen,
    setIsAIModalOpen,
    navigate,
    currentRoute,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    categories,
    products
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'occasions' | 'recipients' | 'categories' | 'budget'
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Autocomplete debounced search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setAutocompleteSuggestions([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const matches = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    ).slice(0, 5);
    setAutocompleteSuggestions(matches);
  }, [searchQuery, products]);

  // Click outside listener for search autocomplete and user dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const routePath = typeof currentRoute === 'string' ? currentRoute : (currentRoute?.path || 'home');

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setIsSearchOpen(false);
    navigate('shop');
  };

  const handleSelectOccasion = (occName) => {
    setFilters(prev => ({ ...prev, occasion: occName, category: 'all', recipient: 'all', budget: '' }));
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    navigate('shop');
  };

  const handleSelectRecipient = (recName) => {
    setFilters(prev => ({ ...prev, recipient: recName, category: 'all', occasion: 'all', budget: '' }));
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    navigate('shop');
  };

  const handleSelectCategory = (catName) => {
    setFilters(prev => ({ ...prev, category: catName, occasion: 'all', recipient: 'all', budget: '' }));
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    navigate('shop');
  };

  const handleSelectBudget = (budgetTier) => {
    setFilters(prev => ({ ...prev, budget: budgetTier, category: 'all', occasion: 'all', recipient: 'all' }));
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    navigate('shop');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors duration-200 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo & Brand Identity */}
          <div className="flex items-center">
            <button 
              onClick={() => navigate('home')}
              className="text-left group flex items-center gap-3 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500/20 via-amber-500/20 to-rose-600/10 border border-rose-300/40 dark:border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-xs transition-transform duration-300 group-hover:scale-105">
                <Gift className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-wider font-serif text-stone-900 dark:text-white uppercase flex items-center gap-1.5">
                  Blush <span className="text-rose-600 dark:text-rose-400 font-light">Box</span>
                </span>
                <span className="block text-[9px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 font-medium">
                  Curated Luxury Gifting &amp; Hampers
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm text-stone-700 dark:text-stone-200">
            <button
              onClick={() => navigate('home')}
              className={`px-3 py-2 rounded-xl transition-all duration-200 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-stone-800/60 ${routePath === 'home' ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50/60 dark:bg-stone-800/80' : ''}`}
            >
              Home
            </button>

            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('categories')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => navigate('categories')}
                className={`px-3 py-2 rounded-xl hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-stone-800/60 transition-all duration-200 flex items-center gap-1 ${routePath === 'categories' ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50/60 dark:bg-stone-800/80' : ''}`}
              >
                Categories <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {activeDropdown === 'categories' && (
                <div className="absolute top-full left-0 w-72 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {categories.slice(0, 7).map((cat) => (
                    <button
                      key={cat._id || cat.slug || cat.name}
                      onClick={() => handleSelectCategory(cat.name)}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-rose-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors"
                    >
                      {cat.name}
                    </button>
                  ))}
                  <button 
                    onClick={() => { setActiveDropdown(null); navigate('categories'); }}
                    className="w-full text-center text-xs font-semibold text-rose-600 dark:text-rose-400 pt-2 border-t border-stone-100 dark:border-stone-800 hover:underline block"
                  >
                    View All Categories Directory →
                  </button>
                </div>
              )}
            </div>

            {/* Occasions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('occasions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => navigate('occasions')}
                className={`px-3 py-2 rounded-xl hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-stone-800/60 transition-all duration-200 flex items-center gap-1 ${routePath === 'occasions' ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50/60 dark:bg-stone-800/80' : ''}`}
              >
                Occasions <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {activeDropdown === 'occasions' && (
                <div className="absolute top-full left-0 w-80 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-4 grid grid-cols-2 gap-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {OCCASIONS.slice(0, 10).map((occ) => (
                    <button
                      key={occ.id}
                      onClick={() => handleSelectOccasion(occ.name)}
                      className="text-left px-3 py-2 text-xs rounded-lg hover:bg-rose-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors"
                    >
                      {occ.name}
                    </button>
                  ))}
                  <button 
                    onClick={() => { setActiveDropdown(null); navigate('occasions'); }}
                    className="col-span-2 text-center text-xs font-semibold text-rose-600 dark:text-rose-400 pt-2 border-t border-stone-100 dark:border-stone-800 hover:underline"
                  >
                    View All Occasions Directory →
                  </button>
                </div>
              )}
            </div>

            {/* Recipients Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('recipients')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => navigate('recipients')}
                className={`px-3 py-2 rounded-xl hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-stone-800/60 transition-all duration-200 flex items-center gap-1 ${routePath === 'recipients' ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50/60 dark:bg-stone-800/80' : ''}`}
              >
                Recipients <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {activeDropdown === 'recipients' && (
                <div className="absolute top-full left-0 w-64 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {RECIPIENTS.map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => handleSelectRecipient(rec.name)}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-rose-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors"
                    >
                      {rec.name}
                    </button>
                  ))}
                  <button 
                    onClick={() => { setActiveDropdown(null); navigate('recipients'); }}
                    className="w-full text-center text-xs font-semibold text-rose-600 dark:text-rose-400 pt-2 border-t border-stone-100 dark:border-stone-800 hover:underline block"
                  >
                    View All Recipients Guide →
                  </button>
                </div>
              )}
            </div>

            {/* Budget Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('budget')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => navigate('budget')}
                className={`px-3 py-2 rounded-xl hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-stone-800/60 transition-all duration-200 flex items-center gap-1 ${routePath === 'budget' || routePath === 'budgets' ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50/60 dark:bg-stone-800/80' : ''}`}
              >
                Budget <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {activeDropdown === 'budget' && (
                <div className="absolute top-full left-0 w-60 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {BUDGETS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleSelectBudget(b.id)}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-rose-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors"
                    >
                      {b.name}
                    </button>
                  ))}
                  <button 
                    onClick={() => { setActiveDropdown(null); navigate('budget'); }}
                    className="w-full text-center text-xs font-semibold text-rose-600 dark:text-rose-400 pt-2 border-t border-stone-100 dark:border-stone-800 hover:underline block"
                  >
                    Explore Price Tiers Guide →
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('contact')}
              className={`px-3 py-2 rounded-xl transition-all duration-200 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-stone-800/60 ${routePath === 'contact' ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50/60 dark:bg-stone-800/80' : ''}`}
            >
              Concierge
            </button>
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            
            {/* Search Toggle & Search Box */}
            <div className="relative" ref={searchContainerRef}>
              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                className="p-2.5 rounded-full text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Search Catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search gift boxes, flowers, hampers..."
                      className="w-full pl-9 pr-8 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                    {searchQuery && (
                      <button 
                        type="button" 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 text-stone-400 hover:text-stone-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </form>

                  {/* Autocomplete Results */}
                  {autocompleteSuggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
                      <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold px-1">Matching Gifts</p>
                      {autocompleteSuggestions.map(item => (
                        <button
                          key={item._id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            navigate('product-details', { slug: item.slug, id: item._id });
                          }}
                          className="w-full text-left flex items-center gap-3 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors group"
                        >
                          <img src={item.images?.[0]} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-stone-900 dark:text-stone-100 truncate group-hover:text-rose-600">{item.name}</p>
                            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">${item.discountPrice || item.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-stone-700" />}
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => navigate('wishlist')}
              className="p-2.5 rounded-full text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors relative"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon & Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 rounded-full text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors relative flex items-center gap-1.5"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-stone-900 dark:text-white" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-scale shadow-xs">
                  {cartCount}
                </span>
              )}
              {cartSubtotal > 0 && (
                <span className="hidden md:inline-block text-xs font-semibold text-stone-900 dark:text-stone-200">
                  ${cartSubtotal}
                </span>
              )}
            </button>

            {/* Admin Dashboard Quick Button */}
            {user && user.role === 'admin' && (
              <button
                onClick={() => navigate('admin')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* User Account Dropdown */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline-block text-xs font-medium text-stone-800 dark:text-stone-200 truncate max-w-[100px]">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="p-2.5 rounded-full text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  aria-label="Sign In"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && user && (
                <div 
                  className="absolute right-0 top-12 w-56 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
                    <p className="text-xs font-bold text-stone-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                    {user.role === 'admin' && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-400 text-[10px] font-bold uppercase">
                        Admin Access
                      </span>
                    )}
                  </div>

                  <div className="py-1 space-y-0.5">
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigate('admin');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-stone-800 rounded-lg font-semibold"
                      >
                        <Settings className="w-4 h-4" /> Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        navigate('profile');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
                    >
                      <User className="w-4 h-4" /> My Profile &amp; Address
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        navigate('profile', { tab: 'orders' });
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
                    >
                      <Package className="w-4 h-4" /> My Orders &amp; Tracking
                    </button>
                  </div>

                  <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 pt-2 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <button
              onClick={() => { setIsMobileMenuOpen(false); navigate('home'); }}
              className={`w-full text-left px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${routePath === 'home' ? 'bg-rose-50 text-rose-600 dark:bg-stone-800 dark:text-rose-400 font-bold' : 'text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              Home
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); navigate('categories'); }}
              className={`w-full text-left px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${routePath === 'categories' ? 'bg-rose-50 text-rose-600 dark:bg-stone-800 dark:text-rose-400 font-bold' : 'text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              Curated Categories
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); navigate('occasions'); }}
              className={`w-full text-left px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${routePath === 'occasions' ? 'bg-rose-50 text-rose-600 dark:bg-stone-800 dark:text-rose-400 font-bold' : 'text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              Special Occasions
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); navigate('recipients'); }}
              className={`w-full text-left px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${routePath === 'recipients' ? 'bg-rose-50 text-rose-600 dark:bg-stone-800 dark:text-rose-400 font-bold' : 'text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              Gift by Recipient
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); navigate('budget'); }}
              className={`w-full text-left px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${routePath === 'budget' || routePath === 'budgets' ? 'bg-rose-50 text-rose-600 dark:bg-stone-800 dark:text-rose-400 font-bold' : 'text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              Explore Price &amp; Budget Tiers
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); navigate('contact'); }}
              className={`w-full text-left px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${routePath === 'contact' ? 'bg-rose-50 text-rose-600 dark:bg-stone-800 dark:text-rose-400 font-bold' : 'text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              Concierge &amp; Inquiries
            </button>
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Quick Shop by Occasion</p>
            <div className="grid grid-cols-2 gap-1.5">
              {OCCASIONS.slice(0, 6).map(occ => (
                <button
                  key={occ.id}
                  onClick={() => handleSelectOccasion(occ.name)}
                  className="text-left text-xs text-stone-700 dark:text-stone-300 py-2 px-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 hover:bg-rose-50 dark:hover:bg-stone-800"
                >
                  {occ.name}
                </button>
              ))}
            </div>
          </div>

          {user && user.role === 'admin' && (
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('admin');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Admin Panel</span>
              </button>
            </div>
          )}

          {!user && (
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex-1 py-2 text-xs font-semibold text-center rounded-lg bg-stone-900 text-white dark:bg-rose-600"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="flex-1 py-2 text-xs font-semibold text-center rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
