import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MemberService } from '../../services/member.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../../../authentication/components/footer/footer.component';

@Component({
  selector: 'app-loan-confirmation',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './loan-confirmation.component.html',
  styleUrl: './loan-confirmation.component.scss',
})
export class LoanConfirmationComponent {

}
