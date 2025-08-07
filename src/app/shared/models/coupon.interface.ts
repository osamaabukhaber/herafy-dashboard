export interface ICoupon {
  _id: string;
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
  minCartTotal: number;
  maxDiscount: number | null;
  expiryDate: string; // or Date
  usageLimit: number;
  usedCount: number;
  active: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface CouponListResponse {
  status: string; // should match values like httpStatus.SUCCESS
  data: {
    allCupons: ICoupon[];
  };
}
export interface CouponResponse {
  status: string;
  data: {
    cupon: ICoupon; // used in getCuponById
  };
}
