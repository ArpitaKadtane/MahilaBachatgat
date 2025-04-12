import { Routes, provideRouter } from '@angular/router';
import { HomeComponent } from './authentication/components/home/home.component';
import { LoginComponent } from './authentication/components/login/login.component';
import { RegisterComponent } from './authentication/components/register/register.component';
import { HeaderComponent } from './authentication/components/header/header.component';
import { FooterComponent } from './authentication/components/footer/footer.component';
import { ContactUsComponent } from './authentication/components/contactus/contactus.component';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication/services/authentication.service';
import { MemberdashboardComponent } from './Member/components/memberdashboard/memberdashboard.component';
import { SidebarComponent } from './Group-leader/components/sidebar/sidebar.component';

import { LeaderdashboardComponent } from './Group-leader/components/leaderdashboard/leaderdashboard.component';

import { GroupManagementComponent } from './Group-leader/components/group-management/group-management.component';
import { LoanApplicationComponent } from './Member/components/loan-application/loan-application.component';
import { UpdateProfileComponent } from './Member/components/update-profile/update-profile.component';
import { ChangePasswordComponent } from './Member/components/change-password/change-password.component';
import { UserProfileLeaderComponent } from './Group-leader/components/user-profile-leader/user-profile-leader.component';
import { ChangePasswordLeaderComponent } from './Group-leader/components/change-password-leader/change-password-leader.component';
import { UserManagementComponent } from './Group-leader/components/user-management/user-management.component';
import { LoanManagementComponent } from './Group-leader/components/loan-management/loan-management.component';
import { LoanConfirmationComponent } from './Member/components/loan-confirmation/loan-confirmation.component';
import { SavingManagementComponent } from './Group-leader/components/saving-management/saving-management.component';
import { FinancialReportComponent } from './Group-leader/components/financial-report/financial-report.component';
import { CreditSavingComponent } from './Member/components/credit-saving/credit-saving.component';
import { TransactionHistoryComponent } from './Member/components/transaction-history/transaction-history.component';
import { AboutusComponent } from './authentication/components/aboutus/aboutus.component';
import { TransperatTransactionComponent } from './authentication/components/transperat-transaction/transperat-transaction.component';
import { SavingLoanComponent } from './authentication/components/saving-loan/saving-loan.component';

// ✅ **Auth Guard for protecting routes**
const authGuard = () => {
  const authService = inject(AuthenticationService);
  return authService.isLoggedIn() ? true : (window.location.href = '/login');
};

// ✅ **Defined Standalone Routes**
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contactus', component: ContactUsComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'contactus', component: ContactUsComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'transperanttransaction', component: TransperatTransactionComponent },
  { path: 'savingloan', component: SavingLoanComponent },

  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuard],
  },

  {
    path: 'leaderdashboard',
    component: LeaderdashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'memberdashboard',
    component: MemberdashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'group-management',
    component: GroupManagementComponent,
    canActivate: [authGuard], // ✅ Protecting route with authentication
  },
  {
    path: 'loan-application',
    component: LoanApplicationComponent,
    canActivate: [authGuard], // ✅ Protecting route with authentication
  },
  {
    path: 'update-profile',
    component: UpdateProfileComponent,
    canActivate: [authGuard], // ✅ Protecting route with authentication
  },
  {
    path: 'update-profile-leader',
    component: UserProfileLeaderComponent,
    canActivate: [authGuard], // ✅ Protecting route with authentication
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
    canActivate: [authGuard], // ✅ Protecting route with authentication
  },
  {
    path: 'change-password-leader',
    component: ChangePasswordLeaderComponent,
    canActivate: [authGuard], // ✅ Protecting route with authentication
  },
  {
    path: 'loan-management',
    component: LoanManagementComponent,
    canActivate: [authGuard], // ✅ Protecting route with authentication
  },
  {
    path: 'loan-confirmation',
    component: LoanConfirmationComponent,
    canActivate: [authGuard], // ✅ Protecting route with authentication
  },
  {
    path: 'saving-management',
    component: SavingManagementComponent,
    canActivate: [authGuard], // ✅ Protecting route with authentication
  },
  {
    path: 'financial-report',
    component: FinancialReportComponent,
    canActivate: [authGuard], // ✅ Protecting route with authentication
  },
  {
    path: 'credit-saving',
    component: CreditSavingComponent,
    canActivate: [authGuard], // ✅ Protecting route with authentication
  },
  {
    path: 'transaction-history',
    component: TransactionHistoryComponent,
    canActivate: [authGuard], // ✅ Protecting route with authentication
  },
  { path: '', redirectTo: 'group-management', pathMatch: 'full' },
  { path: '**', redirectTo: '' }, // Wildcard route
];

// ✅ **Provide Routes in Standalone Bootstrap**
export const appRouting = provideRouter(routes);
