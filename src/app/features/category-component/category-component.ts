import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Category } from '../../shared/models/category.interface';
import { CategoryService } from './../../services/category-services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-category-component',
  imports: [CommonModule, FormsModule],
templateUrl: './category-component.html',
  styleUrl: './category-component.css'
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  error: string | null = null;
  categoryProps: Category = {} as Category;
  editingCategoryId: string | null = null;

  constructor(private categoryservice: CategoryService, private cdr: ChangeDetectorRef){}
  ngOnInit(): void {
    this.categoryservice.getAllCategoty().subscribe({
      next: (res) => {
        this.categories = res.data.category;
        this.loading = false;
        this.cdr.detectChanges()
      },
      error: (error) => {
        console.log("error", error);
        this.error="Failed to load categories"
        this.loading = false;
        this.cdr.detectChanges()
      }
    })
  }
  // delete category
  deleteCategory(id: string){
    if(!id){
      console.log("Category Id is undefied")
      return;
    }
    this.categoryservice.deleteCategory(id).subscribe({
      next: () =>{
        this.categories = this.categories.filter((category) => category._id !== id);
        console.log("category Id", id)
        this.cdr.detectChanges();
      },
      error: (error) =>{
        console.log("Error: ", error);
      }
    })
  }
  // update category
  startEdit(category: Category): void{
    this.editingCategoryId = category._id;
    this.categoryProps = {...category}
  }
  cancelEdit(): void{
    this.editingCategoryId = null;
    this.categoryProps = {} as Category;
  }
  UpdateCategory(): void{
    console.log("Saved Clicked", this.categoryProps);
    if(!this.categoryProps._id){
      console.log("Can't get category id");
      return;
    }
    const updateData = {
      name: this.categoryProps.name,
      image: this.categoryProps.image,
      updatedDate: this.categoryProps.updatedAt
    };
    console.log("Saving Updated data", this.categoryProps._id, updateData);
    this.categoryservice.UpdateCategory(this.categoryProps._id, updateData).subscribe({
      next: () => {
        const index = this.categories.findIndex(category => category._id === this.categoryProps._id);
        if(index !== -1){
          this.categories = this.categories.map((i) => 
          i._id === this.categoryProps._id ? {...i, ...updateData}: i)
        }
        this.editingCategoryId = null;
        this.categoryProps = {} as Category;
        console.log("Updating category saved");
        this.cdr.detectChanges()
      },
      error:(error) => {
        console.error("Error Updating Category", error)
      }
    })
  }
}
