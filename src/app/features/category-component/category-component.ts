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
  loading = true;
  error: string | null = null;
  categoryProps: Category = {} as Category;
  editingCategoryId: string | null = null;
  filterByName: string = '';
  searchByName: string = '';
  currentPage: number = 1;
  limit: number = 5;
  showAddModal = false;
  newCategory: Partial<Category> = {
    name: '',
    image: '',
  };
  names: string[] = ['mobiles', 'shirts', 'handmade'];
  newCategoryRowVisible: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.categoryPagination()
  }
  showAddNew = false;

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data.allCategories;
        this.filteredCategories = [...this.categories];
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
  // paganition
  categoryPagination(): void{
    this.loading = true;
    this.categoryService.getAllCategories(this.currentPage, this.limit).subscribe({
      next: (res) => {
        this.categories = res.data.allCategories;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed';
        this.loading = false
      }
    })
  }
  // next page
  nextPage(): void{
    this.currentPage++;
    this.categoryPagination()
} 
// previous page
previousPage():void{
  if(this.currentPage > 1){
    this.currentPage--;
    this.categoryPagination()
  }
}
// can paginate
canPaginate(): boolean{
  return this.categories.length === this.limit;
}
openAddCategoryModal(): void {
    this.newCategory = {
      name: '',
      image: '',
    };
    this.showAddModal = true;
  }

  closeAddCategoryModal(): void {
    this.showAddModal = false;
  }

  addCategory() {
    this.categoryService.addNewCategory(this.newCategory).subscribe({
      next: (res) => {
        const created = res?.data?.newCategory;
        this.categories.unshift(created);
        this.filteredCategories = [...this.categories];
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

  showAddCategoryRow() {
    this.newCategoryRowVisible = true;
  }

  resetNewCategoryForm() {
    this.newCategory = { name: '', image: '' };
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
          this.filteredCategories = [...this.categories];
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
  }

  cancelEdit(): void {
    this.editingCategoryId = null;
    this.categoryProps = {} as Category;
  }

  updateCategory(): void {
    if (!this.categoryProps._id || !this.categoryProps.name) {
      this.error = 'Category ID or name is missing';
      return;
    }

    const updateData: Partial<Category> = {
      name: this.categoryProps.name,
      image: this.categoryProps.image,
    };

    this.categoryService
      .updateCategory(this.categoryProps._id, updateData)
      .subscribe({
        next: () => {
          this.categories = this.categories.map((category) =>
            category._id === this.categoryProps._id
              ? { ...category, ...updateData }
              : category
          );
          this.filteredCategories = [...this.categories];
          this.editingCategoryId = null;
          this.categoryProps = {} as Category;
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
    this.cdr.detectChanges();
  }
}
