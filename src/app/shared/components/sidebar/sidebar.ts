import { LoginService } from './../../../services/auth/login.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SiderbarService } from '../../../services/siderbar-service/siderbar-service';
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  adminIconDropDown: boolean = false;
  adminSideBare: boolean = false;
  constructor(
    private eRef: ElementRef,
    private siderBarService: SiderbarService,
    private loginService: LoginService,
    private router: Router
  ) {}
  toggleUserDropDown() {
    this.adminIconDropDown = !this.adminIconDropDown;
  }
  siderBarStatus() {
    return this.siderBarStatus;
  }
  toggleAdminSideBare() {
    this.adminSideBare = !this.adminSideBare;
    this.siderBarService.AssignSiderBareStatus(this.adminSideBare);
  }
  signOutUser() {
    this.loginService.signOut();
    this.router.navigate(['/login']);
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.adminIconDropDown = false;
    }
  }
}
