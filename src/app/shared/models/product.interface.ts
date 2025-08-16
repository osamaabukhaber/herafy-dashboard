import { IStore } from "../../models/store-model/istore";
import { Category } from "./category.interface";


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
  store: IStore;
  name: string;
  slug?: string;
  status:string;
  description: string;
  basePrice: number;
  discountPrice?: number;
  discountStart?: string | Date;
  discountEnd?: string | Date;
  category: Category;
  images: string[];
  variants: ProductVariant[];
  // options: ProductVariantOption;
  averageRating?: number;
  reviewCount?: number;
  createdBy: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}





