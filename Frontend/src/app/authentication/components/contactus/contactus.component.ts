import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports: [FormsModule, CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.scss'
})
export class ContactUsComponent {
  name: string = '';
  email: string = '';
  phone: string = '';
  message: string = '';

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Form Submitted!', this.name, this.email, this.phone, this.message);
      alert('आपला संदेश यशस्वीरित्या पाठवला गेला!');
      form.resetForm();
    } else {
      console.log('Form is invalid');
    }
  }
}
