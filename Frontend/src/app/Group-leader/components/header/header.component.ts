import { Component, EventEmitter, Output } from '@angular/core';
import { GroupLeaderService } from '../../services/Group-leader.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../authentication/services/authentication.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  userMenuOpen = false;

  // Emit sidebar toggle action to parent
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  // Emit event to parent (leader dashboard) to toggle sidebar
  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  navigatetohamburger() {
    this.router.navigate(['/leaderdashboard']);
  }
  logout() {
    console.log('🔴 Logging out user...');

    this.authService.logout();

    this.router.navigate(['/home']).then(() => {
      window.location.reload(); // Fresh state
    });

    this.userMenuOpen = false;
  }

  deleteAccount() {
    console.log('🗑 Delete account requested');
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      console.log('✅ Account deletion confirmed');
      // Add deletion logic here if needed
    }
    this.userMenuOpen = false;
  }
}
