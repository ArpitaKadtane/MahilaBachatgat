import { HeaderComponent } from '../header/header.component';
import { GroupLeaderService } from '../../services/Group-leader.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../../../authentication/components/footer/footer.component';
import { AuthenticationService } from '../../../authentication/services/authentication.service'; // Import AuthenticationService
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FooterComponent, HeaderComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  sidebarOpen = false;
  private sidebarSubscription: Subscription = new Subscription();
  userName: string = ''; // Store user name here

  constructor(
    private groupLeaderService: GroupLeaderService,
    private authService: AuthenticationService, // Inject AuthenticationService
    private router: Router // ✅ Inject Router
  ) {}

  ngOnInit() {
    // Subscribe to the sidebar state changes
    this.sidebarSubscription = this.groupLeaderService.sidebarState$.subscribe(
      (isOpen) => {
        this.sidebarOpen = isOpen;
      }
    );

    // Fetch user details (name) using the AuthenticationService
    this.authService.getUserDetails().subscribe(
      (user) => {
        this.userName = user.name; // Set the user name
      },
      (error) => {
        console.error('Failed to fetch user details:', error);
      }
    );
  }

  ngOnDestroy() {
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  closeSidebar() {
    this.groupLeaderService.closeSidebar(); // ✅ Ensures navigation works
  }

  navigateToGroupManagement() {
    this.router.navigate(['/group-management']); // ✅ Now Router is properly injected
  }
}
