export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Policies {
  shipping: string;
  returns: string;
}

export interface storeAddress {
  city: string;
  postalCode: string;
  street: string;
}
export interface IStore {
  _id: string;
  owner?: string;
  name: string;
  slug?: string;
  description: string;
  logoUrl: string;
  status: string;
  location: Location;
  address: storeAddress;
  categorieCount?: number;
  couponsUsed?: number;
  productCount?: number;
  ordersCount?: number;
  policies: Policies;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
