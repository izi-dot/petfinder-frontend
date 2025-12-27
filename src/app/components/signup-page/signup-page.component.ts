import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss',
})
export class SignUpPageComponent {
  userObject = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  onSubmit() {
    // Replace with proper handling (call service, navigate, etc.)
    console.log('signup form submitted', this.userObject);
  }
}


