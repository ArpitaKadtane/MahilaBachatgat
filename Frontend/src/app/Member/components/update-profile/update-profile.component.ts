import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../../../authentication/components/footer/footer.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss',
})
export class UpdateProfileComponent {
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
      .get<any>('http://localhost:3000/api/update-profile', {
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
      .put<any>('http://localhost:3000/api/update-profile', this.member, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
