import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StoreServices } from '../../services/store-serivces/store-services';
import { ActivatedRoute, Route, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IStore } from '../../../../models/store-model/istore';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight, Edit, List, MapPin, Building, Mail, Phone, Globe, Calendar, Clock, Package, Tag, ShoppingCart, Ticket, Truck, RotateCcw, Map, Info, CheckCircle, XCircle, AlertCircle, Circle } from 'lucide-angular';

@Component({
  selector: 'app-store-view-component',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './store-view-component.html',
  styleUrl: './store-view-component.css'
})
export class StoreViewComponent implements OnInit {
  // Lucide icons
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Edit = Edit;
  readonly List = List;
  readonly MapPin = MapPin;
  readonly Building = Building;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly Globe = Globe;
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Package = Package;
  readonly Tag = Tag;
  readonly ShoppingCart = ShoppingCart;
  readonly Ticket = Ticket;
  readonly Truck = Truck;
  readonly RotateCcw = RotateCcw;
  readonly Map = Map;
  readonly Info = Info;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly AlertCircle = AlertCircle;
  readonly Circle = Circle;

  currentId: string = ""
  store!: IStore;
  storeAllIds: string[] = []
  currentIndex: number = 0;

  constructor(
    private storeApiService: StoreServices,
    private active: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
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
              this.cdr.detectChanges();
            }
            else {
              this.router.navigate(["**"])
            }
          })
        }
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
    target.src = 'assets/images/default-store-logo.png';
  }

  openLocationInPopup(): void {
    if (this.store && this.store.location && this.store.location.coordinates) {
      const lat = this.store.location.coordinates[1];
      const lng = this.store.location.coordinates[0];
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

      // Open in popup window with specific dimensions and features
      const popup = window.open(
        mapUrl,
        'location-map',
        'width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
      );

      // Focus on the popup window if it was successfully opened
      if (popup) {
        popup.focus();
      }
    }
  }
}
