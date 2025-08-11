import {
  Component,
  ChangeDetectionStrategy,
  effect,
  signal,
  inject,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, catchError, takeUntil } from 'rxjs/operators';
import { of, forkJoin, Subject } from 'rxjs';
import { PaymentService } from '../../services/payment-serivce';
import { Ipayments } from '../../../../models/payment-model/ipayments';
import { IpaymentsApiResponce } from '../../../../models/payment-model/ipayments-api-responce';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-payment-management',
  templateUrl: "./payments-main-component.html",
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPaymentManagementComponent implements OnDestroy {
  // inject dependencies
  private paymentService = inject(PaymentService);

  // cleanup subject
  private destroy$ = new Subject<void>();

  // state
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

  // reactive params
  private params = {
    page: 1,
    limit: 10,
    filters: {}
  };

  constructor(private fb: FormBuilder , private cdr:ChangeDetectorRef , private router: Router) {
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

    // watch filter changes
    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(values => {
        console.log('Filter values changed:', values);
        const filters = this.buildApiFilters(values);
        this.params = { ...this.params, page: 1, filters };
      });

    // fetch data when params change
    effect(() => {
      const { page, limit, filters } = this.params;
      this.loading = true;
      this.error = null;

      this.paymentService.getAllPayments(page, limit, filters).pipe(
        map((res: IpaymentsApiResponce) => ({
          payments: res.data.payments,
          meta: (res as any).meta || { total: 0, page, limit }
        })),
        catchError(err => {
          console.error(err);
          this.error = 'Failed to load payments';
          return of({ payments: [], meta: { total: 0, page, limit } });
        }),
        takeUntil(this.destroy$)
      ).subscribe(payload => {
        this.payments = payload.payments || [];
        this.total = payload.meta.total ?? 0;
        this.page = payload.meta.page ?? page;
        this.limit = payload.meta.limit ?? limit;
        this.syncSelection();
        this.loading = false;
        console.log('Payment data loaded:', this.payments);
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildApiFilters(values: any) {
    const filters: any = {};
    if (values.search) filters.q = values.search;
    if (values.status) filters.status = values.status;
    if (values.paymentMethod) filters.paymentMethod = values.paymentMethod;
    if (values.provider) filters.provider = values.provider;
    if (values.dateFrom) filters.dateFrom = values.dateFrom;
    if (values.dateTo) filters.dateTo = values.dateTo;
    if (values.minAmount) filters.minAmount = values.minAmount;
    if (values.maxAmount) filters.maxAmount = values.maxAmount;
    return filters;
  }
  loadPayments(params: { page: number; limit: number; filters: any }) {
    this.paymentService.getAllPayments(params.page, params.limit, params.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: IpaymentsApiResponce) => {
          this.payments = res.data.payments;
          this.total = res.meta.total;
          this.loading = false;
          console.log('Payments refreshed:', this.payments);
          this.cdr.detectChanges();
        },
        error: err => {
          console.error(err);
          this.error = 'Failed to refresh payments';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }
  refresh() {
    this.params = { ...this.params };
    this.loading = true;
    console.log('Refreshing payments with params:', this.params);
    this.loadPayments(this.params);
  }

  clearFilters() {
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
    this.params = { page: 1, limit: this.limit, filters: {} };
  }

  gotoPage(newPage: number) {
    if (newPage < 1) return;
    const maxPage = Math.ceil(this.total / this.limit) || 1;
    if (newPage > maxPage) return;
    this.params = { ...this.params, page: newPage };
  }

  setLimit(newLimit: number) {
    this.params = { ...this.params, limit: newLimit, page: 1 };
  }

  trackById(index: number, item: Ipayments) {
    return item._id ?? index;
  }

  toggleSelect(id?: string) {
    if (!id) return;
    const set = new Set(this.selectedIds);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.selectedIds = set;
    this.syncSelection();
  }

  toggleSelectAllOnPage() {
    const set = new Set(this.selectedIds);
    if (this.selectAllOnPage) {
      this.payments.forEach(p => p._id && set.delete(p._id));
      this.selectAllOnPage = false;
    } else {
      this.payments.forEach(p => p._id && set.add(p._id));
      this.selectAllOnPage = true;
    }
    this.selectedIds = set;
  }

  private syncSelection() {
    const set = this.selectedIds;
    this.selectAllOnPage = this.payments.every(p => p._id && set.has(p._id));
  }

  openDetails(payment: Ipayments) {
    this.selectedPayment = payment;
    this.showDetails = true;
    console.log('Payment details opened:', payment);
  }

  closeDetails() {
    this.selectedPayment = null;
    this.showDetails = false;
  }
  moreDetails(paymentId: string){
    this.router.navigate(['/view-payment', paymentId]);
  }

  confirmAction(title: string, message: string, onConfirm: () => void) {
    this.confirmDialog = { open: true, title, message, onConfirm };
  }

  runConfirmedAction() {
    const cb = this.confirmDialog.onConfirm;
    this.confirmDialog = { open: false, title: '', message: '', onConfirm: () => {} };
    cb && cb();
  }

  updatePaymentStatus(payment: Ipayments, newStatus: 'pending' | 'completed' | 'failed' | 'refunded') {
    if (!payment._id) return;
    const prevStatus = payment.status;
    payment.status = newStatus; // optimistic

    this.paymentService.updatePaymentStatus(payment._id, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: updated => {
          const list = [...this.payments];
          const idx = list.findIndex(p => p._id === updated._id);
          if (idx !== -1) list[idx] = updated;
          this.payments = list;
        },
        error: err => {
          console.error(err);
          payment.status = prevStatus; // rollback
          this.error = 'Failed to update status';
        }
      });
  }

  bulkUpdateStatus(newStatus: 'pending' | 'completed' | 'failed' | 'refunded') {
    const ids = Array.from(this.selectedIds);
    if (!ids.length) return;
    this.confirmAction('Confirm bulk update', `Set ${ids.length} payments to "${newStatus}"?`, () => {
      const calls = ids.map(id => this.paymentService.updatePaymentStatus(id, newStatus));
      forkJoin(calls)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: updatedList => {
            const list = [...this.payments];
            updatedList.forEach(u => {
              const idx = list.findIndex(p => p._id === u._id);
              if (idx !== -1) list[idx] = u;
            });
            this.payments = list;
            this.selectedIds = new Set();
          },
          error: err => {
            console.error(err);
            this.error = 'Bulk update failed';
          }
        });
    });
  }

  exportCurrentPageCSV() {
    if (!this.payments.length) return;
    const headers = ['_id', 'order', 'user', 'amount', 'paymentMethod', 'status', 'provider', 'transactionId', 'createdAt'];
    const rows = this.payments.map(p => [
      p._id ?? '',
      p.order ?? '',
      p.user ?? '',
      p.amount ?? '',
      p.paymentMethod ?? '',
      p.status ?? '',
      p.provider ?? '',
      p.transactionId ?? '',
      p.createdAt ? new Date(p.createdAt).toISOString() : ''
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-page-${this.page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  formatCurrency(amount: number) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount);
  }

  onStatusChange(payment: Ipayments, event: Event) {
    const select = event.target as HTMLSelectElement;
    this.updatePaymentStatus(payment, select.value as 'pending' | 'completed' | 'failed' | 'refunded');
  }

  onLimitChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newLimit = Number(select.value);
    this.setLimit(newLimit);
  }
  copyToClipboard(text: string | undefined) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
}
