import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { FooterComponent } from '../../../authentication/components/footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { GroupLeaderService } from '../../services/Group-leader.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './group-management.component.html',
  styleUrl: './group-management.component.scss',
})
export class GroupManagementComponent {
  groupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private groupLeaderService: GroupLeaderService // ✅ Inject the service
  ) {
    this.groupForm = this.fb.group({
      group_name: [''],
      purpose: [''],
      rules: [''],
      leader_name: [''],
      city: [''],
      district: [''],
      member_limit: [''], // ✅ match backend
      membership_criteria: [''], // ✅ match backend
      savings_contribution: [''],
      contact_number: [''],
      bank_name: [''],
      bank_account: [''],
      ifsc_code: [''],
    });
  }

  createGroup() {
    this.groupLeaderService.createGroup(this.groupForm.value).subscribe({
      next: (res) => {
        alert('✅ गट यशस्वीरित्या तयार झाला');
        this.groupForm.reset();
      },
      error: (err) => {
        console.error(err);
        alert('❌ काहीतरी चूक झाली');
      },
    });
  }
}
