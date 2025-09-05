import { LoginService } from './../../../services/auth/login.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SiderbarService } from '../../../services/siderbar-service/siderbar-service';
import {
  LucideAngularModule,
  Menu,
  ChevronDown,
  ChevronRight,
  Key,
  Mail,
  Calendar,
  BarChart3,
  Store,
  FileText,
  Users,
  Package,
  CreditCard,
  ShoppingCart,
  MessageCircle,
  Grid3X3,
  Ticket,
  Star,
  LogOut
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar {
  adminIconDropDown = false;
  adminSideBare = false;

  icons = {
    Menu,
    ChevronDown,
    ChevronRight,
    Key,
    Mail,
    Calendar,
    BarChart3,
    Store,
    FileText,
    Users,
    Package,
    CreditCard,
    ShoppingCart,
    MessageCircle,
    Grid3X3,
    Ticket,
    Star,
    LogOut
  };

  constructor(
    private eRef: ElementRef,
    private cdr: ChangeDetectorRef, // Add ChangeDetectorRef
    private siderBarService: SiderbarService,
    private loginService: LoginService,
    private router: Router
  ) {}

  toggleUserDropDown() {
    this.adminIconDropDown = !this.adminIconDropDown;
    this.cdr.markForCheck(); // Trigger change detection
  }

  toggleAdminSideBare() {
    this.adminSideBare = !this.adminSideBare;
    this.siderBarService.AssignSiderBareStatus(this.adminSideBare);
    this.cdr.markForCheck(); // Trigger change detection
  }

  signOutUser() {
    this.loginService.signOut();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.adminIconDropDown = false;
      this.cdr.markForCheck(); // Trigger change detection
    }
  }
}
