import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class GroupLeaderService {
  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  sidebarState$ = this.sidebarOpenSubject.asObservable();

  // User authentication state
  private userAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  userAuthenticated$ = this.userAuthenticatedSubject.asObservable();
  constructor(private router: Router, private http: HttpClient) {} // ✅ Inject Router properly

  private baseUrl = 'http://localhost:3000/api';

  toggleSidebar() {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  openSidebar() {
    this.sidebarOpenSubject.next(true);
  }

  closeSidebar() {
    this.sidebarOpenSubject.next(false);
    this.router.navigate(['/leaderdashboard']);
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
      `${this.baseUrl}leader/change-password-leader`,
      payload
    );
  }
  // ✅ Create Group method
  createGroup(groupData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/leader/group-management`, groupData);
  }
  getPendingRequests(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    });
    return this.http
      .get<any[]>(`${this.baseUrl}/leader/member-requests`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching pending requests:', error);
          return throwError('❌ Error fetching pending requests');
        })
      );
  }

  getApprovedMembers(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token not found');
      return throwError(() => new Error('❌ Token not found'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<any[]>(`${this.baseUrl}/leader/approved-members`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching approved members:', error);
          return throwError(
            () => new Error('❌ Error fetching approved members')
          );
        })
      );
  }
  // Approve request
  approveRequest(id: number): Observable<any> {
    if (!id) {
      console.error('Request ID is undefined');
      return throwError(() => new Error('❌ Request ID is undefined')); // Use factory function
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token not found');
      return throwError(() => new Error('❌ Token not found')); // Use factory function
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .put(`${this.baseUrl}/leader/approved-request/${id}`, {}, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error approving member:', error);
          return throwError(() => new Error('❌ Error approving member')); // Use factory function
        })
      );
  }

  // Reject a member request
  rejectRequest(id: number): Observable<any> {
    if (!id) {
      console.error('Request ID is undefined');
      return throwError(() => new Error('❌ Request ID is undefined')); // Use factory function
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token not found');
      return throwError(() => new Error('❌ Token not found')); // Use factory function
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .put(`${this.baseUrl}/leader/reject-request/${id}`, {}, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error rejecting member:', error);
          return throwError(() => new Error('❌ Error rejecting member')); // Use factory function
        })
      );
  }
  removeMember(id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return throwError(() => new Error('Token not found'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete(`${this.baseUrl}/leader/remove-member/${id}`, {
      headers,
    });
  }
  getLoanApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/leader/loan-applications`);
  }
  // ✅ Fetch all loan applications
  getAllLoanApplications(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/leader/loan-applications`, {
      headers,
    });
  }
  // ✅ Accept loan application with amount
  acceptLoanApplication(id: number, amount: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .put(
        `${this.baseUrl}/leader/loan-accept/${id}`,
        {
          actualAmountReceived: amount,
        },
        { headers }
      )
      .pipe(
        tap(() => console.log('Loan accepted successfully')),
        catchError((error) => {
          console.error('Error accepting loan application:', error);
          return throwError(
            () => new Error('Failed to accept loan application.')
          );
        })
      );
  }

  // ✅ Reject loan application
  rejectLoanApplication(id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .post(`${this.baseUrl}/leader/loan-reject/${id}`, {}, { headers })
      .pipe(
        tap(() => console.log('Loan rejected successfully')),
        catchError((error) => {
          console.error('Error rejecting loan application:', error);
          return throwError(
            () => new Error('Failed to reject loan application.')
          );
        })
      );
  }
}
