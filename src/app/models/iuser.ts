/* export interface IAddress {
  buildingNo: number;
  street: string;
  nearestLandMark?: string;
  city: string;
  governorate: string;
  country?: string; // default is 'Egypt' on backend
  addressType: 'home' | 'work';
  isDefault?: boolean;
}
 */
export interface IUser {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional because it's hidden in responses and not needed for Google sign-in
  phone?: string;
  role?: 'admin' | 'customer' | 'vendor'; // Inline user role type
  googleId?: string;
  addresses?: {
    buildingNo: number;
    street: string;
    nearestLandMark?: string;
    city: string;
    governorate: string;
    country?: string; // default is 'Egypt' on backend
    addressType: 'home' | 'work';
    isDefault?: boolean;
  }[];
  wishlist?: string[]; // Product IDs
  storesCount?: number;
  ordersCount?: number;
  cancelledOrders?: number;
  activeOrders?: number;
  createdAt?: string;
  updatedAt?: string;
}
