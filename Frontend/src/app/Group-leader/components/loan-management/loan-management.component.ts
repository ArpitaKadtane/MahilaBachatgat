import { Component, OnInit } from '@angular/core';
import { GroupLeaderService } from '../../services/Group-leader.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../Group-leader/components/header/header.component';
import { FooterComponent } from '../../../authentication/components/footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loan-management',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent,FormsModule],
  templateUrl: './loan-management.component.html',
  styleUrl: './loan-management.component.scss',
})
export class LoanManagementComponent implements OnInit {
  loanApplications: any[] = [];
  loading = true;
  error: string = '';

  constructor(private groupLeaderService: GroupLeaderService) {}

  ngOnInit(): void {
    this.fetchLoanApplications();
  }

  fetchLoanApplications(): void {
    this.groupLeaderService.getAllLoanApplications().subscribe({
      next: (res) => {
        this.loanApplications = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'डेटा मिळवताना त्रुटी आली.';
        this.loading = false;
      },
    });
  }
  acceptLoan(id: number, amount: number) {
    if (!amount || amount <= 0) {
      alert('कृपया प्रत्यक्ष मिळालेली रक्कम प्रविष्ट करा.');
      return;
    }

    this.groupLeaderService.acceptLoanApplication(id, amount).subscribe({
      next: () => {
        alert('कर्ज अर्ज मंजूर झाला आहे.');
        this.fetchLoanApplications(); // Refresh the list
      },
      error: () => {
        alert('कर्ज मंजूर करताना त्रुटी आली.');
      },
    });
  }

  rejectLoan(id: number) {
    this.groupLeaderService.rejectLoanApplication(id).subscribe({
      next: () => {
        alert('कर्ज अर्ज नाकारला आहे.');
        this.fetchLoanApplications();
      },
      error: () => {
        alert('कर्ज नाकारताना त्रुटी आली.');
      },
    });
  }
}
