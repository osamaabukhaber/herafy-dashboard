import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, catchError, takeUntil, switchMap } from 'rxjs/operators';
import { of, forkJoin, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { PaymentService } from '../../services/payment-serivce';
import { Ipayments } from '../../../../models/payment-model/ipayments';
import { IpaymentsApiResponce } from '../../../../models/payment-model/ipayments-api-responce';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-payment-management',
  templateUrl: "./payments-main-component.html",
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPaymentManagementComponent implements OnDestroy {
  // inject dependencies
  private paymentService = inject(PaymentService);

  // cleanup subject
  private destroy$ = new Subject<void>();

  // state properties
  loading = false;
  error: string | null = null;
  payments: Ipayments[] = [];
  total = 0;
  page = 1;
  limit = 10;

  // filters
  filterForm: FormGroup;
  filterPanelOpen = false;

  // selection
  selectedIds = new Set<string>();
  selectAllOnPage = false;

  // modals
  showDetails = false;
  selectedPayment: Ipayments | null = null;
  confirmDialog = { open: false, title: '', message: '', onConfirm: (() => {}) as any };

  // reactive streams for parameters
  private pageSubject = new BehaviorSubject<number>(1);
  private limitSubject = new BehaviorSubject<number>(10);
  private filtersSubject = new BehaviorSubject<any>({});

  // computed properties
  get totalPages(): number {
    return Math.ceil(this.total / this.limit) || 1;
  }

  get startItem(): number {
    return (this.page - 1) * this.limit + 1;
  }

  get endItem(): number {
    return Math.min(this.page * this.limit, this.total);
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  get hasSelection(): boolean {
    return this.selectedIds.size > 0;
  }

  get isFirstPage(): boolean {
    return this.page <= 1;
  }

  get isLastPage(): boolean {
    return this.page >= this.totalPages;
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    // init filter form
    this.filterForm = this.fb.group({
      search: [''],
      status: [''],
      paymentMethod: [''],
      provider: [''],
      dateFrom: [null],
      dateTo: [null],
      minAmount: [null],
      maxAmount: [null]
    });

    // watch filter changes and update filters subject
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map(values => this.buildApiFilters(values)),
        takeUntil(this.destroy$)
      )
      .subscribe(filters => {
        console.log('Filter values changed:', filters);
        this.filtersSubject.next(filters);
        this.pageSubject.next(1); // reset to first page when filters change
        this.cdr.detectChanges();
      });

    // combine all parameter streams and fetch data
    combineLatest([
      this.pageSubject.asObservable(),
      this.limitSubject.asObservable(),
      this.filtersSubject.asObservable()
    ]).pipe(
      switchMap(([page, limit, filters]) => {
        console.log('Loading payments:', { page, limit, filters });
        this.loading = true;
        this.error = null;
        // this.cdr.detectChanges();
        return this.paymentService.getAllPayments(page, limit, filters).pipe(
          map((res: IpaymentsApiResponce) => ({
            payments: res.data.payments || [],
            meta: res.meta || { total: 0, page, limit, pages: 1 }
          })),
          catchError(err => {
            console.error('Payment loading error:', err);
            this.error = 'Failed to load payments';
            return of({
              payments: [],
              meta: { total: 0, page, limit, pages: 1 }
            });
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe(result => {
      this.payments = result.payments;
      this.total = result.meta.total;
      this.page = result.meta.page;
      this.limit = result.meta.limit;
      this.loading = false;

      // Clear selection when data changes
      this.selectedIds = new Set();
      this.syncSelection();

      console.log('Payment data loaded:', {
        payments: result.payments.length,
        total: result.meta.total,
        page: result.meta.page
      });

      this.cdr.detectChanges();
    });

    // Initial load
    this.refresh();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildApiFilters(values: any) {
    const filters: any = {};
    if (values.search?.trim()) filters.q = values.search.trim();
    if (values.status) filters.status = values.status;
    if (values.paymentMethod) filters.paymentMethod = values.paymentMethod;
    if (values.provider) filters.provider = values.provider;
    if (values.dateFrom) filters.dateFrom = values.dateFrom;
    if (values.dateTo) filters.dateTo = values.dateTo;
    if (values.minAmount !== null && values.minAmount !== '') filters.minAmount = values.minAmount;
    if (values.maxAmount !== null && values.maxAmount !== '') filters.maxAmount = values.maxAmount;
    return filters;
  }

  private syncSelection() {
    this.selectAllOnPage = this.payments.length > 0 &&
      this.payments.every(p => p._id && this.selectedIds.has(p._id));
  }

  refresh() {
    console.log('Refreshing payments...');
    // Trigger reload by emitting current values
    this.pageSubject.next(this.page);
  }

  clearFilters() {
    console.log('Clearing filters...');
    this.filterForm.reset({
      search: '',
      status: '',
      paymentMethod: '',
      provider: '',
      dateFrom: null,
      dateTo: null,
      minAmount: null,
      maxAmount: null
    });
    // filtersSubject will be updated automatically by form valueChanges
  }

  gotoPage(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) {
      console.log('Invalid page:', newPage, 'Max:', this.totalPages);
      return;
    }
    console.log('Going to page:', newPage);
    this.pageSubject.next(newPage);
  }

  setLimit(newLimit: number) {
    if (newLimit < 1) return;
    console.log('Setting limit:', newLimit);
    this.limitSubject.next(newLimit);
    this.pageSubject.next(1); // reset to first page
  }

  trackById(index: number, item: Ipayments) {
    return item._id ?? index;
  }

  toggleSelect(id?: string) {
    if (!id) return;
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.syncSelection();
    console.log('Selection updated:', Array.from(this.selectedIds));
    this.cdr.detectChanges();
  }

  toggleSelectAllOnPage() {
    if (this.selectAllOnPage) {
      // Deselect all on current page
      this.payments.forEach(p => p._id && this.selectedIds.delete(p._id));
      this.selectAllOnPage = false;
    } else {
      // Select all on current page
      this.payments.forEach(p => p._id && this.selectedIds.add(p._id));
      this.selectAllOnPage = true;
    }

    console.log('Bulk selection updated:', Array.from(this.selectedIds));
    this.cdr.detectChanges();
  }

  openDetails(payment: Ipayments) {
    this.selectedPayment = payment;
    this.showDetails = true;
    console.log('Payment details opened:', payment._id);
    this.cdr.detectChanges();
  }

  closeDetails() {
    this.selectedPayment = null;
    this.showDetails = false;
    this.cdr.detectChanges();
  }

  moreDetails(paymentId: string) {
    this.router.navigate(['/view-payment', paymentId]);
  }

  confirmAction(title: string, message: string, onConfirm: () => void) {
    this.confirmDialog = { open: true, title, message, onConfirm };
    this.cdr.detectChanges();
  }

  runConfirmedAction() {
    const cb = this.confirmDialog.onConfirm;
    this.confirmDialog = { open: false, title: '', message: '', onConfirm: () => {} };
    this.cdr.detectChanges();
    if (cb) {
      cb();
    }
  }

  updatePaymentStatus(payment: Ipayments, newStatus: 'pending' | 'completed' | 'failed' | 'refunded') {
    if (!payment._id) return;

    const prevStatus = payment.status;
    console.log(`Updating payment ${payment._id} from ${prevStatus} to ${newStatus}`);

    // Optimistic update
    const paymentIndex = this.payments.findIndex(p => p._id === payment._id);
    if (paymentIndex !== -1) {
      this.payments[paymentIndex] = { ...this.payments[paymentIndex], status: newStatus };
      this.cdr.detectChanges();
    }

    this.paymentService.updatePaymentStatus(payment._id, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated: Ipayments) => {
          console.log('Payment status updated successfully:', updated);
          const idx = this.payments.findIndex(p => p._id === updated._id);
          if (idx !== -1) {
            this.payments[idx] = updated;
          }
          this.error = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Payment status update failed:', err);
          // Rollback optimistic update
          const idx = this.payments.findIndex(p => p._id === payment._id);
          if (idx !== -1) {
            this.payments[idx] = { ...this.payments[idx], status: prevStatus };
          }
          this.error = err.error?.error || 'Failed to update payment status';
          this.cdr.detectChanges();
        }
      });
  }

  bulkUpdateStatus(newStatus: 'pending' | 'completed' | 'failed' | 'refunded') {
    const ids = Array.from(this.selectedIds);
    if (!ids.length) {
      console.log('No payments selected for bulk update');
      return;
    }

    this.confirmAction(
      'Confirm bulk update',
      `Set ${ids.length} payments to "${newStatus}"?`,
      () => {
        console.log(`Bulk updating ${ids.length} payments to ${newStatus}`);
        this.loading = true;
        this.cdr.detectChanges();

        const calls = ids.map(id => this.paymentService.updatePaymentStatus(id, newStatus));
        forkJoin(calls)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (updatedPayments: Ipayments[]) => {
              console.log('Bulk update successful:', updatedPayments.length);

              updatedPayments.forEach(updated => {
                const idx = this.payments.findIndex(p => p._id === updated._id);
                if (idx !== -1) {
                  this.payments[idx] = updated;
                }
              });

              this.selectedIds = new Set(); // clear selection
              this.syncSelection();
              this.loading = false;
              this.error = null;
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Bulk update failed:', err);
              this.error = 'Bulk update failed';
              this.loading = false;
              this.cdr.detectChanges();
            }
          });
      }
    );
  }

  exportCurrentPageCSV() {
    if (!this.payments.length) {
      console.log('No payments to export');
      return;
    }

    console.log(`Exporting ${this.payments.length} payments to CSV`);
    const headers = ['ID', 'Order', 'User', 'Amount', 'Payment Method', 'Status', 'Provider', 'Transaction ID', 'Created At'];
    const rows = this.payments.map(p => [
      p._id ?? '',
      p.order ?? '',
      p.user ?? '',
      p.amount?.toString() ?? '',
      p.paymentMethod ?? '',
      p.status ?? '',
      p.provider ?? '',
      p.transactionId ?? '',
      p.createdAt ? new Date(p.createdAt).toISOString() : ''
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-page-${this.page}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  formatCurrency(amount: number | undefined | null) {
    if (amount == null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  onStatusChange(payment: Ipayments, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as 'pending' | 'completed' | 'failed' | 'refunded';
    this.updatePaymentStatus(payment, newStatus);
  }

  onLimitChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newLimit = Number(select.value);
    if (newLimit > 0) {
      this.setLimit(newLimit);
    }
  }

  copyToClipboard(text: string | undefined) {
    if (!text) {
      console.log('No text to copy');
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
      // You could add a toast notification here
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('Copied using fallback method');
      } catch (fallbackErr) {
        console.error('Fallback copy also failed:', fallbackErr);
      }
    });
  }

  toggleFilterPanel() {
    this.filterPanelOpen = !this.filterPanelOpen;
    this.cdr.detectChanges();
  }

  closeConfirmDialog() {
    this.confirmDialog = { open: false, title: '', message: '', onConfirm: () => {} };
    this.cdr.detectChanges();
  }
}
