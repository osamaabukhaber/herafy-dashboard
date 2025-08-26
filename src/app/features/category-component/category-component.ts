import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Category } from '../../shared/models/category.interface';
import { CategoryService } from '../../services/category-services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-component.html',
  styleUrls: ['./category-component.css'],
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  paginatedCategories: Category[] = [];
  loading = true;
  error: string | null = null;
  categoryProps: Category = {} as Category;
  editingCategoryId: string | null = null;
  filterByName: string = '';
  searchByName: string = '';
  currentPage: number = 1;
  limit: number = 5;
  newCategoryRowVisible: boolean = false;
  newCategory: { name: string; image?: string } = {
    name: '',
  };
  newCategoryFile: File | null = null;
  editingFile: File | null = null;
  names: string[] = ['mobiles', 'shirts', 'handmade'];

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCategories.length / this.limit);
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories(1, 1000).subscribe({
      next: (res) => {
        this.categories = res.data.allCategories;
        this.filteredCategories = [...this.categories];
        this.updatePaginated();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.error = 'Failed to load categories. Please try again later.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  updatePaginated(): void {
    const start = (this.currentPage - 1) * this.limit;
    const end = start + this.limit;
    this.paginatedCategories = this.filteredCategories.slice(start, end);
  }

  nextPage(): void {
    if (this.canPaginate()) {
      this.currentPage++;
      this.updatePaginated();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginated();
    }
  }

  canPaginate(): boolean {
    return this.filteredCategories.length > this.currentPage * this.limit;
  }

  showAddCategoryRow() {
    this.newCategoryRowVisible = true;
  }

  onNewFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.newCategoryFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newCategory.image = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onEditFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.editingFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.categoryProps.image = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  addCategory() {
    if (!this.newCategory.name) return;
    this.categoryService
      .addNewCategory(this.newCategory.name, this.newCategoryFile ?? undefined)
      .subscribe({
        next: (res) => {
          const created = res.data.newCategory;
          this.categories.unshift(created);
          this.applyFilters();
          this.resetNewCategoryForm();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error adding category:', err);
          this.error = 'Failed to add category';
          this.cdr.detectChanges();
        },
      });
  }

  cancelNewCategory() {
    this.resetNewCategoryForm();
  }

  resetNewCategoryForm() {
    this.newCategory = { name: '' };
    this.newCategoryFile = null;
    this.newCategoryRowVisible = false;
  }

  deleteCategory(id: string): void {
    if (!id) {
      console.error('Category ID is undefined');
      return;
    }
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter(
            (category) => category._id !== id
          );
          this.applyFilters();
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.error = 'Failed to delete category';
          console.error('Error deleting category:', error);
        },
      });
    }
  }

  startEdit(category: Category): void {
    this.editingCategoryId = category._id;
    this.categoryProps = { ...category };
    this.editingFile = null;
  }

  cancelEdit(): void {
    this.editingCategoryId = null;
    this.categoryProps = {} as Category;
    this.editingFile = null;
  }

  updateCategory(): void {
    if (!this.categoryProps._id || !this.categoryProps.name) {
      this.error = 'Category ID or name is missing';
      return;
    }
    this.categoryService
      .updateCategory(
        this.categoryProps._id,
        this.categoryProps.name,
        this.editingFile ?? undefined
      )
      .subscribe({
        next: (res) => {
          this.categories = this.categories.map((category) =>
            category._id === res._id ? res : category
          );
          this.applyFilters();
          this.editingCategoryId = null;
          this.categoryProps = {} as Category;
          this.editingFile = null;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.error = 'Failed to update category';
          console.error('Error updating category:', error);
        },
      });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.categories];
    if (this.filterByName) {
      filtered = filtered.filter(
        (category: Category) =>
          category.name.toLowerCase() === this.filterByName.toLowerCase()
      );
    }
    if (this.searchByName) {
      filtered = filtered.filter((category: Category) =>
        category.name.toLowerCase().includes(this.searchByName.toLowerCase())
      );
    }
    this.filteredCategories = filtered;
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    this.updatePaginated();
    this.cdr.detectChanges();
  }
}
