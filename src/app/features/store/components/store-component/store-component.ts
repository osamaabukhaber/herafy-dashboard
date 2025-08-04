import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { StoreServices } from '../../services/store-serivces/store-services';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IStore } from '../../../../models/store-model/istore';

@Component({
  selector: 'app-store-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store-component.html',
  styleUrl: './store-component.css'
})
export class StoreComponent implements OnInit, OnDestroy {
  storesList: IStore[] = [];
  error: string | null = null;
  loading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private storeApiService: StoreServices,
    private route : Router,
    private cdr: ChangeDetectorRef,

  ) {}

  ngOnInit(): void {
    this.storeApiService.getAllStores()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.storesList = res.data.stores;
          this.loading = false;
          this.cdr.detectChanges()
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to load stores.';
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteStore(id: string) {
    // TODO: implement delete logic
  }

  addStore() {
    // TODO: implement add logic
    this.route.navigate(["/add-new-store"])
  }

  updateStore(store: IStore) {
    // TODO: implement edit logic
    this.route.navigate(["/update-store", store._id]);
  }
}
