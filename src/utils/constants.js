// FILE PURPOSE:
// - Define application-wide constants
// - Store order status pipeline and other fixed values
// - Centralize configuration values for easy maintenance

// Order Status Pipeline (DO NOT CHANGE)
export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'verification', label: 'Verification in Progress', color: 'blue' },
  { value: 'supplier_confirmation', label: 'Awaiting Supplier Confirmation', color: 'indigo' },
  { value: 'received', label: 'Received at Store', color: 'purple' },
  { value: 'testing', label: 'Under Testing', color: 'pink' },
  { value: 'preparing', label: 'Preparing Order', color: 'cyan' },
  { value: 'packed', label: 'Packed & Ready', color: 'teal' },
  { value: 'out_for_delivery', label: 'Out for Delivery', color: 'orange' },
  { value: 'delivered', label: 'Delivered', color: 'green' },
];

// Product Categories
export const PRODUCT_CATEGORIES = [
  'Commercial Laptops',
  'Business Laptops',
  'Gaming Laptops',
  'Workstation Laptops',
  'Ultrabooks',
  'Accessories',
  'Other',
];

// Product Conditions
export const PRODUCT_CONDITIONS = [
  { value: 'new', label: 'Brand New' },
  { value: 'refurbished', label: 'Refurbished' },
  { value: 'used_excellent', label: 'Used - Excellent' },
  { value: 'used_good', label: 'Used - Good' },
  { value: 'used_fair', label: 'Used - Fair' },
];

// User Roles
export const USER_ROLES = {
  GUEST: 'guest',
  USER: 'user',
  ADMIN: 'admin',
};

// Image Configuration
export const IMAGE_CONFIG = {
  MAX_SIZE_KB: 700,
  MAX_SIZE_BYTES: 700 * 1024,
  MAX_IMAGES_PER_PRODUCT: 5,
  ALLOWED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};

// Firestore Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CHATS: 'chats',
  MESSAGES: 'messages',
  STORE_SETTINGS: 'storeSettings',
  REVIEWS: 'reviews',
};

// Chat Configuration
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 1000,
  MESSAGES_PER_PAGE: 50,
};

// Pagination
export const PAGINATION = {
  PRODUCTS_PER_PAGE: 12,
  ORDERS_PER_PAGE: 10,
  CUSTOMERS_PER_PAGE: 20,
};

// Default Store Settings
export const DEFAULT_STORE_SETTINGS = {
  heroTitle: 'MITC - Premium Laptops',
  heroSubtitle: 'Commercial-Import and Business-Class Laptops',
  storeName: 'MITC Store',
  storeEmail: 'support@mitc.com',
  storePhone: '+91 1234567890',
  themeColor: '#3b82f6',
  logo: '',
  banners: [],
};

// Rating Configuration
export const RATING_CONFIG = {
  MIN_RATING: 1,
  MAX_RATING: 5,
};

// Notification Types
export const NOTIFICATION_TYPES = {
  ORDER_CREATED: 'order_created',
  ORDER_UPDATED: 'order_updated',
  ORDER_DELIVERED: 'order_delivered',
  PAYMENT_RECEIVED: 'payment_received',
  CHAT_MESSAGE: 'chat_message',
  PRODUCT_ADDED: 'product_added',
};

export default {
  ORDER_STATUSES,
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
  USER_ROLES,
  IMAGE_CONFIG,
  COLLECTIONS,
  CHAT_CONFIG,
  PAGINATION,
  DEFAULT_STORE_SETTINGS,
  RATING_CONFIG,
  NOTIFICATION_TYPES,
};