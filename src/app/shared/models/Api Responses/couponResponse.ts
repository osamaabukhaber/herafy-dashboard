import { CouponInterface } from './../coupon.interface';

export interface CouponResponse{
    status: string;
    data: {
        allCupons: CouponInterface[];
    }
}