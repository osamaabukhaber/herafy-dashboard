
export interface OrderItem {
  _id?: string;
  product: string;
  store: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id?: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  coupon?: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'payment_failed' | 'refunded';
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  storeDeleted?: boolean;
  storeDeletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateOrderData {
  orderItems: Omit<OrderItem, '_id' | 'name' | 'price' | 'image' | 'store'>[];
  shippingAddress: ShippingAddress;
  coupon?: string;
}

export interface OrderResponse {
  status: string;
  statusCode: number;
  message: string;
  data: Order | { orders: Order[]; page: number; pages: number; total: number };
}

export interface UpdateOrderItemData {
  name?: string;
  quantity?: number;
  image?: File;
}
