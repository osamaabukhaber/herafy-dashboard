
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Subject, forkJoin, of, switchMap, takeUntil } from 'rxjs';

import { CartService } from '../../services/cart-service';
import { ICart } from '../../../../models/cart-model/icart';

@Component({
  selector: 'app-cart-view-component',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './cart-view-component.html',
  styleUrls: ['./cart-view-component.css']
})
export class CartViewComponent implements OnInit, OnDestroy {
  currentId: string = '';
  cart!: ICart;
  cartAllIds: string[] = [];
  currentIndex: number = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          this.currentId = params.get('id') || '';
          return forkJoin({
            cartResponse: this.cartService.getCartById(this.currentId),
            allIds: this.cartService.getAllCartIds()
          });
        })
      )
      .subscribe({
        next: ({ cartResponse, allIds }) => {
          const cartData = cartResponse.data?.cart;
          if (!cartData) {
            this.router.navigate(['**']);
            return;
          }

          this.cart = cartData;
          this.cartAllIds = allIds || [];
          this.currentIndex = this.cartAllIds.indexOf(this.currentId);

          // Trigger manual change detection if necessary
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load cart data:', err);
          this.router.navigate(['**']);
          this.cdr.detectChanges();
        }
      });
  }

  nextCart(): void {
    if (this.currentIndex < this.cartAllIds.length - 1) {
      this.currentIndex++;
      const nextId = this.cartAllIds[this.currentIndex];
      this.router.navigate([`/viewcart/${nextId}`]);
    }
  }

  previousCart(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const prevId = this.cartAllIds[this.currentIndex];
      this.router.navigate([`/viewcart/${prevId}`]);
    }
  }

  onLogoError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/default-cart-logo.png';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
