import { Component } from '@angular/core';
import { FooterComponent } from '../../../authentication/components/footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password-leader',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './change-password-leader.component.html',
  styleUrl: './change-password-leader.component.scss',
})
export class ChangePasswordLeaderComponent {
  changePasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmitChangePassword() {
    if (this.changePasswordForm.invalid) return;

    const formValue = this.changePasswordForm.value;
    const token = localStorage.getItem('token');

    this.http
      .put(
        'http://localhost:3000/api/leader/change-password-leader',
        formValue,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .subscribe({
        next: (res: any) => {
          this.successMessage = '✅ पासवर्ड यशस्वीरित्या बदलला गेला';
          this.errorMessage = '';
          this.changePasswordForm.reset();
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.message || 'पासवर्ड बदलताना त्रुटी आली';
          this.successMessage = '';
        },
      });
  }
}
