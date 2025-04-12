// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { FooterComponent } from '../../../authentication/components/footer/footer.component';
// import { HeaderComponent } from '../header/header.component';
// import { Subscription } from 'rxjs';
// import { MemberService } from '../../services/member.service';
// import { AuthenticationService } from '../../../authentication/services/authentication.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-membersidebar',
//   standalone: true,
//   imports: [FooterComponent, HeaderComponent],
//   templateUrl: './membersidebar.component.html',
//   styleUrl: './membersidebar.component.scss',
// })
// export class MembersidebarComponent implements OnInit, OnDestroy {
//   sidebarOpen = false;
//   private sidebarSubscription: Subscription = new Subscription();
//   userName: string = ''; // Store user name here

//   constructor(
//     private memberService: MemberService,
//     private authService: AuthenticationService,
//     private router: Router // ✅ Inject Router
//   ) {}

//   ngOnInit() {
//     // Subscribe to the sidebar state changes
//     this.sidebarSubscription = this.memberService.sidebarState$.subscribe(
//       (isOpen) => {
//         this.sidebarOpen = isOpen;
//       }
//     );

//     // Fetch user details (name) using the AuthenticationService
//     this.authService.getUserDetails().subscribe(
//       (user) => {
//         this.userName = user.name;
//       },
//       (error) => {
//         console.error('Failed to fetch user details:', error);
//       }
//     );
//   }

//   ngOnDestroy() {
//     if (this.sidebarSubscription) {
//       this.sidebarSubscription.unsubscribe();
//     }
//   }
//   navigateToprofile() {
//     this.router.navigate(['/update-profile']);
//   }
//   navigateToloan() {
//     this.router.navigate(['/loan-application']);
//   }
//   toggleSidebar() {
//     this.memberService.toggleSidebar();

//     // ✅ Ensure navigation happens if not already on sidebar
//     if (!this.router.url.includes('/memberdashboard')) {
//       this.router.navigate(['/memberdashboard']);
//     }
//   }
// }
