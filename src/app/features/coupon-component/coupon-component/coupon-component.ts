import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICoupon } from '../../../shared/models/coupon.interface';
import { CouponService } from '../../../services/coupon-service/coupon-service';

@Component({
  selector: 'app-coupon-component',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor, NgClass],
  templateUrl: './coupon-component.html',
  styleUrl: './coupon-component.css',
})
export class CouponComponent implements OnInit {
  coupons: ICoupon[] = [];
  loading = true;
  error: string | null = null;

  // For editing
  editCouponId: string | null = null;

  // For search
  searchTerm: string = '';
  searchByActive: boolean = true;

  // For adding new coupon
  addingNew: boolean = false;
  newCoupon: Partial<ICoupon> = this.getEmptyCoupon();
  // pagination
  currentPage: number = 1;
  limit: number = 5;
  constructor(
    private couponService: CouponService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchCoupons();
    this.couponpagination()
  }
  // pagination
  couponpagination(): void{
    this.loading = true;
    this.couponService.getAllCupons(this.currentPage, this.limit).subscribe({
      next: (res) => {
        this.coupons = res.data.allCupons;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Falied';
        this.loading = false
      }
    })
  }
  // next page
  nextPage(): void{
    this.currentPage++;
    this.couponpagination()
  }
  // previous pagination
  previousPage(): void{
    if(this.currentPage > 1){
      this.currentPage--;
      this.couponpagination()
    }
  }
  canPaginate(): boolean{
    return this.coupons.length === this.limit
  }
  private getEmptyCoupon(): Partial<ICoupon> {
    return {
      code: '',
      type: 'fixed',
      value: 0,
      minCartTotal: 0,
      maxDiscount: 0,
      expiryDate: '',
      usageLimit: 1,
      usedCount: 0,
      active: true,
    };
  }

  private fetchCoupons(): void {
    this.couponService.getAllCupons().subscribe({
      next: (res) => {
        this.coupons = res.data.allCupons;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to get Coupons', error);
        this.error = 'Failed to get Coupons';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  // Edit functions
  editCoupon(coupon: ICoupon): void {
    this.editCouponId = coupon._id;
  }

  cancelEdit(): void {
    this.editCouponId = null;
    // Refresh data to reset any changes
    this.fetchCoupons();
  }

  updateCoupon(coupon: ICoupon): void {
    if (!coupon._id) return;

    const updateData: Partial<ICoupon> = {
      code: coupon.code,
      type: coupon.type,
      value: +coupon.value,
      minCartTotal: +coupon.minCartTotal,
      maxDiscount: coupon.maxDiscount ? +coupon.maxDiscount : 0,
      expiryDate: new Date(coupon.expiryDate).toISOString(),
      usageLimit: +coupon.usageLimit,
      active: coupon.active,
    };

    this.couponService.updateCoupon(coupon._id, updateData).subscribe({
      next: (res) => {
        const index = this.coupons.findIndex((c) => c._id === coupon._id);
        if (index !== -1) {
          // Update with the response data if available, otherwise use the local coupon data
          this.coupons[index] = res.data?.cupon || coupon;
        }
        this.editCouponId = null;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error updating coupon', error);
        this.editCouponId = null;
      },
    });
  }

  // Delete function
  deleteCoupon(id: string): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this coupon?')) {
      this.couponService.deleteCoupon(id).subscribe({
        next: () => {
          this.coupons = this.coupons.filter((coupon) => coupon._id !== id);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error deleting coupon', error);
        },
      });
    }
  }

  // Add functions
  addCoupon(): void {
    const body: Partial<ICoupon> = {
      code: this.newCoupon.code,
      type: this.newCoupon.type,
      value: +(this.newCoupon.value || 0),
      minCartTotal: +(this.newCoupon.minCartTotal || 0),
      maxDiscount: +(this.newCoupon.maxDiscount || 0),
      expiryDate: this.newCoupon.expiryDate
        ? new Date(this.newCoupon.expiryDate).toISOString()
        : '',
      usageLimit: +(this.newCoupon.usageLimit || 1),
      active: this.newCoupon.active !== false, // default to true
    };

    this.couponService.addCupon(body as ICoupon).subscribe({
      next: (res) => {
        // Use the response data if available, otherwise use the body data
        this.coupons.push(res.data?.cupon || (body as ICoupon));
        this.newCoupon = this.getEmptyCoupon();
        this.addingNew = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error adding coupon', err);
      },
    });
  }

  cancelAdd(): void {
    this.addingNew = false;
    this.newCoupon = this.getEmptyCoupon();
  }

  // Filter function - matches the HTML template
  FilteredCoupons(): ICoupon[] {
    return this.coupons.filter((coupon) => {
      const matchesCode = this.searchTerm
        ? coupon.code.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      // For now, just filter by search term. You can add active filter later
      return matchesCode;
    });
  }
}
