import { Component } from '@angular/core';
import { HeaderComponent } from "../../../Group-leader/components/header/header.component";
import { FooterComponent } from "../../../authentication/components/footer/footer.component";

@Component({
  selector: 'app-saving-management',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './saving-management.component.html',
  styleUrl: './saving-management.component.scss'
})
export class SavingManagementComponent {

}
