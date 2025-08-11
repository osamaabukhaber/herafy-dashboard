import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  imports: [CommonModule],
  templateUrl: './notfound.html',
  styleUrl: './notfound.css'
})
export class NotFoundComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    // Optional: Set page title
  }

  /**
   * Navigate to home page
   */
  goHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Go back to previous page
   */
  goBack(): void {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      this.router.navigate(['..']);

    } else {
      // If no history, go to home page
      this.goHome();
    }
  }

  /**
   * Navigate to contact page
   */
  goToContact(): void {
    this.router.navigate(['/contact']);
  }

  /**
   * Navigate to sitemap
   */
  goToSitemap(): void {
    this.router.navigate(['/sitemap']);
  }

  /**
   * Navigate to search page
   */
  goToSearch(): void {
    this.router.navigate(['/search']);
  }
}
