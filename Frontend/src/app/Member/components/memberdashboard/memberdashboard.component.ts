import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../../../authentication/components/footer/footer.component';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { MemberService } from '../../services/member.service';

import { Router } from '@angular/router';
import { GroupLeaderService } from '../../../Group-leader/services/Group-leader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-memberdashboard',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './memberdashboard.component.html',
  styleUrl: './memberdashboard.component.scss',
})
export class MemberdashboardComponent implements OnInit {
  member: any = {}; // Store member details
  groups: any[] = [];
  selectedGroup: any = null;
  sidebarOpen = true;

  constructor(
    private authService: AuthenticationService,
    private groupLeaderService: GroupLeaderService,
    private memberService: MemberService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getMemberDetails();
    this.fetchGroups(); // Fetch groups on component load
  }
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    console.log('Dashboard clicked — closing sidebar');
    this.sidebarOpen = false;
  }
  navigateToprofile() {
    this.router.navigate(['/update-profile']);
  }
  navigateToChangePassword() {
    this.router.navigate(['/change-password']);
  }
  navigateToloan() {
    this.router.navigate(['/loan-application']);
  }
  navigateToLoanConfirm(){
    this.router.navigate(['/loan-confirmation']);
  }
  navigateToCreditSaving(){
    this.router.navigate(['/credit-saving']);
  }
  navigateToTransactionHistory(){
    this.router.navigate(['/transaction-history']);
  }
  getMemberDetails() {
    this.authService.getMemberDetails().subscribe(
      (response) => {
        console.log('✅ Fetched Member Details:', response);
        if (response.success && response.member) {
          this.member = response.member; // Store member details
        }
      },
      (error) => {
        console.error('❌ Error fetching member details:', error);
      }
    );
  }
  // ✅ Fetch all groups from backend
  fetchGroups() {
    this.memberService.getAllGroups().subscribe(
      (response) => {
        console.log('📦 Groups fetched:', response);
        if (response.success && response.groups) {
          this.groups = response.groups;
        }
      },
      (error) => {
        console.error('❌ Error fetching groups:', error);
      }
    );
  }

  openTrustModal(group: any) {
    this.selectedGroup = group;
  }

  cancelJoin() {
    this.selectedGroup = null;
  }

  confirmJoinGroup() {
    if (this.selectedGroup) {
      const groupId = this.selectedGroup.id;

      this.memberService.joinGroup(groupId).subscribe(
        (response) => {
          alert('🎉 आपल्याला लवकरच गटनेत्याद्वारे गटात सामील केले जाईल!');
          this.selectedGroup = null;
          this.fetchGroups(); // Optionally refresh
        },
        (error) => {
          alert('⚠️ काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.');
          this.selectedGroup = null;
        }
      );
    }
  }
}
