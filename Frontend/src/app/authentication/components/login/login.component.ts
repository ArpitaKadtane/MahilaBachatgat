import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  contact: string = '';
  password: string = '';
  userType: string = 'member'; // Default value can be set here or dynamically based on your logic

  constructor(private router: Router, private authService: AuthenticationService) {}

  onSubmit(form: NgForm) {
    if (form.valid && this.isValidMobile(this.contact)) {
      const loginData = {
        userType: this.userType, // Include the userType
        contact: this.contact,
        password: this.password
      };

      console.log('🛠 Sending Login Request:', JSON.stringify(loginData, null, 2));
      this.authService.loginUser(loginData)
      .subscribe(
        (response: any) => {
          console.log('✅ लॉगिन यशस्वी:', response);
          alert('✅ लॉगिन यशस्वी!');
          this.authService.storeToken(response.token);

          // Access the userType from the response object
          const userType = response.user.userType; // Accessing the correct property from the response
          console.log('User type from response:', userType);

          // Navigate based on userType
          if (userType === 'leader') {
            this.router.navigate(['/leaderdashboard']);
          } else if (userType === 'member') {
            this.router.navigate(['/memberdashboard']);
          } else {
            console.log('Invalid user type received. Redirecting to home page.');
            this.router.navigate(['/']);
          }
        },
        (error: any) => {
          console.error('❌ लॉगिन अयशस्वी:', error);
          alert(`❌ कृपया योग्य मोबाइल नंबर आणि पासवर्ड प्रविष्ट करा.\n⚠️ Error: ${error.error?.message || 'Unknown Error'}`);
        }
      );

    } else {
      alert('⚠️ कृपया योग्य मोबाइल नंबर प्रविष्ट करा.');
    }
  }

  // ✅ Validate Mobile Number (Only 10-digit numbers allowed)
  private isValidMobile(mobile: string): boolean {
    return /^[6-9]\d{9}$/.test(mobile);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

}
