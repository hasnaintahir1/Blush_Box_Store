import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  FolderTree, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Truck, 
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  SlidersHorizontal,
  Info,
  Mail
} from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

// Curated high quality gift photo presets for quick 1-click selection
const PRESET_GALLERY = [
  { id: 'hamp1', name: 'Signature Velvet Hamper', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop', tag: 'Hamper' },
  { id: 'choc1', name: 'Artisan Chocolate Box', url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop', tag: 'Chocolates' },
  { id: 'perf1', name: 'Luxury Eau de Parfum', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop', tag: 'Perfume' },
  { id: 'flow1', name: 'Preserved English Roses', url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800&auto=format&fit=crop', tag: 'Flowers' },
  { id: 'jewl1', name: 'Solitaire Gold Pendant', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop', tag: 'Jewelry' },
  { id: 'leat1', name: 'Handcrafted Leather Portfolio', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop', tag: 'Leather' },
  { id: 'deca1', name: 'Crystal Decanter Set', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop', tag: 'Glassware' },
  { id: 'spa1', name: 'Botanical Wellness & Candle Spa', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop', tag: 'Spa & Bath' },
  { id: 'silk1', name: 'Pure Mulberry Silk Robe', url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop', tag: 'Silk' },
  { id: 'gold1', name: 'Gilded Celebration Flutes', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop', tag: 'Celebration' },
  { id: 'box1', name: 'Blush Satin Gift Box', url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop', tag: 'Gift Box' },
  { id: 'wood1', name: 'Monogrammed Olive Wood Board', url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=800&auto=format&fit=crop', tag: 'Keepsake' }
];

export default function AdminDashboardPage() {
  const { user, navigate, showToast, categories, fetchCategories, fetchProducts } = useStore();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'products' | 'categories'
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, averageOrderValue: 0, pendingOrders: 0 });
  const [orders, setOrders] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Filters in Admin
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');

  // Modals & Forms
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' | 'gallery' | 'url'
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [catImageMode, setCatImageMode] = useState('upload');

  // Order Details Modal
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // File Upload refs
  const fileInputRef = useRef(null);
  const catFileInputRef = useRef(null);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, ordersRes, productsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/orders'),
        fetch('/api/products?limit=100')
      ]);

      const aData = await analyticsRes.json();
      const oData = await ordersRes.json();
      const pData = await productsRes.json();

      if (aData.success) {
        setStats(aData.stats);
      }
      if (oData.success) {
        setOrders(oData.orders || []);
      }
      if (pData.success) {
        setProductsList(pData.products || []);
      }
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
      showToast("Could not load latest admin data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Update order status
  const handleUpdateOrderStatus = async (orderId, newStatus, trackingNo) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, trackingNumber: trackingNo })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order status updated to ${newStatus}`);
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus, status: newStatus } : o));
        if (selectedOrderDetails && selectedOrderDetails._id === orderId) {
          setSelectedOrderDetails(prev => ({ ...prev, orderStatus: newStatus, status: newStatus }));
        }
      } else {
        showToast(data.error || "Failed to update order status", "error");
      }
    } catch (err) {
      showToast("Error updating order status", "error");
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you wish to delete this product from the store?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast("Product deleted successfully!");
        setProductsList(prev => prev.filter(p => p._id !== id));
        fetchProducts();
        loadAdminData();
      } else {
        showToast(data.error || "Failed to delete product", "error");
      }
    } catch (err) {
      showToast("Failed to delete product", "error");
    }
  };

  // Image Upload handler (reads local file from phone/computer gallery)
  const handleFileUpload = (e, target = 'product') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast("Please select a valid image file (PNG, JPG, WEBP)", "error");
      return;
    }

    // Check size (max 8MB for responsive data URL upload)
    if (file.size > 8 * 1024 * 1024) {
      showToast("Image size is too large. Please select an image under 8MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (target === 'product') {
        setEditingProduct(prev => {
          if (!prev) return prev;
          const currentImages = Array.isArray(prev.images) ? [...prev.images] : [];
          // Put the uploaded image at the beginning as primary image
          return {
            ...prev,
            images: [result, ...currentImages.filter(img => img !== result)]
          };
        });
        showToast("Photo loaded from gallery!");
      } else if (target === 'category') {
        setNewCatImage(result);
        showToast("Category photo loaded!");
      }
    };
    reader.onerror = () => {
      showToast("Failed to read image file", "error");
    };
    reader.readAsDataURL(file);
  };

  // Select Preset Image
  const handleSelectPreset = (url, target = 'product') => {
    if (target === 'product') {
      setEditingProduct(prev => {
        if (!prev) return prev;
        const currentImages = Array.isArray(prev.images) ? [...prev.images] : [];
        return {
          ...prev,
          images: [url, ...currentImages.filter(img => img !== url)]
        };
      });
      showToast("Preset photo selected!");
    } else {
      setNewCatImage(url);
      showToast("Preset photo selected!");
    }
  };

  // Add custom URL image
  const handleAddCustomUrl = (target = 'product') => {
    if (!customImageUrl.trim()) return;
    if (target === 'product') {
      setEditingProduct(prev => {
        if (!prev) return prev;
        const currentImages = Array.isArray(prev.images) ? [...prev.images] : [];
        return {
          ...prev,
          images: [customImageUrl.trim(), ...currentImages.filter(img => img !== customImageUrl.trim())]
        };
      });
      setCustomImageUrl('');
      showToast("Image URL added!");
    } else {
      setNewCatImage(customImageUrl.trim());
      setCustomImageUrl('');
      showToast("Category image URL set!");
    }
  };

  // Remove an image from product
  const handleRemoveImage = (indexToRemove) => {
    setEditingProduct(prev => {
      if (!prev) return prev;
      const filtered = (prev.images || []).filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: filtered.length > 0 ? filtered : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop']
      };
    });
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct.name.trim()) {
      showToast("Product name is required", "error");
      return;
    }
    if (!editingProduct.price || Number(editingProduct.price) <= 0) {
      showToast("Please enter a valid price", "error");
      return;
    }

    const isEdit = !!editingProduct?._id;
    const url = isEdit ? `/api/products/${editingProduct._id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      setIsSubmitting(true);
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingProduct,
          price: Number(editingProduct.price),
          discountPrice: editingProduct.discountPrice ? Number(editingProduct.discountPrice) : Number(editingProduct.price),
          stock: Number(editingProduct.stock) || 0,
          images: Array.isArray(editingProduct.images) && editingProduct.images.length > 0 
            ? editingProduct.images 
            : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop']
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? "Product updated successfully!" : "Product published successfully to store!", "success");
        setIsProductModalOpen(false);
        setEditingProduct(null);
        await Promise.all([loadAdminData(), fetchProducts()]);
      } else {
        showToast(data.error || "Failed to save product", "error");
      }
    } catch (err) {
      console.error("Save product error:", err);
      showToast("Failed to save product", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      showToast("Category name is required", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatName.trim(),
          description: newCatDesc.trim(),
          image: newCatImage || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop'
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Category created successfully!", "success");
        setNewCatName('');
        setNewCatDesc('');
        setNewCatImage('');
        await Promise.all([fetchCategories(), loadAdminData()]);
      } else {
        showToast(data.error || "Failed to create category", "error");
      }
    } catch (err) {
      showToast("Failed to create category", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderNumber?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customer?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customer?.email?.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const filteredProducts = productsList.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku?.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedProductCategory === 'all' || p.category === selectedProductCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">
                Administration Portal
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-[10px] font-bold border border-rose-200 dark:border-rose-900">
                Verified Admin: {user?.name || "Store Owner"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
                <Mail className="w-3 h-3 text-emerald-600" />
                <span>Order Alerts: hasnaintahir605@gmail.com</span>
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white mt-1">
              Blush Box Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              disabled={loading}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('home')}
              className="px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-800 hover:bg-rose-600 dark:hover:bg-rose-600 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white dark:bg-stone-900 p-1.5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-xs gap-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'products', label: `Products (${productsList.length})`, icon: Package },
            { id: 'categories', label: `Categories (${categories.length})`, icon: FolderTree }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] uppercase font-bold tracking-wider">Gross Revenue</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
                  ${stats.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                </div>
                <span className="text-[10px] text-emerald-600 font-medium">Real-time calculate</span>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] uppercase font-bold tracking-wider">Total Orders</span>
                  <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
                  {stats.totalOrders || orders.length} Orders
                </div>
                <span className="text-[10px] text-rose-600 font-medium">{stats.pendingOrders || 0} pending processing</span>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] uppercase font-bold tracking-wider">Total Inventory</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
                  {stats.totalProducts || productsList.length} Items
                </div>
                <span className="text-[10px] text-purple-600 font-medium">Active in store catalog</span>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] uppercase font-bold tracking-wider">Active Categories</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                    <FolderTree className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
                  {categories.length} Collections
                </div>
                <span className="text-[10px] text-blue-600 font-medium">Available for shopping</span>
              </div>
            </div>

            {/* Quick Action Button Bar */}
            <div className="p-4 bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-rose-900 dark:text-rose-200">
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span className="font-semibold">Quick Actions:</span> Add new products or categories with phone gallery upload or preset photos.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingProduct({
                      name: '',
                      price: 120,
                      discountPrice: 0,
                      stock: 20,
                      category: categories[0]?.name || 'Gift Hampers',
                      description: 'Delightfully arranged luxury gift presentation in signature box.',
                      images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop'],
                      isFeatured: true,
                      isBestSeller: false,
                      isPersonalized: true
                    });
                    setImageInputMode('upload');
                    setIsProductModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Product
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="px-3.5 py-2 bg-white dark:bg-stone-800 text-stone-800 dark:text-white hover:bg-stone-100 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderTree className="w-3.5 h-3.5" /> Manage Categories
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
                  Recent Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
                >
                  View All ({orders.length}) →
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-stone-400 py-6 text-center">No orders placed yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-bold uppercase tracking-wider">
                        <th className="pb-3">Order #</th>
                        <th className="pb-3">Recipient</th>
                        <th className="pb-3">Items</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord._id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                          <td className="py-3 font-mono font-bold text-stone-900 dark:text-white">#{ord.orderNumber}</td>
                          <td className="py-3 font-medium text-stone-800 dark:text-stone-200">{ord.customer?.name}</td>
                          <td className="py-3 text-stone-500">{ord.items?.length || 1} item(s)</td>
                          <td className="py-3 font-bold text-stone-900 dark:text-white">${ord.grandTotal?.toFixed(2)}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {ord.orderStatus || ord.status || 'Confirmed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
                  Customer Orders &amp; Fulfillment
                </h3>
                <p className="text-xs text-stone-500">Track incoming orders, customer details, and update tracking status.</p>
              </div>

              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order #, client name..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                No orders match your search criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Order Ref</th>
                      <th className="pb-3">Client / Email</th>
                      <th className="pb-3">Items Purchased</th>
                      <th className="pb-3">Destination</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {filteredOrders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                        <td className="py-4 font-mono font-bold text-stone-900 dark:text-white">
                          #{ord.orderNumber}
                          <span className="block text-[10px] text-stone-400 font-normal">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-4">
                          <span className="font-bold text-stone-900 dark:text-white block">{ord.customer?.name}</span>
                          <span className="text-[11px] text-stone-500">{ord.customer?.email}</span>
                          {ord.customer?.phone && <span className="text-[10px] text-stone-400 block">{ord.customer.phone}</span>}
                        </td>

                        <td className="py-4 space-y-1 max-w-xs">
                          {ord.items?.map((it, i) => (
                            <div key={i} className="text-[11px] truncate text-stone-800 dark:text-stone-200">
                              <span className="font-semibold">{it.quantity}x</span> {it.name}
                              {it.customText && (
                                <span className="block text-[10px] text-rose-600 italic">
                                  Engraving: "{it.customText}"
                                </span>
                              )}
                            </div>
                          ))}
                        </td>

                        <td className="py-4 text-stone-500 text-[11px]">
                          {ord.shippingAddress?.city || 'Local Delivery'}, {ord.shippingAddress?.state || ''}
                        </td>

                        <td className="py-4 font-bold text-stone-900 dark:text-white">
                          ${ord.grandTotal?.toFixed(2)}
                        </td>

                        <td className="py-4">
                          <select
                            value={ord.orderStatus || ord.status || 'Confirmed'}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value, ord.trackingNumber || `BB-TRK-${Math.floor(100000 + Math.random() * 900000)}`)}
                            className="px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-[11px] font-bold text-stone-800 dark:text-stone-200 cursor-pointer"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing &amp; Wrapping</option>
                            <option value="Shipped">Dispatched / Courier</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="py-4 text-right">
                          <button
                            onClick={() => setSelectedOrderDetails(ord)}
                            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-rose-50 text-stone-600 hover:text-rose-600 cursor-pointer"
                            title="View Full Order Invoice"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
                  Products &amp; Inventory Management
                </h3>
                <p className="text-xs text-stone-500">Add, edit, change pricing, and upload product photos directly from your device gallery.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Category filter */}
                <select
                  value={selectedProductCategory}
                  onChange={(e) => setSelectedProductCategory(e.target.value)}
                  className="px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none dark:text-white cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>

                <div className="relative w-full sm:w-56">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search product name..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>

                <button
                  onClick={() => {
                    setEditingProduct({
                      name: '',
                      price: 120,
                      discountPrice: 0,
                      stock: 25,
                      category: categories[0]?.name || 'Gift Hampers',
                      description: 'Handcrafted luxury gift presentation.',
                      images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop'],
                      isFeatured: true,
                      isBestSeller: false,
                      isPersonalized: true
                    });
                    setImageInputMode('upload');
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs flex-shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                No products found. Click "Add Product" to create your first item!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Product</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Stock</th>
                      <th className="pb-3">Badges</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {filteredProducts.map((p) => (
                      <tr key={p._id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                        <td className="py-3 flex items-center gap-3">
                          <img 
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200'} 
                            alt={p.name} 
                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-stone-200 dark:border-stone-700" 
                          />
                          <div>
                            <span className="font-serif font-bold text-stone-900 dark:text-white block text-sm">{p.name}</span>
                            <span className="font-mono text-[10px] text-stone-400">SKU: {p.sku || "BB-9842"}</span>
                          </div>
                        </td>

                        <td className="py-3 font-medium text-stone-700 dark:text-stone-300">{p.category}</td>
                        <td className="py-3 font-bold text-stone-900 dark:text-white">
                          ${p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price}
                          {p.discountPrice && p.discountPrice < p.price && (
                            <span className="text-[10px] text-stone-400 line-through ml-1.5">${p.price}</span>
                          )}
                        </td>

                        <td className="py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.stock <= 5 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>

                        <td className="py-3 space-x-1">
                          {p.isFeatured && <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-bold">Featured</span>}
                          {p.isBestSeller && <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[9px] font-bold">Best Seller</span>}
                          {p.isPersonalized && <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[9px] font-bold">Engravable</span>}
                        </td>

                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct({ ...p });
                              setImageInputMode('upload');
                              setIsProductModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-rose-50 text-stone-600 hover:text-rose-600 cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Create Category Form (5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
                Create New Category
              </h3>

              <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Category Title</label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Scented Candles &amp; Aromas"
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Hand-poured soy wax candles infused with essential oils..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white resize-none"
                  />
                </div>

                {/* Category Image Selection */}
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">Category Cover Image</label>
                  
                  {/* Photo Mode Switcher */}
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setCatImageMode('upload')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        catImageMode === 'upload' ? 'bg-rose-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      <Upload className="w-3 h-3" /> From Gallery
                    </button>
                    <button
                      type="button"
                      onClick={() => setCatImageMode('gallery')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        catImageMode === 'gallery' ? 'bg-rose-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      <ImageIcon className="w-3 h-3" /> Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setCatImageMode('url')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        catImageMode === 'url' ? 'bg-rose-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      URL
                    </button>
                  </div>

                  {/* Mode: Upload */}
                  {catImageMode === 'upload' && (
                    <div>
                      <input 
                        type="file" 
                        ref={catFileInputRef}
                        onChange={(e) => handleFileUpload(e, 'category')}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => catFileInputRef.current?.click()}
                        className="w-full py-4 px-4 border-2 border-dashed border-rose-300 dark:border-rose-900/60 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50 text-rose-700 dark:text-rose-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Upload className="w-5 h-5" />
                        <span className="font-bold text-xs">Tap to choose photo from Phone / PC Gallery</span>
                      </button>
                    </div>
                  )}

                  {/* Mode: Presets */}
                  {catImageMode === 'gallery' && (
                    <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                      {PRESET_GALLERY.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectPreset(item.url, 'category')}
                          className="relative rounded-lg overflow-hidden border border-stone-300 dark:border-stone-600 hover:opacity-80 transition-all h-14 cursor-pointer"
                        >
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Mode: URL */}
                  {catImageMode === 'url' && (
                    <input
                      type="url"
                      value={newCatImage}
                      onChange={(e) => setNewCatImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                    />
                  )}

                  {/* Live Preview */}
                  {newCatImage && (
                    <div className="mt-2 flex items-center gap-2 p-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                      <img src={newCatImage} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Image Selected
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {isSubmitting ? "Creating Category..." : "Publish Category"}
                </button>
              </form>
            </div>

            {/* Existing Categories List (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
                Active Categories ({categories.length})
              </h3>

              <div className="space-y-3">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700" />
                      <div>
                        <h4 className="font-bold text-stone-900 dark:text-white text-sm">{cat.name}</h4>
                        <p className="text-[11px] text-stone-500">{cat.description || "Active category collection"}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-rose-600 font-bold bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900">
                      {cat.productCount !== undefined ? `${cat.productCount} items` : 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-2xl space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600">
                  {editingProduct._id ? "Edit Item" : "New Inventory Piece"}
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
                  {editingProduct._id ? `Edit "${editingProduct.name}"` : "Add New Product"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsProductModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              {/* Product Title */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Royal Rose Velvet Gift Hamper"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white font-medium"
                />
              </div>

              {/* Price, Discount, Stock Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Regular Price ($) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Sale / Discount Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingProduct.discountPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: e.target.value ? Number(e.target.value) : 0 })}
                    placeholder="Optional sale price"
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Available Stock Units *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Category *</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white cursor-pointer font-medium"
                >
                  {categories.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* ================= IMAGE SELECTOR (GALLERY UPLOAD / PRESETS / URL) ================= */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-rose-600" />
                    Product Photos (Select from Gallery or Presets)
                  </label>
                  <span className="text-[10px] text-stone-400">{(editingProduct.images || []).length} photo(s) selected</span>
                </div>

                {/* Mode Selector */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setImageInputMode('upload')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      imageInputMode === 'upload' 
                        ? 'bg-rose-600 text-white shadow-xs' 
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload from Gallery / PC
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageInputMode('gallery')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      imageInputMode === 'gallery' 
                        ? 'bg-rose-600 text-white shadow-xs' 
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Preset Luxury Photos
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageInputMode('url')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      imageInputMode === 'url' 
                        ? 'bg-rose-600 text-white shadow-xs' 
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    Custom URL
                  </button>
                </div>

                {/* 1. Device Gallery Upload */}
                {imageInputMode === 'upload' && (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileUpload(e, 'product')}
                      accept="image/*"
                      className="hidden"
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-rose-300 dark:border-rose-900/60 rounded-2xl p-6 bg-white dark:bg-stone-900/40 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-stone-800 dark:text-stone-200 text-xs">
                          Click here to open Phone Gallery or File Manager
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          Supports PNG, JPG, JPEG, WEBP (No URL needed!)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Curated Preset Gallery */}
                {imageInputMode === 'gallery' && (
                  <div>
                    <p className="text-[11px] text-stone-500 mb-2">Tap any photo below to set as product image:</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                      {PRESET_GALLERY.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectPreset(item.url, 'product')}
                          className="group relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 hover:border-rose-500 aspect-square cursor-pointer transition-all"
                        >
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <span className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-white text-[9px] p-1 font-bold truncate text-center">
                            {item.tag}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Custom URL Input */}
                {imageInputMode === 'url' && (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="Paste image link: https://images.unsplash.com/..."
                      className="flex-1 px-3.5 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustomUrl('product')}
                      className="px-4 py-2 bg-stone-900 dark:bg-stone-700 text-white font-bold rounded-xl text-xs hover:bg-rose-600 transition-colors cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>
                )}

                {/* Currently Attached Images Preview */}
                <div className="space-y-1.5 pt-2 border-t border-stone-200/70 dark:border-stone-700/70">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Current Product Images (First is Primary cover):</span>
                  <div className="flex flex-wrap gap-2.5">
                    {(editingProduct.images || []).map((imgUrl, index) => (
                      <div key={index} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-stone-300 dark:border-stone-700 shadow-xs">
                        <img src={imgUrl} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                        {index === 0 && (
                          <span className="absolute top-1 left-1 bg-rose-600 text-white text-[8px] font-bold px-1 rounded-sm shadow-xs">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Product Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Describe the items, materials, presentation and story..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white resize-none"
                />
              </div>

              {/* Badges & Flags */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={editingProduct.isPersonalized}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isPersonalized: e.target.checked })}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Custom Monogram &amp; Engraving Allowed</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Show in Featured Section</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBestSeller}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Best Seller Badge</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl font-bold uppercase tracking-wider shadow-md cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Product...</span>
                    </>
                  ) : (
                    <span>Save &amp; Publish</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ORDER DETAILS MODAL ================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Order Details</span>
                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
                  Invoice #{selectedOrderDetails.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Customer Info */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 space-y-1">
                <span className="font-bold text-stone-900 dark:text-white block">Recipient &amp; Contact:</span>
                <p className="text-stone-700 dark:text-stone-300 font-semibold">{selectedOrderDetails.customer?.name}</p>
                <p className="text-stone-500">{selectedOrderDetails.customer?.email} • {selectedOrderDetails.customer?.phone || 'No phone'}</p>
                <p className="text-stone-500">
                  {selectedOrderDetails.shippingAddress?.street}, {selectedOrderDetails.shippingAddress?.city}, {selectedOrderDetails.shippingAddress?.state} {selectedOrderDetails.shippingAddress?.zip}
                </p>
              </div>

              {/* Items */}
              <div>
                <span className="font-bold text-stone-900 dark:text-white block mb-2">Items in Package:</span>
                <div className="space-y-2">
                  {selectedOrderDetails.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
                      <div>
                        <p className="font-bold text-stone-900 dark:text-white">{it.quantity}x {it.name}</p>
                        {it.customText && (
                          <p className="text-[10px] text-rose-600 italic">Laser Engraving: "{it.customText}"</p>
                        )}
                        {it.giftWrapping && (
                          <p className="text-[10px] text-amber-600">Gift Wrap: {it.giftWrapping.name || it.giftWrapping}</p>
                        )}
                      </div>
                      <span className="font-bold text-stone-900 dark:text-white">${((it.price || 0) * (it.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-1 text-right">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal:</span>
                  <span>${selectedOrderDetails.subtotal?.toFixed(2)}</span>
                </div>
                {selectedOrderDetails.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount:</span>
                    <span>-${selectedOrderDetails.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-500">
                  <span>Shipping:</span>
                  <span>{selectedOrderDetails.shippingFee === 0 ? 'Free' : `$${selectedOrderDetails.shippingFee?.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-stone-900 dark:text-white font-bold text-sm pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span>Grand Total:</span>
                  <span className="text-rose-600">${selectedOrderDetails.grandTotal?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
