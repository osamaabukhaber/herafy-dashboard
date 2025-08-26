// src/app/shared/models/category.interface.ts
export interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parent?: string;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CategoryResponse {
  success: boolean;
  data: {
    allCategories: Category[];
  };
  message?: string;
}
export interface NewCategoryResponse {
  status: string;
  data: {
    newCategory: Category;
  };
}