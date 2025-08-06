export interface CouponInterface {
    _id: string,
    code: string,
    type: 'fixed' | 'percentage';
    value: number,
    minCartTotal: number,
    maxDiscount: number | null;
    expiryDate: string | Date;
    usageLimit: number,
    usedCount: number,
    active: boolean,
    isDeleted: boolean
}
