import { ReviewService } from './../../services/review-services/review-services';
import { Component, OnInit, computed, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { User } from '../../shared/models/user.interface';
import {
  ReviewSummary,
  Review,
  ReviewApiResponse,
} from '../../shared/models/review.interface';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-component.html',
  styleUrls: ['./review-component.css'],
})
export class ReviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  reviews = signal<Review[]>([]);
  loading = signal(false);
  totalReviews = signal(0);
  totalPages = signal(0);
  currentPage = signal(1);
  averageRating = signal(0);
  deletingReviewId = signal<string | null>(null);

  searchTerm = '';
  selectedEntityType = '';
  selectedMinRating = '';
  itemsPerPage = 10;

  expandedReviews = new Set<string>();

  filteredReviews = computed(() => {
    let filtered = this.reviews();
console.log(filtered)
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          
          (review.comment || '').toLowerCase().includes(searchLower) ||
          (typeof review.user === 'object' &&
            (review.user as User)?.userName?.toLowerCase().includes(searchLower)) ||
          (typeof review.user === 'object' &&
            (review.user as User)?.email?.toLowerCase().includes(searchLower))
      );
    }

    if (this.selectedEntityType) {
      filtered = filtered.filter(
        (review) => review.entityType === this.selectedEntityType
      );
    }

    if (this.selectedMinRating) {
      const minRating = parseInt(this.selectedMinRating, 10);
      filtered = filtered.filter((review) => review.rating >= minRating);
    }

    return filtered;
  });

  constructor(private reviewService: ReviewService) {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage.set(1);
        this.loadReviews();
      });
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReviews(): void {
     console.log('🔄 Loading reviews started...');
    console.log('Current page:', this.currentPage());
    console.log('Items per page:', this.itemsPerPage);
    this.loading.set(true);

    // Convert numbers to strings to match expected type
    this.reviewService
      .getAllReviews(
        this.currentPage().toString(),
        this.itemsPerPage.toString()
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ReviewApiResponse) => {
          if (response.status === 'success') {
            this.reviews.set(response.data?.allReviews || []);
            this.totalReviews.set(response.pagination?.totalReviews || 0);
            this.totalPages.set(response.pagination?.totalPages || 1);
            this.loadReviewSummary();
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Failed to load reviews:', error);
          this.reviews.set([]);
          this.loading.set(false);
        },
      });
  }

  loadReviewSummary(): void {
    const reviews = this.reviews();
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + (review.rating || 0),
        0
      );
      this.averageRating.set(totalRating / reviews.length);
    } else {
      this.averageRating.set(0);
    }
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadReviews();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
      this.loadReviews();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
      this.loadReviews();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.currentPage.set(page);
      this.loadReviews();
    }
  }

  getPageNumbers(): number[] {
    const totalPages = this.totalPages();
    const currentPage = this.currentPage();
    const pages: number[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        if (totalPages > 6) pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      }
    }

    return pages;
  }

  deleteReview(reviewId: string): void {
  if (
    confirm(
      'Are you sure you want to delete this review? This action cannot be undone.'
    )
  ) {
    this.deletingReviewId.set(reviewId);

    this.reviewService
      .deleteReview(reviewId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            const updatedReviews = this.reviews().filter(
              (review) => review._id !== reviewId
            );
            this.reviews.set(updatedReviews);

            const updatedTotal = this.totalReviews() - 1;
            this.totalReviews.set(updatedTotal);

            this.totalPages.set(
              Math.ceil(updatedTotal / this.itemsPerPage)
            );

            if (updatedReviews.length === 0 && this.currentPage() > 1) {
              this.previousPage();
            } else {
              this.loadReviews();
            }

            console.log('Review deleted successfully');
          }
          this.deletingReviewId.set(null);
        },
        error: (error) => {
          console.error('Failed to delete review:', error);
          this.deletingReviewId.set(null);
        },
      });
  }
}


  toggleReviewExpansion(reviewId: string): void {
    if (this.expandedReviews.has(reviewId)) {
      this.expandedReviews.delete(reviewId);
    } else {
      this.expandedReviews.add(reviewId);
    }
  }

  getUserInitials(name: string): string {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  getEntityName(review: Review): string {
    return `${review.entityType.toLowerCase()} (${(review.entityId || '').substring(
      0,
      8
    )}...)`;
  }

  getUserInfo(review: Review): { name: string; email: string } {
    if (typeof review.user === 'string') {
      return { name: 'Unknown User', email: 'No email' };
    }
    const user = review.user as User;
    return {
      name: user.userName || 'Unknown User',
      email: user.email || 'No email',
    };
  }

  shouldTruncateReview(comment: string | undefined): boolean {
    return !!(comment && comment.length > 100);
  }

  getTruncatedReview(reviewId: string, comment: string | undefined): string {
    if (
      !this.expandedReviews.has(reviewId) &&
      this.shouldTruncateReview(comment)
    ) {
      return (comment || '').substring(0, 100) + '...';
    }
    return comment || '';
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  refreshReviews(): void {
    this.currentPage.set(1);
    this.loadReviews();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedEntityType = '';
    this.selectedMinRating = '';
    this.currentPage.set(1);
    this.expandedReviews.clear();
    this.loadReviews();
  }
}