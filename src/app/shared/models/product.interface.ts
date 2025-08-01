// import { User } from "../../component/user/user";
// import { Category } from "./category.interface";

import { Category } from "./category.interface";

// export interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   basePrice: number;
//   stock: number;
//   category: Category;
//   images: string[];
//   vendor: User;
//   status: 'In Stock' | 'Out of Stock' | 'Low Stock';
//   createdAt: string;
//   updatedAt: string;
// }

//*!

// export interface VariantOption {
//   value: string;
//   priceModifier: number;
//   stock: number;
//   sku: string;
// }

// export interface Variant {
//   name: string;
//   isDeleted: boolean;
//   options: VariantOption[];
// }

// export interface Product {
//   _id: string;
//   store: string;
//   name: string;
//   slug: string;
//   description: string;
//   basePrice: number;
//   discountPrice?: number;
//   discountStart?: Date;
//   discountEnd?: Date;
//   category: string;
//   images: string[];
//   variants: Variant[];
//   averageRating: number;
//   reviewCount: number;
//   createdBy: string;
//   isDeleted: boolean;
//   createdAt: string;
//   updatedAt: string;
// }



// // src/app/shared/models/product.interface.ts
// export interface ProductVariantOption {
//   value: string;
//   priceModifier: number;
//   stock: number;
//   sku: string;
// }

// export interface ProductVariant {
//   _id?: string;
//   name: string;
//   isDeleted: boolean;
//   options: ProductVariantOption[];
// }

// export interface Product {
//   _id?: string;
//   store: string;
//   name: string;
//   slug?: string;
//   description: string;
//   basePrice: number;
//   discountPrice: number;
//   discountStart?: Date;
//   discountEnd?: Date;
//   category: Category;
//   images: string[];
//   variants: ProductVariant[];
//   averageRating: number;
//   reviewCount: number;
//   createdBy: string;
//   isDeleted: boolean;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface ProductCreateRequest {
//   store: string;
//   name: string;
//   description: string;
//   basePrice: number;
//   discountPrice?: number;
//   discountStart?: Date;
//   discountEnd?: Date;
//   category: string;
//   images: string[];
//   variants?: ProductVariant[];
// }

// export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
//   _id: string;
// }

// export interface ProductSearchParams {
//   query?: string;
//   category?: string;
//   store?: string;
//   minPrice?: number;
//   maxPrice?: number;
//   page?: number;
//   limit?: number;
//   sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
//   sortOrder?: 'asc' | 'desc';
// }

// export interface ProductFilterState {
//   search: string;
//   category: string;
//   store: string;
//   priceRange: {
//     min: number;
//     max: number;
//   };
//   inStock: boolean;
//   onDiscount: boolean;
// }


//*!

export interface ProductVariantOption {
  value: string;
  priceModifier?: number;
  stock: number;
  sku: string;
}

export interface ProductVariant {
  name: string;
  isDeleted?: boolean;
  options: ProductVariantOption[];
}

export interface Product {
  _id: string;
  store: string;
  name: string;
  slug?: string;
  description: string;
  basePrice: number;
  discountPrice?: number;
  discountStart?: string | Date;
  discountEnd?: string | Date;
  category: Category;
  images: string[];
  variants: ProductVariant;
  // options: ProductVariantOption;
  averageRating?: number;
  reviewCount?: number;
  createdBy: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}







// export interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   originalPrice?: number;
//   category: string | Category;
//   store: string | Store;
//   images: string[];
//   variants?: ProductVariant[];
//   specifications?: Record<string, any>;
//   tags: string[];
//   isActive: boolean;
//   inStock: boolean;
//   stockQuantity: number;
//   sku: string;
//   weight?: number;
//   dimensions?: {
//     length: number;
//     width: number;
//     height: number;
//   };
//   rating: number;
//   reviewCount: number;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface ProductVariant {
//   _id: string;
//   name: string;
//   value: string;
//   price?: number;
//   stockQuantity?: number;
// }

// export interface Category {
//   _id: string;
//   name: string;
//   description?: string;
//   image?: string;
//   parent?: string;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Store {
//   _id: string;
//   name: string;
//   description?: string;
//   owner: string | User;
//   address: Address;
//   contactInfo: ContactInfo;
//   logo?: string;
//   banner?: string;
//   isActive: boolean;
//   rating: number;
//   reviewCount: number;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Address {
//   street: string;
//   city: string;
//   state: string;
//   country: string;
//   zipCode: string;
// }

// export interface ContactInfo {
//   phone: string;
//   email: string;
//   website?: string;
// }

// export interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// export interface CreateProductRequest {
//   name: string;
//   description: string;
//   price: number;
//   originalPrice?: number;
//   category: string;
//   store: string;
//   images: string[];
//   variants?: Omit<ProductVariant, '_id'>[];
//   specifications?: Record<string, any>;
//   tags: string[];
//   isActive?: boolean;
//   inStock?: boolean;
//   stockQuantity: number;
//   sku: string;
//   weight?: number;
//   dimensions?: {
//     length: number;
//     width: number;
//     height: number;
//   };
// }

// export interface UpdateProductRequest {
//   name?: string;
//   description?: string;
//   price?: number;
//   originalPrice?: number;
//   category?: string;
//   images?: string[];
//   variants?: ProductVariant[];
//   specifications?: Record<string, any>;
//   tags?: string[];
//   isActive?: boolean;
//   inStock?: boolean;
//   stockQuantity?: number;
//   weight?: number;
//   dimensions?: {
//     length: number;
//     width: number;
//     height: number;
//   };
// }

// export interface ProductFilters {
//   category?: string;
//   store?: string;
//   minPrice?: number;
//   maxPrice?: number;
//   inStock?: boolean;
//   isActive?: boolean;
//   search?: string;
//   tags?: string[];
//   page?: number;
//   limit?: number;
//   sortBy?: string;
//   sortOrder?: 'asc' | 'desc';
// }

// export interface ProductListResponse {
//   products: Product[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }
