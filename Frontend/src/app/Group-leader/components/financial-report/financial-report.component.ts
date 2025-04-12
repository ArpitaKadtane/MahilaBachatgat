import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../../../authentication/components/footer/footer.component";

@Component({
  selector: 'app-financial-report',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './financial-report.component.html',
  styleUrl: './financial-report.component.scss'
})
export class FinancialReportComponent {

}
