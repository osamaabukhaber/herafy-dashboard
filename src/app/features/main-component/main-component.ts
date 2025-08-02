import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SiderbarService } from '../../services/siderbar-service/siderbar-service';
import { Sidebar } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-main-component',
  imports: [Sidebar, RouterOutlet, CommonModule],
  templateUrl: './main-component.html',
  styleUrl: './main-component.css',
})
export class MainComponent implements OnInit, OnDestroy {
  isSidebarOpen = true;
  siderBarService = inject(SiderbarService);
  cdr = inject(ChangeDetectorRef);
  destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.siderBarService.adminSideBarStatusMeth()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (val) => {
          this.isSidebarOpen = val;
          this.cdr.detectChanges(); //
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
