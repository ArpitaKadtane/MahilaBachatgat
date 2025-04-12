import { Component } from '@angular/core';
import { FooterComponent } from '../../../authentication/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-profile-leader',
  standalone: true,
  imports: [FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './user-profile-leader.component.html',
  styleUrl: './user-profile-leader.component.scss',
})
export class UserProfileLeaderComponent {
  member: any = {}; // ✅ Start with an empty object to prevent undefined errors.

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Authentication required!');
      return;
    }

    this.http
      .get<any>('http://localhost:3000/api/update-profile-leader', {
        // ✅ Corrected GET endpoint
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe(
        (data) => {
          if (data && data.user) {
            this.member = { ...data.user }; // ✅ Create a copy to prevent side effects
          } else {
            alert('Member data not found.');
          }
        },
        (error) => {
          console.error('Error fetching user data:', error);
          alert('प्रोफाइल डेटा मिळवताना त्रुटी आली.');
        }
      );
  }

  updateProfile() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Authentication required!');
      return;
    }

    this.http
      .put<any>(
        'http://localhost:3000/api/update-profile-leader',
        this.member,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .subscribe(
        (response) => {
          alert('प्रोफाइल यशस्वीरित्या अपडेट झाले! ✅');
        },
        (error) => {
          console.error('Error updating profile:', error);
          alert('प्रोफाइल अपडेट करताना त्रुटी आली.');
        }
      );
  }
}
