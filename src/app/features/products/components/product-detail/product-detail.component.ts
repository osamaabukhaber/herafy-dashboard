// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ProductApiService } from '../../services/product-api.service';
// import { Product } from '../../../../shared/models/product.interface.js';

// @Component({
//   selector: 'app-product-detail',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './product-detail.component.html'
// })
// export class ProductDetailComponent implements OnInit {
//   product: Product | null = null;
//   loading = false;

//   constructor(
//     private productApiService: ProductApiService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     const productId = this.route.snapshot.paramMap.get('id');
//     if (productId) {
//       this.loadProduct(productId);
//     }
//   }

//   loadProduct(id: string): void {
//     this.loading = true;
//     this.productApiService.getProductById(id)
//       .subscribe({
//         next: (response) => {
//           this.product = response.data;
//           this.loading = false;
//         },
//         error: (error) => {
//           console.error('Error loading product:', error);
//           this.loading = false;
//         }
//       });
//   }

//   editProduct(): void {
//     if (this.product) {
//       this.router.navigate(['/products', this.product._id, 'edit']);
//     }
//   }

//   deleteProduct(): void {
//     if (this.product?._id && confirm('Are you sure you want to delete this product?')) {
//       this.productApiService.deleteProduct(this.product._id)
//         .subscribe({
//           next: () => {
//             this.router.navigate(['/products']);
//           },
//           error: (error) => {
//             console.error('Error deleting product:', error);
//           }
//         });
//     }
//   }
// }
