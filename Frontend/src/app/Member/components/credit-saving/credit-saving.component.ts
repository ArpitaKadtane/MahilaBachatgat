import { Component } from '@angular/core';
import { FooterComponent } from "../../../authentication/components/footer/footer.component";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-credit-saving',
  standalone: true,
  imports: [FooterComponent, HeaderComponent],
  templateUrl: './credit-saving.component.html',
  styleUrl: './credit-saving.component.scss'
})
export class CreditSavingComponent {

}
