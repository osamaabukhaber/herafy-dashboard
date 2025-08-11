export interface ICartItem {
  product: Record<string, any>; // ObjectId (MongoDB string)
  quantity: number;
  variant?: any; // { Color: 'Red', Size: 'Large' } etc.
  price: number;
}

export interface ICart {
  _id?: string;
  user: Record<string, any>; // ObjectId (user reference)
  items: ICartItem[];
  coupon?: string; // ObjectId (coupon reference)
  total: number;
  discount: number;
  totalAfterDiscount: number;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}
