import { Component } from '@angular/core';
import { FooterComponent } from '../../../authentication/components/footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-loan-application',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, ReactiveFormsModule],
  templateUrl: './loan-application.component.html',
  styleUrl: './loan-application.component.scss',
})
export class LoanApplicationComponent {
  loanForm!: FormGroup;

  constructor(private fb: FormBuilder, private memberService: MemberService) {}

  ngOnInit(): void {
    this.loanForm = this.fb.group({
      fullName: ['', Validators.required],
      dob: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      pan: ['', Validators.required],
      employmentType: ['', Validators.required],
      income: ['', Validators.required],
      loanAmount: ['', Validators.required],
      loanPurpose: ['', Validators.required],
      loanTenure: ['', Validators.required],
      address: ['', Validators.required],

      // 🔧 Add these missing fields 👇
      accountNumber: ['', Validators.required],
      bankName: ['', Validators.required],
      ifscCode: ['', Validators.required],

      repaymentPlan: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loanForm.valid) {
      this.memberService.submitLoanApplication(this.loanForm.value).subscribe({
        next: (res) => {
          alert('✅ तुमचा कर्ज अर्ज यशस्वीरित्या सबमिट झाला आहे!');
          this.loanForm.reset();
        },
        error: (err) => {
          alert('❌ अर्ज सबमिट करताना त्रुटी आली, कृपया पुन्हा प्रयत्न करा.');
          console.error(err);
        },
      });
    } else {
      alert('कृपया सर्व माहिती पूर्णपणे भरा!');
    }
  }
}
