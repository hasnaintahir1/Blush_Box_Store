import express from 'express';
import jwt from 'jsonwebtoken';
import { dataStore } from './db.js';
import { handleAIAssistantChat } from './ai.js';
import { sendOrderNotificationEmail } from './email.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'lumiere_luxury_gifting_secret_key_2026';

// Helper to create slugs
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// ---------------- PRODUCTS ----------------

// GET /api/products (With full filters, search, sorting, pagination)
router.get('/products', (req, res) => {
  try {
    let { 
      search, 
      category, 
      subcategory, 
      occasion, 
      recipient, 
      budget,
      minPrice, 
      maxPrice, 
      rating, 
      featured, 
      bestSeller, 
      newArrival,
      inStock,
      sort = 'featured',
      page = 1, 
      limit = 50 
    } = req.query;

    let items = [...dataStore.data.products];

    // Search
    if (search) {
      const q = search.toLowerCase().trim();
      items = items.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.occasions && p.occasions.some(o => o.toLowerCase().includes(q))) ||
        (p.recipients && p.recipients.some(r => r.toLowerCase().includes(q)))
      );
    }

    // Category filter
    if (category && category !== 'all') {
      const catL = category.toLowerCase().replace(/-/g, ' ');
      items = items.filter(p => 
        p.category.toLowerCase().replace(/-/g, ' ') === catL ||
        slugify(p.category) === category
      );
    }

    // Subcategory filter
    if (subcategory && subcategory !== 'all') {
      items = items.filter(p => p.subcategory && p.subcategory.toLowerCase() === subcategory.toLowerCase());
    }

    // Occasion filter
    if (occasion && occasion !== 'all') {
      const occL = occasion.toLowerCase().replace(/-/g, ' ');
      items = items.filter(p => 
        p.occasions && p.occasions.some(o => o.toLowerCase().replace(/-/g, ' ').includes(occL) || slugify(o) === occasion)
      );
    }

    // Recipient filter
    if (recipient && recipient !== 'all') {
      const recL = recipient.toLowerCase().replace(/-/g, ' ');
      items = items.filter(p => 
        p.recipients && p.recipients.some(r => r.toLowerCase().replace(/-/g, ' ').includes(recL) || slugify(r) === recipient)
      );
    }

    // Budget quick filter
    if (budget) {
      if (budget === 'under-25') items = items.filter(p => (p.discountPrice || p.price) <= 25);
      else if (budget === '25-50') items = items.filter(p => (p.discountPrice || p.price) >= 25 && (p.discountPrice || p.price) <= 50);
      else if (budget === '50-100') items = items.filter(p => (p.discountPrice || p.price) >= 50 && (p.discountPrice || p.price) <= 100);
      else if (budget === '100-200') items = items.filter(p => (p.discountPrice || p.price) >= 100 && (p.discountPrice || p.price) <= 200);
      else if (budget === 'luxury') items = items.filter(p => (p.discountPrice || p.price) >= 150);
    }

    // Price range
    if (minPrice) {
      items = items.filter(p => (p.discountPrice || p.price) >= Number(minPrice));
    }
    if (maxPrice) {
      items = items.filter(p => (p.discountPrice || p.price) <= Number(maxPrice));
    }

    // Rating
    if (rating) {
      items = items.filter(p => p.rating >= Number(rating));
    }

    // Flags
    if (featured === 'true') items = items.filter(p => p.isFeatured);
    if (bestSeller === 'true') items = items.filter(p => p.isBestSeller);
    if (newArrival === 'true') items = items.filter(p => p.isNewArrival);
    if (inStock === 'true') items = items.filter(p => p.stock > 0);

    // Sorting
    switch (sort) {
      case 'price-asc':
        items.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-desc':
        items.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      case 'best-sellers':
        items.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        break;
      case 'newest':
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'featured':
      default:
        items.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    const total = items.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const paginated = items.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      success: true,
      products: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:idOrSlug
router.get('/products/:idOrSlug', (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const product = dataStore.data.products.find(p => p._id === idOrSlug || p.slug === idOrSlug);
    
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    // Find related products in same category or matching occasions
    const related = dataStore.data.products
      .filter(p => p._id !== product._id && (p.category === product.category || (p.occasions && product.occasions && p.occasions.some(o => product.occasions.includes(o)))))
      .slice(0, 4);

    // Reviews for this product
    const reviews = dataStore.data.reviews.filter(r => r.productId === product._id);

    res.json({
      success: true,
      product,
      related,
      reviews
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/products/:id (Admin Full Update)
router.put(['/products/:id', '/admin/products/:id'], (req, res) => {
  try {
    const { id } = req.params;
    const index = dataStore.data.products.findIndex(p => p._id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    const existing = dataStore.data.products[index];
    const updated = {
      ...existing,
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
      discountPrice: req.body.discountPrice !== undefined ? Number(req.body.discountPrice) : existing.discountPrice,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
      rating: req.body.rating !== undefined ? Number(req.body.rating) : existing.rating,
      images: Array.isArray(req.body.images) && req.body.images.length > 0 ? req.body.images : (req.body.images ? [req.body.images] : existing.images),
      updatedAt: new Date().toISOString()
    };

    dataStore.data.products[index] = updated;
    dataStore.save();

    res.json({ success: true, product: updated, message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products and /api/admin/products (Admin Create)
router.post(['/products', '/admin/products'], (req, res) => {
  try {
    const body = req.body;
    if (!body.name || body.price === undefined || !body.category) {
      return res.status(400).json({ success: false, error: "Name, price, and category are required" });
    }

    const newProduct = {
      _id: `prod-${Date.now()}`,
      name: body.name,
      slug: slugify(body.name) + '-' + Math.floor(Math.random() * 1000),
      description: body.description || "",
      shortDescription: body.shortDescription || body.description?.slice(0, 100) || "",
      price: Number(body.price),
      discountPrice: body.discountPrice ? Number(body.discountPrice) : Number(body.price),
      discountPercentage: body.discountPercentage ? Number(body.discountPercentage) : (body.discountPrice && body.discountPrice < body.price ? Math.round(((body.price - body.discountPrice) / body.price) * 100) : 0),
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : (body.images ? [body.images] : ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop"]),
      category: body.category,
      subcategory: body.subcategory || "",
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map(t => t.trim()) : []),
      occasions: Array.isArray(body.occasions) ? body.occasions : (body.occasions ? body.occasions.split(',').map(o => o.trim()) : ["All Occasions"]),
      recipients: Array.isArray(body.recipients) ? body.recipients : (body.recipients ? body.recipients.split(',').map(r => r.trim()) : ["For Everyone"]),
      rating: Number(body.rating) || 5.0,
      reviewsCount: Number(body.reviewsCount) || 0,
      stock: Number(body.stock) || 25,
      sku: body.sku || `BB-${Math.floor(1000 + Math.random() * 9000)}`,
      isFeatured: Boolean(body.isFeatured),
      isBestSeller: Boolean(body.isBestSeller),
      isNewArrival: Boolean(body.isNewArrival !== false),
      isPersonalized: Boolean(body.isPersonalized),
      personalizationPlaceholder: body.personalizationPlaceholder || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dataStore.data.products.unshift(newProduct);
    dataStore.save();

    res.status(201).json({ success: true, product: newProduct, message: "Product created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/products/:id (Admin Update)
router.patch(['/products/:id', '/admin/products/:id'], (req, res) => {
  try {
    const { id } = req.params;
    const index = dataStore.data.products.findIndex(p => p._id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    const existing = dataStore.data.products[index];
    const updated = {
      ...existing,
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
      discountPrice: req.body.discountPrice !== undefined ? Number(req.body.discountPrice) : existing.discountPrice,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
      rating: req.body.rating !== undefined ? Number(req.body.rating) : existing.rating,
      images: Array.isArray(req.body.images) && req.body.images.length > 0 ? req.body.images : existing.images,
      updatedAt: new Date().toISOString()
    };

    dataStore.data.products[index] = updated;
    dataStore.save();

    res.json({ success: true, product: updated, message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/products/:id (Admin Delete)
router.delete(['/products/:id', '/admin/products/:id'], (req, res) => {
  try {
    const { id } = req.params;
    const initialLen = dataStore.data.products.length;
    dataStore.data.products = dataStore.data.products.filter(p => p._id !== id);

    if (dataStore.data.products.length === initialLen) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    dataStore.save();
    res.json({ success: true, message: "Product removed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/upload (Image Upload)
router.post('/upload', (req, res) => {
  try {
    const { image, name } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: "Image data is required" });
    }
    // Return the image data URI as URL (instant storage)
    res.json({ success: true, url: image, name: name || "uploaded_image" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- CATEGORIES ----------------

// GET /api/categories and /api/admin/categories
router.get(['/categories', '/admin/categories'], (req, res) => {
  try {
    // Add real product counts
    const categoriesWithCounts = dataStore.data.categories.map(cat => {
      const count = dataStore.data.products.filter(p => p.category === cat.name).length;
      return { ...cat, productCount: count };
    });
    res.json({ success: true, categories: categoriesWithCounts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/categories (Admin Create)
router.post(['/categories', '/admin/categories'], (req, res) => {
  try {
    const { name, description, image, parentCategory, icon } = req.body;
    if (!name) return res.status(400).json({ success: false, error: "Name is required" });

    const newCat = {
      _id: `cat-${Date.now()}`,
      name,
      slug: slugify(name),
      description: description || "",
      image: image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
      parentCategory: parentCategory || null,
      isActive: true,
      icon: icon || "Gift"
    };

    dataStore.data.categories.push(newCat);
    dataStore.save();

    res.status(201).json({ success: true, category: newCat, message: "Category created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/categories/:id
router.patch(['/categories/:id', '/admin/categories/:id'], (req, res) => {
  try {
    const { id } = req.params;
    const index = dataStore.data.categories.findIndex(c => c._id === id);
    if (index === -1) return res.status(404).json({ success: false, error: "Category not found" });

    dataStore.data.categories[index] = { ...dataStore.data.categories[index], ...req.body };
    dataStore.save();
    res.json({ success: true, category: dataStore.data.categories[index], message: "Category updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/categories/:id
router.delete(['/categories/:id', '/admin/categories/:id'], (req, res) => {
  try {
    const { id } = req.params;
    dataStore.data.categories = dataStore.data.categories.filter(c => c._id !== id);
    dataStore.save();
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- ORDERS ----------------

// GET /api/orders and /api/admin/orders (Admin all / Customer user orders)
router.get(['/orders', '/admin/orders'], (req, res) => {
  try {
    const { email } = req.query;
    let list = [...dataStore.data.orders];
    if (email) {
      list = list.filter(o => o.customer && o.customer.email.toLowerCase() === email.toLowerCase());
    }
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, orders: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/:id
router.get('/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const order = dataStore.data.orders.find(o => o._id === id || o.orderNumber === id);
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/orders (Customer Checkout)
router.post('/orders', async (req, res) => {
  try {
    const { customer, shippingAddress, items, subtotal, discount, couponCode, shippingFee, tax, grandTotal, paymentMethod, giftNote } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: "Cart is empty" });
    }
    if (!customer || !customer.email || !customer.name) {
      return res.status(400).json({ success: false, error: "Customer information is required" });
    }

    const orderNumber = `BLUSH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      _id: `ord-${Date.now()}`,
      orderNumber,
      customer,
      shippingAddress: shippingAddress || {},
      items,
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      couponCode: couponCode || null,
      shippingFee: Number(shippingFee) || 0,
      tax: Number(tax) || 0,
      grandTotal: Number(grandTotal) || 0,
      paymentMethod: paymentMethod || "Credit Card",
      paymentStatus: "Paid",
      orderStatus: "Confirmed",
      trackingNumber: `BLUSH-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      giftNote: giftNote || null,
      createdAt: new Date().toISOString()
    };

    // Decrement stock for purchased products
    for (const it of items) {
      const p = dataStore.data.products.find(prod => prod._id === it.productId);
      if (p && p.stock > 0) {
        p.stock = Math.max(0, p.stock - (it.quantity || 1));
      }
    }

    dataStore.data.orders.unshift(newOrder);
    dataStore.save();

    // Trigger async email notification to admin (hasnaintahir605@gmail.com) and customer
    sendOrderNotificationEmail(newOrder).catch(emailErr => {
      console.warn("Background email notification error:", emailErr.message);
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/orders/:id/status and /api/admin/orders/:id/status (Admin status update)
router.patch(['/orders/:id/status', '/admin/orders/:id/status'], (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = dataStore.data.orders.find(o => o._id === id || o.orderNumber === id);
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });

    if (status) order.orderStatus = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    dataStore.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- AUTHENTICATION ----------------

// POST /api/auth/register
router.post('/auth/register', (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "Name, email, and password are required" });
    }

    const existing = dataStore.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    const newUser = {
      _id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password, // in real app hashed
      role: "customer",
      phone: phone || "",
      wishlist: [],
      createdAt: new Date().toISOString()
    };

    dataStore.data.users.push(newUser);
    dataStore.save();

    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        wishlist: newUser.wishlist
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/login
router.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    // Check if it's admin master login
    const isAdminEmail = cleanEmail === 'admin@blushbox.com' || 
                         cleanEmail === 'admin@lumiere.com' || 
                         cleanEmail === 'admin' ||
                         cleanEmail === 'hasnaintahir605@gmail.com';
    const isAdminPass = cleanPassword === 'adminpassword123' || 
                        cleanPassword === 'admin123' || 
                        cleanPassword === 'admin';

    let user = dataStore.data.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (isAdminEmail && isAdminPass) {
      if (!user) {
        user = {
          _id: "usr-admin-1",
          name: "Blush Box Admin",
          email: cleanEmail.includes('@') ? cleanEmail : "admin@blushbox.com",
          password: cleanPassword,
          role: "admin",
          phone: "+1 (555) 019-2831",
          wishlist: []
        };
        dataStore.data.users.push(user);
        dataStore.save();
      } else {
        user.role = "admin"; // Ensure admin role is granted
      }
    } else if (!user || user.password !== password) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        wishlist: user.wishlist || []
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/customers
router.get('/admin/customers', (req, res) => {
  try {
    const customers = dataStore.data.users.map(u => {
      const userOrders = dataStore.data.orders.filter(o => o.customer && o.customer.email.toLowerCase() === u.email.toLowerCase());
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        ordersCount: userOrders.length,
        totalSpent: Math.round(totalSpent * 100) / 100,
        createdAt: u.createdAt
      };
    });
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- REVIEWS ----------------

// GET /api/reviews
router.get('/reviews', (req, res) => {
  try {
    const { productId } = req.query;
    let list = [...dataStore.data.reviews];
    if (productId) list = list.filter(r => r.productId === productId);
    res.json({ success: true, reviews: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/reviews
router.post('/reviews', (req, res) => {
  try {
    const { productId, userName, userEmail, rating, title, comment } = req.body;
    if (!productId || !userName || !comment) {
      return res.status(400).json({ success: false, error: "Product, name, and comment are required" });
    }

    const newRev = {
      _id: `rev-${Date.now()}`,
      productId,
      userName,
      userEmail: userEmail || "guest@example.com",
      rating: Number(rating) || 5,
      title: title || "",
      comment,
      verifiedPurchase: true,
      status: "approved",
      createdAt: new Date().toISOString()
    };

    dataStore.data.reviews.unshift(newRev);

    // Update product rating and review count
    const prod = dataStore.data.products.find(p => p._id === productId);
    if (prod) {
      const prodRevs = dataStore.data.reviews.filter(r => r.productId === productId);
      const avg = prodRevs.reduce((s, r) => s + r.rating, 0) / prodRevs.length;
      prod.rating = Math.round(avg * 10) / 10;
      prod.reviewsCount = prodRevs.length;
    }

    dataStore.save();
    res.status(201).json({ success: true, review: newRev });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/reviews/:id (Admin delete)
router.delete('/reviews/:id', (req, res) => {
  try {
    const { id } = req.params;
    dataStore.data.reviews = dataStore.data.reviews.filter(r => r._id !== id);
    dataStore.save();
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- CONTACT MESSAGES ----------------

// POST /api/contact
router.post('/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Name, email, and message are required" });
    }

    const newMsg = {
      _id: `msg-${Date.now()}`,
      name,
      email,
      subject: subject || "Customer Inquiry",
      message,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    dataStore.data.contactMessages.unshift(newMsg);
    dataStore.save();

    res.status(201).json({ success: true, message: "Thank you. Our luxury concierge will respond shortly." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/contact (Admin)
router.get('/contact', (req, res) => {
  try {
    res.json({ success: true, messages: dataStore.data.contactMessages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/contact/:id/read
router.patch('/contact/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const msg = dataStore.data.contactMessages.find(m => m._id === id);
    if (msg) {
      msg.isRead = true;
      dataStore.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/contact/:id
router.delete('/contact/:id', (req, res) => {
  try {
    const { id } = req.params;
    dataStore.data.contactMessages = dataStore.data.contactMessages.filter(m => m._id !== id);
    dataStore.save();
    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- COUPONS ----------------

// POST /api/coupons/validate
router.post('/coupons/validate', (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ success: false, error: "Coupon code required" });

    const coupon = (dataStore.data.coupons || []).find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return res.status(404).json({ success: false, error: "Invalid coupon code" });
    }

    if (subtotal < coupon.minAmount) {
      return res.status(400).json({ success: false, error: `Minimum order of $${coupon.minAmount} required for this code` });
    }

    const discountAmount = Math.round((subtotal * (coupon.discountPercentage / 100)) * 100) / 100;

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        discountAmount,
        description: coupon.description
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- ADMIN ANALYTICS ----------------

// GET /api/admin/stats and /api/admin/analytics
router.get(['/admin/stats', '/admin/analytics'], (req, res) => {
  try {
    const products = dataStore.data.products;
    const orders = dataStore.data.orders;
    const users = dataStore.data.users;

    const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const pendingOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;
    const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
    const lowStockProducts = products.filter(p => p.stock <= 5).length;

    // Monthly / recent chart metrics
    const salesByDay = [
      { name: "Mon", sales: 1420, orders: 8 },
      { name: "Tue", sales: 2180, orders: 12 },
      { name: "Wed", sales: 1890, orders: 10 },
      { name: "Thu", sales: 2750, orders: 15 },
      { name: "Fri", sales: 3400, orders: 18 },
      { name: "Sat", sales: 4200, orders: 24 },
      { name: "Sun", sales: 3890, orders: 21 },
    ];

    res.json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: users.filter(u => u.role === 'customer').length,
        pendingOrders,
        deliveredOrders,
        lowStockProducts,
        recentOrders: orders.slice(0, 5),
        salesChart: salesByDay
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/reset-seed
router.post('/admin/reset-seed', (req, res) => {
  try {
    dataStore.resetToSeed();
    res.json({ success: true, message: "Database reseeded successfully with realistic luxury inventory!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- AI GIFTING ASSISTANT ----------------

// POST /api/ai/assistant
router.post('/ai/assistant', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    const result = await handleAIAssistantChat({ message, chatHistory });
    res.json({
      success: true,
      reply: result.reply,
      recommendedProducts: result.recommendedProducts,
      isRefusal: Boolean(result.isRefusal)
    });
  } catch (err) {
    console.error("AI Assistant error:", err);
    res.status(500).json({ 
      success: false, 
      reply: "I am temporarily curating recommendations. Please browse our luxury gift hampers or refined jewelry collections.",
      recommendedProducts: dataStore.data.products.slice(0, 2)
    });
  }
});

export default router;
