import { Component, EventEmitter, Output } from '@angular/core';
import { MemberService } from '../../services/member.service';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  userMenuOpen = false;

  // Emit sidebar toggle action to parent
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  constructor(
    private memberService: MemberService,
    private authService: AuthenticationService,
    private router: Router // ✅ Inject Router
  ) {}

  toggleSidebar() {
    this.toggleSidebarEvent.emit(); // Emit the event to parent component
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }
  navigatetohamburger() {
    this.router.navigate(['/memberdashboard']);
  }

  logout() {
    this.authService.logout();
    window.location.href = '/home'; // Redirect to login after logout
  }

  deleteAccount() {
    alert('Account deletion is not available yet.');
  }
}
