import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Category } from '../../shared/models/category.interface';
import { CategoryService } from './../../services/category-services/category.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-category-component',
  imports: [CommonModule],
templateUrl: './category-component.html',
  styleUrl: './category-component.css'
})
export class CategoryComponent implements OnInit {
  category: Category[] = [];
  loading = true;

  constructor(private categoryservice: CategoryService, private cdr: ChangeDetectorRef){}
  ngOnInit(): void {
    this.categoryservice.getAllCategoty().subscribe({
      next: (res) => {
        this.category = res.data.category;
        this.loading = false;
        this.cdr.detectChanges()
      },
      error: (error) => {
        console.log("error", error);
        this.loading = false;
      }
    })
  }

}
