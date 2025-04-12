import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  menuOpen = false;

  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToContactUs() {
    this.router.navigate(['/contactus']);
  }
  navigateToTransperantTransaction() {
    this.router.navigate(['/transperanttransaction']);
  }
  navigateToSavingLoan() {
    this.router.navigate(['/savingloan']);
  }
  navigateToAboutUs() {
    this.router.navigate(['/aboutus']);
  }
  navigateToHome() {
    this.router.navigate(['/']);
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
