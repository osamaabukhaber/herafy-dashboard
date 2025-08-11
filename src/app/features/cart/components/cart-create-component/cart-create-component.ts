import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CartService } from '../../services/cart-service';


@Component({
  selector: 'app-admin-cart-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cart-create-component.html',
  styleUrls: ['./cart-create-component.css']
})
export class AdminCartFormComponent {
  cartForm: FormGroup;
  isEditMode = false;

  products: any;
  coupons: any;

  total = 0;
  discount = 0;
  totalAfterDiscount = 0;
  today !: Date;
  discountProductPrice: number = 0;
  discountProuctStartDate !: Date
  discountProuctEndDate !: Date
  variantsName: string[] = []
  variantsNameOptions : any[] =[]

  priceModifier: number = 0;
  stock: number = 0;
  sku: string = '';

  constructor(private fb: FormBuilder, private cartService: CartService) {
    this.cartForm = this.createCartForm();
    this.cartForm.valueChanges.subscribe(() => this.calculateTotals());
    this.today = new Date();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadProducts();
    this.loadCoupons();
  }
  loadProducts(): void {
    // Simulate loading products from a service
    // this.cartService.getAllProducts().subscribe(response => {
    //   this.products = response.data.products.map((product: any) => ({
    //     id: product._id,
    //     name: product.productName,
    //     defaultPrice: product.basePrice
    //   }));
    // });
    this.products = [
      {
        "_id": "64fbd6b731346c2f5e0a3f4d",
        "store": "64fbd6b731346c2f5e0a3f4a",
        "name": "Classic T-Shirt",
        "slug": "classic-t-shirt",
        "description": "A high-quality cotton t-shirt available in multiple colors.",
        "basePrice": 150,
        "discountPrice": 120,
        "discountStart": "2025-08-01T00:00:00.000Z",
        "discountEnd": "2025-08-31T23:59:59.999Z",
        "category": "64fbd79f31346c2f5e0a3f4b",
        "images": [
          "https://example.com/images/tshirt-blue.jpg",
          "https://example.com/images/tshirt-red.jpg"
        ],
        "variants": [
          {
            "name": "Color",
            "isDeleted": false,
            "options": [
              { "value": "Blue", "priceModifier": 2, "stock": 20, "sku": "TS-BLUE-001" },
              { "value": "Red", "priceModifier": 5, "stock": 15, "sku": "TS-RED-002" }
            ]
          }
        ],
        "averageRating": 4.2,
        "reviewCount": 33,
        "createdBy": "64fbd8e031346c2f5e0a3f4c",
        "isDeleted": false
      },
      {
        "_id": "64fbd6b731346c2f5e0a3f4e",
        "store": "64fbd6b731346c2f5e0a3f4a",
        "name": "Running Shoes",
        "slug": "running-shoes",
        "description": "Comfortable and durable running shoes with size and color options.",
        "basePrice": 450,
        "discountPrice": 399,
        "discountStart": "2025-08-05T00:00:00.000Z",
        "discountEnd": "2025-08-20T23:59:59.999Z",
        "category": "64fbd79f31346c2f5e0a3f4b",
        "images": [
          "https://example.com/images/shoes-black.jpg",
          "https://example.com/images/shoes-white.jpg"
        ],
        "variants": [
          {
            "name": "Color",
            "options": [
              { "value": "Black", "priceModifier": 0, "stock": 10, "sku": "SH-BLK-001" },
              { "value": "White", "priceModifier": 10, "stock": 8, "sku": "SH-WHT-002" }
            ]
          },
          {
            "name": "Size",
            "options": [
              { "value": "40", "priceModifier": 0, "stock": 5, "sku": "SH-40" },
              { "value": "41", "priceModifier": 0, "stock": 5, "sku": "SH-41" },
              { "value": "42", "priceModifier": 0, "stock": 8, "sku": "SH-42" }
            ]
          }
        ],
        "averageRating": 4.6,
        "reviewCount": 120,
        "createdBy": "64fbd8e031346c2f5e0a3f4c",
        "isDeleted": false
      },
      {
        "_id": "64fbd6b731346c2f5e0a3f4f",
        "store": "64fbd6b731346c2f5e0a3f4a",
        "name": "Minimalist Notebook",
        "slug": "minimalist-notebook",
        "description": "A sleek and stylish notebook with 200 pages.",
        "basePrice": 80,
        "discountPrice": 0,
        "category": "64fbd79f31346c2f5e0a3f4b",
        "images": [],
        "variants": [],
        "averageRating": 0,
        "reviewCount": 0,
        "createdBy": "64fbd8e031346c2f5e0a3f4c",
        "isDeleted": false
      }

    ];
  }
  loadCoupons(): void {
    // Simulate loading coupons from a service
    this.coupons = [
      {
        "code": "WELCOME10",
        "type": "fixed",
        "value": 10,
        "minCartTotal": 50,
        "maxDiscount": null,
        "expiryDate": "2025-12-31T23:59:59.999Z",
        "usageLimit": 100,
        "usedCount": 5,
        "active": true,
        "isDeleted": false
      },
      {
        "code": "SUMMER25",
        "type": "percentage",
        "value": 25,
        "minCartTotal": 100,
        "maxDiscount": 50,
        "expiryDate": "2025-09-30T23:59:59.999Z",
        "usageLimit": 50,
        "usedCount": 10,
        "active": true,
        "isDeleted": false
      }
      ,
      {
        "code": "ONETIME30",
        "type": "percentage",
        "value": 30,
        "minCartTotal": 200,
        "maxDiscount": 100,
        "expiryDate": "2025-08-31T23:59:59.999Z",
        "usageLimit": 1,
        "usedCount": 0,
        "active": true,
        "isDeleted": false
      }

    ];
  }
  createCartForm(): FormGroup {
    return this.fb.group({
      items: this.fb.array([this.createItemForm()]),
      coupon: ['', Validators.required],
    });
  }

  createItemForm(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      variants: this.fb.array([
        this.createVariantForm()
      ])
    });
  }
  createVariantForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      isDeleted: [false],
      options: this.fb.array([
        this.createOptionForm()
      ])
    });
  }

  createOptionForm(): FormGroup {
    return this.fb.group({
      value: ['', Validators.required],
      priceModifier: [0, [Validators.required]],
      stock: [0, [Validators.required]],
      sku: ['', Validators.required]
    });
  }
  addItem(): void {
    if (this.items.length >= 5) {
      console.warn('Maximum of 5 items allowed.');
      return;
    }
    if (this.items.at(0)?.get('productId')?.value === '') {
      console.warn('Please fill the first product before adding more.');
      return;
    }
    this.items.push(this.createItemForm());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculateTotals();
  }

  onProductChange(index: number): void {
    const item = this.items.at(index);
    const productId = item.get('productId')?.value;
    const product = this.products.find((p: { _id: any; }) => p._id === productId);
    if (product) {
      item.patchValue({ price: product.basePrice });
      this.discountProductPrice = product.discountPrice
      this.discountProuctStartDate = product.discountStart
      this.discountProuctEndDate = product.discountEnd
      this.variantsName = this.getVariantNames(product)
    }
    this.calculateTotals();
  }

  getVariantNames(product: any): string[] {
    if (product.variants && product.variants.length > 0) {
      return product.variants.map((variant: any) => variant.name);
    }
    return [];
  }
  onVariantNameChange(productId: any, variantName: string) {
    this.variantsNameOptions = this.getVariantsNameOption(variantName ,productId);
  }
  getVariantsNameOption(variantName: string ,productId: any): any[] {
  if (!variantName || !productId) {
    return [];
  }
  // Check if product has variants and return options for the specified variant name
  const product = this.products.find((p: { _id: any; }) => p._id === productId);
  if (!product || !product.variants || product.variants.length === 0) {
    return [];
  }
  const variant = product.variants.find((v: { name: string; }) => v.name === variantName);
  return variant ? variant.options : [];
}

onOptionValueChange(itemIndex: number, variantIndex: number, optionValue: string): void {
  console.log('Option value changed:', optionValue);
  const option = this.variantsNameOptions.find((o: { value: string; }) => o.value === optionValue);
  if (option) {
    // Find the FormArray for options
    const optionsArray = this.variantOptions(itemIndex, variantIndex);
    // Find the index of the selected option in the FormArray
    const optionFormIndex = optionsArray.controls.findIndex(
      (ctrl: any) => ctrl.get('value')?.value === optionValue
    );
    if (optionFormIndex !== -1) {
      // Patch the values to the correct FormGroup
      optionsArray.at(optionFormIndex).patchValue({
        priceModifier: option.priceModifier || 0,
        stock: option.stock || 0,
        sku: option.sku || ''
      });
    }
  }
}

  // will change
  calculateTotals(): void {
    this.total = this.items.controls.reduce((sum, item) => {
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      return sum + (quantity * price);
    }, 0);

    const selectedCoupon = this.coupons.find((c: { code: any; }) => c.code === this.cartForm.get('coupon')?.value);
    this.discount = selectedCoupon?.discount || 0;
    this.totalAfterDiscount = this.total - (this.total * this.discount / 100);
  }

  onSubmit(): void {
    console.log('Form Submitted:', this.cartForm.value);
    if (this.cartForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const cartData = this.cartForm.value;
    cartData.total = this.total;
    cartData.discount = this.discount;
    cartData.totalAfterDiscount = this.totalAfterDiscount;
    cartData.items = cartData.items.map((item: any) => ({
      ...item,
      variants: item.variants?.filter((v: any) => v.name && v.options?.length)
    }));

    console.log('Cart Submitted:', cartData);
    this.resetForm();
  }

  resetForm(): void {
    this.cartForm.reset();
  }

  markFormGroupTouched(): void {
    Object.keys(this.cartForm.controls).forEach(key => {
      const control = this.cartForm.get(key);
      control?.markAsTouched();
      if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            Object.keys(arrayControl.controls).forEach(nestedKey => {
              arrayControl.get(nestedKey)?.markAsTouched();
            });
          }
        });
      }
    });
  }

  getCouponError(): string | null {
    const errors = this.coupon.errors;
    if (errors?.['required']) return 'Coupon is required';
    return null;
  }

  get coupon(): FormControl {
    return this.cartForm.get('coupon') as FormControl;
  }

  get items(): FormArray {
    return this.cartForm.get('items') as FormArray;
  }

  get itemControls(): FormGroup[] {
    return this.items.controls as FormGroup[];
  }

  productId(i: number): FormControl {
    return this.items.at(i).get('productId') as FormControl;
  }

  quantity(i: number): FormControl {
    return this.items.at(i).get('quantity') as FormControl;
  }

  price(i: number): FormControl {
    return this.items.at(i).get('price') as FormControl;
  }

  variants(i: number): FormArray {
    return this.items.at(i).get('variants') as FormArray;
  }

  variantOptions(itemIndex: number, variantIndex: number): FormArray {
    return this.variants(itemIndex).at(variantIndex).get('options') as FormArray;
  }
  addVariant(itemIndex: number): void {
    this.variants(itemIndex).push(this.createVariantForm());
  }

  removeVariant(itemIndex: number, variantIndex: number): void {
    this.variants(itemIndex).removeAt(variantIndex);
  }
  options(itemIndex: number, variantIndex: number): FormArray {
    return this.variantOptions(itemIndex, variantIndex);
  }
  addOption(itemIndex: number, variantIndex: number): void {
    this.variantOptions(itemIndex, variantIndex).push(this.createOptionForm());
  }

  removeOption(itemIndex: number, variantIndex: number, optionIndex: number): void {
    const options = this.variantOptions(itemIndex, variantIndex);
    options.removeAt(optionIndex);
  }
  trackByIndex(index: number): number {
    return index;
  }
}
