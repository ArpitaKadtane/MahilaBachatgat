import { Component } from '@angular/core';

import { MemberService } from '../../services/member.service';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../../../authentication/components/footer/footer.component';
@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
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
      .put('http://localhost:3000/api/member/change-password', formValue, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
