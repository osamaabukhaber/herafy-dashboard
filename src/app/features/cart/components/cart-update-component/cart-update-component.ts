import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { IcartItemResponce } from '../../../../models/cart-model/icart-item-responce';

@Component({
  selector: 'app-admin-cart-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./cart-update-component.html"
})
export class AdminCartUpdateComponent implements OnInit {
  cartForm!: FormGroup;
  cartId!: string;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cartId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadCart();
  }

  initForm() {
    this.cartForm = this.fb.group({
      user: [null, Validators.required],
      items: this.fb.array([]),
      coupon: [''],
      isDeleted: [false],
    });
  }

  newItem(item?: any): FormGroup {
    return this.fb.group({
      product: [item?.product?._id || null, Validators.required],
      quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
      variant: this.createVariantGroup(item?.variant || {}),
      price: [item?.price || 0, [Validators.required, Validators.min(0)]],
    });
  }

  createVariantGroup(variant?: { name?: string; value?: string }): FormGroup {
    return this.fb.group({
      name: [variant?.name || '', Validators.required],
      value: [variant?.value || '', Validators.required],
    });
  }


  loadCart() {
    this.cartService.getCartById(this.cartId).subscribe({
      next: (res: IcartItemResponce) => {
        const cart = res.data.cart;
        if (!cart) {
          this.router.navigate(['/cart']);
          return;
        }
        console.log('Cart data loaded:', cart);
        this.cartForm.patchValue({
          user: cart.user["_id"] || null,
          coupon: cart.coupon || '',
          isDeleted: cart.isDeleted || false
        });

        this.items.clear();
        cart.items.forEach(item => {
          this.items.push(this.newItem(item));
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  addItem() {
    this.items.push(this.newItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

onSubmit() {
  if (this.cartForm.invalid) return;

  const formValue = this.cartForm.value;

  console.log('Updating cart with ID:', this.cartId);
  console.log('Updated cart data (formatted):', formValue);

  this.cartService.updateCart(this.cartId, formValue).subscribe({
    next: (res) => {
      console.log('Cart updated successfully:', res);
      this.router.navigate(['/cart']);
    },
    error: err => console.error(err)
  });
}
  onCancel() {
    this.router.navigate(['/cart']);
  }

  get items(): FormArray {
    return this.cartForm.get('items') as FormArray;
  }

  getVariantKeys(variantGroup: AbstractControl): string[] {
    return Object.keys((variantGroup as FormGroup).controls);
  }

  getVariantControl(item: AbstractControl, key: string): AbstractControl {
    return (item.get('variant') as FormGroup).get(key)!;
  }
}
