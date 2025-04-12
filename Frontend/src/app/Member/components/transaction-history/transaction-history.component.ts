import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../../../authentication/components/footer/footer.component";

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent {

}
