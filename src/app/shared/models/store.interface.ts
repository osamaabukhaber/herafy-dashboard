// src/app/shared/models/store.interface.ts

export interface Store {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  owner: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
