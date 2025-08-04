// src/app/shared/models/category.interface.ts
export interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parent?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}
