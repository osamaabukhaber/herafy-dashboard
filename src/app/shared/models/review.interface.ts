import { User } from './user.interface';
export interface Review {
  _id: string;
  user: User | string;
  entityId: string;
  entityType: 'PRODUCT' | 'STORE';
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReviewApiResponse {
  status: string;
  data: {
    allReviews: Review[];
  };
  results?: number;
  pagination?: {
    totalReviews: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratings: RatingBreakdown[];
}

export interface RatingBreakdown {
  rating: number;
  count: number;
  percentage: number;
}
