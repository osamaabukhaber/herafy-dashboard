export interface IShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IOrderItem {
  _id?: string;
  product?: string; // Product ID (ObjectId as string)
  name?: string;
  quantity: number;
  price: number;
  total?: number;
}

export interface IOrder {
  _id: string; // Order ID (ObjectId as string)
  user: string; // User ID (ObjectId as string)
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  coupon?: string; // Coupon ID (ObjectId as string)
  subtotal: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paidAt?: Date | null;
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
  storeDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id: string; // User ID (ObjectId as string)
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface Ipayments {
  _id?: string; // MongoDB document ID
  order: IOrder; // Complete Order object
  user: IUser; // Complete User object
  amount: number;
  paymentMethod: 'credit_card' | 'paypal' | 'cash_on_delivery';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string; // From payment provider
  provider?: string; // e.g., Visa, PayPal, MasterCard
  error?: string; // Error message if failed
  stripeSessionId?: string | null; // Stripe Checkout session ID
  refundedAt?: Date | null; // Refund timestamp
  createdAt?: Date; // From timestamps: true
  updatedAt?: Date; // From timestamps: true
}
