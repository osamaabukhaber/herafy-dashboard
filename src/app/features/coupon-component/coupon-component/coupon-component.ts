import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CouponInterface } from '../../../shared/models/coupon.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CouponService } from '../../../services/coupon-service/coupon-service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-coupon-component',
  imports: [FormsModule, CommonModule],
templateUrl: './coupon-component.html',
  styleUrl: './coupon-component.css'
})
export class CouponComponent {
  coupons: CouponInterface[] = [];
  loading = true;
  error: string | null = null
  couponId: string | null = null
  couponProps: CouponInterface = {} as CouponInterface;
  filterByCode: string = ''
  searchByActive: boolean = true
  constructor(private couponService: CouponService, private cdr: ChangeDetectorRef){}
  
  ngOnInit():void {
    this.couponService.getAllCupons().subscribe({
      next: (res) => {
        this.coupons = res.data.allCupons;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log( "error", error);
        this.error = ("Failed to get Coupons");
        this.loading = false;
        this.cdr.detectChanges()
      }
    })
  }
  // delete coupons
  deleteCoupon(id: string){
    if(!id){
      console.log("This Coupon is not found");
      return;
    }
    this.couponService.deleteCoupon(id).subscribe({
      next: () => {
        this.coupons = this.coupons.filter((coupon) => coupon._id !== id);
        console.log( "Deleted ID is: ",id);
        this.cdr.detectChanges()
      },
      error: (error) =>{
        console.log("Error: ", error)
      }
    })
  }
  // update coupon
  startEdit(coupon: CouponInterface):void {
    this.couponId = coupon._id;
    this.couponProps = {...coupon};
  }
  cancelEdit(): void{
    this.couponId = null;
    this.couponProps = {} as CouponInterface;
  }
  updateCoupon(): void{
   console.log("Saving click", this.couponProps);
   if(!this.couponProps._id){
    alert("Can't get coupon id");
    return
   }
   const updateData = {
    code: this.couponProps.code,
    type: this.couponProps.type,
    value: this.couponProps.value
   };
   console.log("saving updated data", this.couponProps._id);
   this.couponService.updateCoupon(this.couponProps._id, updateData).subscribe({
    next: () => {
      const index = this.coupons.findIndex(coupon => coupon._id === this.couponProps._id);
      if(index !== -1){
        this.coupons = this.coupons.map((i) => 
        i._id === this.couponProps._id ? {...i, ...updateData}: i)
      }
      this.couponId = null;
      this.couponProps = {} as CouponInterface;
      console.log("Coupon Updated succesfully");
      this.cdr.detectChanges()
    },
    error: (error) => {
      console.error("Error updating coupons", error)
    }
   })
  }
  // filter adn search coupons
  FilteredCoupons(): CouponInterface[]{
    let filterd = this.coupons;
    if(this.filterByCode){
      filterd = filterd.filter((coupon : CouponInterface) => 
      coupon.code.toLowerCase().includes(this.filterByCode.toLowerCase()))
    }
    if(this.searchByActive){
      filterd = filterd.filter((coupon: CouponInterface) => 
      coupon.active === this.searchByActive)
    }
    return filterd
  }
}
