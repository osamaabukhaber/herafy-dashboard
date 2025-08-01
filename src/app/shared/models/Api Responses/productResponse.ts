import { Product } from "../product.interface";

export interface ProductListBackendResponse {
  status: 'success' | 'error';
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  message?: string;
  error?: string;
}
