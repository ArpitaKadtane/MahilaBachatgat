import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  // Sidebar functionality
  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  sidebarState$ = this.sidebarOpenSubject.asObservable();

  // User authentication state
  private userAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  userAuthenticated$ = this.userAuthenticatedSubject.asObservable();

  private baseUrl = 'http://localhost:3000/api';
  constructor(private router: Router, private http: HttpClient) {}

  // Sidebar methods
  toggleSidebar() {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  joinGroup(groupId: string): Observable<any> {
    const token = localStorage.getItem('authtoken'); // or however you store the token
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(
      `${this.baseUrl}/member/join-group`,
      { groupId },
      { headers }
    );
  }

  openSidebar() {
    this.sidebarOpenSubject.next(true);
  }

  closeSidebar() {
    this.sidebarOpenSubject.next(false);
    this.router.navigate(['/memberdashboard']);
  }

  // Get current sidebar state
  isSidebarOpen(): boolean {
    return this.sidebarOpenSubject.value;
  }

  // User authentication methods
  loginUser() {
    this.userAuthenticatedSubject.next(true);
  }

  logoutUser() {
    this.userAuthenticatedSubject.next(false);
  }
  // ✅ Fetch all groups available in the system
  getAllGroups(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/member/groups`, { headers });
  }

  isUserAuthenticated(): boolean {
    return this.userAuthenticatedSubject.value;
  }
  // ✅ Change password method
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const payload = {
      oldPassword,
      newPassword,
    };
    return this.http.put(
      `${this.baseUrl}/leader/change-password-leader`,
      payload
    );
  }
  submitLoanApplication(applicationData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(
      `${this.baseUrl}/member/loan-application`,
      applicationData,
      { headers }
    );
  }
  getExpectedLoanAmountForMember() {
    return this.http.get(`${this.baseUrl}/member/loan-expected`);
  }
  

  // confirmLoanAmount(data: { expectedAmount: number; actualAmount: number }) {
  //   return this.http.post(`${this.baseUrl}/member/loan-confirmation`, data);
  // }
  // member.service.ts
  getApprovedLoans(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(`${this.baseUrl}/member/approved-loans`, {
      headers,
    });
  }
}
