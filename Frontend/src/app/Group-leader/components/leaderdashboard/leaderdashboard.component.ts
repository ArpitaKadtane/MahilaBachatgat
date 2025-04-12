import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../../authentication/components/footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { GroupLeaderService } from '../../services/Group-leader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaderdashboard',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, CommonModule],
  templateUrl: './leaderdashboard.component.html',
  styleUrl: './leaderdashboard.component.scss',
})
export class LeaderdashboardComponent implements OnInit {
  leaderName: string = 'Loading...';
  leaderDetails: any = {};
  memberCount: number = 0;
  totalSavings: number = 0;
  totalLoans: number = 0;
  loansPending: number = 0;
  recentTransactions: any[] = [];
  isLoading: boolean = true;
  sidebarOpen = true;

  constructor(
    private authService: AuthenticationService,
    private groupLeaderService: GroupLeaderService,
    private router: Router
  ) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  navigateToChangePassword() {
    this.router.navigate(['/change-password-leader']);
  }
  closeSidebar() {
    console.log('Dashboard clicked — closing sidebar');
    this.sidebarOpen = false;
  }
  navigateToprofile() {
    this.router.navigate(['/update-profile-leader']);
  }

  navigateToGroupManagement() {
    this.router.navigate(['/group-management']);
  }
  navigateToUserManagement() {
    this.router.navigate(['/user-management']);
  }
  navigateToLoanManagement() {
    this.router.navigate(['/loan-management']);
  }
  navigateToSavingManagement() {
    this.router.navigate(['/saving-management']);
  }
  navigateToFinancialReport() {
    this.router.navigate(['/financial-report']);
  }
  ngOnInit(): void {
    this.loadLeaderData();
    this.loadGroupStatistics();
    this.loadRecentTransactions();
    this.groupLeaderService.sidebarState$.subscribe((isOpen) => {
      this.sidebarOpen = isOpen;
    });
  }

  loadLeaderData(): void {
    this.authService.getUserDetails().subscribe(
      (response) => {
        console.log('📥 प्रमुख माहिती प्राप्त:', response);

        if (response && response.leader) {
          this.leaderDetails = response.leader;
          this.leaderName = response.leader.full_name;
        } else {
          this.leaderName = 'प्रमुख';
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('❌ प्रमुख माहिती प्राप्त करताना त्रुटी:', error);
        this.leaderName = 'अज्ञात';
        this.isLoading = false;
      }
    );
  }

  loadGroupStatistics(): void {
    setTimeout(() => {
      this.memberCount = 15;
      this.totalSavings = 45000;
      this.totalLoans = 30000;
      this.loansPending = 2;
    }, 500);
  }

  loadRecentTransactions(): void {
    setTimeout(() => {
      this.recentTransactions = [
        {
          id: 1,
          type: 'बचत',
          amount: 500,
          member: 'सुनीता पाटील',
          date: '01-04-2025',
        },
        {
          id: 2,
          type: 'कर्ज',
          amount: 5000,
          member: 'अश्विनी जाधव',
          date: '30-03-2025',
        },
        {
          id: 3,
          type: 'परतफेड',
          amount: 1000,
          member: 'वैशाली शिंदे',
          date: '28-03-2025',
        },
      ];
    }, 500);
  }
}
