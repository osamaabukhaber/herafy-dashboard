import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Ipayments } from '../../../../models/payment-model/ipayments';
import { forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
import { PaymentService } from '../../services/payment-serivce';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payments-view-component',
  imports: [CommonModule ],
  templateUrl: './payments-view-component.html',
  styleUrls: ['./payments-view-component.css']
})
export class PaymentsViewComponent implements OnInit, OnDestroy {
  currentId: string = '';
  payment!: Ipayments;
  paymentAllIds: string[] = [];
  currentIndex: number = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private paymentService: PaymentService,
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
            paymentResponse: this.paymentService.getPaymentById(this.currentId),
            allIds: this.paymentService.getAllPaymentIds()
          });
        })
      )
      .subscribe({
        next: ({ paymentResponse, allIds }) => {
          const paymentData = paymentResponse.data?.payment;
          if (!paymentData) {
            this.router.navigate(['**']);
            return;
          }

          this.payment = paymentData;
          // this.cdr.detectChanges();
          this.paymentAllIds = allIds || [];
          this.currentIndex = this.paymentAllIds.indexOf(this.currentId);
          this.cdr.detectChanges();
          console.log('Current Payment ', this.payment);
          // Trigger manual change detection if necessary
        },
        error: (err) => {
          console.error('Failed to load cart data:', err);
          this.router.navigate(['**']);
        }
      });
  }

  nextPayment(): void {
    if (this.currentIndex < this.paymentAllIds.length - 1) {
      this.currentIndex++;
      const nextId = this.paymentAllIds[this.currentIndex];
      this.router.navigate([`/view-payment/${nextId}`]);
    }
  }

  previousPayment(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const prevId = this.paymentAllIds[this.currentIndex];
      this.router.navigate([`/view-payment/${prevId}`]);
    }
  }

  // onLogoError(event: Event): void {
  //   const target = event.target as HTMLImageElement;
  //   target.src = 'assets/images/default-cart-logo.png';
  // }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  trackByItemId(index: number, item: any): any {
    return item._id || index;
  }
  getProgressWidth(): string {
    const totalSteps = 5; // Total number of steps in the process
    const completedSteps = 3; // Number of completed steps (this should be dynamic)
    const progress = (completedSteps / totalSteps) * 100;
    return `width: ${progress}%;`;
  }
}

