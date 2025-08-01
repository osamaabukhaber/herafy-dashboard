// src/app/shared/utils/constants.ts
export const API_ENDPOINTS = {
  PRODUCTS: '/api/product',
  CATEGORIES: '/api/category',
  STORES: '/api/store',
  USERS: '/api/user',
  ORDERS: '/api/order',
  CARTS: '/api/cart',
  PAYMENTS: '/api/payment',
  REVIEWS: '/api/review',
  COUPONS: '/api/coupon',
  AUTH: '/api/auth'
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100
} as const;

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued'
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
} as const;
