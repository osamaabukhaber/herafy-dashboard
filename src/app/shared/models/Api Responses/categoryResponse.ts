import { Category } from "../category.interface";

export interface CategoryResponse {
    status: string;
    data:{
        allCategories: Category[];
    }
}