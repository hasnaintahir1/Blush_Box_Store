import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { initialProducts, initialCategories, initialReviews, initialOrders, initialContactMessages } from './seedData.js';

// Schema definitions
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  discountPercentage: { type: Number, default: 0 },
  images: [{ type: String }],
  category: { type: String, required: true },
  subcategory: { type: String },
  tags: [{ type: String }],
  occasions: [{ type: String }],
  recipients: [{ type: String }],
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  stock: { type: Number, default: 20 },
  sku: { type: String },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isPersonalized: { type: Boolean, default: false },
  personalizationPlaceholder: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  parentCategory: { type: String },
  isActive: { type: Boolean, default: true },
  icon: { type: String, default: "Gift" }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true },
  customer: {
    name: String,
    email: String,
    phone: String
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    giftMessage: String,
    customText: String
  }],
  subtotal: Number,
  discount: Number,
  couponCode: String,
  shippingFee: Number,
  tax: Number,
  grandTotal: Number,
  paymentMethod: String,
  paymentStatus: { type: String, default: "Pending" },
  orderStatus: { type: String, default: "Pending" },
  trackingNumber: String,
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "customer" },
  phone: String,
  wishlist: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  rating: { type: Number, required: true },
  title: { type: String },
  comment: { type: String, required: true },
  verifiedPurchase: { type: Boolean, default: true },
  status: { type: String, default: "approved" },
  createdAt: { type: Date, default: Date.now }
});

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);
export const CategoryModel = mongoose.models.Category || mongoose.model('Category', categorySchema);
export const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);
export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export const ReviewModel = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export const ContactModel = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);

// Memory & JSON persistent store
const DATA_FILE = path.join(process.cwd(), 'data', 'store_data.json');

class DataStore {
  constructor() {
    this.data = {
      products: [...initialProducts],
      categories: [...initialCategories],
      reviews: [...initialReviews],
      orders: [...initialOrders],
      users: [
        {
          _id: "usr-admin-1",
          name: "Lumière Concierge Admin",
          email: "admin@lumiere.com",
          password: "adminpassword123", // In production hashed
          role: "admin",
          phone: "+1 (555) 019-2831",
          wishlist: ["prod-1", "prod-5"],
          createdAt: new Date().toISOString()
        },
        {
          _id: "usr-demo-1",
          name: "Lady Penelope Ashworth",
          email: "penelope@luxurygifts.com",
          password: "password123",
          role: "customer",
          phone: "+1 (555) 432-8765",
          wishlist: ["prod-1", "prod-2", "prod-8"],
          createdAt: new Date().toISOString()
        }
      ],
      contactMessages: [...initialContactMessages],
      coupons: [
        { code: "LUMIERE20", discountPercentage: 20, minAmount: 50, description: "20% off luxury gifting" },
        { code: "VALENTINE15", discountPercentage: 15, minAmount: 40, description: "15% off romantic gifts" },
        { code: "WELCOME10", discountPercentage: 10, minAmount: 25, description: "10% off your first order" }
      ]
    };
    this.init();
  }

  init() {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
          this.data = parsed;
        } else {
          this.save();
        }
      } else {
        this.save();
      }
    } catch (e) {
      console.warn("Using in-memory data store:", e.message);
    }
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2));
    } catch (err) {
      console.error("Failed to save data store:", err.message);
    }
  }

  resetToSeed() {
    this.data.products = [...initialProducts];
    this.data.categories = [...initialCategories];
    this.data.reviews = [...initialReviews];
    this.data.orders = [...initialOrders];
    this.data.contactMessages = [...initialContactMessages];
    this.save();
    return this.data;
  }
}

export const dataStore = new DataStore();

// Connect MongoDB with automatic sync
export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://hasnain:lrwoQ7v3ZF2KYfgR@cluster0.nes0bku.mongodb.net/blushbox?retryWrites=true&w=majority';
  if (uri) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log(" Connected to MongoDB Atlas (blushbox) successfully!");

      // Sync initial data into MongoDB if empty, or load from MongoDB if already populated
      try {
        const productCount = await ProductModel.countDocuments();
        if (productCount === 0) {
          console.log("Seeding MongoDB blushbox database with initial products and categories...");
          await ProductModel.insertMany(dataStore.data.products.map(p => {
            const { _id, ...rest } = p;
            return rest;
          }));
          await CategoryModel.insertMany(dataStore.data.categories.map(c => {
            const { _id, ...rest } = c;
            return rest;
          }));
          console.log(" MongoDB seeded with initial catalog successfully.");
        } else {
          // Load stored MongoDB products to keep in-memory store synchronized
          const dbProducts = await ProductModel.find().lean();
          if (dbProducts && dbProducts.length > 0) {
            dataStore.data.products = dbProducts.map(p => ({ ...p, _id: p._id.toString() }));
          }
          const dbCategories = await CategoryModel.find().lean();
          if (dbCategories && dbCategories.length > 0) {
            dataStore.data.categories = dbCategories.map(c => ({ ...c, _id: c._id.toString() }));
          }
          console.log(` Loaded ${dbProducts.length} products and ${dbCategories.length} categories from MongoDB.`);
        }
      } catch (syncErr) {
        console.warn("MongoDB initial collection sync notice:", syncErr.message);
      }
    } catch (error) {
      console.warn("MongoDB connection failed, operating with resilient persistent store:", error.message);
    }
  } else {
    console.log("Using embedded high-performance JSON/Memory database store.");
  }
}
