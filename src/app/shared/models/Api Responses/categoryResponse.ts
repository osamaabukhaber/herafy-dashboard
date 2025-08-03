import { Category } from "../category.interface";

export interface CategoryResponse {
    status: string;
    data:{
        category: Category[];
    }
}