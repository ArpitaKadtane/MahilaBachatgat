// register.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userData = {
    userType: '',
    fullName: '',
    email: '',
    password: '',
    contact: '',
    age: '',
    address: '',
    aadhaar: '',
    bankAccount: '',
    ifsc: '',
    bankName: ''
  };

  constructor(private router: Router, private authService: AuthenticationService) {}

  // Function to handle form submission
  onRegister(event: Event) {
    event.preventDefault(); // Prevent page reload

    // Basic validation
    if (Object.values(this.userData).some(value => !value)) {
      alert('कृपया सर्व माहिती भरा!');
      return;
    }

    this.authService.registerUser(this.userData).subscribe(
      (response) => {
        alert('नोंदणी यशस्वी!');
        this.router.navigate(['/login']); // Navigate to login page
      },
      (error) => {
        console.error('नोंदणी अयशस्वी!', error);
        alert('नोंदणी अयशस्वी! कृपया पुन्हा प्रयत्न करा.');
      }
    );
  }

  // Function to navigate to login page
  goToLogin() {
    this.router.navigate(['/login']);
  }
}