import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StoreServices } from '../../services/store-serivces/store-services';
import { ActivatedRoute, Route, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IStore } from '../../../../models/store-model/istore';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-store-view-component',
  imports: [CommonModule , RouterLink ],
  templateUrl: './store-view-component.html',
  styleUrl: './store-view-component.css'
})
export class StoreViewComponent  implements OnInit{
  // This component can be used to display store details or any other related information.
  // Currently, it does not have any specific functionality or properties defined.
  // You can add methods and properties as needed for your application.
  currentId : string =""
  store !:IStore ;
  storeAllIds : string[]=[]
  currentIndex:number = 0;
  constructor(private storeApiService:StoreServices , private active:ActivatedRoute , private router:Router , private cdr:ChangeDetectorRef){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.active.paramMap.subscribe((data) => {
      this.currentId = data.get("id") || ""

      this.storeApiService.getStoreById(this.currentId).subscribe({
        next: (data) => {
          const obj = data.data.store;
          console.log(obj)
          this.storeApiService.getAllStoreIds().subscribe((data) => {
            this.storeAllIds = data;
            this.currentIndex = this.storeAllIds.indexOf(this.currentId);
            if (obj) {
              this.store = obj
              this.cdr.detectChanges(); // Ensure change detection runs to update the view
            }
            else {
              this.router.navigate(["**"])
            }
          })}
      })
    })

  }
  nextStore() {
    if (this.currentIndex < (this.storeAllIds.length - 1)) {
      this.currentIndex++;
      this.router.navigate([`/view-store/${this.storeAllIds[this.currentIndex]}`]);
    }
  }
  previousStore() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.router.navigate([`/view-store/${this.storeAllIds[this.currentIndex]}`]);
    }
  }
  onLogoError(event: Event): void {
  const target = event.target as HTMLImageElement;
  target.src = 'assets/images/default-store-logo.png'; // fallback image path
}
}
