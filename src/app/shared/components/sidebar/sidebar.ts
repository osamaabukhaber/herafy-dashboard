import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  adminIconDropDown: boolean = false;
  adminSideBare: boolean = false;
  constructor(private eRef: ElementRef) {}
  toggleUserDropDown() {
    this.adminIconDropDown = !this.adminIconDropDown;
  }
  toggleAdminSideBare() {
    this.adminSideBare = !this.adminSideBare;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.adminIconDropDown = false;
    }
  }
}
