import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = 'http://localhost:3000/api'; // Backend URL

  constructor(private http: HttpClient) {}

  // User Registration API
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  // User Login API with improved error handling and logging
  loginUser(credentials: { userType: string; contact: string; password: string; }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    console.log('📤 Sending Login Request:', JSON.stringify(credentials)); // Debugging log

    return this.http.post<any>(`${this.baseUrl}/login`, credentials, { headers }).pipe(
      tap((response) => console.log('✅ Server Response:', response)),
      catchError((error) => {
        console.error('❌ Login Failed:', error);
        console.error('Error details:', error.error); // Log the error details from the server
        return throwError(() => error);
      })
    );
  }

  // Store token after successful login
  storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Remove token on logout
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Get user details from the backend using the auth token
  getUserDetails(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.baseUrl}/leaderdashboard`, { headers }).pipe(
      tap((response) => console.log('✅ User Details:', response)),
      catchError((error) => {
        console.error('❌ Error fetching user details:', error);
        return throwError(() => error);
      })
    );
  }

  // Fetch group members
  getGroupMembers(): Observable<any> {
    return this.getWithAuth(`${this.baseUrl}/members`);
  }

  // Fetch group savings
  getGroupSavings(): Observable<any> {
    return this.getWithAuth(`${this.baseUrl}/savings`);
  }

  // Fetch group loans
  getGroupLoans(): Observable<any> {
    return this.getWithAuth(`${this.baseUrl}/loans`);
  }

  // Fetch recent transactions
  getRecentTransactions(): Observable<any> {
    return this.getWithAuth(`${this.baseUrl}/transactions/recent`);
  }

  // Fetch upcoming meetings
  getUpcomingMeetings(): Observable<any> {
    return this.getWithAuth(`${this.baseUrl}/meetings/upcoming`);
  }

  // Helper method for making authenticated GET requests
  private getWithAuth(url: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(url, { headers }).pipe(
      tap((response) => console.log(`✅ Data fetched from ${url}:`, response)),
      catchError((error) => {
        console.error(`❌ Error fetching data from ${url}:`, error);
        return throwError(() => error);
      })
    );
  }
  getMemberDetails(): Observable<any> {
    const token = this.getToken();
   

    if (!token) {
      console.error('❌ No token found. Redirecting to login.');
      return throwError(() => new Error('Unauthorized: No token found.'));
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<any>(`${this.baseUrl}/memberdashboard`, { headers }).pipe(
      tap(response => console.log('✅ Fetched Member:', response)),
      catchError(error => {
        console.error('❌ Error fetching member:', error);
        return throwError(() => error);
      })
    );
  }
}
